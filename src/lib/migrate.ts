import { config } from 'dotenv';
import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config();

async function migrate() {
  try {
    // Read schema file with correct path
    const schema = readFileSync(join(process.cwd(), 'src', 'lib', 'schema.sql'), {
      encoding: 'utf8',
    });

    // Execute schema
    await sql.query(schema);
    console.log('Migration completed successfully');

    // Add test event
    await sql`
      INSERT INTO events (
        num_pessoas, 
        data_inicio, 
        data_inscricao, 
        mensagem, 
        local, 
        duracao, 
        quadra, 
        preco_hora
      ) VALUES (
        12,
        NOW() + INTERVAL '1 day',
        NOW(),
        'Evento teste',
        'Quadra Principal',
        '2 horas',
        'Quadra 1',
        50.00
      )
    `;
    console.log('Test data inserted successfully');

  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

migrate();