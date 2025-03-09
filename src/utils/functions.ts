import {
  Laje,
  Vigota_Painel,
  Enchimento,
  DadosProtendida,
  TipoTrelicada,
  TipoCarga,
} from "../types/interfaces";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const vigotas_paineis = require("../data/vigotas_paineis.json");
const enchimentos = require("../data/enchimentos.json");
const dados_protendida: DadosProtendida[] = require("../data/tabela_protendida.json");
import parametros from "../data/parametros.json";
import precos from "../data/precos.json";
import dados_vigotas_paineis from "../data/tabela_vigotas_paineis.json";
import gruposCargas from "../data/cargas.json";

// Função para encontrar a treliça pelo id
const buscarTrelica = (trel_id: number): Vigota_Painel => {
  return vigotas_paineis.find(
    (trelica: Vigota_Painel) => trelica.id === trel_id
  );
};

// Função para encontrar o enchimento pelo id
const buscarEnchimento = (ench_id: number): Enchimento => {
  return enchimentos.find(
    (enchimento: Enchimento) => enchimento.id === ench_id
  );
};

// Função para encontrar o enchimento pelo id
const buscarEnchimentoPorRef = (ref_enchimento: string): Enchimento => {
  return enchimentos.find(
    (enchimento: Enchimento) => enchimento.ench_modelo === ref_enchimento
  );
};

export const EnchimentoModeloPorID = (ench_id: number): string => {
  const enchimento = enchimentos.find(
    (enchimento: Enchimento) => enchimento.id === ench_id
  );
  return enchimento ? enchimento.ench_modelo : "";
};

export const TrelicaModeloPorID = (trel_id: number): string => {
  const Vigota_Painel = vigotas_paineis.find(
    (trelica: Vigota_Painel) => trelica.id === trel_id
  );
  return Vigota_Painel ? Vigota_Painel.trel_modelo : "";
};

export const calcularVolumeConcretoM3 = (laje: Laje): number => {
  const enchimento = buscarEnchimento(laje.ench_id); // busca o enchimento
  const trelica = buscarTrelica(laje.trel_id); // busca a treliça
  let vc: number = 0;

  // if ((!enchimento || !trelica) && (laje.tipo_laje !== "protendida")) {
  //   return 0;
  // }

  // Coeficiente de perdas
  const p = 1.03;

  // hf - capa de concreto - [m]
  const hf = parametros.hf / 100;

  // Parametros dos elementos
  // Enchimento
  let be = 0;
  let ah = 0;
  let he = 0;
  if (enchimento) {
    be = enchimento.be / 100;
    ah = enchimento.ah / 100;
    he = enchimento.he / 100;
  }

  //Treliça
  let bv = 0;
  let hv = 0;
  if (trelica) {
    bv = trelica.bv / 100;
    hv = trelica.hv / 100;
  }

  // Area da laje [m²]
  const aL = Number(laje.vaoOposto) * Number(laje.vaoViga);

  // Calculo do volume de uma laje treçiçada considerando perdas de 3%
  if (laje.tipo_laje === "trelicada") {
    const H = he + hf; // Altura [m]
    const bw = bv - 2 * ah; // Alma [m]

    // Intereixo (ie) é a soma do 'be' do enchimento e do 'bv' da treliça - [m]
    const ie = be + bv;

    // Área da seção T [m²]
    const areaSecao = (ie - bw) * hf + bw * H + (bv - bw) * hv;

    // Volume de concreto [m³]
    // ([m²]*[m]/[m²])*[m²] = [m³] => Área da seção * comprimento correspondente a 1m² da laje * coef. perdas
    vc = areaSecao * (1 / ie) * aL * p;
  } else if (laje.tipo_laje === "painel_macico") {
    // Volume de concreto [m³]
    // Altura da laje (pré-dimensioanda)
    const H = laje.altura_laje / 100;

    // Altura da laje * Área da laje [m*m²]=[m³]
    vc = H * aL * p;
  } else if (laje.tipo_laje === "painel_macico_aliviado") {
    // Alma da vigota [bw]
    const h = he + hf; // Altura [m] - descontado hv
    const bw = bv - be; // Alma [m]

    // Área de concreto da seção [m²]
    const areaSecao = bw * h;

    // Volume de concreto para 1m² de laje [m³/m²]
    const vp = areaSecao * (1 / bw);

    // Volume de concreto total [m³]
    // [m³/m²]*[m²] = [m³]
    vc = vp * aL * p;
  } else if (laje.tipo_laje === "protendida") {
    vc =
      (dados_protendida
        .filter((item: DadosProtendida) => {
          return (
            item.carga_kgf_m2 >= laje.carga &&
            item.condicao_apoio === laje.condicao_apoio &&
            item.tipo_vigota === laje.tipo_vigota &&
            item.altura_cm === laje.altura_laje
          );
        })
        .map((item) => item.concreto_l_m2)[0] /
        1000) *
      aL;
  }
  // Retorna o volume de concreto usinado em m³
  return vc;
};

export const calcularQtdeEscoras = (laje: Laje): number => {
  // Espaçamento entre escoras
  let esp = 0;
  if (laje.tipo_laje === "protendida") {
    esp = 3;
  } else {
    esp = 1;
  }

  // Fator
  const f = 1 / esp ** 2;

  // Area da laje [m²]
  const aL = laje.vaoOposto * laje.vaoViga;

  // Qtde de escoras
  const qtde = Math.round(f * aL);

  return qtde;
};

export const calcularQtdeEnchimento = (laje: Laje): number => {
  const enchimento = buscarEnchimento(laje.ench_id); // busca o enchimento
  const trelica = buscarTrelica(laje.trel_id); // busca a treliça
  let qtde: number = 0;

  if (!enchimento || !trelica) {
    return 0;
  }

  // Area da laje [m²]
  const aL = laje.vaoOposto * laje.vaoViga;

  // Parametros
  const be = enchimento.be / 100;
  const bv = trelica.bv / 100;

  // Intereixo (ie) é a soma do 'be' do enchimento e do 'bv' da treliça - [m]
  const ie = be + bv;

  // qtde
  if (laje.tipo_laje !== "painel_macico") {
    qtde = aL / (ie * be);
  } else {
    qtde = 0;
  }

  return qtde;
};

export const calcularCustoEnchimento = (laje: Laje): number => {
  const enchimento = buscarEnchimento(laje.ench_id); // busca o enchimento
  const trelica = buscarTrelica(laje.trel_id); // busca a treliça

  let custo: number = 0;

  if (!enchimento || !trelica) {
    return 0;
  }

  // Area da laje [m²]
  const aL = laje.vaoOposto * laje.vaoViga;

  // Parametros
  const be = enchimento.be / 100;
  const bv = trelica.bv / 100;
  const ah = enchimento.ah / 100;
  const he = enchimento.he / 100;

  // Intereixo (ie) é a soma do 'be' do enchimento e do 'bv' da treliça - [m]
  const ie = be + bv;

  // qtde
  let qtde = calcularQtdeEnchimento(laje);

  // volume m3
  const volUnit = (2 * ah + be) * he;

  const volTotal = qtde * volUnit;

  // Custo
  custo = volTotal * enchimento.custo_unitario_m3;

  return custo;
};

export const calcularComprimentoLinearVigas = (laje: Laje): number => {
  const enchimento = buscarEnchimento(laje.ench_id); // busca o enchimento
  const trelica = buscarTrelica(laje.trel_id); // busca a treliça

  if ((!enchimento || !trelica) && laje.tipo_laje !== "protendida") {
    return 0;
  }

  // Area da laje [m²]
  const aL = laje.vaoOposto * laje.vaoViga;

  // Intereixo (ie) é a soma do 'be' do enchimento e do 'bv' da treliça - [m]
  let ie = 0;
  if (laje.tipo_laje !== "protendida") {
    const be = enchimento.be / 100;
    const bv = trelica.bv / 100;
    ie = be + bv;
  } else {
    ie =
      dados_protendida
        .filter((item: DadosProtendida) => {
          return (
            item.carga_kgf_m2 >= laje.carga &&
            item.condicao_apoio === laje.condicao_apoio &&
            item.tipo_vigota === laje.tipo_vigota &&
            item.altura_cm === laje.altura_laje
          );
        })
        .map((item) => item.intereixo_cm)[0] / 100;
  }
  // Vao oposto
  const vaoOposto = laje.vaoOposto;

  // Quantidade de vigas
  const qtdeVigas = vaoOposto / ie;

  // Comprimento total
  const compLinear = qtdeVigas * laje.vaoViga;

  return compLinear;
};

