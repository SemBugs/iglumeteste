import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import imgHome from "@/assets/imgs/report_man.webp";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  // Não precisa mais do handleClick, pois estamos usando Link
  return (
    <main className={styles.mainContainer}>
      <div className={styles.imageContainer}>
        <Link href="https://iglumelajes.com.br/" target="_blank">
          <Image
            src={imgHome}
            alt="imgHome"
            width={315}
            height={315}
            priority={true}
          />
        </Link>
      </div>
      <div className={styles.infoContainer}>
        <h1>VAMOS INSERIR SUA LAJE</h1>
        {/* Usando Link para navegação */}
        <Link href="/calculadoraLajes">
          <button className={styles.button}>
            NOVA LAJE
          </button>
        </Link>
      </div>
    </main>
  );
}
