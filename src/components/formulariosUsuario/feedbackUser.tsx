import React, { useState } from "react";
import styles from "./styles/FeedBackUser.module.css";
import { FaRegTimesCircle } from "react-icons/fa";

interface props {
    showMe: boolean,
    closeMe: () => void;
}

export default function FeedbackUser({ showMe, closeMe }: props) {
    const [formData, setFormData] = useState({ nome: "", mensagem: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/submitFeedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    mensagem: formData.mensagem,
                    dataEnvio: new Date().toISOString(),
                }),
            });

            // Verificar se a resposta da API foi bem-sucedida
            if (!response.ok) {
                const text = await response.text(); // Captura o HTML da resposta
                console.error("Erro inesperado na API:", text);
                throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json(); // Processa a resposta como JSON
            alert("Feedback enviado com sucesso!");
            setFormData({ nome: "", mensagem: "" });
            closeMe
        } catch (error) {
            console.error("Erro ao enviar o feedback:", error);
            alert("Erro ao enviar o feedback. Verifique o console para mais detalhes.");
        }
    };

    if (!showMe) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <div className={styles.headContainer}>
                    <h1>Deixe seu Feedback!</h1>
                    <FaRegTimesCircle onClick={closeMe} />
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="nome" className={styles.label}>
                            Nome:
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="mensagem" className={styles.label}>
                            Mensagem:
                        </label>
                        <textarea
                            id="mensagem"
                            name="mensagem"
                            value={formData.mensagem}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows={4}
                            maxLength={300}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className={styles.button}>
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}