export const CalcularPesoProprioLaje = (laje: Laje): number => {
  // Peso específico do concreto armado [kN/m³]
  const gamaC = 25;

  // Enchimento e treliça
  const enchimento = buscarEnchimento(laje.ench_id === 0 ? 1 : laje.ench_id); // busca o enchimento
  const trelica = buscarTrelica(laje.trel_id); // busca a treliça

  // hf: number, trelica: Vigota_Painel, enchimento: Enchimento
  // Propriedades da laje
  const hf = parametros.hf;

  // Propriedades do enchimento
  const he = enchimento.he / 100;
  const be = enchimento.be / 100;
  const ah = enchimento.ah / 100;

  // Propriedades da vigota
  const bv = trelica.bv / 100;
  const hv = trelica.hv / 100;

  // Peso próprio da laje Treliçada
  if (laje.tipo_laje === "trelicada") {
    const bw = bv - 2 * ah; // Alma bw                          [m]
    const ie = bv + be; // Intereixo                        [m]
    const gamaEnch = (enchimento.peso_proprio * 9.807) / 1000; // Peso específico do Enchimento    [kN/m³]

    const ppCapa = gamaC * ie * (hf / 100); // Peso própio da capa de concreto  [kN/m]
    const ppVigota = gamaC * ((he - hv) * bw + hv * bv); // Peso própio da vigota            [kN/m]
    const ppEnch = gamaEnch * (be * hv + 2 * ah * (he - hv)); // Peso próprio do enchimento       [kN/m]
    const pTotal = (ppCapa + ppVigota + ppEnch) / ie; // [kN/m]*[1/m] =                   [kN/m²]

    return pTotal;
  } else if (laje.tipo_laje === "painel_macico") {
    const ppCapa = gamaC * (laje.altura_laje / 100); // [kN/m²]
    return ppCapa;
  } else if (laje.tipo_laje === "painel_macico_aliviado") {
    const h = he + hf; // Altura da laje descontando hv    [m]
    const bw = bv - be; // Alma bw                          [m]
    const gamaEnch = (enchimento.peso_proprio * 9.807) / 1000; // Peso específico do Enchimento    [kN/m³]

    const ppCapa = gamaC * bw * (h / 100); // Peso própio da capa de concreto  [kN/m]
    const ppVigota = gamaC * (hv * bv); // Peso própio da vigota            [kN/m]
    const ppEnch = gamaEnch * (be * he); // Peso próprio do enchimento       [kN/m]
    const pTotal = (ppCapa + ppVigota + ppEnch) / bv; // [kN/m]*[1/m] =                   [kN/m²]

    return pTotal;
  }

  return 0;
};

export const calcularECS = (fck: number, agregado: string): number => {
  let ECI: number; // MODULO DE ELASTICIDADE DO CONCRETO
  let AlphaE: number; // COEFICIENTE EM FUNÇÃO DO AGREGADO
  let AlphaI: number;
  let ECS: number;

  // Calculando o Alpha E
  switch (agregado) {
    case "diabásio":
    case "bassalto":
      AlphaE = 1.2;
      break;
    case "gnaisse":
    case "granito":
      AlphaE = 1;
      break;
    case "calcário":
      AlphaE = 0.9;
      break;
    case "arenito":
      AlphaE = 0.7;
      break;
    default:
      AlphaE = 0.7;
  }

  // Calculando Alpha I
  AlphaI = 0.8 + 0.2 * (fck / 80);
  if (AlphaI > 1) {
    AlphaI = 1;
  }

  // Calculando ECI
  if (fck <= 50) {
    ECI = AlphaE * 5600 * Math.sqrt(fck);
  } else if (fck > 50) {
    ECI = 21500 * AlphaE * (fck * 0.1 + 1.25) ** (1 / 3);
  } else {
    ECI = 0;
  }

  // Retornando ECS (MPa)
  ECS = AlphaI * ECI;
  return ECS;
};

export const calcularMomentoInerciaT = (
  H: number,
  hv: number,
  bv: number,
  bw: number,
  ie: number,
  hf: number
): { IXcg: number; ycg: number; areaSecao: number } => {
  // H = Altura da laje
  // hv = Altura da base da vigota
  // bv = Largura da base da vigota
  // bw = Largura da alma
  // I = Intereixo = Largura do enchimento + bv
  // hf = Altura da capa de concreto

  let areaSecao: number;
  let ycg: number;

  // Eixo de gravidade
  let num: number;

  num =
    (ie - bw) * (hf ** 2 * 0.5) +
    bw * H ** 2 * 0.5 +
    (bv - bw) * (H - hv * 0.5) * hv;
  areaSecao = (ie - bw) * hf + bw * H + (bv - bw) * hv;

  ycg = num / areaSecao;

  // Momento de inercia
  let Ix: number;
  let IXcg: number;

  Ix =
    ((ie - bw) * hf ** 3) / 3 +
    (bw * H ** 3) / 3 +
    ((bv - bw) * hv ** 3) / 12 +
    (bv - bw) * hv * (H - hv / 2) ** 2;

  IXcg = Ix - areaSecao * ycg ** 2;

  return { IXcg, ycg, areaSecao };
};

export const coeficientesDimensionamento = (
  caso: string,
  lbda: number,
  fd: number,
  fdser: number,
  De: number,
  lx: number,
  Phd: number = 1,
  Pvd: number = 2,
  H: number = 1
): { [key: string]: number } => {
  let kx: number = 0,
    ky: number = 0,
    wc: number = 0,
    mx: number = 0,
    my: number = 0,
    mxe: number = 0,
    mye: number = 0,
    rx: number = 0,
    ry: number = 0,
    rxe: number = 0,
    rye: number = 0,
    RY_: number = 0,
    RYE_: number = 0,
    MX_: number = 0,
    MXE_: number = 0,
    W0: number = 0;

  // Expoenenciações de lambda
  const lbda4 = Math.pow(lbda, 4);
  const lbda2 = Math.pow(lbda, 2);

  switch (caso) {
    // Para lajes armadas em duas direções
    case "1":
      kx = lbda4 / (1 + lbda4);
      ky = 1 - kx;
      wc = (5 * kx) / 384;
      mx = kx / 8;
      my = (ky * lbda2) / 8;
      rx = (ky * lbda) / 2;
      ry = kx / 2;
      break;
    case "2":
      kx = (5 * lbda4) / (2 + 5 * lbda4);
      ky = 1 - kx;
      wc = kx / 192;
      mx = kx / 14.22;
      my = (ky * lbda2) / 8;
      mxe = -kx / 8;
      rx = (ky * lbda) / 2;
      ry = (3 * kx) / 8;
      rye = (5 * kx) / 8;
      break;
    case "2A":
      kx = 5 / (2 * lbda4 + 5);
      ky = 1 - kx;
      wc = (kx * lbda4) / 192;
      mx = ky / 8;
      my = (kx * lbda2) / 14.22;
      mye = (-kx * lbda2) / 8;
      rx = (3 * kx * lbda) / 8;
      ry = ky / 2;
      rxe = (5 * kx * lbda) / 8;
      break;
    case "3":
      kx = (5 * lbda4) / (1 + 5 * lbda4);
      ky = 1 - kx;
      wc = kx / 384;
      mx = kx / 24;
      my = (kx * lbda2) / 8;
      mxe = -kx / 12;
      rx = (ky * lbda) / 8;
      rye = kx / 2;
      break;
    case "3A":
      kx = 5 / (lbda4 + 5);
      ky = 1 - kx;
      wc = (kx * lbda4) / 384;
      mx = ky / 8;
      my = (kx * lbda2) / 24;
      mye = (-kx * lbda2) / 12;
      ry = ky / 2;
      rxe = (kx * lbda) / 2;
      break;
    case "4":
      kx = lbda4 / (1 + lbda4);
      ky = 1 - kx;
      wc = kx / 192;
      mx = kx / 14.22;
      my = (ky * lbda2) / 14.22;
      mxe = -kx / 8;
      mye = (-ky * lbda2) / 8;
      rx = (3 * ky * lbda) / 8;
      ry = (3 * kx) / 8;
      rxe = (5 * ky * lbda) / 8;
      rye = (5 * kx) / 8;
      break;
    case "5":
      kx = (2 * lbda4) / (1 + 2 * lbda4);
      ky = 1 - kx;
      wc = kx / 384;
      mx = kx / 24;
      my = (ky * lbda2) / 14.22;
      mxe = -kx / 12;
      mye = (-ky * lbda2) / 8;
      rx = (3 * ky * lbda) / 8;
      rxe = (5 * ky * lbda) / 8;
      rye = kx / 2;
      break;
    case "5A":
      kx = 2 / (2 + lbda4);
      ky = 1 - kx;
      wc = (kx * lbda4) / 384;
      mx = ky / 14.2;
      my = (kx * lbda2) / 24;
      mxe = -ky / 8;
      mye = (-kx * lbda2) / 12;
      ry = (3 * ky) / 8;
      rxe = (kx * lbda) / 2;
      rye = (5 * ky) / 8;
      break;
    case "6":
      kx = lbda4 / (1 + lbda4);
      ky = 1 - kx;
      wc = kx / 384;
      mx = kx / 24;
      my = (ky * lbda2) / 24;
      mxe = -kx / 12;
      mye = (-ky * lbda2) / 12;
      rxe = (ky * lbda) / 2;
      rye = kx / 2;
      break;
    // Para lajes armadas em uma direção
    case "7":
      MX_ = (fd * Math.pow(lx, 2)) / 8;
      RY_ = (fd * lx) / 2;
      W0 = ((5 / 384) * fdser * Math.pow(lx, 4)) / De;
      break;
    case "8":
      MX_ = (fd * Math.pow(lx, 2)) / 14.22;
      MXE_ = -(fd * Math.pow(lx, 2)) / 8;
      RY_ = (3 * fd * lx) / 8;
      RYE_ = (5 * fd * lx) / 8;
      W0 = ((1 / 192) * fdser * Math.pow(lx, 4)) / De;
      break;
    case "9":
      MX_ = (fd * Math.pow(lx, 2)) / 24;
      MXE_ = -(fd * Math.pow(lx, 2)) / 12;
      RYE_ = (fd * lx) / 2;
      W0 = ((1 / 384) * fdser * Math.pow(lx, 4)) / De;
      break;
    case "10":
      MXE_ = -(fd * Math.pow(lx, 2)) / 2 - Pvd * lx - Phd * H;
      RYE_ = fd * lx + Pvd;
      W0 =
        ((1 / 8) * fdser * Math.pow(lx, 4)) / De +
        (Pvd * Math.pow(lx, 3)) / (3 * De);
      break;
    default:
      break;
  }

  return {
    kx: kx,
    ky: ky,
    wc: wc,
    mx: mx,
    my: my,
    mxe: mxe,
    mye: mye,
    rx: rx,
    ry: ry,
    rxe: rxe,
    rye: rye,
    RY_: RY_,
    RYE_: RYE_,
    MX_: MX_,
    MXE_: MXE_,
    W0: W0,
  };
};

