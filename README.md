# 🎯 Monte seu Prompt

Uma aplicação web interativa e gamificada focada no **letramento em Inteligência Artificial**, desenvolvida para exposição na **Feira de Graduação 2026 da UEFS** (Universidade Estadual de Feira de Santana).

## 🎓 Contexto Acadêmico e Objetivo

Este projeto foi desenvolvido sob o escopo da disciplina **EXA085 - Inteligência Artificial Generativa na Educação**. 

A aplicação foi criada para atuar como uma ferramenta de conscientização e educação durante a Feira de Graduação da UEFS 2026, recebendo estudantes do ensino médio e a comunidade externa. O objetivo pedagógico é desmistificar o funcionamento das IAs generativas (como o ChatGPT, Gemini, etc.), ensinando na prática que **a máquina não tem vontade própria; a qualidade da sua resposta depende inteiramente da qualidade da instrução humana (o *prompt*).**

## 🎮 Como Funciona o Jogo?

O usuário assume a cadeira de um "Engenheiro de Prompt". Ao receber uma missão (ex: Explicar a Fotossíntese), ele deve construir o pedido perfeito utilizando uma mecânica de *Drag and Drop* (arrastar e soltar) com cartas divididas em 4 categorias essenciais:

*   🎭 **Papel:** Quem a IA deve assumir ser? (ex: Professor animado, Pirata)
*   🎯 **Tarefa:** O que ela deve fazer de fato? (ex: Explicar a gravidade)
*   🔍 **Contexto:** Para quem e com qual nível de detalhe? (ex: Para uma criança de 5 anos)
*   📋 **Formato:** Como a resposta deve ser estruturada? (ex: Em lista com emojis)

**Sistema de Avaliação:**
A aplicação avalia as cartas arrastadas em tempo real. Combinações perfeitas recebem o selo **🏆 Nível Mestre**. Omissões geram **⚠️ Prompts Incompletos**, enquanto o excesso de cartas conflitantes causa um curto-circuito no sistema, gerando uma **🤖💥 Alucinação**, demonstrando visualmente como a IA se perde com instruções ruins.

## 🤖 Declaração de Uso de Inteligência Artificial

Alinhado às diretrizes da disciplina EXA085, que fomenta o estudo e a aplicação prática da IA Generativa na Educação, declaramos o uso ativo de Modelos de Linguagem de Grande Escala (LLMs) durante o ciclo de desenvolvimento deste software. 

A IA foi utilizada como uma ferramenta de **assistência ao desenvolvimento (pair programming)** para:
1. Estruturação da lógica base do React e da mecânica de física de *drag-and-drop* (`@dnd-kit`).
2. Geração e expansão criativa do banco de dados de missões, combinações e textos de "alucinações" (`db_prompt.json`).
3. Refinamentos de estilização CSS e arquitetura do código.

Toda a arquitetura lógica, regras de negócio pedagógicas, revisão de código e tomada de decisões visuais foram guiadas, validadas e testadas ativamente pela equipe de desenvolvedores humanos. Este projeto serve como um caso de sucesso de como a colaboração humano-IA pode acelerar a criação de tecnologias educacionais.

## 🛠️ Tecnologias Utilizadas

*   **React (via Vite):** Para uma interface componentizada e renderização ultrarrápida.
*   **@dnd-kit/core:** Biblioteca moderna para gerenciamento fluido de interações de arrastar e soltar.
*   **CSS3 Nativo:** Estilização baseada em variáveis CSS e flex/grid layouts.
*   **Arquitetura Offline-First:** O motor de avaliação roda via um banco de dados JSON local, dispensando o uso de APIs externas ou internet, garantindo estabilidade durante a exposição na Feira.

## 🚀 Como Executar Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1. Clone este repositório:
```bash
git clone https://github.com/ItalloGuimaraes/monte-seu-prompt.git

```

2. Acesse a pasta do projeto:
```bash
cd monte-seu-prompt

```


3. Instale as dependências:
```bash
npm install

```


4. Inicie o servidor de desenvolvimento:
```bash
npm run dev

```



## 👥 Equipe de Desenvolvimento

Projeto construído colaborativamente pelos estudantes:

* **Davi Oliveira**
* **Guilherme Lima**
* **Ítallo Guimarães**
* **Levi Vasconcelos**
* **Sinval Victor Mota**
