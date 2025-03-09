import Image from 'next/image'
import styles from '@/styles/detailedReport.module.css'
import { Laje } from '@/types/interfaces'
import Footer from '@/components/footer'
import imgHome from "@/assets/imgs/report_man.webp";
import trelicada_img from "@/assets/imgs/trelicada_isopor_icon.svg"
import protendida_img from "@/assets/imgs/protendida_icon.svg"
import painel_macico_img from "@/assets/imgs/painel_macico_icon.svg"
import painel_macico_aliviado_img from "@/assets/imgs/painel_aliviado_icon.svg"
import caminhao_img from "@/assets/imgs/cement-truck-svgrepo-com.svg"
import tela_soldada_img from "@/assets/imgs/frame-svgrepo-com.svg"
import escoras_metalicas_img from "@/assets/imgs/laravel-svgrepo-com.svg"
import bombaEstacionaria from "@/assets/imgs/truck-crane-svgrepo-com.svg"
import {
    calcularVolumeConcretoM3,
    calcularQtdeEscoras,
    calcularCustoAcoAdicionalLajeTrelicada,
    tipoLajePorTipo,
    handleEnviarDados,
    valorToLocalString,
    calcularAreaTotalLajes,
    calcularValorTotalTrelicas,
    calcularValorTotalEnchimento,
    calcularCustoAco
} from "../utils/functions";
import precos from "../data/precos.json";
import { useState, useEffect } from 'react'
import logo from "../../public/iglume-logo.svg";
import Link from 'next/link'
import FeedbackUser from '@/components/formulariosUsuario/feedbackUser';
import FrameFeedback from '@/components/formulariosUsuario/frameFeedback';
import { FaFileDownload } from "react-icons/fa";
import { generatePDF } from "@/utils/functions";

interface props { setShowNavbar: React.Dispatch<React.SetStateAction<boolean>>; }


