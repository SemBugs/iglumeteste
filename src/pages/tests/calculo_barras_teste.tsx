import { useState } from "react";
import { calcularBarras } from '../../utils/functions'

// Componente de teste com Tailwind CSS
export default function Teste() {
  const [area, setArea] = useState(2.5); // Valor inicial de 2.5 cm²
  const [opt, setOpt] = useState(0); // Controle do ponto de partida
  const [resultado, setResultado] = useState('');

  const handleTest = () => {
    const res = calcularBarras(area, opt);
    setResultado(res);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Testar Função de Cálculo de Barras</h1>
      
      {/* Campo para a área de aço */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="area">
          Área de Aço (cm²)
        </label>
        <input
          id="area"
          type="number"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          placeholder="Área de Aço (cm²)"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Campo para o ponto de partida (opt) */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="opt">
          Ponto de Partida (opt)
        </label>
        <input
          id="opt"
          type="number"
          value={opt}
          onChange={(e) => setOpt(Number(e.target.value))}
          placeholder="Ponto de Partida"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Botão para calcular */}
      <button
        onClick={handleTest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Calcular
      </button>

      {/* Resultado */}
      <p className="mt-4 text-lg text-gray-700">{resultado}</p>
    </div>
  );
}