// Função Ro minimo
const roMin = (fck: number): number => {
  let roMin: number;
  switch (fck) {
    case 20:
    case 25:
    case 30:
      return (roMin = 0.15);
    case 35:
      return (roMin = 0.164);
    case 40:
      return (roMin = 0.179);
    case 45:
      return (roMin = 0.194);
    case 50:
      return (roMin = 0.208);
    case 55:
      return (roMin = 0.211);
    case 60:
      return (roMin = 0.219);
    case 65:
      return (roMin = 0.226);
    case 70:
      return (roMin = 0.233);
    case 75:
      return (roMin = 0.239);
    case 80:
      return (roMin = 0.245);
    case 85:
      return (roMin = 0.251);
    case 90:
      return (roMin = 0.256);
    default:
      return 0;
  }
};

// Funcção calculo As Laje Maciça
const AsLajeMacica = (
  alphaC: number,
  etaC: number,
  lbda: number,
  fcd: number,
  b: number,
  fyd: number,
  md: number,
  d: number,
  AsMin: number
): [number, number] => {
  let As1 = 0;
  let raiz = 0;
  let x = 0;

  // Altura da linha neutra
  raiz = 1 - (2 * md) / (alphaC * etaC * fcd * b * Math.pow(d, 2));
  x = d / lbda;
  x = x * (1 - Math.pow(raiz, 0.5));

  // Área de aço
  As1 = (alphaC * etaC * lbda * fcd * b * x) / fyd;
  if (AsMin > As1) {
    As1 = AsMin;
  }

  return [As1, x];
};

// Verificação x/d
const VerificacaoXD = (x: number, d: number, fck: number): boolean => {
  return x / d <= (fck <= 50 ? 0.45 : 0.35);
};

// Função calculo cobrimento
const cobrimento = (classificacao: string): number => {
  switch (classificacao) {
    case "Rural":
    case "Submersa":
    case "Urbano Interno Seco":
      return 0.02;
    case "Urbano Externo":
    case "Urbano":
      return 0.025;
    case "Marinha":
    case "Industrial I":
      return 0.035;
    case "Industrial II":
    case "Respingos de maré":
      return 0.045;
    default:
      return 0;
  }
};

export const calcularCustoAcoAdicionalLajePainel = (
  laje: Laje
): [custoAco: number, areaAcoAdicional: number] => {
  // Retorna 0 caso seja protendida
  if (laje.tipo_laje === "protendida") return [0, 0];

  // Vigota da laje
  const trelica = buscarTrelica(laje.trel_id);

  // Parametros
  const class_ = "Urbano Interno Seco";
  const agregado = parametros.agregado;
  const vaoViga = Number(laje.vaoViga); // Vão da viga                                                      [m]
  const vaoOposto = Number(laje.vaoOposto); // Vão oposto da viga                                               [m]
  const fck = Number(parametros.fck); // Módulo de resistência do concreto                                [MPa]
  const fyk = Number(parametros.fyk); // Módulo de resistencia do aço                                     [kN/cm²]
  const hf = laje.altura_laje / 100; // A altura é pré-dimensionada de acordo com a carga e vão da viga  [m]
  const b = 100; // Comprimento da laje - Calcula-se para 1m de comprimento          [m]
  const poison = 0.2; //                                                                  []
  const fluencia = 2.5; //                                                                  []
  const psi2 = Number(parametros.psi_2); //                                                                 []
  const apoio_viga = Number(parametros.apoio_viga); //                                                            [m]

  // Cargas
  // Carga permanente = Revestimento + Peso Próprio [kN/m²]
  const pesoLaje: number = CalcularPesoProprioLaje(laje);
  const gk: number =
    pesoLaje + Number(parametros.carga_revestimento) * (9.807 / 1000); // [kN/m²]

  // Carga acidental/variável [kN/m²]
  const qk: number = laje.carga * (9.807 / 1000);

  // Parametros da vigota
  const hv = Number(trelica.hv) / 100; // [m]
  const bi = Number(trelica.bi) / 1000; // [m]
  const bd = Number(trelica.bd) / 1000; // [m]
  const bv = Number(trelica.bv) / 100; // [m]

  let AsVigota =
    Math.PI * Math.pow(bi * 50, 2) + Math.PI * Math.pow(bd * 50, 2); // [cm²]

  // Quantidade de vigotas na faixa de 1m
  // Área de aço na faixa de 1m
  // const qtVigotas = 1 / bv
  // AsVigota = AsVigota * qtVigotas //  [cm²/m]

  // Variáveis dependentes
  const lx = vaoViga + apoio_viga; // Vão da viga apoio [m]
  const ly = vaoOposto + apoio_viga; // Vão oposto da viga + apoio                 [m]
  const H = hf + hv; // Altura da laje                             [m]
  const fyd = fyk / 1.15; // Resistência de cálculo do aço              [kN/cm²]
  const fcd = fck / 10 / 1.4; // Resistência de cálculo do concreto         [kN/cm²]
  const c = cobrimento(class_); // Cobrimento de concreto                     [m]
  const d_positiva = (H - c - 0.01) * 100; // Altura útil positiva                       [cm]
  const d_negativa = (H - c - 0.005) * 100; // Altura útil negativa                       [cm]
  const r_lbda = (lx > ly ? lx : ly) / (lx < ly ? lx : ly); // Razão entre os lados da laje lambda        [m/m]

  let tipoArmacao = "";
  let caso_laje = "";

  if (r_lbda <= 2) {
    tipoArmacao = "bid";
    caso_laje = "1";
  } else {
    tipoArmacao = "uni";
    caso_laje = "7";
  }

  // VERIFICAÇÃO ELS - ESTADO LIMITE DE SERVIÇO
  const fdser = gk + psi2 * qk; // Carga de serviço [kN/m²]
  const fd = 1.4 * (qk + gk); // Carga de cálculo [kN/m²]
  const mECS = calcularECS(fck, agregado) * 1000; // Módulo de elasticidade secante [kPa]
  const De = (mECS * Math.pow(H, 3)) / (12 * (1 - Math.pow(poison, 2))); // Rigidez à flexão da laje [kN/cm²]

  // Solicitações - coeficientes unitários
  const dic_kx = coeficientesDimensionamento(
    caso_laje,
    r_lbda,
    fd,
    fdser,
    De,
    lx
  );

  const kx = dic_kx.kx; // Coeficiente kx []
  const wc = dic_kx.wc; // Coeficiente wc []

  let W0 = ((wc * fdser * Math.pow(lx, 4)) / De) * 1000; // Flecha imediata (casos 1-6) [mm]
  if (W0 === 0) {
    W0 = dic_kx.W0 * 1000; // Flecha imediata (casos 7-10) [mm]
  }

  const w00 = (1 + fluencia) * W0; // Flecha de longa duração [mm]
  const wadm = (lx * 1000) / 250; // Flecha admissível [mm]
  const ELS_ok = w00 <= wadm; // Verificação ELS [bool]

  // CALCULO DAS ARMADURAS - ELU - ESTADO LIMITE ÚLTIMO
  let Mx = dic_kx.mx * fd * Math.pow(lx, 2) * 100; // Momento fletor positivo direção X [kNcm/m]

  let My = dic_kx.my * fd * Math.pow(lx, 2) * 100; // Momento fletor positivo direção Y [kNcm/m]
  let Mxe = dic_kx.mxe * fd * Math.pow(lx, 2) * 100; // Momento fletor negativo direção X [kNcm/m]
  let Mye = dic_kx.mye * fd * Math.pow(lx, 2) * 100; // Momento fletor negativo direção Y [kNcm/m]

  // Solicitações de cálculo
  let Rx = dic_kx.rx * fd * lx; // [kN/m]
  let Rxe = dic_kx.rxe * fd * lx; // [kN/m]
  let Rye = dic_kx.rye * fd * lx; // [kN/m]
  let Ry = dic_kx.ry * fd * lx; // [kN/m]

  // Para os casos 7, 8, 9, 10
  if (["7", "8", "9", "10"].includes(caso_laje)) {
    My = 0;
    Mye = 0;
    Rx = 0;
    Rxe = 0;
    Mx = dic_kx.MX_ * 100; // [kNcm/m]
    Mxe = dic_kx.MXE_ * 100; // [kNcm/m]
    Ry = dic_kx.RY_ * 100; // [kNcm/m]
    Rye = dic_kx.RYE_ * 100; // [kNcm/m]
  }

  // Compatibilização de momentos fletores dos momentos negativos
  // Adotar procedimento futuramente

  // Coeficientes de cálculo
  let lbda, alphaC, etaC;
  if (fck <= 50) {
    lbda = 0.8;
    alphaC = 0.85;
  } else {
    lbda = 0.8 - (fck - 50) / 400;
    alphaC = 0.85 * (1 - (fck - 50) / 200);
  }
  etaC = fck <= 40 ? 1 : Math.pow(40 / fck, 1 / 3);

  // Armadura positiva mínima [cm²/m] => [cm²/vigota]
  const AsMin_positiva =
    (tipoArmacao === "bid" ? 0.67 : 1) * roMin(fck) * 100 * H;

  // Armadura negativa mínima [cm²/m]
  const AsMin_negativa = roMin(fck) * 100 * H;

  // DIMENSIONAMENTO ARMADURA POSITIVA (SEMPRE HÁ ARMADURA POSITIVA)
  // Para lajes unidirecionais existe apenas Mx e Mxe
  // Para lajes bidirecionais existe Mx, Mxe, My e Mye
  let As1_x = 0,
    As1_y,
    AsAdicional;
  let x = 0;

  if (Mx !== 0) {
    // DIREÇÃO X (direção da vigota)
    [As1_x, x] = AsLajeMacica(
      alphaC,
      etaC,
      lbda,
      fcd,
      b,
      fyd,
      Mx,
      d_positiva,
      AsMin_positiva
    );

    // Verificação da relação x/d
    const verXD_positiva_X = VerificacaoXD(x, d_positiva, fck);
  }

  // Área de aço adicional [cm²/vigota]
  AsAdicional = As1_x > AsVigota ? As1_x * bv - AsVigota : 0;
  if (AsAdicional < 0) {
    AsAdicional = 0;
  }

  // if (tipoArmacao === "bid" && My !== 0) {
  //     // DIREÇÃO Y
  //     [As1_y, x] = AsLajeMacica(alphaC, etaC, lbda, fcd, b, fyd, My, d_positiva, AsMin_positiva);

  //     // Verificação da relação x/d
  //     const verXD_positiva_Y = VerificacaoXD(x, d_positiva, fck);
  // }

  // // DIMENSIONAMENTO ARMADURA NEGATIVA
  // let As1_negativa_x, As1_negativa_Y;
  // if (Mxe !== 0) {
  //     // DIREÇÃO X
  //     [As1_negativa_x, x] = AsLajeMacica(alphaC, etaC, lbda, fcd, b, fyd, Mxe, d_negativa, AsMin_negativa);

  //     // Verificação da relação x/d
  //     const verXD_negativo_X = VerificacaoXD(x, d_negativa, fck);
  // }

  // if (Mye !== 0 && tipoArmacao === "bid") {
  //     // DIREÇÃO Y
  //     [As1_negativa_Y, x] = AsLajeMacica(alphaC, etaC, lbda, fcd, b, fyd, Mye, d_negativa, AsMin_negativa);

  //     // Verificação da relação x/d
  //     const verXD_negativo_X = VerificacaoXD(x, d_negativa, fck);
  // }

  // Retorno
  // Calculo de estimativa de custo
  // Iniciar com bitola = 25
  const abt25 = Math.PI * (25 / 20) ** 2;

  // Quantidade de barras de 25mm equivalentes para a área de aço adicional calculada
  const qtBarrasEqu: number = AsAdicional / abt25;

  // Comprimento linear de vigas
  const compVigas: number = calcularComprimentoLinearVigas(laje);

  // Custo metro barra de 25mm
  const custoB25 = precos["ca_60_25.0"];

  // Custo total estimado
  const custoTotalAco: number =
    Math.round(compVigas * custoB25 * qtBarrasEqu * 100) / 100;

  // Retorno
  return [custoTotalAco, AsAdicional];
};

