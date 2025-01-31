import { NextResponse } from "next/server";
import { sql } from '@/lib/db';

export async function GET() {
  const agora = new Date();
  
  try {
    // Get all upcoming events ordered by registration date
    const { rows: eventos } = await sql`
      SELECT * FROM events 
      WHERE data_inicio > ${agora.toISOString()}
      ORDER BY data_inscricao ASC
    `;

    if (eventos.length === 0) {
      return NextResponse.json({ message: "Nenhum jogo agendado" }, { status: 404 });
    }

    // Find current active event
    const eventoAtivo = eventos.find(e => 
      new Date(e.data_inscricao) <= agora && new Date(e.data_inicio) > agora
    );

    if (eventoAtivo) {
      return NextResponse.json({ ...eventoAtivo, inscricoesAbertas: true });
    }

    return NextResponse.json({ ...eventos[0], inscricoesAbertas: false });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: "Erro ao buscar eventos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  
  try {
    const { rows: [evento] } = await sql`
      INSERT INTO events (
        num_pessoas, data_inicio, data_inscricao, 
        mensagem, local, duracao, quadra, preco_hora
      ) VALUES (
        ${body.numPessoas}, ${new Date(body.dataInicio).toISOString()}, 
        ${new Date(body.dataInscricao).toISOString()}, ${body.mensagem}, 
        ${body.local}, ${body.duracao}, ${body.quadra}, 
        ${body.precoHora}
      )
      RETURNING *
    `;
    
    return NextResponse.json({ message: "Jogo criado", evento });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: "Erro ao criar evento" }, { status: 500 });
  }
}