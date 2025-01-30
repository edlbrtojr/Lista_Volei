"use client";
import { useEffect, useState } from "react";

export default function Home({ eventId }: { eventId?: string }) {
  const [nome, setNome] = useState("");
  const [registros, setRegistros] = useState<any[]>([]);
  const [eventoAtivo, setEventoAtivo] = useState(false);
  const [eventoAtual, setEventoAtual] = useState<any>(null);

  useEffect(() => {
    async function fetchEvento() {
      const res = await fetch("/api/evento");
      const data = await res.json();
      const agora = new Date();
      if (data && new Date(data.dataInicio) <= agora) {
        setEventoAtivo(true);
        setEventoAtual(data);
      }
    }
    fetchEvento();
  }, []);

  const enviarNome = async () => {
    if (!nome.trim()) return;
    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    const novoRegistro = await res.json();
    setRegistros([...registros, novoRegistro]);
    setNome("");
  };

  return eventoAtivo ? (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold my-8">Inscrição para o Vôlei</h1>
        {eventoAtual && (
          <div className="text-gray-600 dark:text-gray-400">
            <p className="text-lg font-medium">{eventoAtual.mensagem}</p>
            <p>Local: {eventoAtual.local}</p>
            <p>Data: {new Date(eventoAtual.dataInicio).toLocaleDateString()}</p>
            <p>Horário: {new Date(eventoAtual.dataInicio).toLocaleTimeString()}</p>
            <p>Total de vagas: {eventoAtual.numPessoas}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <input
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          onClick={enviarNome}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Enviar
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">Data e Hora</th>
              <th className="px-6 py-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {registros.map((reg, index) => (
              <tr key={index} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4">{reg.nome}</td>
                <td className="px-6 py-4">{new Date(reg.data).toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-sm">{reg.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}
