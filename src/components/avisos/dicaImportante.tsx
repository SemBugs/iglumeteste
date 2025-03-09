import Image from 'next/image';
import apoioViga from '@/assets/imgs/apoio_viga_laje.svg';
import apoioEnchimento from '@/assets/imgs/apoio_enchimento.svg';
import apoioVigaProtendida from '@/assets/imgs/apoio_viga_protendida.svg'
import apoioEnchimentoProtendida from '@/assets/imgs/apoio_enchimento_protendida.svg'
import styles from './styles/dicaImportante.module.css';
import parametros from '@/data/parametros.json';

interface props {
    showMe: boolean
    onClose: () => void;
    tipoLaje: string;
}

export default function DicaImportante({ showMe, onClose, tipoLaje }: props) {
    const apoio_viga = (Number(parametros.apoio_viga) * 100 / 2)
        .toLocaleString('pt-br', { minimumFractionDigits: 2 });

    const apoio_vao_oposto = (Number(parametros.apoio_vao_oposto) * 100 / 2)
        .toLocaleString('pt-br', { minimumFractionDigits: 2 });

    const imagensLajes: Record<string, any> = {
        vigaTrelicada: apoioViga,
        enchimentoTrelicada: apoioEnchimento,
        vigaProtendida: apoioVigaProtendida,
        enchimentoProtendida: apoioEnchimentoProtendida
    };

    const apoioTipo = (tipoLaje === "protendida") ? "enchimentoProtendida" : "enchimentoTrelicada"
    const imgApoioEnchimento = imagensLajes[apoioTipo] || apoioEnchimento;

    const vigaTipo = (tipoLaje === "protendida") ? "vigaProtendida" : "vigaTrelicada"
    const imgViga = imagensLajes[vigaTipo] || apoioViga

    if (!showMe) return null
    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Dica importante!</h1>
                    <p className={styles.titleP}>Não considere apoio nas medidas</p>
                    <p className={styles.description}>
                        A medida dos apoios é considerada automaticamente no cálculo, sendo {apoio_viga} cm para cada lado da viga e {apoio_vao_oposto} cm para cada lado no sentido oposto.
                    </p>
                </div>
                <div className={styles.supportSections}>
                    <div className={styles.supportItem}>
                        <p className={styles.supportTitle}>APOIO DA VIGA DA LAJE</p>
                        <Image
                            src={imgViga}
                            height={150}
                            width={150}
                            alt="apoio_viga_img"
                        />
                        <p>Apoio de {apoio_viga} cm</p>
                    </div>
                    <div className={styles.supportItem}>
                        <p className={styles.supportTitle}>APOIO &apos;ISOPOR&apos;</p>
                        <Image
                            src={imgApoioEnchimento}
                            height={150}
                            width={150}
                            alt="apoio_enchimento_img"
                        />
                        <p>Apoio {apoio_vao_oposto} cm</p>
                    </div>
                </div>
                <button className={styles.button} onClick={onClose}>OK</button>
            </div>
        </div>
    );
}
