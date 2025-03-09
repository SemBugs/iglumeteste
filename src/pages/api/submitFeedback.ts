import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST request is allowed" });
  }

  try {
    // Autenticação
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ auth, version: "v4" });

    // Captura os dados enviados no corpo da requisição
    const { nome, mensagem, dataEnvio } = req.body;

    // Prepara os dados para o envio
    const values = [
      [
        nome,       // Nome do usuário
        mensagem,   // Feedback do usuário
        dataEnvio,  // Data do envio
      ],
    ];

    // Enviar os dados para a aba "Feedback" na planilha
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "feedback!A1:C1", // Nome da aba (Feedback) e colunas-alvo
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
      insertDataOption: "INSERT_ROWS",
    });

    // Depuração: Verificar a resposta do Google Sheets
    console.log("Resposta do Google Sheets:", response.data);

    return res.status(200).json({
      message: "Feedback enviado com sucesso!",
      data: response.data,
    });
  } catch (e: any) {
    console.error("Erro ao tentar enviar dados para o Google Sheets:", e.message);
    return res.status(500).send({ message: e.message ?? "Algo deu errado" });
  }
}
