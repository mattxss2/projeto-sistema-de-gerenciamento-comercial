import express from 'express';
import { gerarInsightsComerciais } from '../services/aiservice.js';
// Supondo que você tenha os modelos do Mongoose para Vendas e Produtos
import Venda from '../models/Venda.js';
import Produto from '../models/Produto.js';

const router = express.Router();

router.get('/insights-ia', async (req, res) => {
  try {
    // Busca dados analíticos recentes para alimentar o contexto da IA
    const historicoVendas = await Venda.find().sort({ data: -1 }).limit(100);
    const fluxoEstoque = await Produto.find({}, 'nome estoque atual estoqueMinimo ritmoSaida');

    // Executa a função integrada à IA
    const insights = await gerarInsightsComerciais(historicoVendas, fluxoEstoque);

    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao compilar insights estratégicos.' });
  }
});

export default router;