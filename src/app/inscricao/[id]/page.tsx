'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Home from '../../page'
import { use } from 'react'

type Props = {
  params: Promise<{ id: string }>
}

export default function InscricaoPage(props: Props) {
  const router = useRouter()
  const { id } = use(props.params)

  useEffect(() => {
    async function verificarEvento() {
      const res = await fetch('/api/evento')
      const data = await res.json()
      
      if (data.id !== id) {
        // If this is not the current active event, redirect to appropriate page
        const inscricoesRes = await fetch("/api/evento", { method: "PUT" });
        const todosEventos = await inscricoesRes.json();
        const evento = todosEventos.find((e: any) => e.id === id);
        
        if (!evento) {
          router.push('/acabou')
          return
        }

        const agora = new Date()
        if (new Date(evento.dataInscricao) > agora) {
          router.push('/aguarde')
          return
        }
      }
    }

    verificarEvento()
  }, [id, router])

  return <Home />
}
