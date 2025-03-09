import Link from "next/link";
import styles from "@/styles/navbar.module.css";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useRouter } from "next/router";

interface props {
  showButton: boolean;
  ButtonContent?: string;
  buttonEvent: () => void;
}

export default function Navbar({ ButtonContent, showButton, buttonEvent }: props) {
  const router = useRouter()

  const actionButton = () => {
    return (
      <button
        className={styles.actionButton}
        // onClick={() => {
        //   router.push("/detailedReport")
        // }}
        onClick={buttonEvent}
      >
        {ButtonContent}
      </button>
    );
  };

  return (
    <nav className={styles.navContainer}>
      <Link href="/">
        <Image
          src={logo}
          width={131}
          height={37}
          alt="logo_iglu_me"
          className={styles.logo}
        />
      </Link>
      <div>{showButton && actionButton()}</div>
    </nav>
  );
}
