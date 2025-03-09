import React, { useState, useEffect } from "react";
import { Laje, TipoTrelicada } from "../types/interfaces";
import {
    calcularCargaPorGrupo,
    definirVigota_Enchimento,
    definirVigotaProtendida,
    calcularLajeTrelicadaMetodoTabela,
    dimensionarLajeTrelicada,
    dimensionarLajeMacica
} from "@/utils/functions";
import EscolherLaje from "./formularioLaje/escolherLaje";
import EscolherCarga from "./formularioLaje/escolherCarga";
import EscolherVaos from "./formularioLaje/escolherVaos";

interface props {
    onClose: () => void;
    onSave: (laje: Laje) => void;
    laje: Laje;
    lajeInicial: Laje;
    showModal: boolean;
    setShowModal: (state: boolean) => void;
    idLaje: number;
    novaLaje: (l: Laje) => void;
    isEdit: boolean;
}

export default function NovaLajeModal({ showModal, setShowModal, onClose, onSave, idLaje, laje, novaLaje, isEdit }: props) {
    const [step, setStep] = useState(1);
    const [lajeData, setLajeData] = useState<Laje>(laje);

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handleBack = () => setStep((prevStep) => prevStep - 1);

    const onExit = () => {
        setStep(1);
        setShowModal(false);
    };

    useEffect(() => { setLajeData(laje); }, [idLaje, laje]);

    const handleChange = (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
        const element = e.currentTarget;
        const name = element.title;

        // Verifica se o elemento é um input e usa a propriedade `value` caso seja
        const value = (element instanceof HTMLInputElement) ? element.value : element.id;

        if (name === "grupo") {
            setLajeData({
                ...lajeData,
                carga: calcularCargaPorGrupo(value),
                [name]: value,
            });
        } else if (name === "vaoViga" || name === "vaoOposto") {
            // Remove qualquer caractere que não seja número
            let vl = value.replace(/\D/g, "");

            // Converte para número e divide por 100
            let numericValue = parseFloat(vl) / 100;

            // Formata para 2 casas decimais e substitui "." por ","
            let formattedValue = numericValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            setLajeData({ ...lajeData, [name]: formattedValue.replace(",", "."), });
        }
        else {
            setLajeData({ ...lajeData, [name]: value, });
        }
    };

    const handleSubmit = () => {
        let lajeInfo;
        let custo_aco_adicional = 0, area_aco_adicional_calculado = 0;
        let opt_barras1: string = "", opt_barras2: string = "", opt_barras3: string = "";

        if (lajeData.tipo_laje !== "protendida") {
            lajeInfo = definirVigota_Enchimento(lajeData.vaoViga, lajeData.carga, lajeData.tipo_laje);
        } else {
            lajeInfo = definirVigotaProtendida(
                lajeData.vaoViga,
                lajeData.carga,
                lajeData.condicao_apoio
            );
        }

        const [trel_id, trel_modelo, ench_id, ench_modelo, altura_laje, tipo_vigota] = lajeInfo;

        let l_calculada: Laje = {
            ...lajeData,
            id: idLaje,
            ench_id,
            ench_modelo,
            trel_modelo,
            altura_laje,
            trel_id,
            ...(tipo_vigota && { tipo_vigota })
        }

        // Campos de calculo manual (tabela)
        let area_aco_adicional_tabela = 0;
        let opt_barras1_tabela = "";

        if (l_calculada.tipo_laje !== "protendida" && l_calculada.tipo_laje !== "painel_macico") {
            let lajeCalculada: TipoTrelicada
            lajeCalculada = calcularLajeTrelicadaMetodoTabela(l_calculada.vaoViga, l_calculada.carga, l_calculada.tipo_laje)

            area_aco_adicional_tabela = lajeCalculada.area_aco_cm2
            opt_barras1_tabela = lajeCalculada.barras_adicionais ?? ""
        }

        const tipo = l_calculada.tipo_laje

        if (tipo !== "protendida") {
            const { AsAdd, configBarras } =
                (l_calculada.tipo_laje !== "painel_macico") ?
                    dimensionarLajeTrelicada(l_calculada) :
                    dimensionarLajeMacica(l_calculada)

            area_aco_adicional_calculado = AsAdd
            opt_barras1 = configBarras[0]
            opt_barras2 = configBarras[1]
            opt_barras3 = configBarras[2]
        }


        const relacao_tabela_calculado: number = area_aco_adicional_calculado > 0 ? area_aco_adicional_tabela / area_aco_adicional_calculado : 0;

        console.log(altura_laje)
        onSave({
            ...lajeData,
            id: idLaje,
            ench_id,
            ench_modelo,
            trel_modelo,
            altura_laje,
            trel_id,
            ...(tipo_vigota && { tipo_vigota }),
            custo_aco_adicional,
            area_aco_adicional_calculado,
            area_aco_adicional_tabela,
            opt_barras1,
            opt_barras2,
            opt_barras3,
            opt_barras1_tabela,
            relacao_tabela_calculado
        });

        setStep(3);
    };


    const setLajeCarga = (grupo: string, carga: number) => {
        setLajeData({
            ...lajeData,
            carga: carga,
            grupo: grupo
        })
    }

    if (!showModal) return null;

    return (
        <div>
            {/* Step 1: Tipo de Laje */}
            <EscolherLaje
                showMe={step === 1}
                handleBack={handleBack}
                handleNext={handleNext}
                handleSubmit={handleSubmit}
                curstep={step}
                onClose={onExit}
                handleChange={handleChange}
                tipo_laje={lajeData.tipo_laje}
                isEdit={isEdit}
                nomeLaje={lajeData.nome_laje}
            />

            {/* Step 2: Uso da Laje */}
            <EscolherCarga
                showMe={step === 2}
                handleBack={handleBack}
                handleNext={handleNext}
                handleSubmit={handleSubmit}
                curstep={step}
                onClose={onExit}
                handleChange={handleChange}
                carga_grupo={lajeData.grupo}
                isEdit={isEdit}
                nomeLaje={laje.nome_laje}
                setLajeCarga={setLajeCarga}
            />

            {/* Step 3: Dados da Laje */}
            <EscolherVaos
                showMe={step === 3}
                handleBack={handleBack}
                handleSubmit={handleSubmit}
                curstep={step}
                onClose={onExit}
                handleChange={handleChange}
                laje={lajeData}
                novaLaje={() => {
                    const l: Laje = { ...lajeData, vaoViga: 0, vaoOposto: 0 }
                    novaLaje(l)
                }}
                isEdit={isEdit}
            />
        </div>
    );
};

