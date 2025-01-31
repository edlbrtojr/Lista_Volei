"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Evento = {
  id: string;
  numPessoas: number;
  dataInicio: string;
  dataInscricao: string;  // Add this property
  mensagem: string;
  local: string;
};

export default function Aguarde() {
  const [proximasInscricoes, setProximasInscricoes] = useState<Evento[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchEventos() {
      try {
        const res = await fetch("/api/evento", { method: "GET" });
        if (res.status === 404) {
          router.push("/acabou");
          return;
        }
        
        const data = await res.json();
        const agora = new Date();
        
        // Sort and filter future events
        const eventosFuturos = data
          .filter((e: Evento) => new Date(e.dataInicio) > agora)
          .sort((a: Evento, b: Evento) => 
            new Date(a.dataInscricao).getTime() - new Date(b.dataInscricao).getTime()
          );

        setProximasInscricoes(eventosFuturos);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEventos();
    // Update every minute
    const interval = setInterval(fetchEventos, 60000);
    return () => clearInterval(interval);
  }, [router]);

  const formatarTempo = (data: string) => {
    const diff = new Date(data).getTime() - new Date().getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Próximas Inscrições</h1>
        <div className="space-y-8">
          {proximasInscricoes.map((evento, index) => (
            <div key={evento.id} 
              className={`border-t pt-6 first:border-t-0 first:pt-0 ${index === 0 ? 'bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg' : ''}`}
            >
              <h2 className="text-xl font-semibold mb-2">
                {index === 0 && <span className="text-blue-600 dark:text-blue-400 text-sm block mb-1">Próxima abertura</span>}
                {evento.mensagem}
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <h3 className="font-medium mb-2">Detalhes do Jogo</h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>Local: {evento.local}</p>
                    <p>Jogadores: {evento.numPessoas}</p>
                    <p>Data: {new Date(evento.dataInicio).toLocaleDateString()}</p>
                    <p>Horário: {new Date(evento.dataInicio).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-medium mb-2">Inscrições abrem em</h3>
                  <div className="text-2xl font-mono text-blue-600 dark:text-blue-400">
                    {formatarTempo(evento.dataInscricao)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
