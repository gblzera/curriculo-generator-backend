const express = require('express');
const cors = require('cors');
const { generatePdf, getModernoTemplate, getClassicoTemplate, getMinimalistaTemplate } = require('./services/pdfGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURAÇÃO DO CORS (VERSÃO SIMPLIFICADA E ESTÁVEL) ---
// Define explicitamente a URL do seu frontend como a origem permitida.
const corsOptions = {
  origin: 'https://curriculo-generator-two.vercel.app'
};

// Usa o middleware do CORS com as opções que definimos.
// O próprio middleware 'cors' já lida com as requisições pre-flight (OPTIONS) automaticamente.
app.use(cors(corsOptions));
// -----------------------------------------------------------

app.use(express.json({ limit: '5mb' }));

app.get('/', (req, res) => {
  res.send('Backend do Gerador de Currículos está no ar e pronto!');
});

app.post('/generate-resume', async (req, res) => {
  try {
    const { layout, resumeData, themeColor } = req.body;

    if (!resumeData || !layout) {
      return res.status(400).json({ message: 'Dados do currículo ou layout ausentes.' });
    }
    if (!resumeData.personalInfo || !resumeData.personalInfo.name) {
      return res.status(400).json({ message: 'O nome é um campo obrigatório.' });
    }
    if (!resumeData.personalInfo.email) {
      return res.status(400).json({ message: 'O e-mail é um campo obrigatório.' });
    }

    let html;
    switch (layout) {
      case 'moderno':
        html = getModernoTemplate(resumeData, themeColor);
        break;
      case 'classico':
        html = getClassicoTemplate(resumeData, themeColor);
        break;
      case 'minimalista':
        html = getMinimalistaTemplate(resumeData, themeColor);
        break;
      default:
        html = getModernoTemplate(resumeData, themeColor);
    }
    
    const pdfBuffer = await generatePdf(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=curriculo.pdf');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao gerar o PDF.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});