import painel_aliviado from "@/assets/imgs/painel_aliviado_icon.svg";
import painel_macico from "@/assets/imgs/painel_macico_icon.svg";
import trelicada_isopor from "@/assets/imgs/trelicada_isopor_icon.svg";
import protendida from "@/assets/imgs/protendida_icon.svg";
import { FaRegTimesCircle } from "react-icons/fa";
import styles from "@/styles/formulariosLaje.module.css";
import { useState } from "react";
import CardButton from "@/components/formularioLaje/cardButton"
import { Laje } from "@/types/interfaces"

interface props {
  showMe: boolean;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  curstep: number;
  onClose: () => void;
  handleChange: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => void;
  tipo_laje: string;
  isEdit?: boolean;
  nomeLaje: string;
}

export default function EscolherLaje(
  {
    showMe,
    handleBack,
    handleNext,
    handleSubmit,
    curstep,
    onClose,
    handleChange,
    tipo_laje,
    isEdit = false,
    nomeLaje
  }: props
) {

  const dadosCards = [
    {
      title: "Treliçada Isopor",
      imageSource: trelicada_isopor,
      value_id: "trelicada",
      card_description: "Leveza e Praticidade, geralmente a mais barata",
      selected: tipo_laje === "trelicada"
    },
    {
      title: "Painel Maciço",
      imageSource: painel_macico,
      value_id: "painel_macico",
      card_description: "Resistência e Lindo Acabamento",
      selected: tipo_laje === "painel_macico"
    },
    {
      title: "Painel Aliviado",
      imageSource: painel_aliviado,
      value_id: "painel_macico_aliviado",
      card_description: "Resistência, redução no concreto e acabamento",
      selected: tipo_laje === "painel_macico_aliviado"
    },
    {
      title: "Protendida",
      imageSource: protendida,
      value_id: "protendida",
      card_description: "Alcança grandes vãos e gera economia nas escoras",
      selected: tipo_laje === "protendida"
    },
  ];

  const clickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    handleChange(e);
    handleNext();
  }

  const handleExit = () => { onClose() };

  if (!showMe) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.mainContainer} style={{ maxWidth: "600px" }}>
        <div className={styles.headContainer}>
          <h1>{isEdit ? `Edição da laje (${nomeLaje})` : "Escolha a Laje"}</h1>
          <FaRegTimesCircle onClick={handleExit} />
        </div>

        <CardButton
          dados={dadosCards}
          clickEvent={clickEvent}
          title="tipo_laje"
          styles={styles}
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
