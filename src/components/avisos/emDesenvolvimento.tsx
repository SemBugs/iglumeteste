import { FaRegTimesCircle } from "react-icons/fa";
import Image from 'next/image'
import dev from "@/assets/imgs/dev.webp"
import styles from "@/styles/emDesenvolvimento.module.css"

interface props {
    showMe: boolean;
    msg: string;
    onClose: () => void;
}

export default function EmDesenvolvimento({ showMe, msg, onClose }: props) {
    if (!showMe) return null
    return (
        <div className={styles.overlay}>
            <div className={styles.mainContainer}>
                <div className={styles.titleContainer}>
                    <p>Ops! Etapa em desenvolvimento!</p>
                    <FaRegTimesCircle size={30} onClick={() => onClose()} />
                </div>
                <div className={styles.imageContainer}>
                    <Image src={dev} width={500} height={500} alt="image_dev" />
                </div>
                <div className={styles.messageContainer}>
                    <p>{msg}</p>
                </div>
            </div>
        </div>
    )
}