export const calcularCustoAcoAdicionalLajePainelAliviado = (
  laje: Laje
): [custoAco: number, areaAcoAdicional: number] => {
  // TODO
  return [0, 0];
};

export const calcularCustoAcoAdicionalLajeTrelicada = (
  laje: Laje
): [custoAco: number, areaAcoAdicional: number] => {
  // retorna 0 caso seja protendida
  if (laje.tipo_laje === "protendida") return [0, 0];

  const enchimento = buscarEnchimento(laje.ench_id === 0 ? 1 : laje.ench_id); // busca o enchimento
  const trelica = buscarTrelica(laje.trel_id); // busca a treliça

  // Propriedades Vigota [cm]
  const hv: number = trelica.hv;
  const bv: number = trelica.bv;
  const ht: number = trelica.ht;
  const bi: number = trelica.bi;
  const bs: number = trelica.bs;
  const bd: number = trelica.bd;
  const AsVigota: number = (Math.PI * bi ** 2) / 200; // [cm²]

  // Propriedades Enchimento [cm]
  const he: number = enchimento.he;
  const be: number = enchimento.be;
  const ce: number = enchimento.ce;
  const ah: number = enchimento.ah;
  const av: number = enchimento.av;

  // Parametros
  const agregado: string = parametros.agregado;
  const psi2: number = parametros.psi_2;
  const hf: number = parametros.hf;
  const fck: number = parametros.fck;
  const fyk: number = parametros.fyk;

  // Geometria
  const bw: number = bv - 2 * ah; // Alma
  const ie: number = bv + be; // Intereixo
  const H: number = he + hf; // Altura da laje

  // Propriedades
  let ycg: number = 0;
  let areaSecao: number = 0;
  let IXcg: number = 0;
  const vaoCalculo: number =
    Number(laje.vaoViga) + Number(parametros.apoio_viga);
  const fluencia: number = parametros.fluencia;
  const delta: number = parametros.delta;
  // const alphaC: number = parametros.alphaC
  // const etaC: number = parametros.etaC
  // const lbda: number = parametros.lbda

  // Coeficientes de cálculo
  let lbda, alphaC, etaC;
  if (fck <= 50) {
    lbda = 0.8;
    alphaC = 0.85;
  } else {
    lbda = 0.8 - (fck - 50) / 400;
    alphaC = 0.85 * (1 - (fck - 50) / 200);
  }

  etaC = fck <= 40 ? 1 : Math.pow(40 / fck, 1 / 3);

  // Módulo de elasticidade secante [kPa]
  const mECS: number = calcularECS(fck, agregado);

  // Momento de inercia da seção da laje  [cm^4]
  const params = calcularMomentoInerciaT(H, hv, bv, bw, ie, hf);
  ycg = params.ycg;
  areaSecao = params.areaSecao;
  IXcg = params.IXcg;

  // Altura equivalente de uma laje maciça
  const heq: number = ((IXcg * 12) / ie) ** (1 / 3);

  // Rigidez equivalente da laje
  const De = (mECS * ((heq / 100) ^ 3)) / (12 * ((1 - 0.2) ^ 2));

  // Cargas
  // Carga permanente = Revestimento + Peso Próprio [kN/m²]
  const pesoLaje: number = CalcularPesoProprioLaje(laje);
  const gk: number =
    pesoLaje + Number(parametros.carga_revestimento) * (9.807 / 1000); // [kN/m²]

  // Carga acidental/variável [kN/m²]
  const qk: number = laje.carga * (9.807 / 1000);

  // Carga de serviço
  const fdser: number = gk * psi2 * qk;

  // Flecha imediata (caso 7)
  const W0: number = (1000 * (5 / 384) * (fdser * vaoCalculo ** 4)) / De; // [mm]

  // Flecha de longa duração [mm]
  const W00: number = W0 * (1 + fluencia);

  // Flecha adimissível
  const wadm: number = (vaoCalculo * 1000) / 250;

  // Confere estado limite de serviço
  const ELS_ok: boolean = W00 <= wadm;

  // Dimensionamento à Flexão
  const d_: number = 2.5;
  const d: number = H - hv / 2;

  // Momento de calculo (Caso 7)
  const fatorMajoracao = 1.4;
  const fd: number = fatorMajoracao * gk + fatorMajoracao * qk;

  let md = ((fd * vaoCalculo ** 2) / 8) * ie; // [kNcm/vigota]

  // Resistencias de calculo [kN/cm²]
  const fcd: number = fck / (fatorMajoracao * 10); // Converção direta kN/m² -> kN/cm²
  const fyd: number = fyk / 1.15;

  // fctk superior [MPa]
  const fctk_sup: number = 0.039 * fck ** (2 / 3);

  // Módulo de resistencia [cm³]
  const WO: number = IXcg / (H - ycg);

  // xduc
  let xDuc: number = 0;
  if (fck <= 50) {
    xDuc = ((delta - 0.4375) * d) / 1.25;
  } else if (fck <= 90 && fck > 50) {
    xDuc = ((delta - 0.5625) * d) / 1.25;
  }

  // x23
  const x23: number = (3.5 / 13.5) * d;
  const MdDuc =
    alphaC * etaC * fcd * lbda * xDuc * bw * (d - (lbda * xDuc) / 2) +
    alphaC * etaC * fcd * hf * (ie - bw) * (d - hf / 2);
  const MdMin = 0.8 * WO * fctk_sup; // [kNcm]

  // Comparação das solicitações - Tipo de armadura
  let tipoArmadura: string = "";
  if (MdMin >= md) {
    tipoArmadura = "Armadura Mínima";
    md = MdMin;
  } else if (md > MdMin && md <= MdDuc) {
    tipoArmadura = "Armadura Simples";
  } else {
    tipoArmadura = "Armadura Dupla";
  }

  let hipoteseInicial: boolean = true;
  let x: number = 0;
  let As1: number = 0;
  let As2: number = 0;
  let aux: number = 0;
  let z: number = 0;
  let s: number = 0;
  let t: number = 0;
  let u: number = 0;
  let x1: number = 0;
  let x2: number = 0;
  let dominio: number = 1;
  let ec: number = 0;
  let e1: number = 0;
  let e2: number = 0;
  let sigma2: number;

  if (
    tipoArmadura === "Armadura Mínima" ||
    tipoArmadura === "Armadura Simples"
  ) {
    z = alphaC * etaC * fcd * ie * lbda * d;
    s = alphaC * etaC * fcd * ie * lbda ** 2 * 0.5;
    x1 = (z + Math.sqrt(z ** 2 - 4 * s * md)) / (2 * s);
    x2 = (z - Math.sqrt(z ** 2 - 4 * s * md)) / (2 * s);

    if (x1 >= H) {
      x = x2;
    } else {
      x = x1;
    }

    t = alphaC * etaC * fcd * ie * lbda * x;

    As1 = t / fyd;
    const AsMin: number = (0.15 / 100) * areaSecao;

    if (AsMin > As1) {
      As1 = AsMin;
    }

    hipoteseInicial = lbda * x < hf;

    if (!hipoteseInicial) {
      z = alphaC * etaC * fcd * hf * d;
      s = alphaC * etaC * fcd * hf ** 2 * 0.5;
      t = alphaC * etaC * fcd * lbda * bw * d;
      u = alphaC * etaC * fcd * lbda ** 2 * bw * 0.5;
      aux = t ^ (2 - 4 * u * (md - (z - s) * (ie - bw)));
      x1 = (t + Math.sqrt(aux)) / (2 * u);
      x2 = (t - Math.sqrt(aux)) / (2 * u);

      if (x1 >= H) {
        x = x2;
      } else {
        x = x1;
      }

      As1 =
        (alphaC * etaC * fcd * lbda * bw * x +
          alphaC * etaC * fcd * hf * (ie - bw)) /
        fyd;
      if (AsMin > As1) {
        As1 = AsMin;
      } // cm2/vigota
    }
  } else {
    // Calcula a armadura dupla
    x = xDuc;

    // Determinando o dominio
    if (x < 0) {
      dominio = 1;
    } else if (x < 0.259 * d) {
      dominio = 2;
    } else if (x < 0.629 * d) {
      dominio = 3;
    } else if (x < d) {
      dominio = 4;
    } else {
      dominio = 5;
    }

    // ec
    if (dominio == 3) {
      ec = 3.5;
    } else if (dominio == 2) {
      ec = (10 / (d - x)) * x;
    }

    // e1
    if (dominio == 2) {
      e1 = 10;
    } else if ((dominio = 3)) {
      e1 = (3.5 / x) * (d - x);
    }

    // e2
    e2 = (ec / x) * (x - d_);

    // Tensões de escoamento
    const valores = [e1 * 21, fyd];
    const sigma1 = Math.min(...valores);

    if (e2 < -fyd / 21) {
      sigma2 = -fyd;
    } else if (e2 > fyd / 21) {
      sigma2 = fyd;
    } else {
      sigma2 = e2 * 21;
    }

    // Calculando As2
    As2 = (md - MdDuc) / (sigma2 * (d - d_));

    // Calculando As1
    As1 =
      (alphaC * etaC * fcd * lbda * xDuc * bw +
        alphaC * etaC * fcd * hf * (ie - bw) +
        As2 * sigma2) /
      fyd;
  }

  // Aço adicional calculado
  let AsAdicional: number = 0;
  if (As1 > 0) {
    AsAdicional = As1 - AsVigota;
  } else {
    AsAdicional = 0;
  }
  AsAdicional = Math.round(AsAdicional * 100) / 100;

  // Calculo de estimativa de custo
  // Iniciar com bitola = 25
  const abt25 = Math.PI * (25 / 20) ** 2;

  // Quantidade de barras de 25mm equivalentes para a área de aço adicional calculada
  const qtBarrasEqu: number = AsAdicional / abt25;

  // Comprimento linear de vigas
  const compVigas: number = calcularComprimentoLinearVigas(laje);

  // Custo metro barra de 25mm
  const custoB25 = precos["ca_60_25.0"];

  // Custo total estimado
  const custoTotalAco: number =
    Math.round(compVigas * custoB25 * qtBarrasEqu * 100) / 100;

  // Retorno
  return [custoTotalAco, AsAdicional];
};

