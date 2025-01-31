import { NextResponse } from "next/server";
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { nome, eventId } = await req.json();
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';

    // First check if event is still open and has space
    const { rows: [event] } = await sql`
      SELECT num_pessoas FROM events WHERE id = ${eventId}
    `;

    // Get current registration count
    const { rows: [{count}] } = await sql`
      SELECT COUNT(*) FROM registrations 
      WHERE event_id = ${eventId}
    `;

    const isFull = parseInt(count) >= event.num_pessoas;
    const status = isFull ? 'waiting' : 'confirmed';

    // Add registration
    const { rows: [registration] } = await sql`
      INSERT INTO registrations (event_id, nome, ip, status)
      VALUES (${eventId}, ${nome}, ${clientIp}, ${status})
      RETURNING *
    `;

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: "Erro ao registrar inscrição" }, 
      { status: 500 }
    );
  }
}