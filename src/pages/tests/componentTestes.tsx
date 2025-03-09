import EscolherLaje from "@/components/formularioLaje/escolherLaje";
import EscolherCarga from "@/components/formularioLaje/escolherCarga";
import EscolherVaos from "@/components/formularioLaje/escolherVaos";
import EmDesenvolvimento from "@/components/avisos/emDesenvolvimento";
import InputErro from "@/components/avisos/inputErro";
import DimReservatorio from "@/components/reservatorio/dimReservatorio"
import DimReservatorioDetalhado from "@/components/reservatorio/dimReservatorioDetalhado"
import EscolherCidade from "@/components/formulariosUsuario/escolherCidade";
import DicaImportante from "@/components/avisos/dicaImportante";
import { useState } from "react";
import FeedBackUser from "@/components/formulariosUsuario/feedbackUser"
import { Laje } from "@/types/interfaces";


export default function Teste() {
    const [show, setShow] = useState(true)
    const closeModal = () => { setShow(false) }

    return (
        <>
        </>
    );
}
