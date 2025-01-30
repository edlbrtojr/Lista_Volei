import { NextResponse } from "next/server";

type Evento = {
  id: string;
  numPessoas: number;
  dataInicio: Date;      // When the game starts
  dataInscricao: Date;   // When registrations open
  mensagem: string;
  local: string;
  localCustom?: string;
  duracao: string;
  quadra: string;
  precoHora: string;
};

let eventos: Evento[] = [];

export async function GET() {
  const agora = new Date();
  // Return all upcoming events ordered by registration date
  const eventosAtivos = eventos
    .filter(e => new Date(e.dataInicio) > agora)
    .sort((a, b) => new Date(a.dataInscricao).getTime() - new Date(b.dataInscricao).getTime());

  if (eventosAtivos.length === 0) {
    return NextResponse.json({ message: "Nenhum jogo agendado" }, { status: 404 });
  }

  // Find the current active event (if any)
  const eventoAtivo = eventosAtivos.find(e => 
    new Date(e.dataInscricao) <= agora && new Date(e.dataInicio) > agora
  );

  if (eventoAtivo) {
    return NextResponse.json({ ...eventoAtivo, inscricoesAbertas: true });
  }

  // Return the next event
  return NextResponse.json({ ...eventosAtivos[0], inscricoesAbertas: false });
}

export async function POST(req: Request) {
  const body = await req.json();
  const novoEvento = {
    id: crypto.randomUUID(),
    ...body,
    dataInicio: new Date(body.dataInicio),
    dataInscricao: new Date(body.dataInscricao),
    duracao: body.duracao,
    quadra: body.quadra,
    precoHora: body.precoHora
  };
  eventos.push(novoEvento);
  return NextResponse.json({ message: "Jogo criado" });
}

// New endpoint to list all events
export async function PUT() {
  return NextResponse.json(eventos);
}

// New endpoint to delete an event
export async function DELETE(req: Request) {
  const { id } = await req.json();
  eventos = eventos.filter(e => e.id !== id);
  return NextResponse.json({ message: "Jogo removido" });
}

// Add this new endpoint
export async function PATCH(req: Request) {
  const body = await req.json();
  const index = eventos.findIndex(e => e.id === body.id);
  if (index > -1) {
    eventos[index] = {
      ...body,
      dataInicio: new Date(body.dataInicio),
      dataInscricao: new Date(body.dataInscricao),
      duracao: body.duracao,
      quadra: body.quadra,
      precoHora: body.precoHora
    };
    return NextResponse.json({ message: "Jogo atualizado" });
  }
  return NextResponse.json({ message: "Jogo não encontrado" }, { status: 404 });
}
