import { NextResponse } from "next/server";

const registros: { nome: string; data: Date; ip: string }[] = [];

export async function GET() {
  return NextResponse.json(registros);
}

export async function POST(req: Request) {
  const { nome } = await req.json();
  const ip = req.headers.get("x-forwarded-for") || "Desconhecido"; // Captura IP real
  const novoRegistro = { nome, data: new Date(), ip };

  registros.push(novoRegistro);
  return NextResponse.json(novoRegistro);
}