export const calcularBarras = (as: number, opt: number): string => {
  // Função que calcula a área da seção da bitola passada
  const areaSecao = (bitola: number) => Math.PI * Math.pow(bitola / 20, 2);

  // Lista de bitolas
  const bitolas = [12.5, 10.0, 8.0, 6.3, 5.0, 4.2];

  // Variável de retorno
  let resultado = "";

  // Área de aço inicial
  let areaRestante = as;
  let areaFinal = 0;

  for (let i = opt; i < bitolas.length; i++) {
    const bitola = bitolas[i];
    const areaBarra = areaSecao(bitola);

    // Calcula a quantidae de barras inteiras
    const quantidadeBarras = Math.floor(areaRestante / areaBarra);

    // Incrementa a área total
    areaFinal += quantidadeBarras * areaBarra;

    // Incrementa a string
    if (quantidadeBarras > 0) {
      resultado += `${quantidadeBarras} θ ${bitola} + `;
    }

    // Calcula o resto da área
    areaRestante = areaRestante % areaBarra;
  }

  // Remove o último '+' da string, se houver
  if (resultado.endsWith(" + ")) {
    resultado = resultado.slice(0, -3);
  }

  return `${resultado.trim()} (${areaFinal.toFixed(2)} cm²)`;
};

const configuracao = (fabricante: string) => {
  const configuracoesArcelorMittal = [
    {
      limites: [
        { vao: 4, carga: 100 },
        { vao: 3.8, carga: 200 },
        { vao: 3.6, carga: 400 },
        { vao: 3.4, carga: 550 },
        { vao: 3.2, carga: 600 }
      ],
      id_vigota: 2,
      id_enchimento: 2,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 5.8, carga: 100 },
        { vao: 5.4, carga: 150 },
        { vao: 5.2, carga: 300 },
        { vao: 5, carga: 400 },
        { vao: 4.8, carga: 550 },
        { vao: 4.6, carga: 600 }
      ],
      id_vigota: 1,
      id_enchimento: 3,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 6.8, carga: 100 },
        { vao: 6.4, carga: 200 },
        { vao: 6.2, carga: 350 },
        { vao: 5.8, carga: 400 },
        { vao: 5.6, carga: 550 },
        { vao: 5.4, carga: 600 }
      ],
      id_vigota: 3,
      id_enchimento: 4,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 7.7, carga: 100 },
        { vao: 7.1, carga: 350 },
        { vao: 6.8, carga: 450 },
        { vao: 6.5, carga: 600 }
      ],
      id_vigota: 8,
      id_enchimento: 5,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 8.7, carga: 100 },
        { vao: 8.4, carga: 150 },
        { vao: 8.1, carga: 400 },
        { vao: 7.5, carga: 550 },
        { vao: 7.2, carga: 600 }
      ],
      id_vigota: 10,
      id_enchimento: 6,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 9.4, carga: 100 },
        { vao: 9.1, carga: 200 },
        { vao: 8.8, carga: 400 },
        { vao: 8.5, carga: 500 },
        { vao: 8.2, carga: 600 }
      ],
      id_vigota: 12,
      id_enchimento: 7,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 4, carga: 100 },
        { vao: 3.8, carga: 200 },
        { vao: 3.6, carga: 400 },
        { vao: 3.4, carga: 550 },
        { vao: 3.2, carga: 600 }
      ],
      id_vigota: 2,
      id_enchimento: 14,
      tipo: ["painel_macico_aliviado"]
    },
    {
      limites: [
        { vao: 5.8, carga: 100 },
        { vao: 5.4, carga: 150 },
        { vao: 5.2, carga: 300 },
        { vao: 5, carga: 400 },
        { vao: 4.8, carga: 550 },
        { vao: 4.6, carga: 600 }
      ],
      id_vigota: 1,
      id_enchimento: 15,
      tipo: ["painel_macico_aliviado"]
    },
    {
      limites: [
        { vao: 6.8, carga: 100 },
        { vao: 6.4, carga: 200 },
        { vao: 6.2, carga: 350 },
        { vao: 5.8, carga: 400 },
        { vao: 5.6, carga: 550 },
        { vao: 5.4, carga: 600 }
      ],
      id_vigota: 3,
      id_enchimento: 16,
      tipo: ["painel_macico_aliviado"]
    },
    {
      limites: [
        { vao: 7.7, carga: 100 },
        { vao: 7.1, carga: 350 },
        { vao: 6.8, carga: 450 },
        { vao: 6.5, carga: 600 }
      ],
      id_vigota: 8,
      id_enchimento: 17,
      tipo: ["painel_macico_aliviado"]
    },
    {
      limites: [
        { vao: 8.7, carga: 100 },
        { vao: 8.4, carga: 150 },
        { vao: 8.1, carga: 400 },
        { vao: 7.5, carga: 550 },
        { vao: 7.2, carga: 600 }
      ],
      id_vigota: 10,
      id_enchimento: 18,
      tipo: ["painel_macico_aliviado"]
    },
    {
      limites: [
        { vao: 9.4, carga: 100 },
        { vao: 9.1, carga: 200 },
        { vao: 8.8, carga: 400 },
        { vao: 8.5, carga: 500 },
        { vao: 8.2, carga: 600 }
      ],
      id_vigota: 12,
      id_enchimento: 19,
      tipo: ["painel_macico_aliviado"]
    }
  ];

  const configuracoesAutentica = [
    {
      limites: [
        { vao: 4.75, carga: 300 },
        { vao: 4.45, carga: 400 },
        { vao: 4.25, carga: 500 },
        { vao: 3.95, carga: 600 },
        { vao: 3.75, carga: 700 },
        { vao: 3.55, carga: 800 },
        { vao: 3.35, carga: 1000 }
      ],
      id_vigota: 2,
      id_enchimento: 2,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 6.75, carga: 200 },
        { vao: 6.25, carga: 300 },
        { vao: 5.95, carga: 400 },
        { vao: 5.55, carga: 500 },
        { vao: 5.35, carga: 600 },
        { vao: 4.95, carga: 700 },
        { vao: 4.75, carga: 800 },
        { vao: 4.55, carga: 900 },
        { vao: 4.35, carga: 1000 }
      ],
      id_vigota: 1,
      id_enchimento: 3,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 7.85, carga: 200 },
        { vao: 7.55, carga: 300 },
        { vao: 7.05, carga: 400 },
        { vao: 6.55, carga: 500 },
        { vao: 6.25, carga: 600 },
        { vao: 5.95, carga: 700 },
        { vao: 5.65, carga: 800 },
        { vao: 5.45, carga: 900 },
        { vao: 5.25, carga: 1000 }
      ],
      id_vigota: 3,
      id_enchimento: 4,
      tipo: ["trelicada"]
    },
    {
      limites: [
        { vao: 5.25, carga: 200 },
        { vao: 5.05, carga: 300 },
        { vao: 4.95, carga: 400 },
        { vao: 4.85, carga: 500 },
        { vao: 4.75, carga: 900 },
        { vao: 4.65, carga: 1000 },
        { vao: 4.55, carga: 1100 },
        { vao: 4.45, carga: 1200 }
      ],
      id_vigota: 2,
      id_enchimento: 14,
      tipo: ["painel_macico_aliviado", "painel_macico"]
    },
    {
      limites: [
        { vao: 6.75, carga: 200 },
        { vao: 6.65, carga: 300 },
        { vao: 6.55, carga: 500 }
      ],
      id_vigota: 1,
      id_enchimento: 15,
      tipo: ["painel_macico_aliviado", "painel_macico"]
    }
  ];

  if (fabricante === "arcelormittal") {
    return configuracoesArcelorMittal
  } else if (fabricante === "autentica") {
    return configuracoesAutentica
  } else {
    return configuracoesArcelorMittal
  }
}

