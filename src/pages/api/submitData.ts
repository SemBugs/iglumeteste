import {
  calcularVolumeConcretoM3,
  calcularIntereixoLaje,
  calcularComprimentoLinearVigas,
  calcularQtdeEnchimento,
  areaLaje
} from "./../../utils/functions";
import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { formatarData } from "@/utils/functions";
import parametros from "@/data/parametros.json";
import { Laje } from "@/types/interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST request is allowed" });
  }

  // Verificar se req.body é um array e iterar sobre todas as linhas
  const bodyArray = Array.isArray(req.body) ? req.body : [req.body];

  // Mapeia cada linha do array para os dados corretos
  const dataToSend = bodyArray.map((body) => ({
    ...body,
    vaoViga: Number(body.vaoViga),
    vaoOposto: Number(body.vaoOposto),
    area_aco_adicional_calculado: Number(body.area_aco_adicional_calculado),
    area_aco_adicional_tabela: Number(body.area_aco_adicional_tabela),
    custo_aco_adicional: Number(body.custo_aco_adicional),
  }));

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

    // Preparar dados para o Google Sheets
    const values = dataToSend.map((laje: Laje) => [
      laje.nome_laje,
      laje.tipo_laje,
      laje.vaoViga,
      laje.vaoOposto,
      Number(laje.vaoViga) + Number(parametros.apoio_viga),
      Number(laje.vaoOposto) + Number(parametros.apoio_vao_oposto),
      `${laje.condicao_apoio} - ${laje.tipo_vigota}`,
      laje.grupo,
      laje.carga,
      laje.ench_modelo,
      laje.trel_modelo,
      laje.altura_laje,
      calcularIntereixoLaje(laje),
      calcularVolumeConcretoM3(laje),
      calcularComprimentoLinearVigas(laje),
      calcularQtdeEnchimento(laje),
      areaLaje(laje),
      laje.area_aco_adicional_calculado,
      laje.area_aco_adicional_tabela,
      laje.opt_barras1_tabela,
      laje.opt_barras1,
      laje.opt_barras2,
      laje.opt_barras3
    ]);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A1:W1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
      insertDataOption: "INSERT_ROWS",
    });

    // Depuração: Verificar se a resposta foi bem-sucedida
    console.log("Resposta do Google Sheets:", response.data);

    return res.status(200).json({
      data: response.data,
    });
  } catch (e: any) {
    console.error(
      "Erro ao tentar enviar dados para o Google Sheets:",
      e.message
    );
    return res.status(500).send({ message: e.message ?? "Algo deu errado" });
  }
}
