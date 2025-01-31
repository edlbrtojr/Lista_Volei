import { NextResponse } from "next/server";
import { sql } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  try {
    const { rows } = await sql`
      SELECT * FROM registrations 
      WHERE event_id = ${eventId}
      ORDER BY data ASC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: "Erro ao buscar registros" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { nome, eventId } = await req.json();
  const ip = req.headers.get("x-forwarded-for") || "Desconhecido";

  try {
    const { rows: [registro] } = await sql`
      INSERT INTO registrations (nome, ip, event_id)
      VALUES (${nome}, ${ip}, ${eventId})
      RETURNING *
    `;
    return NextResponse.json(registro);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: "Erro ao criar registro" }, { status: 500 });
  }
}