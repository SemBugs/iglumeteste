import { definirVigotaProtendida } from '@/utils/functions'

export default function TestarFuncao() {
  const resultado = definirVigotaProtendida(6, 200, "AA");

  return (
    <div>
      <h1>Resultado da Função</h1>
      <p>{JSON.stringify(resultado)}</p>
    </div>
  );
}