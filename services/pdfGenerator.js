const puppeteer = require('puppeteer');

async function generatePdf(htmlContent) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  await browser.close();
  return pdfBuffer;
}

const renderList = (items, renderItem) => items.map(renderItem).join('');

function getModernoTemplate(data, themeColor = '#8e44ad') {
  return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Currículo - ${data.personalInfo.name}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.6; }
        a { text-decoration: none; color: inherit; }
        .container { border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
        .header { background-color: ${themeColor}; color: white; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 36px; }
        .header p { margin: 5px 0 0; font-size: 16px; }
        .header a { color: white !important; }
        .content { padding: 25px; }
        h2 { font-size: 20px; color: ${themeColor}; border-bottom: 2px solid ${themeColor}; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; }
        .section p { margin: 0 0 10px; }
        .section strong { color: #333; }
        .item { margin-bottom: 15px; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; padding: 10px 0; }
        .skill-tag { background-color: #f0f0f0; color: #333; padding: 5px 12px; border-radius: 15px; font-size: 14px; }
        .date { font-style: italic; color: #555; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.personalInfo.name}</h1>
          <p>${data.personalInfo.email} | ${data.personalInfo.phone}${data.personalInfo.linkedin ? ` | <a href="${data.personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ''}</p>
        </div>
        <div class="content">
          ${data.summary ? `<div class="section"><h2>Resumo Profissional</h2><p>${data.summary}</p></div>` : ''}
          ${data.experience.length > 0 ? `<div class="section"><h2>Experiência Profissional</h2>${renderList(data.experience, exp => `<div class="item"><p><strong>${exp.position}</strong> at ${exp.company}</p><p class="date">${exp.startDate} - ${exp.inProgress ? 'Presente' : exp.endDate}</p><p>${exp.description}</p></div>`)}</div>` : ''}
          ${data.education.length > 0 ? `<div class="section"><h2>Formação Acadêmica</h2>${renderList(data.education, edu => `<div class="item"><p><strong>${edu.course}</strong> - ${edu.institution}</p><p class="date">${edu.startDate} - ${edu.inProgress ? `Presente (Prev. ${edu.projectedEndDate})` : edu.endDate}</p></div>`)}</div>` : ''}
          ${data.skills.length > 0 ? `<div class="section"><h2>Habilidades</h2><div class="skills-list">${renderList(data.skills, skill => `<span class="skill-tag">${skill}</span>`)}</div></div>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}

function getClassicoTemplate(data, themeColor = '#8e44ad') {
  return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Currículo - ${data.personalInfo.name}</title>
      <style>
        body { font-family: 'Georgia', 'Times New Roman', serif; color: #333; font-size: 14px; line-height: 1.6; }
        a { color: ${themeColor}; text-decoration: none; }
        .container { padding: 30px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 36px; font-variant: small-caps; }
        .header p { margin: 5px 0; color: #555; }
        hr { border: 0; border-top: 1px solid #ccc; margin: 20px 0; }
        h2 { font-size: 20px; text-align: center; color: ${themeColor}; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
        .item { margin-bottom: 15px; }
        .item strong { font-size: 16px; }
        .date { font-style: italic; color: #555; }
        .skills-list { text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.personalInfo.name}</h1>
          <p>${data.personalInfo.email} | ${data.personalInfo.phone}${data.personalInfo.linkedin ? ` | <a href="${data.personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ''}</p>
        </div>
        ${data.summary ? `<div class="section"><hr><h2>Resumo Profissional</h2><p>${data.summary}</p></div>` : ''}
        ${data.experience.length > 0 ? `<div class="section"><hr><h2>Experiência Profissional</h2>${renderList(data.experience, exp => `<div class="item"><p><strong>${exp.position}</strong>, ${exp.company}</p><p class="date">${exp.startDate} - ${exp.inProgress ? 'Presente' : exp.endDate}</p><p>${exp.description}</p></div>`)}</div>` : ''}
        ${data.education.length > 0 ? `<div class="section"><hr><h2>Formação Acadêmica</h2>${renderList(data.education, edu => `<div class="item"><p><strong>${edu.course}</strong></p><p>${edu.institution} - ${edu.inProgress ? `(Conclusão Prevista: ${edu.projectedEndDate})` : edu.endDate}</p></div>`)}</div>` : ''}
        ${data.skills.length > 0 ? `<div class="section"><hr><h2>Habilidades</h2><p class="skills-list">${data.skills.join(' &bull; ')}</p></div>` : ''}
      </div>
    </body>
    </html>
  `;
}

function getMinimalistaTemplate(data, themeColor = '#8e44ad') {
  // O template minimalista é em preto e branco por design, então a themeColor não é aplicada aqui.
  // Mantemos o parâmetro para consistência da interface da função.
  const renderList = (items, renderItem) => items.map(renderItem).join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Currículo - ${data.personalInfo.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; color: #222; font-size: 13px; line-height: 1.7; background-color: #fff;}
        a { color: inherit; text-decoration: none; }
        .container { padding: 40px; }
        .name { font-size: 32px; font-weight: 600; text-align: left; margin-bottom: 5px; }
        .contact { font-size: 14px; text-align: left; margin-bottom: 30px; color: #555; }
        h2 { font-size: 16px; font-weight: 600; color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .item { margin-bottom: 20px; }
        .item p { margin: 2px 0; }
        .item-header { display: flex; justify-content: space-between; font-weight: 500; }
        .item-header .position, .item-header .course { font-weight: 600; }
        .item-header .date { font-style: normal; color: #555; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 8px 15px; padding-top: 5px;}
        .skill-tag { font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="name">${data.personalInfo.name}</p>
        <p class="contact">${data.personalInfo.email}${data.personalInfo.phone ? ` &bull; ${data.personalInfo.phone}` : ''}${data.personalInfo.linkedin ? ` &bull; <a href="${data.personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ''}</p>
        
        ${data.summary ? `<div class="section"><h2>Resumo</h2><p>${data.summary}</p></div>` : ''}

        ${data.experience.length > 0 ? `<div class="section"><h2>Experiência</h2>${renderList(data.experience, exp => `
          <div class="item">
            <div class="item-header">
              <span class="position">${exp.position}</span>
              <span class="date">${exp.startDate} - ${exp.inProgress ? 'Presente' : exp.endDate}</span>
            </div>
            <p class="company">${exp.company}</p>
            <p>${exp.description}</p>
          </div>
        `)}</div>` : ''}
        
        ${data.education.length > 0 ? `<div class="section"><h2>Educação</h2>${renderList(data.education, edu => `
          <div class="item">
            <div class="item-header">
               <span class="course">${edu.course}</span>
               <span class="date">${edu.startDate} - ${edu.inProgress ? `(Prev. ${edu.projectedEndDate})` : edu.endDate}</span>
            </div>
            <p>${edu.institution}</p>
          </div>
        `)}</div>` : ''}
        
        ${data.skills.length > 0 ? `<div class="section"><h2>Habilidades</h2><div class="skills-list">${renderList(data.skills, skill => `
          <span class="skill-tag">${skill}</span>
        `)}</div></div>` : ''}
      </div>
    </body>
    </html>
  `;
}

module.exports = { generatePdf, getModernoTemplate, getClassicoTemplate, getMinimalistaTemplate };