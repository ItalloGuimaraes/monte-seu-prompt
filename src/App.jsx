import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Card } from './components/Card';
import { DropZone } from './components/DropZone';
import dbData from './db_prompt.json';
import './App.css';

// Funções utilitárias para o design da Tela 4
const getClasseResultado = (selo) => {
  if (!selo) return '';
  if (selo.includes('incompleto') || selo.includes('não reconhecida')) return 'resultado-incompleto';
  if (selo.includes('Quase')) return 'resultado-quase';
  if (selo.includes('Mestre')) return 'resultado-mestre';
  if (selo.includes('Alucinação')) return 'resultado-alucinacao';
  return 'resultado-incompleto';
};

const extrairSelo = (textoSelo) => {
  if (textoSelo.includes('Alucinação')) return { emoji: '🤖💥', texto: 'Alucinação!' };
  if (textoSelo.includes('incompleto')) return { emoji: '⚠️', texto: 'Prompt incompleto' };
  if (textoSelo.includes('Quase')) return { emoji: '🟡', texto: 'Quase lá' };
  if (textoSelo.includes('Mestre')) return { emoji: '🏆', texto: 'Prompt Nível Mestre' };
  return { emoji: '❓', texto: 'Combinação Desconhecida' };
};

function App() {
  const [telaAtual, setTelaAtual] = useState(1);
  const [missao, setMissao] = useState(null);
  const [cartasBaralho, setCartasBaralho] = useState([]);
  const [cartasMontagem, setCartasMontagem] = useState([]);
  const [resultado, setResultado] = useState(null);

  // === Lógica de Jogo (Sortear, Arrastar, Gerar) ===
// === TELA 2: Lógica de Sortear Missão ===
  const sortearMissao = () => {
    // 1. Sorteia a missão
    const chavesMissoes = Object.keys(dbData.missoes);
    const chaveSorteada = chavesMissoes[Math.floor(Math.random() * chavesMissoes.length)];
    const missaoEscolhida = dbData.missoes[chaveSorteada];

    // 2. Separa os IDs obrigatórios para as combinações dessa missão
    const idsNecessarios = new Set();
    Object.keys(missaoEscolhida.combinacoes).forEach(combo => {
      if (combo !== 'combinacao_padrao') {
        combo.split('+').forEach(id => idsNecessarios.add(id));
      }
    });

    // 3. NOVO: Agrupa todas as cartas do banco por categoria
    const cartasPorCategoria = { papel: [], tarefa: [], contexto: [], formato: [] };
    Object.entries(dbData.cartas).forEach(([id, dados]) => {
      cartasPorCategoria[dados.categoria].push(id);
    });

    // 4. NOVO: Força o baralho a ter pelo menos 3 cartas de CADA categoria
    ['papel', 'tarefa', 'contexto', 'formato'].forEach(cat => {
      // Conta quantas cartas dessa cor já foram adicionadas
      let contagemNaMesa = Array.from(idsNecessarios).filter(id => dbData.cartas[id].categoria === cat).length;

      // Enquanto não tiver 3 cartas dessa cor, puxa mais uma aleatória da mesma cor
      while (contagemNaMesa < 3) {
        const candidatas = cartasPorCategoria[cat].filter(id => !idsNecessarios.has(id));
        if (candidatas.length > 0) {
          const idSorteado = candidatas[Math.floor(Math.random() * candidatas.length)];
          idsNecessarios.add(idSorteado);
          contagemNaMesa++;
        } else {
          break; // Segurança: sai do loop se esgotarem as cartas dessa categoria
        }
      }
    });

    // 5. Preenche com aleatórias caso a regra acima não tenha dado 12 cartas no total
    const todosIdsCartas = Object.keys(dbData.cartas);
    while (idsNecessarios.size < 12) {
      const idAleatorio = todosIdsCartas[Math.floor(Math.random() * todosIdsCartas.length)];
      idsNecessarios.add(idAleatorio);
    }

    // 6. Transforma os IDs nos objetos das cartas e embaralha tudo na tela
    const baralhoMontado = Array.from(idsNecessarios)
      .map(id => ({ id, ...dbData.cartas[id] }))
      .sort(() => Math.random() - 0.5);

    setMissao(missaoEscolhida);
    setCartasBaralho(baralhoMontado);
    setCartasMontagem([]); // Limpa a mesa
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Se soltou a carta na DropZone
    if (over && over.id === 'area-de-montagem') {
      const cartaArrastada = cartasBaralho.find(c => c.id === active.id);
      
      if (cartaArrastada) {
        // Cria um clone da carta com um ID de instância único
        const cartaClone = { ...cartaArrastada, instanceId: Date.now() + Math.random() };
        
        // Adiciona o clone na mesa, mas NÃO remove a original do baralho
        setCartasMontagem([...cartasMontagem, cartaClone]);
      }
    }
  };

  const removerDaMontagem = (cartaClicada) => {
    // Remove apenas a instância exata que foi clicada na mesa
    setCartasMontagem(cartasMontagem.filter(c => c.instanceId !== cartaClicada.instanceId));
  };

 // === TELA 4: Lógica de Avaliar o Prompt ===
  const gerarResposta = () => {
    // 1. Tenta achar a combinação exata mapeada no JSON
    const idsArrastados = cartasMontagem.map(c => c.id);
    const chaveMontada = idsArrastados.sort().join('+');
    let respostaFinal = missao.combinacoes[chaveMontada];

    if (respostaFinal) {
      setResultado(respostaFinal);
      setTelaAtual(4);
      return;
    }

    // 2. AVALIAÇÃO DINÂMICA DAS REGRAS
    const totalCartas = cartasMontagem.length;
    const categorias = cartasMontagem.map(c => c.categoria);
    const temConflito = new Set(categorias).size !== categorias.length;

    // Descobre qual é a carta de Tarefa correta para esta missão lendo o JSON
    let idTarefaCorreta = null;
    Object.keys(missao.combinacoes).forEach(chave => {
      chave.split('+').forEach(id => {
        if (id.startsWith('tarefa_')) idTarefaCorreta = id;
      });
    });

    // Verifica se o aluno colocou a tarefa certa na mesa
    const acertouTema = cartasMontagem.some(c => c.id === idTarefaCorreta);

    if (totalCartas === 0) {
      respostaFinal = {
        selo: "⚠️ Prompt incompleto",
        resposta: "Você clicou em gerar sem colocar nenhuma carta na mesa! A IA ficou apenas piscando o cursor na tela, esperando suas instruções."
      };
    } else if (totalCartas === 1) {
      respostaFinal = {
        selo: "⚠️ Prompt incompleto",
        resposta: `Você colocou apenas uma instrução. A IA até tentou responder, mas o texto gerado foi super genérico porque faltou o tema, contexto, tom de voz ou um formato.`
      };
    } else if (temConflito || totalCartas > 5 || !acertouTema) {
      // ALUCINAÇÃO: Conflito de cores, excesso de cartas, ou ERROU O TEMA!
      respostaFinal = missao.combinacoes['combinacao_padrao'];
    } else {
      // QUASE LÁ: 2 a 4 cartas, sem conflito, e ACERTOU o tema da missão.
      respostaFinal = {
        selo: "🟡 Quase lá",
        resposta: "A sua combinação fez sentido e a IA gerou um texto razoável. Mas como faltaram peças complementares ou você usou cartas que não combinavam 100% com o objetivo, a resposta não atingiu seu potencial máximo!"
      };
    }

    setResultado(respostaFinal);
    setTelaAtual(4);
  };
  
  // Variáveis visuais exclusivas para a Tela 4
  const classeCorDeFundo = telaAtual === 4 && resultado ? getClasseResultado(resultado.selo) : '';
  const seloVisual = resultado ? extrairSelo(resultado.selo) : null;

  return (
    <div className={`app-wrapper ${classeCorDeFundo}`}>
      <div className="app-container">
        
        {/* TELA 1: INTRODUÇÃO */}
        {telaAtual === 1 && (
          <div className="tela">
            <div className="topbar">
              <div className="branding">
                <span>Monte</span> <span>seu</span> <span>Prompt</span>
              </div>
            </div>

            <h1 className="titulo-intro">
              Você é o engenheiro!
              <span className="destaque-laranja">A IA só obedece!</span>
            </h1>
            
            <p className="intro-subtitulo">
              Monte um pedido pra uma inteligência artificial arrastando cartas de 4 categorias.<br />    
              Escolha bem - a qualidade da resposta depende somente de você!
            </p>

            <div className="categorias-grid">
              <div className="cat-intro bg-papel">
                <span className="emoji">🎭</span>
                <p className="titulo-cat">PAPEL</p>
                <p className="pergunta">Quem a IA deve ser?</p>
              </div>
              <div className="cat-intro bg-tarefa">
                <span className="emoji">🎯</span>
                <p className="titulo-cat">TAREFA</p>
                <p className="pergunta">O que ela deve fazer?</p>
              </div>
              <div className="cat-intro bg-contexto">
                <span className="emoji">🔍</span>
                <p className="titulo-cat">CONTEXTO</p>
                <p className="pergunta">Para quem, com que detalhe?</p>
              </div>
              <div className="cat-intro bg-formato">
                <span className="emoji">📋</span>
                <p className="titulo-cat">FORMATO</p>
                <p className="pergunta">Como a resposta deve parecer?</p>
              </div>
            </div>

            <div className="exemplos-grid">
              <div className="exemplo-card fraco">
                <div className="exemplo-titulo">⚠️ PROMPT FRACO</div>
                <p>"Explique a fotossíntese."</p>
                <p>A IA chuta um nível, um tom e um formato - o resultado pode não servir pra ninguém.</p>
              </div>
              <div className="exemplo-card completo">
                <div className="exemplo-titulo">🏆 PROMPT COMPLETO</div>
                <p>"Como um professor animado, explique a fotossíntese para uma criança de 8 anos, em lista com emojis."</p>
                <p>Papel + Tarefa + Contexto + Formato = Resposta sob medida.</p>
              </div>
            </div>

            <button className="btn btn-grande" onClick={() => setTelaAtual(2)}>Começar</button>
          </div>
        )}

        {/* TELA 2: MISSÃO */}
        {telaAtual === 2 && (
          <div className="tela">
            <p className="subtitulo">SUA MISSÃO NESTA RODADA:</p>
            
            <div className="caixa-missao" style={{ 
              color: missao ? 'var(--texto-principal)' : '#C7C7CA', 
              fontWeight: missao ? '900' : 'normal' 
            }}>
              {missao ? missao.objetivo : "Clique no botão abaixo para descobrir seu objetivo."}
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button 
                className="btn" 
                onClick={sortearMissao}
                style={missao ? { backgroundColor: 'transparent', color: 'var(--texto-principal)', border: '2px solid #DADADC' } : {}}
              >
                🎲 {missao ? 'Sortear Outra Missão' : 'Sortear Missão'}
              </button>
              
              {missao && (
                <button className="btn" onClick={() => setTelaAtual(3)}>
                  Ir para montagem →
                </button>
              )}
            </div>
          </div>
        )}

        {/* TELA 3: MONTAGEM */}
        {telaAtual === 3 && (
          <div className="tela tela-montagem">
            <h2>🎯 {missao.objetivo}</h2>
            
            <DndContext onDragEnd={handleDragEnd}>
              <div className="baralho">
                {cartasBaralho.map(carta => (
                  <Card key={carta.id} {...carta} />
                ))}
              </div>

              <DropZone>
                {cartasMontagem.length === 0 && (
                  <p style={{ margin: 'auto', color: '#C7C7CA' }}>
                    Arraste as cartas aqui para montar o seu prompt...
                  </p>
                )}
                {cartasMontagem.map(carta => (
                <Card 
                  key={carta.instanceId} // Usando o ID único da cópia
                  {...carta} 
                  isMini={true} 
                  onRemove={() => removerDaMontagem(carta)} 
                />
              ))}
              </DropZone>
            </DndContext>

            <div className="preview-box">
              <span className="rotulo">Preview do Prompt:</span>
              <span>
                {cartasMontagem.length > 0 
                  ? cartasMontagem.map(c => c.titulo).join('. ') + '.'
                  : 'Seu texto aparecerá aqui conforme você arrasta as cartas.'}
              </span>
            </div>

            <button className="btn" onClick={gerarResposta}>✨ Gerar Resposta da IA</button>
          </div>
        )}

        {/* TELA 4: RESULTADO PADRONIZADO */}
        {telaAtual === 4 && (
          <div className="tela tela-resultado">
            
            <div className="selo-box">
              <span className="emoji">{seloVisual.emoji}</span>
              <span className="texto">{seloVisual.texto}</span>
            </div>
            
            <div className="balao-ia">
              {resultado.resposta}
            </div>
            
            <p className="subtitulo" style={{ marginTop: '10px', color: '#2D2D2D', fontWeight: 'bold' }}>
              Lembre-se: quem decidiu o resultado foi você, a IA só executou o que foi pedido!
            </p>
            
            <button className="btn" onClick={() => {
              setResultado(null);
              setMissao(null);
              setTelaAtual(1);
            }}>🔁 Jogar Novamente</button>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;