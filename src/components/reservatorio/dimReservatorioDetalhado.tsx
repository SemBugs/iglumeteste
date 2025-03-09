import Image from 'next/image'
import styles from '@/styles/dimReservatorioDetalhado.module.css'
import caixa_agua from '@/assets/imgs/caixa_agua.svg'
import pessoas from "@/assets/imgs/pessoas.webp"
import { FaRegTimesCircle } from "react-icons/fa"
import reservatorios from "@/data/caixas_dagua.json"
import { useState } from 'react'

interface props {
    showMe: boolean;
    onClose: () => void;
}

export default function CalculadoraReservatorioDetalhado({ showMe }: props) {
    if (!showMe) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.mainContainer}>
                <div className={styles.headContainer}>
                    <h1>Calcular reservatório</h1>
                    <FaRegTimesCircle onClick={() => { }} />
                </div>
                <div className={styles.parametrosContainer}>
                    <div className={styles.paramsContainer}>
                        <div className={styles.qtPessoasImagem}>
                            <Image src={pessoas} alt="img_pessoas" height={50} />
                            <span>Quantas pessoas utilizarão o local?</span>
                        </div>
                        <div className={styles.qtPessoasControls}>
                            <div className={styles.spinContainer}>
                                <button>-</button>
                                <input type="number" />
                                <button>+</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.paramsContainer}>
                        <span>Consumo diário [L/pessoa]</span>
                        <div className={styles.spinContainer}>
                            <button>-</button>
                            <input type="number" />
                            <button>+</button>
                        </div>
                    </div>
                    <div className={styles.paramsContainer}>
                        <span>Dias de armazenamento</span>
                        <div className={styles.spinContainer}>
                            <button>-</button>
                            <input type="number" />
                            <button>+</button>
                        </div>
                    </div>
                    <div className={styles.calculoConsumo}>
                        Consumo total: {0}
                    </div>
                    <hr />
                    <div className={styles.resultadoContainer}>
                        <div className={styles.imageContainer}>
                            <Image src={caixa_agua} alt="image_caixa" height={150} />
                        </div>
                        <div className={styles.controlContainer}>
                            <div className={styles.controlsChoice}>
                                <label htmlFor="quantidade">Sua Escolha</label>
                                <select name="" id="">
                                    <option value="">Escolha um reservatório</option>
                                </select>
                            </div>
                            <div className={styles.controlsChoice}>
                                <label htmlFor="quantidade">Quantidade</label>
                                <input type="number" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}