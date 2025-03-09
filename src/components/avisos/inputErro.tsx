import { FaRegTimesCircle } from "react-icons/fa";
import Image from 'next/image'
import stop from "@/assets/imgs/stop.webp"
import styles from "@/styles/emDesenvolvimento.module.css"

interface props {
    showMe: boolean;
    msg: string;
    onClose: () => void;
}

export default function InputErro({ showMe, msg, onClose }: props) {
    if (!showMe) return null
    return (
        <div className={styles.overlay}>
            <div className={styles.mainContainer}>
                <div className={styles.titleContainer}>
                    <p>Ops! As informações informações que você passou estão incorretas!</p>
                    <FaRegTimesCircle size={50} onClick={() => onClose()} />
                </div>
                <div className={styles.imageContainer}>
                    <Image src={stop} width={500} height={500} alt="image_stop" />
                </div>
                <div className={styles.messageContainer}>
                    <p>{msg}</p>
                </div>
            </div>
        </div>
    )
}