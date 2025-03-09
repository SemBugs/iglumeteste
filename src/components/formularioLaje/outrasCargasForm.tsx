import Image from 'next/image';
import { FaRegTimesCircle } from "react-icons/fa";
import styles from './styles/OutrasCargasForm.module.css';
import outras_cargas from "@/assets/imgs/outas_cargas.svg";
import cargas from "@/data/cargas.json";
import { useState } from 'react';
import { TipoCarga } from '@/types/interfaces';

interface props {
    showMe: boolean;
    onClose: (setNext: boolean) => void;
    setLajeCarga: (grupo: string, carga: number) => void;
}

const outrasCargasList = () => {
    // Função de callback
    const optionItem = (k:string, v:number): JSX.Element => {
        return (
            <option key={k} value={k}>
                {k}: {v}kgf
            </option>
        )
    }
    // Array de arrays
    const Grupos = Object.entries(cargas)

    // Array de JSX.Element[]
    const lista = Grupos.map(([key, value]) => optionItem(key, value))

    // Retorno
    return lista;
};


export default function OutrasCargas({ showMe, onClose, setLajeCarga }: props) {
    const [grupo, setGrupo] = useState('');
    const [carga, setCarga] = useState<number | null>(null);

    // Lógica do handleChange
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const Grupos: TipoCarga = cargas;
        const selectedKey = e.target.value;
        const cargaValue = Grupos[selectedKey];
        if (cargaValue !== undefined) {
            setGrupo(selectedKey);
            setCarga(cargaValue);
        } else {
            setGrupo('');
            setCarga(null);
        }
    };

    const handleContinuar = () => {
        if (grupo && carga !== null) {
            setLajeCarga(grupo, carga); // Envia os dados para o componente pai
            onClose(true);                 // Fecha o modal
        } else {
            alert('Por favor, selecione uma carga válida!');
        }
    };

    if (!showMe) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.mainContainer}>
                <div className={styles.headContainer}>
                    <h1>Outras cargas</h1>
                    <FaRegTimesCircle onClick={() => onClose(false)} />
                </div>
                <Image src={outras_cargas} height={100} width={100} alt="imagem"></Image>
                <div className={styles.mainInputContainer}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="select_carga">Cargas</label>
                        <select
                            name="select_carga"
                            id="select_carga"
                            onChange={handleChange}
                            value={grupo || 'default'}
                        >
                            <option value="default">Selecione a carga</option>
                            {outrasCargasList()}
                        </select>
                    </div>
                </div>
                <div className={styles.navButtonsContainer}>
                    <button onClick={handleContinuar}>Continuar</button>
                </div>
            </div>
        </div>
    );
}
