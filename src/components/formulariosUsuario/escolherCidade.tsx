import Image from 'next/image'
import { FaRegTimesCircle } from "react-icons/fa";
import styles from "./styles/EscolherCidade.module.css"
import imgTrel from "@/assets/imgs/trel_elevator.webp"
import dbCidades from "@/data/cidades.json";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Laje } from "@/types/interfaces"
import InputErro from '../avisos/inputErro';

interface props {
    showMe: boolean;
    closeMe: () => void;
    lajes: Laje[];
}

export default function EscolherCidade({ lajes, showMe, closeMe }: props) {
    const handleExit = () => { closeMe() }
    const tbCidades = dbCidades.tbCidades
    const [cidadesFiltradas, setCidadesFiltradas] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState("")
    const [selectedCidade, setSelectedCidade] = useState("")
    const [showError, setShowError] = useState(false);
    const [erroMsg, setErroMsg] = useState("")
    const Router = useRouter();

    useEffect(() => {
        const cidadeUf = JSON.parse(sessionStorage.getItem("cidade_uf") || "{}");
        if (cidadeUf.cidade) setSelectedCidade(cidadeUf.cidade);
        if (cidadeUf.uf) {
            setSelectedUF(cidadeUf.uf);
            setCidadesFiltradas(listaCidades(cidadeUf.uf));
        }
    }, []);

    const listaUF = () => {
        // Obtem estados únicos
        const estados = Array.from(new Set(tbCidades.map(cidade => cidade.uf))).sort();

        // Retorna os elementos <option>
        return estados.map(uf => (
            <option key={uf} value={uf}>
                {uf}
            </option>
        ));
    };

    const listaCidades = (uf: string) => {
        // Filtrar cidades pelo UF fornecido
        const cidadesDoEstado = tbCidades
            .filter(cidade => cidade.uf === uf)
            .map(cidade => cidade.cidade)
            .sort();

        // Retornar elementos <option> para cada cidade
        return cidadesDoEstado
    };

    const handleUFChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUF = e.target.value;
        if (selectedUF) {
            setSelectedUF(selectedUF);
            const cidades = listaCidades(selectedUF);
            setCidadesFiltradas(cidades);
        } else {
            setCidadesFiltradas([]);
        }
    };

    const handleCidadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCidade = e.target.value;
        if (selectedCidade) { setSelectedCidade(selectedCidade); }
    }

    const optionListaCidades = () => {
        return (
            cidadesFiltradas.map(cidade => (
                <option key={cidade} value={cidade}>
                    {cidade}
                </option>
            )))
    }

    const validarForm = () => {
        // Verifica se existem lajes cadastradas
        if (lajes.length <= 0) {
            // Mostrar modal de erro
            setErroMsg("Por favor, cadastre lajes para continuar.")
            setShowError(true)
            return
        }
        if (selectedCidade && selectedUF && selectedCidade != "default" && selectedUF != "default" && selectedCidade != "" && selectedUF != "") {
            // Salva a lista em Session Storage
            sessionStorage.setItem('listaLajes', JSON.stringify(lajes));
            sessionStorage.setItem('cidade_uf', JSON.stringify({ cidade: selectedCidade, uf: selectedUF }));
            Router.push('/resumeReport',);
        } else {
            // Mostrar modal de erro
            setErroMsg("Por favor, selecione seu estado e cidade para continuar.")
            setShowError(true)
        }
    }

    if (!showMe) return null

    return (
        < div className={styles.overlay} >
            <div className={styles.mainContainer}>
                <div className={styles.headContainer}>
                    <h1>Informe a cidade da sua obra</h1>
                    <FaRegTimesCircle onClick={handleExit} />
                </div>
                <Image src={imgTrel} height={100} width={100} alt='imagem'></Image>
                <div className={styles.mainInputContainer}>
                    <div className={styles.inputContainer} style={{ maxWidth: "80px" }}>
                        <label htmlFor="select_uf">Estado</label>
                        <select name="select_uf" id="select_uf" onChange={(e) => handleUFChange(e)} value={selectedUF}>
                            <option value="default">UF</option>
                            {listaUF()}
                        </select>
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="select_cidade">Cidade</label>
                        <select name="select_cidade" id="select_cidade" onChange={(e) => handleCidadeChange(e)} value={selectedCidade}>
                            <option value="default">Selecione a cidade</option>
                            {optionListaCidades()}
                        </select>
                    </div>
                </div>
                <div className={styles.navButtonsContainer}>
                    <button onClick={() => validarForm()}>Continuar</button>
                </div>
            </div>
            <InputErro
                showMe={showError}
                msg={erroMsg}
                onClose={() => setShowError(false)}
            />
        </div >
    )
}