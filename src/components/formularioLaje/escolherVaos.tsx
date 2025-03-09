import { FaRegTimesCircle } from "react-icons/fa";
import styles from "./styles/escolherVaos.module.css";
import Image from "next/image";
import vaosLaje from "@/assets/imgs/vaos_laje.webp";
import { useState, useEffect, useRef } from "react";
import InputErro from "../avisos/inputErro";
import { Laje } from "@/types/interfaces";
import Dica from "@/components/avisos/dicaImportante"

interface props {
    showMe: boolean;
    handleBack: () => void;
    handleSubmit: () => void;
    curstep: number;
    onClose: () => void;
    handleChange: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => void;
    laje: Laje;
    novaLaje: () => void;
    isEdit: boolean;
}

export default function EscolherVaos(
    {
        showMe,
        handleBack,
        handleSubmit,
        curstep,
        onClose,
        handleChange,
        laje,
        novaLaje,
        isEdit
    }: props
) {
    const [thisLaje, setThisLaje] = useState<Laje>(laje)
    const [curVaoViga, setVaoViga] = useState("")
    const [curVaoOposto, setVaoOposto] = useState("")
    const [curNomeLaje, setNomeLaje] = useState(thisLaje.nome_laje)
    const [ShowInputErroModal, setShowInputErroModal] = useState(false);
    const [showMsg, setShowMsg] = useState(false)
    const [showDica, setShowDica] = useState(true)
    const [condicao, setCondicao] = useState(laje.condicao_apoio);
    const [showConfigProtendida, setShowConfigProtendida] = useState(laje.tipo_laje === 'protendida')

    const closeDica = () => { setShowDica(false) }
    const handleCloseModal = (): void => { setShowInputErroModal(false) }
    const handleShowModal = (): void => { setShowInputErroModal(true) }

    const handleShowMsg = (): void => {
        // Mostra a mensagem
        setShowMsg(true)

        // Esconde após 2s
        setTimeout(() => {
            setShowMsg(false)
        }, 2000)
    }

    useEffect(() => {
        setVaoViga(laje.vaoViga ? String(laje.vaoViga).replace(".", ",") : "")
        setVaoOposto(laje.vaoOposto ? String(laje.vaoOposto).replace(".", ",") : "")
    })

    useEffect(() => {
        setThisLaje(laje)
        setNomeLaje(laje.nome_laje)
        setShowConfigProtendida(laje.tipo_laje === 'protendida')
    }, [laje])


    const handleExit = () => {
        onClose();
    };

    const validarForm = () => {
        if (
            parseFloat(curVaoViga.replace(",", ".")) <= 0.0 ||
            parseFloat(curVaoOposto.replace(",", ".")) <= 0.0 ||
            parseFloat(curVaoViga.replace(",", ".")) > 12.0 ||
            parseFloat(curVaoOposto.replace(",", ".")) > 12.0 ||
            curVaoViga === "" ||
            curVaoOposto === ""
        ) {
            handleShowModal()
        } else {
            handleShowMsg()
            setVaoViga("")
            setVaoOposto("")
            handleSubmit()
            if (!isEdit) {
                novaLaje()
            } else {
                handleExit();
            }
        }
    }

    const handleChangeHere = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "vaoViga" || name === "vaoOposto") {
            // Remove qualquer caractere que não seja número
            let vl = value.replace(/\D/g, "");

            // Converte para número e divide por 100
            let numericValue = parseFloat(vl) / 100;

            // Formata para 2 casas decimais e substitui "." por ","
            let formattedValue = numericValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            // Atualiza o estado correspondente
            if (name === "vaoViga") {
                setVaoViga(formattedValue);
            } else if (name === "vaoOposto") {
                setVaoOposto(formattedValue);
            }
        } else if (name === "nome_laje") {
            setNomeLaje(value);
        }
        handleChange(e);
    };

    const CamposProtendida = (show: boolean) => {
        if (!show) return null;
        return (
            <>
                {/* CONDIÇÃO DE APOIO */}
                <fieldset className={styles.fieldset}>
                    <div className={styles.legenda}>
                        <legend>Apoio:</legend>
                    </div>
                    <div className={styles.inputs}>
                        <label>
                            <input
                                type="radio"
                                name="condicao_apoio"
                                title="condicao_apoio"
                                value="AA"
                                checked={condicao === "AA" || condicao === ""}
                                onChange={(e) => {
                                    setCondicao("AA")
                                    handleChange(e)
                                }}
                            />
                            AA
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="condicao_apoio"
                                title="condicao_apoio"
                                value="AE"
                                checked={condicao === "AE"}
                                onChange={(e) => {
                                    setCondicao("AE")
                                    handleChange(e)
                                }}
                            />
                            AE
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="condicao_apoio"
                                title="condicao_apoio"
                                value="EE"
                                checked={condicao === "EE"}
                                onChange={(e) => {
                                    setCondicao("EE")
                                    handleChange(e)
                                }}
                            />
                            EE
                        </label>
                    </div>
                </fieldset>
                <hr className={styles.separador}></hr>
            </>
        )
    }

    if (!showMe) return null;
    return (
        <div className={styles.overlay}>
            <Dica
                showMe={showDica}
                onClose={closeDica}
                tipoLaje={laje.tipo_laje}
            />
            <div className={styles.mainContainer}>
                <div className={styles.headContainer}>
                    <h1>
                        {isEdit ? `Vãos da Laje (${laje.nome_laje})` : "Vãos da Laje"}
                    </h1>
                    <FaRegTimesCircle onClick={handleExit} className={styles.iconClose} />
                </div>
                <div className={styles.formContainer}>
                    <div>
                        <label htmlFor="nome_laje">Nome do vão/Cômodo</label>
                        <input
                            type="text"
                            name="nome_laje"
                            className={styles.textBox}
                            title="nome_laje"
                            value={curNomeLaje}
                            onChange={handleChangeHere}
                            id="nome_laje"
                            maxLength={15}
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image src={vaosLaje} alt="vãos da laje" width={1920} height={1080} />
                    </div>
                    {/* Mensagem de confirmação de input */}
                    <p
                        style={{
                            display: !showMsg ? "none" : "block",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            fontWeight: "bold",
                            fontSize: "16px",
                            textAlign: "center",
                            margin: "0px",
                            animation: "fadeInOut 4s ease-in-out",
                        }}
                    >
                        Laje {isEdit ? "editada" : "inserida"} com sucesso!
                    </p>
                    {CamposProtendida(showConfigProtendida)}
                    <div className={styles.inputsContainer}>
                        <div>
                            <label htmlFor="vaoViga">Vão da viga</label>
                            <input
                                type="text"
                                name="vaoViga"
                                className={styles.textBox}
                                title="vaoViga"
                                onChange={handleChangeHere}
                                value={curVaoViga}
                                id="vaoViga"
                                placeholder="0,00"
                                inputMode="numeric"
                            />
                        </div>
                        <div>
                            <label htmlFor="vaoOposto">Vão oposto</label>
                            <input
                                type="text"
                                name="vaoOposto"
                                className={styles.textBox}
                                title="vaoOposto"
                                onChange={handleChangeHere}
                                value={curVaoOposto}
                                id="vaoOposto"
                                placeholder="0,00"
                                inputMode="numeric"
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className={styles.navButtonsContainer}>
                        <button
                            onClick={handleBack}
                            disabled={curstep === 1}
                            className={styles.buttonBack}
                        >
                            Voltar
                        </button>
                        {curstep === 3 &&
                            <button
                                onClick={() => {
                                    validarForm()
                                }}
                            >
                                Inserir na lista
                            </button>
                        }
                        <InputErro
                            showMe={ShowInputErroModal}
                            msg="O VÃO DA VIGA e o VÃO OPOSTO devem ser maiores que 0 e menores que 12m."
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
