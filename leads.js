import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, whatsapp, objetivo } = req.body;

  try {
    const client = await pool.connect();
    const query = 'INSERT INTO leads (nome, whatsapp, objetivo) VALUES ($1, $2, $3) RETURNING *';
    const values = [nome, whatsapp, objetivo];
    
    await client.query(query, values);
    client.release();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao salvar no banco' });
  }
}