export const definirVigota_Enchimento = (
  vao: number,
  carga: number,
  tipo_laje: string
): [number, string, number, string, number] => {
  // Retorna a vigota que atende ao vão e carga indicada
  // Retorno => [id_vigota, modelo_vigota, id_enchimento, enchimento_modelo, altura_laje]

  let id_vigota: number;
  let modelo_vigota: string;
  let id_enchimento: number;
  let modelo_enchimento: string;
  let altura_laje: number;

  // Encontrar a configuração correta
  const cConfig = configuracao("autentica")

  const config = cConfig.find(cfg =>
    cfg.tipo.includes(tipo_laje) &&
    cfg.limites.some(limite => vao <= limite.vao && carga <= limite.carga)
  );

  // Se encontrou uma configuração, atribuir os valores
  if (config) {
    id_vigota = config.id_vigota;
    id_enchimento = config.id_enchimento;
  } else {
    id_vigota = 20;
    id_enchimento = tipo_laje !== "painel_macico_aliviado" ? 7 : 19;
  }

  const enchimento = buscarEnchimento(id_enchimento);
  const vigota = buscarTrelica(id_vigota);

  altura_laje = (enchimento ? enchimento.he : 30) + Number(parametros.hf)
  modelo_enchimento = enchimento ? enchimento.ench_modelo : '';
  modelo_vigota = vigota ? vigota.trel_modelo : '';

  return [
    id_vigota,
    modelo_vigota,
    tipo_laje !== "painel_macico" ? id_enchimento : 0,
    tipo_laje !== "painel_macico" ? modelo_enchimento : "",
    altura_laje,
  ];
};

export const definirVigotaProtendida = (
  vao_viga: number,
  carga: number,
  condicao_apoio: string
): [number, string, number, string, number, string] => {
  // Retorna [id_vigota, modelo_vigota, id_enchimento, enchimento_modelo, altura_laje, tipo_vigota]
  // const altura_laje = definirVigota_Enchimento(vao_viga, carga)[4];

  const candidatos = dados_protendida
    .filter((item) => {
      return (
        item.carga_kgf_m2 >= carga && item.condicao_apoio === condicao_apoio // &&
        // item.tipo_vigota === tipo_vigota // &&
        // item.altura_cm === altura_laje
      );
    })
    .map(({ tipo_3010, tipo_4110, ...rest }) => rest);

  // Se não houver candidatos, retorna valores padrão
  if (candidatos.length === 0) {
    return [0, "-", 0, "-", 0, "-"];
  }

  // Encontra a menor carga no conjunto filtrado
  const menorCarga = Math.min(...candidatos.map((item) => item.carga_kgf_m2));

  // Filtra novamente para pegar apenas os itens com a menor carga encontrada
  const candidatosFiltrados = candidatos.filter(
    (item) => item.carga_kgf_m2 === menorCarga
  );

  // Se ainda assim não houver candidato válido, retorna valores padrão
  if (candidatosFiltrados.length === 0) {
    return [0, "-", 0, "-", 0, "-"];
  }

  const tipoNome = (tipo: string): [number, string] => {
    switch (tipo) {
      case "tipo_2010":
        return [14, "3 FIOS"];
      case "tipo_3010":
        return [15, "4 FIOS"];
      case "tipo_3110":
        return [16, "5 FIOS"];
      case "tipo_4110":
        return [17, "6 FIOS"];
      case "tipo_4111":
        return [18, "7 FIOS"];
      case "tipo_4111E":
        return [19, "7 FIOS E"];
      default:
        return [0, "-"];
    }
  };

  // Verifica o tipo correspondente ao vão fornecido
  const tipos = ["tipo_2010", "tipo_3110", "tipo_4111", "tipo_4111E"] as const;

  for (const candidato of candidatosFiltrados) {
    for (const tipo of tipos) {
      const valor = candidato[tipo];

      if (valor !== undefined && valor !== null && vao_viga * 100 <= valor) {
        return [
          tipoNome(tipo)[0], // ID da vigota
          tipoNome(tipo)[1], // Modelo da vigota
          buscarEnchimentoPorRef(candidato.ref_enchimento).id, // id do enchimento
          candidato.ref_enchimento, // Referência do enchimento
          candidato.altura_cm,
          candidato.tipo_vigota,
        ];
      }
    }
  }

  return [0, "-", 0, "-", 0, "-"];
};

export const calcularCargaPorGrupo = (
  grupo: string = "Residencial"
): number => {
  const Grupos: TipoCarga = gruposCargas;
  let carga = Grupos[grupo];
  return carga;
};

export const tipoLajePorTipo = (tipo: string): string => {
  if (tipo === "trelicada") {
    return "Treliçada";
  } else if (tipo === "painel_macico") {
    return "Painel Maciço";
  } else if (tipo === "protendida") {
    return "Protendida";
  } else {
    return "Painel Aliviado";
  }
};

export const formatarData = (date: Date) => {
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const generatePDF = async (
  element: HTMLElement,
  fileName: string = "relatorio.pdf"
) => {
  if (!element) {
    alert("Elemento do relatório não encontrado.");
    return;
  }

  // Salva os estilos originais
  const originalStyle = element.style.cssText;

  try {
    // Força o layout "desktop" no elemento
    element.style.width = "1200px";
    element.style.overflow = "visible";
    element.style.zoom = "100%";

    // Ajusta as imagens dentro do elemento
    // const images = element.querySelectorAll("img");
    // images.forEach((img) => {
    //   img.style.objectFit = "contain";
    //   // img.style.overflow = "hidden";
    // });

    // Captura o conteúdo como imagem usando html2canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Dimensões do PDF
    const pdfWidth = 297; // Largura padrão A4 em modo paisagem (mm)
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

    // Cria um PDF
    const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);

    // Adiciona a imagem ao PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Salva o PDF
    pdf.save(fileName);
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    alert("Erro ao gerar o PDF.");
  } finally {
    // Restaura os estilos originais do elemento
    element.style.cssText = originalStyle;
  }
};

export const handleEnviarDados = async (listaLajes: Laje[]) => {
  if (listaLajes.length === 0) {
    return;
  }

  try {
    const response = await fetch("/api/submitData", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listaLajes),
    });
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
  }
};

export const valorToLocalString = (valor: string | number): string => {
  const vlOut = Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return vlOut;
};

