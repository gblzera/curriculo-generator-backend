# Backend - Gerador de Currículos

Este é o backend do projeto **Gerador de Currículos**. É uma API construída com Node.js e Express, responsável por receber os dados do currículo em formato JSON, gerar um documento PDF com layout profissional usando Puppeteer e devolvê-lo ao cliente.

## Principais Funcionalidades

-   Geração dinâmica de PDFs a partir de templates HTML.
-   Suporte a múltiplos templates de layout (Moderno, Clássico, Minimalista).
-   Customização da cor primária do currículo via API.
-   Validação de dados de entrada essenciais no servidor.

## Tecnologias Utilizadas

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express.js**: Framework para a construção da API.
-   **Puppeteer**: Biblioteca para controlar o Chrome e gerar PDFs de alta fidelidade.
-   **CORS**: Middleware para permitir requisições de origens diferentes (do nosso frontend).
-   **Jest & Supertest**: Para a execução de testes automatizados da API.

## Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [NPM](https://www.npmjs.com/) (geralmente vem com o Node.js)

## Instalação e Configuração

1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

## Como Executar

Para iniciar o servidor em modo de desenvolvimento (com recarregamento automático a cada alteração), execute:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3001`.

## Como Rodar os Testes

Para executar os testes automatizados da API, rode o seguinte comando:

```bash
npm test
```

## Endpoint da API

### Gerar um Currículo

-   **URL:** `/generate-resume`
-   **Método:** `POST`
-   **Corpo da Requisição (Body):**

```json
{
  "layout": "moderno",
  "themeColor": "#8e44ad",
  "resumeData": {
    "personalInfo": {
      "name": "Nome Completo",
      "email": "email@exemplo.com",
      "phone": "999999999",
      "linkedin": "[https://linkedin.com/in/perfil](https://linkedin.com/in/perfil)"
    },
    "summary": "Resumo profissional...",
    "experience": [
      {
        "company": "Empresa",
        "position": "Cargo",
        "startDate": "Jan/2020",
        "endDate": "Dez/2022",
        "inProgress": false,
        "description": "Descrição das atividades..."
      }
    ],
    "education": [
      {
        "course": "Nome do Curso",
        "institution": "Nome da Instituição",
        "startDate": "Fev/2018",
        "endDate": "Dez/2021",
        "inProgress": false,
        "projectedEndDate": ""
      }
    ],
    "skills": ["React", "Node.js", "Trabalho em Equipe"]
  }
}
```

-   **Resposta de Sucesso:**
    -   **Código:** `200 OK`
    -   **Conteúdo:** O arquivo `curriculo.pdf` para download.
-   **Resposta de Erro:**
    -   **Código:** `400 Bad Request` (se os dados forem inválidos).
    -   **Código:** `500 Internal Server Error` (se ocorrer um erro no servidor).