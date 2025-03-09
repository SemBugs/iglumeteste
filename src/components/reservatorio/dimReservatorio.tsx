import styles from '@/styles/dimReservatorio.module.css'
import CardButton from '../formularioLaje/cardButton'
import caixa_agua from '@/assets/imgs/caixa_agua.svg'
import { FaRegTimesCircle } from "react-icons/fa"
import reservatorios from "@/data/caixas_dagua.json"
import { useState } from 'react'
import EmDesenvolvimento from "../avisos/emDesenvolvimento";

interface props {
    showMe: boolean;
    onClose: () => void;
}

export default function CalculadoraReservatorio({ showMe, onClose }: props) {

    const [volume, setVolume] = useState(310)
    const [quantidade, setQuantidade] = useState(1)

    const [ShowDevModal, setShowDevModal] = useState(false);
    const handleCloseModal = (): void => { setShowDevModal(false) }
    const handleShowModal = (): void => { setShowDevModal(true) }

    const dadosCard = [{
        title: "Caixa D'água",
        imageSource: caixa_agua,
        value_id: "caixa_agua",
        card_description: `${Number(quantidade * volume).toLocaleString('pt-br')} kgf`,
        selected: true
    }]

    const handleChangeVolume = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === "volume") {
            setVolume(Number(value))
        } else {
            setQuantidade(Number(value))
        }
    };

    const optionsReservatorios = () => {
        return reservatorios.map((reservatorio) => (
            <option key={reservatorio.id} value={reservatorio.volume}>
                {reservatorio.volume} L
            </option>
        ));
    };

    if (!showMe) return null
    return (
        <div className={styles.overlay}>
            <EmDesenvolvimento
                showMe={ShowDevModal}
                onClose={handleCloseModal}
                msg="Em breve poderá calcular o reservatório detalhadamente!"
            />
            <div className={styles.mainContainer}>
                <div className={styles.headContainer}>
                    <h1>Informações do reservatório</h1>
                    <FaRegTimesCircle onClick={onClose} />
                </div>
                <div className={styles.cardsContainer}>
                    <CardButton
                        dados={dadosCard}
                        clickEvent={() => { }}
                        title="grupo"
                        styles={styles}
                    />
                </div>
                <div className={styles.inputsContainer}>
                    <div>
                        <label htmlFor="volume">Volume</label>
                        <select name="volume" id="volume" onChange={(e) => handleChangeVolume(e)}>
                            <option value="">Escolha o volume</option>
                            {optionsReservatorios()}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quantidade">Quantidade</label>
                        <input type="number" name="quantidade" className={styles.textBox} title="quantidade" onChange={handleChangeVolume} value={quantidade} />
                    </div>
                </div>
                <div className={styles.submitButton}>
                    <button onClick={handleShowModal}>
                        DESCOBRIR A IDEAL
                    </button>
                </div>
            </div>
        </div>
    )
}