# 🎯 Monte seu Prompt

Uma aplicação web interativa e gamificada focada no **letramento em Inteligência Artificial**, desenvolvida para exposição na **Feira de Graduação 2026 da UEFS** (Universidade Estadual de Feira de Santana).

## 🎓 Contexto Acadêmico e Objetivo

Este projeto foi desenvolvido sob o escopo da disciplina **EXA085 - Inteligência Artificial Generativa na Educação**. 

A aplicação foi criada para atuar como uma ferramenta de conscientização e educação durante a Feira de Graduação da UEFS 2026, recebendo estudantes do ensino médio e a comunidade externa. O objetivo pedagógico é desmistificar o funcionamento das IAs generativas (como o ChatGPT, Gemini, etc.), ensinando na prática que **a máquina não tem vontade própria; a qualidade da sua resposta depende inteiramente da qualidade da instrução humana (o *prompt*).**

## 📜 Articulação com as Diretrizes do MEC

O projeto foi fundamentado no Capítulo 2 das diretrizes do Ministério da Educação para o uso de IA, explorando ativamente os seguintes pontos:

*   **Oportunidade 6 - Apoio da inteligência artificial à inovação pedagógica e ao desenvolvimento de novas competências:** A dinâmica transforma o participante em criador ativo do resultado, e não num mero espetador. Ao manipular fisicamente os componentes de um comando, o estudante desenvolve uma competência prática (Engenharia de Prompts) transferível para qualquer contexto de uso de IA.
*   **Desafio 5 - Confiabilidade das respostas e prevenção de erros factuais em modelos de inteligência artificial generativa:** A mecânica do jogo demonstra de forma concreta que comandos incompletos ou contraditórios geram propositadamente respostas "alucinadas" e vagas. Isto torna visível um conceito abstrato, educando o utilizador sobre as limitações da IA.
*   **Desafio 6 - Proteção da aprendizagem ativa e da autoria acadêmica frente à automação excessiva:** A ausência de *slots* fixos na área de montagem força o participante a pensar criticamente sobre o que o objetivo exige. O jogo reforça que não existe uma "fórmula automática" e que a autoria do resultado pertence ao ser humano.

## ⚖️ Curadoria e Ética (Próximos Passos)

Como parte do rigor académico e das exigências da disciplina, o produto educacional passará pela avaliação utilizando o **instrumento de curadoria da turma de ética**. Esta etapa de validação encontra-se pendente e será executada antes do evento final para garantir que a aplicação respeita integralmente os princípios éticos do uso de tecnologia no ambiente escolar.

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

## 📦 Como Gerar a Versão de Produção (Offline)

Para compilar o projeto e gerar os ficheiros estáticos que correm nativamente no navegador, sem necessidade de servidor ou internet:

1. Execute o comando de build:
```bash
npm run build

```

2. O Vite criará uma pasta chamada `dist/` na raiz do projeto.
3. Basta copiar o conteúdo desta pasta para uma *pen drive* ou qualquer computador e dar um duplo clique no ficheiro `index.html`.


## 👥 Equipe de Desenvolvimento

Projeto construído colaborativamente pelos estudantes:

* **Ítallo Guimarães**

* **Levi Vasconcelos**

* **Davi Oliveira**

* **Guilherme Lima**

* **Sinval Victor Mota**
