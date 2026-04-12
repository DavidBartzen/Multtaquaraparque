import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const {
    nome, cpf, rg, data_nascimento, estado_civil, profissao, renda_mensal,
    endereco, bairro, cidade, estado, telefone, email,
    conjuge_nome, conjuge_cpf, conjuge_rg, conjuge_data_nascimento,
    conjuge_estado_civil, conjuge_profissao, conjuge_renda_mensal,
    conjuge_endereco, conjuge_bairro, conjuge_cidade, conjuge_estado,
    conjuge_telefone, conjuge_email,
    lote1, lote2, lote3, condicao_pagamento
  } = req.body;

  try {
    const client = await pool.connect();
    const query = `
      INSERT INTO ficha (
        nome, cpf, rg, data_nascimento, estado_civil, profissao, renda_mensal,
        endereco, bairro, cidade, estado, telefone, email,
        conjuge_nome, conjuge_cpf, conjuge_rg, conjuge_data_nascimento,
        conjuge_estado_civil, conjuge_profissao, conjuge_renda_mensal,
        conjuge_endereco, conjuge_bairro, conjuge_cidade, conjuge_estado,
        conjuge_telefone, conjuge_email,
        lote1, lote2, lote3, condicao_pagamento
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,
        $14,$15,$16,$17,
        $18,$19,$20,
        $21,$22,$23,$24,
        $25,$26,
        $27,$28,$29,$30
      ) RETURNING *`;
    
    const values = [
      nome, cpf, rg, data_nascimento, estado_civil, profissao, renda_mensal,
      endereco, bairro, cidade, estado, telefone, email,
      conjuge_nome, conjuge_cpf, conjuge_rg, conjuge_data_nascimento,
      conjuge_estado_civil, conjuge_profissao, conjuge_renda_mensal,
      conjuge_endereco, conjuge_bairro, conjuge_cidade, conjuge_estado,
      conjuge_telefone, conjuge_email,
      lote1, lote2, lote3, condicao_pagamento
    ];

    await client.query(query, values);
    client.release();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao salvar ficha' });
  }
}