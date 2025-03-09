import { FaRegTimesCircle } from "react-icons/fa";
import styles from "@/styles/formulariosLaje.module.css";
import moveis from "@/assets/imgs/moveis.svg";
import telhado from "@/assets/imgs/telhado.svg";
import festas from "@/assets/imgs/festas.svg";
import veiculos_medios from "@/assets/imgs/veiculos_medios.svg";
import caixa_agua from "@/assets/imgs/caixa_agua.svg";
import outras_cargas from "@/assets/imgs/outas_cargas.svg";
import { useState } from "react";
import CardButton from "@/components/formularioLaje/cardButton";
import DimReservatorio from "@/components/reservatorio/dimReservatorio"
import OutrasCargas from "./outrasCargasForm";

interface props {
    showMe: boolean;
    handleBack: () => void;
    handleNext: () => void;
    handleSubmit: () => void;
    curstep: number;
    onClose: () => void;
    handleChange: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => void;
    carga_grupo: string;
    isEdit?: boolean;
    nomeLaje: string;
    setLajeCarga: (grupo: string, carga: number) => void;
}

export default function EscolherCarga(
    {
        showMe,
        handleBack,
        handleNext,
        handleSubmit,
        curstep,
        onClose,
        handleChange,
        carga_grupo,
        isEdit = false,
        nomeLaje,
        setLajeCarga }: props
) {

    const [showDimReservatorio, setShowDimReservatorio] = useState(false)
    const closeDimensionamento = () => { setShowDimReservatorio(false) }

    const [showOutrasCargas, setShowOutrasCargas] = useState(false)
    const closeOutrasCargas = (setNext: boolean) => {
        setShowOutrasCargas(false)
        if (setNext) { handleNext(); }
    }


    const dadosCards = [
        {
            title: "Móveis",
            imageSource: moveis,
            value_id: "moveis",
            card_description: "Móveis, transito de pessoas do imóvel...",
            selected: carga_grupo === "moveis"
        },
        {
            title: "Telhado",
            imageSource: telhado,
            value_id: "telhado",
            card_description: "Colonial, fibrocimento, zinco, amianto...",
            selected: carga_grupo === "telhado"
        },
        {
            title: "Festas",
            imageSource: festas,
            value_id: "festas",
            card_description: "Festas familiares, aniversários, churrascos...",
            selected: carga_grupo === "festas"
        },
        {
            title: "Veículos Médios",
            imageSource: veiculos_medios,
            value_id: "veiculos_medios",
            card_description: "Caminhonetes, Picapes...",
            selected: carga_grupo === "veiculos_medios"
        },
        // {
        //     title: "Caixas D'água",
        //     imageSource: caixa_agua,
        //     value_id: "caixa_agua",
        //     card_description: "Calcular Volume",
        //     selected: carga_grupo === "caixa_agua"
        // },
        {
            title: "Outras Cargas",
            imageSource: outras_cargas,
            value_id: "outras_cargas",
            card_description: "Selecione outra carga",
            selected: carga_grupo === "outras_cargas"
        },
    ];

    const clickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
        const value = e.currentTarget.id
        if (value === "caixa_agua") {
            setShowDimReservatorio(true)
        } else if (value === "outras_cargas") {
            setShowOutrasCargas(true)
        } else {
            handleChange(e)
            handleNext()
        }
    }

    const handleExit = () => { onClose(); };

    if (!showMe) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.mainContainer}>
                <div className={styles.headContainer}>
                    <h1>{isEdit ? `Edição da carga (${nomeLaje})` : "Escolha a Carga"}</h1>
                    <FaRegTimesCircle onClick={handleExit} />
                </div>

                <CardButton
                    dados={dadosCards}
                    clickEvent={clickEvent}
                    title="grupo"
                    styles={styles}
                />

                <DimReservatorio
                    showMe={showDimReservatorio}
                    onClose={closeDimensionamento}
                />

                <OutrasCargas
                    showMe={showOutrasCargas}
                    onClose={closeOutrasCargas}
                    setLajeCarga={setLajeCarga}
                />

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
                            onClick={handleSubmit}
                        >
                            Concluir
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}
