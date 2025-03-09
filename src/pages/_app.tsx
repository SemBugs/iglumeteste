import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import Head from 'next/head';
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps & { Component: any }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const navbarProps = Component.navbarProps || { showButton: false };
  return (
    <>
      <Head>
        <title>Iglue ME</title>
        <meta name="description" content="Empresa de engenharia, projeto e fornecimento de Lajes de concreto armado" />
        <meta name="keywords" content="engenharia, arquitetura, projetos, orçamento, construção, reformas, calculadoras de engenharia" />
        <meta property="og:title" content="Iglu ME Lajes" />
        <meta property="og:description" content="@iglume" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showNavbar && <Navbar {...navbarProps} />}
      <Component {...pageProps} setShowNavbar={setShowNavbar} />
    </>
  );
}