export default function DetailedReport({ setShowNavbar }: props) {
    const bdi = 0.12;
    const [listaLajes, setListaLajes] = useState<Laje[]>([]);
    const [showTable, setShowTable] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)

    const closeFeeback = () => { setShowFeedback(false) }
    const openFeedback = () => { setShowFeedback(true) }

    const imagensLajes: Record<string, any> = {
        trelicada: trelicada_img,
        painel_macico: painel_macico_img,
        painel_macico_aliviado: painel_macico_aliviado_img,
        protendida: protendida_img
    };

    useEffect(() => {
        const lLajes: Laje[] = JSON.parse(sessionStorage.getItem('listaLajes') || '[]')
        setListaLajes(lLajes)
    }, [])

    // Área
    const areaTotal = valorToLocalString(calcularAreaTotalLajes(listaLajes));

    // Valor treliças
    const valorTrelicas = calcularValorTotalTrelicas(listaLajes) * (1 + bdi);

    // Enchimentos
    const valorEnchimento = calcularValorTotalEnchimento(listaLajes) * (1 + bdi);

    // Concreto usinado
    const qtdConcreto = listaLajes.reduce((acc, laje) => acc + calcularVolumeConcretoM3(laje), 0)
    const valorConcreto = (Number(qtdConcreto) * Number(precos.concreto_usinado_m3)) * (1 + bdi);

    // Escoramento
    const qtdEscoramento = listaLajes.reduce((acc, laje) => acc + calcularQtdeEscoras(laje), 0)
    const valorEscoramento = (Number(qtdEscoramento) * Number(precos.escoramento)) * (1 + bdi)

    // Aço adicional
    const valorAcoAdicional = (1 + bdi) * listaLajes.reduce(
        (acc, laje) => {
            const optBarras = laje.area_aco_adicional_calculado >= laje.area_aco_adicional_tabela ? laje.opt_barras1_tabela : laje.opt_barras1
            return acc + calcularCustoAco(optBarras)
        },
        0
    );

    // Tela soldada
    const areaTelaAcoDist = 13.45
    const custoUnitTela = Number(precos.telaAcoDistribuicao)
    let qtdeTotalTelas: Number = 0
    const valorTotalTelaAcoDist = (1 + bdi) * listaLajes.reduce(
        (custoTotal, laje) => {
            const areaLaje = laje.vaoViga * laje.vaoOposto
            const qtdeTelas = areaLaje / areaTelaAcoDist
            qtdeTotalTelas = Number(qtdeTelas) + Number(qtdeTotalTelas)
            const custoAcoDist = Number(qtdeTelas) * custoUnitTela
            return custoTotal + custoAcoDist
        }
        , 0)

    const custoBombaEstacionaria = 1100 * (1 + bdi)

    // Total geral
    // Incluso aço adicional nao informado
    const totalGeral = (
        valorConcreto +
        valorEscoramento +
        valorTotalTelaAcoDist +
        valorTrelicas +
        custoBombaEstacionaria +
        valorEnchimento +
        valorAcoAdicional
    )

    const actionButton = () => {
        const handleGeneratePDF = async () => {
            const element = document.getElementById("relatorio");
            setShowNavbar(false); // Oculta o Navbar
            setShowTable(true); // Mostra a tabela

            // Aguarda 500ms antes de gerar o PDF
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (element) {
                // Gera o PDF
                await generatePDF(element, "relatorio_iglume_lajes.pdf");
            } else {
                alert("Elemento do relatório não encontrado.");
            }

            // Restaura os estados após o download
            setTimeout(() => {
                setShowNavbar(true);
                setShowTable(false);
            }, 1000); // Aguarda 1 segundo antes de restaurar
        };

        return (
            <button
                className={styles.actionButton}
                onClick={() => {
                    handleGeneratePDF()
                    handleEnviarDados(listaLajes)
                }}
                style={{ display: showTable ? "none" : "" }}
            >
                <span className={styles.buttonText}>Gerar</span>
                <FaFileDownload className={styles.downloadIcon} />
            </button>
        );
    };

    // Tabela
    const tbLajes = () => {
        return (
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>VÃOS</th>
                            <th>TIPO</th>
                            <th>TRELIÇA/FIOS</th>
                            <th>SOBRECARGA</th>
                            <th>ENCHIMENTO</th>
                            <th>ALTURA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaLajes.map((l) => (
                            <tr key={l.id}>
                                <td >{l.nome_laje}</td>
                                <td>
                                    {Number(l.vaoViga).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    x
                                    {Number(l.vaoOposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td>{tipoLajePorTipo(l.tipo_laje)}</td>
                                <td>{l.trel_modelo}</td>
                                <td>{l.carga} kgf</td>
                                <td>{l.ench_modelo}</td>
                                <td>{l.altura_laje} cm</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    //Fim tabela

    const tipoLaje = (lajes: Laje[]): string => {
        const nomeAmigavel: Record<string, string> = {
            trelicada: "Treliçada",
            painel_macico: "Painel Maciço",
            painel_macico_aliviado: "Painel Maciço Aliviado",
            protendida: "Protendida"
        };

        const tiposUnicos = Array.from(new Set(lajes.map((laje) => laje.tipo_laje)));

        const nomesFormatados = tiposUnicos.map(tipo => nomeAmigavel[tipo] || tipo);

        return nomesFormatados.length === 1
            ? `Laje: ${nomesFormatados[0]}`
            : `Lajes: ${nomesFormatados.join(" | ")}`;
    };

    const primeiroTipo = listaLajes.length > 0 ? listaLajes[0].tipo_laje : "";
    const imagemAtual = imagensLajes[primeiroTipo] || trelicada_img; // Padrão: Treliçada

    return (
        <div className={styles.mainContainer} id="relatorio">
            <div className={styles.containerButton}>
                {actionButton()}
            </div>
            {showTable && <div>
                <Image
                    src={logo}
                    alt='imagem-relatorio'
                    width={200}
                    height={200}
                />
            </div>}
            {!showTable && <div className={styles.headContainer}>
                <div>
                    <h1>Estimativas de custo</h1>
                    <h2>Lajes pré-moldadas, concreto usinado, escoramentos e malha de aço</h2>
                </div>
                <Image
                    src={imgHome}
                    alt='imagem-relatorio'
                    width={1920}
                    height={1080}
                />
            </div>}
            <div className={styles.reportDataContainer}>
                <div className={styles.cardContainer}>
                    {/* Campo Laje */}
                    {showTable && <div className={styles.tituloLajes}>
                        <h1>Laje pré-moldada</h1>
                        <hr />
                    </div>}
                    <div className={styles.cardInfo}>
                        <div className={styles.cardDescription}>
                            <Image src={imagemAtual} alt='card_image' height={200} width={200} priority={false} />
                            <div>
                                <p>{tipoLaje(listaLajes)}</p>
                                <p>Área Total: {areaTotal}m²</p>
                            </div>
                        </div>
                        <p>R$ {valorToLocalString(valorTrelicas + valorEnchimento + valorAcoAdicional)}</p>
                    </div>
                    {showTable && tbLajes()}

                    {/* Campo Complementos */}
                    {showTable && <div className={styles.tituloLajes}>
                        <h1>Complementos da Laje</h1>
                        <hr />
                    </div>}

                    <div className={styles.cardInfo}>
                        <div className={styles.cardDescription}>
                            <Image src={caminhao_img} alt='card_image' height={200} width={200} />
                            <div>
                                <p>Concreto Usinado 25MPa</p>
                                <p>Volume {valorToLocalString(qtdConcreto)}m³</p>
                            </div>
                        </div>
                        <p>R$ {valorToLocalString(valorConcreto)}</p>
                    </div>
                    <div className={styles.cardInfo}>
                        <div className={styles.cardDescription}>
                            <Image src={bombaEstacionaria} alt='card_image' height={200} width={200} />
                            <div>
                                <p>Bomba estacionária</p>
                            </div>
                        </div>
                        <p>R$ {valorToLocalString(custoBombaEstacionaria)}</p>
                    </div>
                    <div className={styles.cardInfo}>
                        <div className={styles.cardDescription}>
                            <Image src={tela_soldada_img} alt='card_image' height={200} width={200} />
                            <div>
                                <p>EQ092 2X3-15X15-4.2mm</p>
                                <p>Quantidade: {Math.ceil(Number(qtdeTotalTelas))} </p>
                            </div>
                        </div>
                        <p>R$ {valorToLocalString(valorTotalTelaAcoDist)}</p>
                    </div>
                    <div className={styles.cardInfo}>
                        <div className={styles.cardDescription}>
                            <Image src={escoras_metalicas_img} alt='card_image' height={200} width={200} />
                            <div>
                                <p>Escoras metálicas </p>
                                <p>Quantidade: {qtdEscoramento} Peças </p>
                            </div>
                        </div>
                        <p>R$ {valorToLocalString(valorEscoramento)}</p>
                    </div>
                    {showTable && <div className={styles.cardValorTotal}>
                        <p>SubTotal</p>
                        <p>{valorToLocalString(totalGeral - valorTrelicas)}</p>
                    </div>}
                    <div className={styles.cardValorTotal}>
                        <p>Total</p>
                        <p>{valorToLocalString(totalGeral)}</p>
                    </div>
                    {/* <div>
                        <p className={styles.aviso}>*Este orçamento foi baseado em valores da região do Estado de Minas Gerais, se você é de outra região aconselhamos que consulte especialistas locais.</p>
                    </div> */}
                    {showTable && <div>
                        <p><strong>Atenção!</strong> Esta ferramenta não substitui o <strong>Engenheiro e as empresas da área</strong>. Nosso intuito é apresentar uma <strong>estimativa inicial de custos e quantitativos</strong>, conforme o seu projeto.</p>
                    </div>}
                </div>
            </div>

            {!showTable && <div className={styles.sendProjectContainer}>
                <div className={styles.sendProjectImageContainer}>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: "bold" }}>Envie o seu projeto</h2>
                    <div className={styles.imgSection}>
                        <Image
                            src={imgHome}
                            alt='envie-seu-projeto-imagem'
                            height={1920}
                            width={1920}
                        />
                        <p style={{ fontSize: "1.3rem" }}>A nossa equipe consegue economizar para você.</p>
                    </div>
                </div>
                <div className={styles.interactButtons}>
                    <div>
                        <Link
                            href="https://wa.me/553199754441?text=Olá IgluME! Eu gostaria de compartilhar o meu projeto para uma análise mais detalhada."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button>Enviar projeto</button>
                        </Link>
                    </div>
                </div>
            </div>}

            {!showTable && <FrameFeedback
                openFeedback={openFeedback}
            />}

            <div>
                <p className={styles.aviso}>*Este orçamento foi baseado em valores da região do Estado de Minas Gerais, se você é de outra região aconselhamos que consulte especialistas locais.</p>
            </div>

            {!showTable && <Footer />}

            <FeedbackUser
                showMe={showFeedback}
                closeMe={closeFeeback}
            />

            {/* {!showTable && <Wpp />} */}
        </div>
    )
}
