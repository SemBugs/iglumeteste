import styles from '@/styles/detailedReport.module.css';

interface props {
    openFeedback: () => void;
}

export default function FrameFeedback({ openFeedback }: props) {
    return (
        <div className={styles.feedbackContainer}>
            <div className={styles.ctaContainer}>
                <p className={styles.ctaMessage}>
                    Esta plataforma está em versão <strong>beta</strong>. Sua opinião é muito importante para nós!
                    Clique no botão abaixo para enviar seu feedback.
                </p>
                <button className={styles.feedbackButton} onClick={openFeedback}>
                    Feedback
                </button>
            </div>
        </div>
    );
};