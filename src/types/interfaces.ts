export interface Laje {
  nome_laje: string;
  id: number;
  vaoViga: number;
  vaoOposto: number;
  grupo: string;
  tipo?: string;
  carga: number;
  ench_id: number;
  ench_modelo: string;
  trel_id: number;
  trel_modelo: string;
  altura_laje: number;
  tipo_laje: string;
  area_aco_adicional_calculado: number;
  area_aco_adicional_tabela: number;
  relacao_tabela_calculado:number;
  opt_barras1: string;
  opt_barras2: string;
  opt_barras3: string;
  opt_barras1_tabela: string;
  custo_aco_adicional: number;
  condicao_apoio: string;
  tipo_vigota: string;
}

export interface Enchimento {
  id: number;
  ench_modelo: string;
  ench_tipo: string;
  he: number;
  be: number;
  ce: number;
  av: number;
  ah: number;
  peso_proprio: number;
  custo_unitario: number;
  custo_unitario_m3: number;
}

export interface Vigota_Painel {
  id: number;
  trel_modelo: string;
  ht: number;
  bv: number;
  hv: number;
  bs: number;
  bd: number;
  bi: number;
  trel_peso_linear: number;
  trel_custo_linear: number;
}

export interface Usuario {
  nome_usuario: string;
  cidade_usuario: string;
  telefone_usuario: string;
}

export interface DadosProtendida {
  altura_cm: number;
  enchimento: string;
  ref_enchimento: string;
  capa_cm: number;
  tipo_vigota: string;
  intereixo_cm: number;
  concreto_l_m2: number;
  peso_proprio_kg: number;
  carga_kgf_m2: number;
  condicao_apoio: string;
  tipo_2010?: number | null;
  tipo_3010?: number | null;
  tipo_3110?: number | null;
  tipo_4110?: number | null;
  tipo_4111?: number | null;
  tipo_4111E?: number | null;
}

export interface TipoTrelicada {
  id: number;
  altura_cm: number;
  enchimento: "ceramico" | "EPS";
  ref_enchimento: string;
  capa_cm: number;
  modelo_trelica: string;
  d_linhas_escora_m: number;
  concreto_l_m2: number;
  peso_proprio_kgf_m2: number;
  tabela: string;
  vao_viga_m: number;
  carga_kgf_m2: number;
  barras_adicionais: string | null;
  area_aco_cm2: number;
  q1: number | null;
  b1: number | null;
  q2: number | null;
  b2: number | null;
  q3: number | null;
  b3: number | null;
  tipo_aco: "ca60" | "ca50";
  tipo_laje: "trelicada" | "painel_macico_aliviado";
}

export interface TipoCarga {
  [grupo: string]: number;
}