export const calcularLajeTrelicadaMetodoTabela = (
  vao_viga: number,
  carga: number,
  tipo_laje: string
): TipoTrelicada => {
  // Passo 1: Filtrar registros onde o vão e a carga são maiores ou iguais ao solicitado e igual ao tipo
  let candidatos = dados_vigotas_paineis.filter(
    (laje) =>
      laje.vao_viga_m <= (Number(vao_viga) + Number(parametros.apoio_viga)) &&
      laje.carga_kgf_m2 <= carga &&
      laje.barras_adicionais != "nok" &&
      laje.tipo_laje === tipo_laje &&
      laje.fornecedor === "autentica"
  );

  console.log(`Vao viga: ${Number(vao_viga) + Number(parametros.apoio_viga)}`)

  if (candidatos.length === 0) {
    const retorno: TipoTrelicada = {
      id: 0,
      altura_cm: 0,
      enchimento: "EPS",
      ref_enchimento: "",
      capa_cm: 0,
      modelo_trelica: "",
      d_linhas_escora_m: 0,
      concreto_l_m2: 0,
      peso_proprio_kgf_m2: 0,
      tabela: "",
      vao_viga_m: 0,
      carga_kgf_m2: 0,
      barras_adicionais: "erro",
      area_aco_cm2: 0,
      q1: 0,
      b1: 0,
      q2: 0,
      b2: 0,
      q3: 0,
      b3: 0,
      tipo_aco: "ca60",
      tipo_laje: "trelicada",
    };
    return retorno;
  }

  // Passo 2: Encontrar a menor carga entre os filtrados
  const maiorCarga = Math.max(...candidatos.map((laje) => laje.carga_kgf_m2));
  candidatos = candidatos.filter((laje) => laje.carga_kgf_m2 === maiorCarga);

  // Passo 3: Filtrar pela menor altura da laje
  const menorAltura = Math.min(...candidatos.map((laje) => laje.altura_cm));
  candidatos = candidatos.filter((laje) => laje.altura_cm === menorAltura);

  // Passo 4: Filtrar pelo menor vão
  const maior = Math.max(...candidatos.map((laje) => laje.vao_viga_m));
  candidatos = candidatos.filter((laje) => laje.vao_viga_m === maior);

  // Retorna a melhor opção encontrada
  return candidatos[0] as TipoTrelicada;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const areaLaje = (l: Laje): number => {
  let vo = Number(l.vaoOposto) + Number(parametros.apoio_vao_oposto);
  let vv = Number(l.vaoViga) + Number(parametros.apoio_viga);
  return vo * vv;
};

export const calcularAreaTotalLajes = (lajes: Laje[]): number => {
  const areaTotal = lajes.reduce((acc, laje: Laje) => acc + areaLaje(laje), 0);
  return areaTotal;
};

export const calcularValorTotalTrelicas = (lajes: Laje[]): number => {
  const valorTrelicas = lajes.reduce((acc, laje) => {
    const vigota = vigotas_paineis.find(
      (item: Vigota_Painel) => item.trel_modelo === laje.trel_modelo
    );
    if (vigota) {
      return (
        acc + calcularComprimentoLinearVigas(laje) * vigota.trel_custo_linear
      );
    }
    return acc;
  }, 0);

  return valorTrelicas;
};

export const calcularValorTotalEnchimento = (lajes: Laje[]): number => {
  const valorEnchimento = lajes.reduce(
    (acc, laje) => acc + calcularCustoEnchimento(laje),
    0
  );
  return valorEnchimento;
};

const kgf_to_knm2 = (carga: number): number => {
  return (carga * 9.807) / 1000;
};

export const CalcularPesoProprioLaje2 = (l: Laje): number => {
  // REFERENCIAS
  // NBR 6120

  // Elementos da laje
  const enchimento = buscarEnchimento(l.ench_id);
  const trelica = buscarTrelica(l.trel_id);

  // Propriedades
  const H = l.altura_laje / 100;
  const tipo_laje = l.tipo_laje;
  const bv = trelica.bv / 100;
  const hv = trelica.hv / 100;

  const be = enchimento ? enchimento.be / 100 : 0;
  const he = enchimento ? enchimento.he / 100 : 0;
  const ie = bv + be;
  const gEnchimento = enchimento ? (enchimento.peso_proprio * 9.807) / 1000 : 0;

  // Parametros
  const capaConcreto = parametros.hf / 100;
  const gConcreto = parametros.gama_contreto;

  // Saida
  let pesoLaje = 0;

  if (tipo_laje === "trelicada") {
    const pesoCapa = gConcreto * ie * capaConcreto;
    const pesoVigota = gConcreto * he * bv;
    const pesoEnchimento = gEnchimento * be * he;
    pesoLaje = (pesoCapa + pesoVigota + pesoEnchimento) / ie;
  } else if (tipo_laje === "painel_macico") {
    pesoLaje = gConcreto * H;
  } else if (tipo_laje === "painel_macico_aliviado") {
    const bw = bv - be;
    const pesoCapa = gConcreto * bw * (H / 100);
    const pesoVigota = gConcreto * (hv * bv);
    const pesoEnchimento = gEnchimento * (be * he);
    pesoLaje = (pesoCapa + pesoVigota + pesoEnchimento) / bv;
  }

  return pesoLaje;
};

const calcularAreaT = (
  enchimento: Enchimento,
  trelica: Vigota_Painel,
  hf: number
): number => {
  const bv = trelica.bv;
  const hv = trelica.hv;
  const ht = trelica.ht;
  const be = enchimento.be;
  const ah = enchimento.ah;
  const H = ht + hf;
  const ie = bv + be;
  const bw = bv - 2 * ah;
  const areaSecaoT = (ie - bw) * hf + bw * H + (bv - bw) * hv;
  // cm2
  return areaSecaoT;
};

export const calcularCentroGeometricoT = (
  enchimento: Enchimento,
  trelica: Vigota_Painel,
  hf: number
): number => {
  const bv = trelica.bv;
  const hv = trelica.hv;
  const ht = trelica.ht;
  const be = enchimento.be;
  const ah = enchimento.ah;
  const H = ht + hf;
  const ie = bv + be;
  const bw = bv - 2 * ah;

  const numerador =
    (ie - bw) * Math.pow(hf, 2) * 0.5 +
    bw * Math.pow(H, 2) * 0.5 +
    (bv - bw) * hv * (H - hv * 0.5);

  const denominador = (ie - bw) * hf + bw * H + (bv - bw) * hv;
  const ycg = numerador / denominador;

  // cm
  return ycg;
};

export const calcularMomentoInerciaT2 = (
  enchimento: Enchimento,
  trelica: Vigota_Painel,
  hf: number,
  ycg: number
): number => {
  const bv = trelica.bv;
  const hv = trelica.hv;
  const ht = trelica.ht;
  const be = enchimento.be;
  const ah = enchimento.ah;
  const H = ht + hf;
  const ie = bv + be;
  const bw = bv - 2 * ah;

  // cm^4
  const Ix =
    ((ie - bw) * Math.pow(hf, 3)) / 3 +
    (bw * Math.pow(H, 3)) / 3 +
    ((bv - bw) * Math.pow(hv, 3)) / 12 +
    (bv - bw) * hv * (H - hv * 0.5);

  // cm^4
  const Ixcg = Ix - calcularAreaT(enchimento, trelica, hf) * Math.pow(ycg, 2);

  return Ixcg;
};

const calcularAlturaEquivalentePorMomentoInercia = (
  Ixcg: number,
  ie: number
): number => {
  const he = Math.pow((12 * Ixcg) / ie, 1 / 3);
  return he;
};

const calcularRigidezEquivalente = (
  ecs: number,
  H: number,
  poison: number
): number => {
  const De = (ecs * Math.pow(H, 3)) / (12 * (1 - Math.pow(poison, 2)));
  return De;
};

const calcularFlechaImediata = (
  caso: string,
  fdServico: number,
  vaoCalculo: number,
  De: number,
  Pv = 0
): number => {
  let w0: number = 0;

  switch (caso) {
    case "7":
      w0 = (5 / 384 / De) * fdServico * Math.pow(vaoCalculo, 4);
      break;
    case "8":
      w0 = (1 / 192 / De) * fdServico * Math.pow(vaoCalculo, 4);
      break;
    case "9":
      w0 = (1 / 384 / De) * fdServico * Math.pow(vaoCalculo, 4);
      break;
    case "10":
      w0 =
        (1 / 8 / De) * fdServico * Math.pow(vaoCalculo, 4) +
        (Pv / 3 / De) * fdServico * Math.pow(vaoCalculo, 3);
      break;
  }

  return w0;
};

const calcularFctkSup = (fck: number): number => {
  return 0.39 * Math.pow(fck, 2 / 3);
};

const calcularLinhaNeutra = (
  alphaC: number,
  etaC: number,
  fcd: number,
  ie: number,
  lbda: number,
  d: number,
  md: number,
  H: number
): number => {
  const z = alphaC * etaC * fcd * ie * lbda * d;
  const s = alphaC * etaC * fcd * ie * lbda ** 2 * 0.5;
  const x1 = (z + Math.sqrt(z ** 2 - 4 * s * md)) / (2 * s);
  const x2 = (z - Math.sqrt(z ** 2 - 4 * s * md)) / (2 * s);
  const x = x1 >= H ? x2 : x1;
  return x;
};

const calcularAs = (
  alphaC: number,
  etaC: number,
  fcd: number,
  bf: number,
  lbda: number,
  x: number,
  fyd: number
): number => {
  return (alphaC * etaC * fcd * bf * lbda * x) / fyd;
};

const calcularMomentoCalculo = (
  caso: string,
  fd: number,
  vaoCalculo: number,
  PV = 0,
  PH = 0,
  H = 0
): { Mx: number; Mxe: number } => {
  switch (caso) {
    case "7":
      return { Mx: (fd * vaoCalculo ** 2) / 8, Mxe: 0 };
    case "8":
      return {
        Mx: (fd * vaoCalculo ** 2) / 14.22,
        Mxe: -(fd * vaoCalculo ** 2) / 8,
      };
    case "9":
      return {
        Mx: (fd * vaoCalculo ** 2) / 24,
        Mxe: -(fd * vaoCalculo ** 2) / 12,
      };
    case "10":
      return {
        Mx: 0,
        Mxe: -(fd * vaoCalculo ** 2) / 2 - PV * vaoCalculo - PH * H,
      };
  }
  return { Mx: 0, Mxe: 0 };
};

export const dimensionarLajeMacica = (l: Laje) => {
  // O que eu quero retornar ?
  // A área de aço total necessário [cm²]
  // A área de aço adicional [cm²]
  // As configurações de barras possíveis

  const trelica = buscarTrelica(l.trel_id);
  const bi = trelica.bi;
  const ht = trelica.ht;
  const bv = trelica.bv;
  const AsVigota = 2 * Math.PI * Math.pow(bi / 20, 2);

  // Parametros da laje
  const pesoRevestimento = kgf_to_knm2(parametros.carga_revestimento);
  const pesoProprioLaje = CalcularPesoProprioLaje2(l);

  // Parametros
  const fck = parametros.fck;
  const fyk = parametros.fyk;
  const fcd = fck / 1.4 / 10; // kN/cm2
  const fyd = fyk / 1.15; //kN/cm2
  const apoioViga = parametros.apoio_viga;

  // Geometria (cm)
  const hf = parametros.hf;
  const H = hf + ht;
  const d_ = 5;
  const d = H - d_;

  const fctk_sup = calcularFctkSup(fck) / 10; // kN/cm2
  const Wo = (bv * H ** 2) / 6; // cm3
  const MdMin = 0.8 * Wo * fctk_sup; // kNcm

  // Coeficientes de cálculo
  let lbda: number, alphaC: number, etaC: number;
  if (fck <= 50) {
    lbda = 0.8;
    alphaC = 0.85;
  } else {
    lbda = 0.8 - (fck - 50) / 400;
    alphaC = 0.85 * (1 - (fck - 50) / 200);
  }
  etaC = fck <= 40 ? 1 : Math.pow(40 / fck, 1 / 3);

  // Carga permanente [kN/m²]
  const gk = pesoProprioLaje + pesoRevestimento;

  // Carga acidental [kN/m²]
  const qk = kgf_to_knm2(l.carga);

  // Vão de cálculo
  const vaoCalculo = Number(l.vaoViga) + apoioViga;

  const xduc = fck <= 50 ? 0.45 * d : 0.35 * d;

  const mdDuc =
    alphaC * etaC * fcd * bv * lbda * xduc * (d - (lbda * xduc) / 2);

  const fd: number = 1.4 * (gk + qk);
  const mdCalc = calcularMomentoCalculo("7", fd, vaoCalculo).Mx * bv; // kNcm/vigota
  const md = MdMin >= mdCalc ? MdMin : mdCalc;

  const AsMin = 0.0015 * H * bv; // cm2
  const x =
    md <= mdDuc
      ? (d / lbda) *
      (1 - (1 - (2 * md) / (alphaC * etaC * fcd * bv * d ** 2)) ** 0.5)
      : xduc;
  const As1 = (alphaC * etaC * fcd * bv * lbda * x) / fyd;
  const AsCalc = As1 > AsMin ? As1 : AsMin; // cm2/vigota

  const AsAdd =
    AsCalc > AsVigota ? Math.round((AsCalc - AsVigota) * 100) / 100 : 0;
  const [op1, op2, op3] = [0, 1, 2].map((i) => calcularBarras(AsAdd, i));

  return { AsCalc, AsAdd, configBarras: [op1, op2, op3] };
};

export const dimensionarLajeTrelicada = (
  l: Laje
): { AsCalc: number; AsAdd: number; configBarras: string[] } => {
  // O que eu quero retornar ?

  // A área de aço total necessário [cm²]
  // A área e aço adicional [cm²]
  // As configurações de barras possíveis

  // Premissas
  // 1. A LAJE É UNIDIRECIONAL

  // trelicada | painel_macico_aliviado | painel_macico | protendida
  // const tipoLaje = l.tipo_laje;
  const enchimento = buscarEnchimento(l.ench_id);
  const trelica = buscarTrelica(l.trel_id);

  // Parametros da laje
  const pesoRevestimento = kgf_to_knm2(parametros.carga_revestimento);
  const pesoProprioLaje = CalcularPesoProprioLaje2(l);

  // Parametros diversos
  const agregado = parametros.agregado;
  const psi2 = parametros.psi_2;
  const hf = parametros.hf;
  const fck = parametros.fck;
  const fyk = parametros.fyk;
  const apoioViga = parametros.apoio_viga;
  const fluencia = 2.5;
  const delta = parametros.delta;

  // Geometria (cm)
  const ht = trelica.ht;
  const bv = trelica.bv;
  const bi = trelica.bi;
  const be = enchimento.be;
  const ah = enchimento.ah;
  const hEnchimento = enchimento.he;
  const H = hEnchimento + hf;
  const ie = bv + be;
  const d_ = 5;
  const d = H - d_;
  const bw = bv - 2 * ah;

  // Carga permanente [kN/m²]
  const gk = pesoProprioLaje + pesoRevestimento;

  // Carga acidental [kN/m²]
  const qk = kgf_to_knm2(l.carga);

  // Vão de cálculo
  const vaoCalculo = Number(l.vaoViga) + apoioViga;

  // Coeficientes de cálculo
  let lbda: number, alphaC: number, etaC: number;
  if (fck <= 50) {
    lbda = 0.8;
    alphaC = 0.85;
  } else {
    lbda = 0.8 - (fck - 50) / 400;
    alphaC = 0.85 * (1 - (fck - 50) / 200);
  }
  etaC = fck <= 40 ? 1 : Math.pow(40 / fck, 1 / 3);

  // Propriedades
  const mECS = calcularECS(fck, agregado); // MPa
  const ycg = calcularCentroGeometricoT(enchimento, trelica, hf); // cm
  const Ixcg = calcularMomentoInerciaT2(enchimento, trelica, hf, ycg); // cm4
  const he = calcularAlturaEquivalentePorMomentoInercia(Ixcg, ie); // cm
  const De = calcularRigidezEquivalente(mECS * 1000, he / 100, 0.2); // kNm
  const fdServico = gk + psi2 * qk; // kN/m2
  const w0 = calcularFlechaImediata("7", fdServico, vaoCalculo, De) * 1000; // mm
  const w00 = w0 * (1 + fluencia); // mm
  const wadm = (vaoCalculo * 1000) / 250; // mm
  const ELSok = w00 <= wadm;
  const fctk_sup = calcularFctkSup(fck) / 10; //kN/cm²
  const Wo = Ixcg / (ht + hf - ycg); // cm3
  const MdMin = 0.8 * Wo * fctk_sup; // kNcm
  const AsMin = 0.0015 * calcularAreaT(enchimento, trelica, hf); // cm2
  const fcd = fck / 10 / 1.4; // kN/cm2
  const fyd = fyk / 1.15; // kN/cm2
  const xDuc =
    fck <= 50 ? ((delta - 0.4375) * d) / 1.25 : ((delta - 0.5625) * d) / 1.25;
  const fd: number = 1.4 * (gk + qk);
  const mdCalc = calcularMomentoCalculo("7", fd, vaoCalculo).Mx * ie; // kNcm/vigota
  const md = MdMin >= mdCalc ? MdMin : mdCalc;
  const MdDuc =
    alphaC * etaC * fcd * lbda * xDuc * bw * (d - (lbda * xDuc) / 2) +
    alphaC * etaC * fcd * hf * (ie - bw) * (d - hf / 2);

  // Comparação das solicitações - Tipo de armadura
  let tipoArmadura = "";
  if (MdMin >= md) {
    tipoArmadura = "Armadura Mínima";
  } else if (md > MdMin && md <= MdDuc) {
    tipoArmadura = "Armadura Simples";
  } else {
    tipoArmadura = "Armadura Dupla";
    return { AsCalc: 0, AsAdd: 0, configBarras: [""] };
  }

  const x = calcularLinhaNeutra(alphaC, etaC, fcd, ie, lbda, d, md, H);
  const hipotese = lbda * x < hf;
  const As1 = calcularAs(alphaC, etaC, fcd, ie, lbda, x, fyd);
  let AsCalc = As1 > AsMin ? As1 : AsMin; // cm2/vigota

  if (!hipotese) {
    const z = alphaC * etaC * fcd * hf * d;
    const s = alphaC * etaC * fcd * hf ** 2 * 0.5;
    const t = alphaC * etaC * fcd * lbda * bw * d;
    const u = alphaC * etaC * fcd * lbda ** 2 * bw * 0.5;
    const aux = Math.pow(t, 2) - 4 * u * (md - (z - s) * (ie - bw));
    const x1 = (t + Math.sqrt(aux)) / (2 * u);
    const x2 = (t - Math.sqrt(aux)) / (2 * u);
    const x = x1 >= H ? x2 : x1;

    const p1 = alphaC * etaC * fcd * lbda * bw * x;
    const p2 = alphaC * etaC * fcd * hf * (ie - bw);
    const AsAux = (p1 + p2) / fyd;
    AsCalc = AsAux < AsMin ? AsMin : AsAux; // cm2/vigota
  }

  // Aço adicional calculado
  const AsVigota = 2 * Math.PI * Math.pow(bi / 20, 2);
  const AsAdd =
    AsCalc > AsVigota ? Math.round((AsCalc - AsVigota) * 100) / 100 : 0;
  const [op1, op2, op3] = [0, 1, 2].map((i) => calcularBarras(AsAdd, i));

  return { AsCalc, AsAdd, configBarras: [op1, op2, op3] };
};

export const calcularCustoAco = (optBarras: string): number => {
  if (!optBarras) return 0;
  const regex = /(\d+)\s*[θ@]\s*([\d.]+)/g;
  const matches = Array.from(optBarras.matchAll(regex));

  const custoTotal = matches.reduce((total, match) => {
    const quantidade = parseInt(match[1], 10);
    const tipoBarra = match[2].includes(".")
      ? `ca_60_${match[2]}`
      : `ca_60_${match[2]}.0`;

    const preco = (precos as Record<string, number>)[tipoBarra] || 0;
    return total + quantidade * preco;
  }, 0);

  return custoTotal;
};

export const calcularIntereixoLaje = (l: Laje): number => {
  return 0;
};
