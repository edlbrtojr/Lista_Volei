'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

type Props = {
  params: Promise<{ id: string }>
}

export default function InscricaoPage(props: Props) {
  const router = useRouter()
  const { id } = use(props.params)

  useEffect(() => {
    let isMounted = true;

    async function verificarEvento() {
      try {
        const res = await fetch('/api/evento')
        const data = await res.json()
        
        if (!isMounted) return;

        if (data.id !== id) {
          const inscricoesRes = await fetch("/api/evento", { method: "PUT" });
          const todosEventos = await inscricoesRes.json();
          const evento = todosEventos.find((e: any) => e.id === id);
          
          if (!isMounted) return;

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
      } catch (error) {
        console.error('Error checking event:', error)
      }
    }

    verificarEvento()

    return () => {
      isMounted = false
    }
  }, [id, router])

}