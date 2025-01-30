'use client'

import { useEffect, useState } from "react";

type Evento = {
  id: string;
  numPessoas: number;
  dataInicio: string;
  mensagem: string;
  local: string;
  localCustom?: string;
  dataInscricao: string;
};

export default function Config() {
  const [numPessoas, setNumPessoas] = useState(12);
  const [dataInicio, setDataInicio] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [local, setLocal] = useState("BE STRONG");
  const [localCustom, setLocalCustom] = useState("");
  const [dataInscricao, setDataInscricao] = useState("");

  const locais = ["BE STRONG", "PRAINHA", "LIFE ARENA", "OTHER"];

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    const res = await fetch("/api/evento", { method: "PUT" });
    const data = await res.json();
    setEventos(data);
  };

  const criarEvento = async () => {
    const localFinal = local === "OTHER" ? localCustom : local;
    await fetch("/api/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        numPessoas, 
        dataInicio, 
        dataInscricao,
        mensagem,
        local: localFinal 
      }),
    });
    setDataInicio("");
    setMensagem("");
    setLocalCustom("");
    fetchEventos();
  };

  const editarEvento = (evento: Evento) => {
    setEditingId(evento.id);
    setNumPessoas(evento.numPessoas);
    setDataInicio(evento.dataInicio);
    setMensagem(evento.mensagem);
    if (locais.includes(evento.local)) {
      setLocal(evento.local);
      setLocalCustom("");
    } else {
      setLocal("OTHER");
      setLocalCustom(evento.local);
    }
  };

  const atualizarEvento = async () => {
    const localFinal = local === "OTHER" ? localCustom : local;
    await fetch("/api/evento", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: editingId,
        numPessoas, 
        dataInicio, 
        mensagem,
        local: localFinal 
      }),
    });
    setEditingId(null);
    setDataInicio("");
    setMensagem("");
    setLocalCustom("");
    fetchEventos();
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setDataInicio("");
    setMensagem("");
    setNumPessoas(12);
  };

  const deletarEvento = async (id: string) => {
    await fetch("/api/evento", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEventos();
  };

  const categorizarEventos = () => {
    const agora = new Date();
    const eventosOrdenados = [...eventos].sort((a, b) => 
      new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
    );

    return {
      proximos: eventosOrdenados.filter(e => new Date(e.dataInicio) > agora),
      anteriores: eventosOrdenados.filter(e => new Date(e.dataInicio) <= agora)
    };
  };

  const { proximos, anteriores } = categorizarEventos();

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 pb-12">
      <h1 className="text-2xl font-bold mb-8 text-center">
        {editingId ? "Editar Jogo" : "Agendar Novo Jogo"}
      </h1>
      
      {/* Form section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 mb-8">
        <div className="border-b dark:border-gray-700 pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">Detalhes do Jogo</h2>
          {/* Existing fields for game details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Data e horário do jogo:</label>
              <input 
                type="datetime-local" 
                value={dataInicio} 
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Número de jogadores:</label>
              <select 
                value={numPessoas} 
                onChange={(e) => setNumPessoas(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Título do jogo:</label>
              <input 
                type="text" 
                value={mensagem} 
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Local:</label>
              <select 
                value={local} 
                onChange={(e) => setLocal(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {locais.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              
              {local === "OTHER" && (
                <input 
                  type="text"
                  value={localCustom}
                  onChange={(e) => setLocalCustom(e.target.value)}
                  placeholder="Digite o local"
                  className="mt-2 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Detalhes da Inscrição</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Abertura das inscrições:</label>
              <input 
                type="datetime-local" 
                value={dataInscricao} 
                onChange={(e) => setDataInscricao(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                As inscrições ficarão abertas desta data até o início do jogo
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={editingId ? atualizarEvento : criarEvento}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {editingId ? "Atualizar" : "Agendar"} Jogo
          </button>
          {editingId && (
            <button 
              onClick={cancelarEdicao}
              className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Events lists section */}
      <div className="space-y-8">
        {/* Próximos Vôleis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Próximos Vôleis
          </h2>
          <div className="space-y-4">
            {proximos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhum evento futuro agendado
              </p>
            ) : (
              proximos.map((evento) => (
                <div 
                  key={evento.id}
                  className="flex items-center justify-between p-4 border border-blue-100 dark:border-blue-900 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{evento.mensagem}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Data: {new Date(evento.dataInicio).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Participantes: {evento.numPessoas}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Local: {evento.local}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editarEvento(evento)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deletarEvento(evento.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vôleis Anteriores */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-600 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Vôleis Anteriores
          </h2>
          <div className="space-y-4">
            {anteriores.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhum evento anterior registrado
              </p>
            ) : (
              anteriores.map((evento) => (
                <div 
                  key={evento.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/20"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{evento.mensagem}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Data: {new Date(evento.dataInicio).toLocaleDateString()} às{" "}
                      {new Date(evento.dataInicio).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Participantes: {evento.numPessoas}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Local: {evento.local}
                    </p>
                  </div>
                  <button
                    onClick={() => deletarEvento(evento.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remover evento"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
