import Image, { StaticImageData } from 'next/image';
// import styles from "@/styles/formulariosLaje.module.css"

interface typeDados {
    title: string;
    imageSource: StaticImageData;
    value_id: string;
    card_description: string;
    selected: boolean;
}

interface props {
    dados: typeDados[];
    clickEvent: (e: React.MouseEvent<HTMLDivElement>) => void;
    title: string;
    styles: { [key: string]: string };
}

export default function CardButton({ dados, clickEvent, title, styles }: props) {
    return (
        <div className={styles.cardsContainer}>
            {dados.map((card, index) => (
                <div
                    key={index}
                    className={`${styles.cardLaje} ${card.selected ? styles.selected : ""}`}
                    id={card.value_id}
                    onClick={clickEvent}
                    title={title}
                >
                    <p className={styles.cardTitle}>{card.title}</p>
                    <Image
                        src={card.imageSource}
                        height={150}
                        width={150}
                        alt={card.title}
                        priority={true}
                    />
                    <p className={styles.cardDescription}>
                        {card.card_description}
                    </p>
                </div>
            ))}
        </div>
    );
}