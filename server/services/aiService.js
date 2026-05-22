import { GoogleGenAI } from "@google/generative-ai";

// Inicializa a API com a chave configurada no seu arquivo .env
const aiKey = process.env.GEMINI_API_KEY;
const aiClient = new GoogleGenAI({ apiKey: aiKey });

export const gerarInsightsComerciais = async (historicoVendas, fluxoEstoque) => {
  try {
    const model = aiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construção do Prompt contextualizado com as regras de negócio do escopo
    const prompt = `
      Você é a inteligência artificial analítica do sistema InsightGestor.
      Com base nos dados fornecidos abaixo, gere um relatório estratégico estritamente em formato JSON para o gestor comercial.

      Dados de Histórico de Vendas:
      ${JSON.stringify(historicoVendas)}

      Dados de Fluxo Atual de Estoque:
      ${JSON.stringify(fluxoEstoque)}

      O JSON de retorno deve seguir exatamente esta estrutura (sem formatações markdown adicionais, retorne apenas o objeto JSON limpo):
      {
        "previsaoDemanda": [
          { "produto": "Nome do Produto", "alerta": "Descrição detalhada do risco de esgotar com base no ritmo de saída." }
        ],
        "comportamentoClientes": [
          { "padrao": "Identificação do padrão observado", "sugestao": "Sugestão prática de promoção ou abordagem direcionada." }
        ]
      }
    `;

    const resultado = await model.generateContent(prompt);
    const respostaTexto = resultado.response.text();
    
    // Converte a string retornada pela IA em um objeto JSON válido
    return JSON.parse(respostaTexto);
  } catch (error) {
    console.error("Erro ao processar insights com a IA:", error);
    throw new Error("Falha ao gerar insights comerciais.");
  }
};