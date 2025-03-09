import Link from "next/link";
import styles from "@/styles/footer.module.css";
import logo from "../../public/logo.png";
import Image from "next/image";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  const iconSize: number = 35;
  const wppLink: string = "https://wa.me/553199754441?text=Olá";
  const faceLink: string = "https://www.facebook.com/iglume/";
  const instaLink: string = "https://www.instagram.com/iglumelajes/";
  const youtubeLink: string = "https://www.youtube.com/@IgluMeLajes";
  return (
    <footer className={styles.footer}>
      <div className={styles.infoContainer}>
        <div className={styles.logoContainer}>
          <Link href="https://iglumelajes.com.br/" target="_blank">
            <Image
              src={logo}
              width={131}
              height={37}
              alt="logo_iglu_me"
              className={styles.logo}
            />
          </Link>
          <p>Capitais e regiões metropolitanas</p>
        </div>
        <div className={styles.iconInfoContainer}>
          <div className={styles.iconContainer}>
            <Link href={wppLink} target="_blank">
              <FaWhatsapp className={styles.span} size={iconSize} />
            </Link>
            <Link href={faceLink} target="_blank">
              <FaFacebook className={styles.span} size={iconSize} />
            </Link>
            <Link href={instaLink} target="_blank">
              <FaInstagram className={styles.span} size={iconSize} />
            </Link>
            <Link href={youtubeLink} target="_blank">
              <FaYoutube className={styles.span} size={iconSize} />
            </Link>
          </div>
          <div>
            <p>Av. Raja Gabáglia, N° 2000 - 8°Andar, Sala 802z - Cidade Jardim</p>
            <p>Belo Horizonte-MG, 30494-170</p>
          </div>
        </div>
      </div>
      <div className={styles.copyContainer}>
        <Link href="https://github.com/EliaJunior" target="_blank" className="">
          &copy; {new Date().getFullYear()} Desenvolvido por ED 42 Labs.
        </Link>
      </div>
    </footer>
  );
}
