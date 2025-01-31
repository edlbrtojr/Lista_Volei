'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'

type Props = {
  params: Promise<{ id: string }>
}

export default function InscricaoPage(props: Props) {
  const { id } = use(props.params)
  const [registros, setRegistros] = useState<{ nome: string; data: Date; ip: string; pagou: boolean }[]>([])
  const [totalVagas] = useState(12) // Default to 12, can be updated based on your logic
  const [nome, setNome] = useState('')
  const [eventoAtual] = useState<{ mensagem: string; local: string; numPessoas: number; dataInicio: string; duracao: string; quadra: string; precoHora: number } | null>(null)

  useEffect(() => {
    let isMounted = true;

    async function fetchRegistros() {
      try {
        const res = await fetch(`/api/registro?eventId=${id}`);
        const data: { nome: string; data: string; ip: string; status: string; pagou: boolean }[] = await res.json();
        
        if (!isMounted) return;
    
        // Convert data property to Date object
        const registrosWithDate = data.map(reg => ({
          ...reg,
          data: new Date(reg.data)
        }));
    
        // Sort by registration date
        const sortedRegistros = registrosWithDate.sort((a, b) => 
          a.data.getTime() - b.data.getTime()
        );
    
        // Split into confirmed and waiting lists
        const confirmed = sortedRegistros.filter(r => r.status === 'confirmed');
        const waiting = sortedRegistros.filter(r => r.status === 'waiting');
    
        setRegistros([...confirmed, ...waiting]);
      } catch (error) {
        console.error('Error fetching registros:', error);
      }
    }

    fetchRegistros()

    return () => {
      isMounted = false
    }
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim() })
      })

      if (res.ok) {
        const novoRegistro = await res.json()
        setRegistros([...registros, novoRegistro])
        setNome('')
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
    }
  }

  const mainList = registros.slice(0, totalVagas)
  const waitingList = registros.slice(totalVagas)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Vôlei dos Desesperados</h1>
      
      {eventoAtual && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-3">{eventoAtual.mensagem}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="block text-gray-500 dark:text-gray-400">Local</span>
              <strong>{eventoAtual.local}</strong>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="block text-gray-500 dark:text-gray-400">Participantes</span>
              <strong>{eventoAtual.numPessoas} jogadores</strong>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="block text-gray-500 dark:text-gray-400">Data e Hora</span>
              <strong>{new Date(eventoAtual.dataInicio).toLocaleString()}</strong>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="block text-gray-500 dark:text-gray-400">Duração</span>
              <strong>{eventoAtual.duracao} horas</strong>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="block text-gray-500 dark:text-gray-400">Quadra</span>
              <strong>{eventoAtual.quadra}</strong>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="block text-gray-500 dark:text-gray-400">Cota</span>
              <strong>R$ {(Number(eventoAtual.duracao) * Number(eventoAtual.precoHora) / eventoAtual.numPessoas).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Inscrever
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 font-medium">#</th>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Data e Hora</th>
                <th className="px-6 py-3 font-medium">IP</th>
                <th className="px-6 py-3 font-medium">Pagou?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mainList.map((reg, index) => (
                <tr key={index} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{reg.nome}</td>
                  <td className="px-6 py-4">{new Date(reg.data).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-sm">{reg.ip}</td>
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={reg.pagou} onChange={() => handlePagouChange(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Lista de Espera</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 font-medium">#</th>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Data e Hora</th>
                <th className="px-6 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {waitingList.map((reg, index) => (
                <tr key={index} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">{index + 1 + totalVagas}</td>
                  <td className="px-6 py-4">{reg.nome}</td>
                  <td className="px-6 py-4">{new Date(reg.data).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-sm">{reg.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  function handlePagouChange(index: number) {
    const updatedRegistros = [...mainList]
    updatedRegistros[index].pagou = !updatedRegistros[index].pagou
    setRegistros([...updatedRegistros, ...waitingList])
  }
}