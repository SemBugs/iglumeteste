import styles from "./styles/ConfigurarProtendida.module.css";
import { Laje } from "@/types/interfaces"
import { useState } from "react"

interface Props {
    showMe: boolean;
    onClose: () => void; // Callback para fechar o modal
    onSave: () => void; // Callback para salvar os dados
    handleChange: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => void;
    laje: Laje;
}

export default function ConfigurarProtendida({ showMe, onClose, onSave, laje, handleChange }: Props) {
    const [condicao, setCondicao] = useState(laje.condicao_apoio);
    const [tipo, setTipo] = useState(laje.tipo_vigota);

    // const condicao = laje.condicao_apoio
    // const tipo = laje.tipo_vigota

    if (!showMe) return null;

    const handleSave = () => {
        onClose(); // Fecha o modal
        onSave();
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContainer}>
                <h2 className={styles.modalTitle}>Configurações</h2>
                <hr />

                <form className={styles.modalForm}>
                    {/* Condição de Apoio */}
                    <fieldset className={styles.fieldset}>
                        <div className={styles.legenda}>
                            <legend>Condição de Apoio</legend>
                        </div>
                        <div className={styles.inputs}>
                            <label>
                                <input
                                    type="radio"
                                    name="condicao_apoio"
                                    title="condicao_apoio"
                                    value="AA"
                                    checked={condicao === "AA"}
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
                    <hr />
                    {/* Tipo */}
                    <fieldset className={styles.fieldset}>
                        <div className={styles.legenda}>
                            <legend>Tipo</legend>
                        </div>
                        <div className={styles.inputs}>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo_vigota"
                                    title="tipo_vigota"
                                    value="SIMPLES"
                                    checked={tipo === "SIMPLES"}
                                    onChange={(e) => {
                                        setTipo("SIMPLES")
                                        handleChange(e)
                                    }}
                                />
                                Simples
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo_vigota"
                                    title="tipo_vigota"
                                    value="DUPLA"
                                    checked={tipo === "DUPLA"}
                                    onChange={(e) => {
                                        setTipo("DUPLA")
                                        handleChange(e)
                                    }}
                                />
                                Dupla
                            </label>
                        </div>
                    </fieldset>

                    <div className={styles.navButtonsContainer}>
                        <button type="button" onClick={handleSave}>
                            Salvar
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
