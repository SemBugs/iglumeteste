import { useState } from "react";
import { definirVigota_Enchimento } from '../../utils/functions'

// Componente de teste com Tailwind CSS
export default function Teste() {
    const [carga, setCarga] = useState(0);
    const [vao, setVao] = useState(0);
    const [resultado, setResultado] = useState<[number, string, number, string, number]>([0, '', 0, '', 0]);

    const handleTest = () => {
        const res = definirVigota_Enchimento(vao, carga, "trelicada");
        setResultado(res); // Armazena o array completo
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Testar Função de Retorno Vigota</h1>

            {/* Campo para a carga */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carga">
                    Carga [kgf/m²]
                </label>
                <input
                    id="carga"
                    type="number"
                    value={carga}
                    onChange={(e) => setCarga(Number(e.target.value))}
                    placeholder="Carga [kgf/m²]"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Campo para o vão */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vao">
                    Vão Livre [m]
                </label>
                <input
                    id="vao"
                    type="number"
                    value={vao}
                    onChange={(e) => setVao(Number(e.target.value))}
                    placeholder="Vão [m]"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Botão para calcular */}
            <button
                onClick={handleTest}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            >
                Calcular
            </button>

            {/* Exibição do resultado */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                {resultado[1] !== '' ? (
                    <p className="text-lg text-gray-700">
                        <span className="font-semibold text-blue-600"> {resultado[1]} </span>
                        +
                        <span className="font-semibold text-blue-600"> {resultado[3]} </span>
                    </p>
                ) : (
                    <p className="text-lg text-red-600">Nenhuma vigota atende aos critérios informados.</p>
                )}
            </div>
        </div>
    );
}
