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

  // === TELA 2: Lógica de Sortear Missão (Otimizada com Distratores Automáticos) ===
  const sortearMissao = () => {
    const chavesMissoes = Object.keys(dbData.missoes);
    const chaveSorteada = chavesMissoes[Math.floor(Math.random() * chavesMissoes.length)];
    const missaoEscolhida = dbData.missoes[chaveSorteada];

    // 1. Pega as cartas base definidas no JSON para esta missão
    const idsNoBaralho = new Set(missaoEscolhida.cartas_do_baralho);

    // 2. Busca todas as tarefas disponíveis no banco inteiro
    const todasAsTarefas = Object.keys(dbData.cartas).filter(id => dbData.cartas[id].categoria === 'tarefa');

    // 3. Sorteia tarefas distratoras até termos 3 cartas verdes (Tarefa) no baralho
    let tarefasNoBaralho = missaoEscolhida.cartas_do_baralho.filter(id => dbData.cartas[id].categoria === 'tarefa').length;
    
    while (tarefasNoBaralho < 3) {
      const tarefaAleatoria = todasAsTarefas[Math.floor(Math.random() * todasAsTarefas.length)];
      if (!idsNoBaralho.has(tarefaAleatoria)) {
        idsNoBaralho.add(tarefaAleatoria);
        tarefasNoBaralho++;
      }
    }

    // 4. Transforma os IDs nos objetos das cartas e embaralha
    const baralhoMontado = Array.from(idsNoBaralho)
      .map(id => ({ id, ...dbData.cartas[id] }))
      .sort(() => Math.random() - 0.5);

    setMissao(missaoEscolhida);
    setCartasBaralho(baralhoMontado);
    setCartasMontagem([]); // Limpa a mesa
  };

  // === MOTOR DE RENDERIZAÇÃO: Monta o texto como um quebra-cabeça ===
  const montarTextoDinamico = (missaoAtual, papel, contexto, formato) => {
    const ab = papel.estilo.abertura;
    const ass = papel.estilo.assinatura;
    const nota = contexto.estilo.nota;
    const cont = missaoAtual.conteudo;

    let miolo = "";
    // Se o contexto pedir texto curto, cortamos os passos para o limite de 3
    const passosFormatados = contexto.estilo.modo === 'curto' ? cont.passos.slice(0, 3) : cont.passos;

    if (formato.id.includes('lista') || formato.id.includes('receita') || formato.id.includes('bula')) {
      miolo = passosFormatados.map(p => `• ${p}`).join('\n');
    } else if (formato.id.includes('tuite') || formato.id.includes('tiktok') || contexto.estilo.modo === 'curto') {
      miolo = `${cont.curto} ${cont.hashtag}`;
    } else if (formato.id.includes('cordel') || formato.id.includes('musica')) {
      miolo = cont.verso;
    } else if (formato.id.includes('meme') || formato.id.includes('standup') || formato.id.includes('codigo')) {
      miolo = cont.humor;
    } else {
      miolo = passosFormatados.join(' '); 
    }

    // Junta tudo: Abertura + Nota de Contexto + Miolo + Assinatura
    return `${ab}\n${nota}\n\n${miolo}\n\n${ass}`;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && over.id === 'area-de-montagem') {
      const cartaArrastada = cartasBaralho.find(c => c.id === active.id);
      if (cartaArrastada) {
        const cartaClone = { ...cartaArrastada, instanceId: Date.now() + Math.random() };
        setCartasMontagem([...cartasMontagem, cartaClone]);
      }
    }
  };

  const removerDaMontagem = (cartaClicada) => {
    setCartasMontagem(cartasMontagem.filter(c => c.instanceId !== cartaClicada.instanceId));
  };

  // === TELA 4: Lógica de Avaliar o Prompt ===
  const gerarResposta = () => {
    const idsArrastados = cartasMontagem.map(c => c.id).sort();
    const chaveMontada = idsArrastados.join('+');
    const totalCartas = cartasMontagem.length;
    const categorias = cartasMontagem.map(c => c.categoria);
    const categoriasUnicas = new Set(categorias);
    const temConflitoCategoria = categoriasUnicas.size !== totalCartas;

    let respostaFinal = null;

    // 1. COMBINAÇÕES CURADAS (Exceções e Easter Eggs)
    if (missao.combinacoes_curadas && missao.combinacoes_curadas[chaveMontada]) {
      setResultado(missao.combinacoes_curadas[chaveMontada]);
      setTelaAtual(4);
      return;
    }

    // 2. REGRAS DE FALHA GRAVE
    if (totalCartas === 0) {
      setResultado({
        selo: "⚠️ Prompt incompleto",
        resposta: "Você clicou em gerar sem colocar nenhuma carta na mesa! A IA ficou apenas piscando o cursor na tela, esperando suas instruções."
      });
      setTelaAtual(4);
      return;
    }

    const acertouTema = cartasMontagem.some(c => c.id === missao.tarefa);

    if (!acertouTema) {
      respostaFinal = {
        selo: "⚠️ Prompt incompleto",
        resposta: "Você esqueceu de colocar a carta de TAREFA certa! A IA assumiu a persona, preparou o formato, mas ficou te olhando sem saber O QUE era para explicar."
      };
    } else if (temConflitoCategoria) {
      const repetidas = categorias.filter((item, index) => categorias.indexOf(item) !== index);
      respostaFinal = {
        selo: "🤖💥 Alucinação!",
        resposta: `Você colocou duas cartas de ${repetidas[0].toUpperCase()} ao mesmo tempo! A IA tentou fundir as duas instruções e entrou em curto-circuito.`
      };
    } else if (totalCartas >= 7) {
      respostaFinal = missao.combinacoes_curadas['combinacao_padrao'];
    }

    if (respostaFinal) {
      setResultado(respostaFinal);
      setTelaAtual(4);
      return;
    }

    // 3. AVALIAÇÃO DE MESTRE VS QUASE LÁ
    const papelCard = cartasMontagem.find(c => c.categoria === 'papel');
    const contextoCard = cartasMontagem.find(c => c.categoria === 'contexto');
    const formatoCard = cartasMontagem.find(c => c.categoria === 'formato');

    if (!papelCard || !contextoCard || !formatoCard) {
      const faltantes = ['papel', 'contexto', 'formato'].filter(cat => !categoriasUnicas.has(cat));
      
      // FALLBACK: Se o JSON não tiver a chave, usa uma string genérica para não quebrar o .replace()
      const textoBase = missao.resposta_quase_generica || "A IA gerou a resposta, mas o resultado ficou genérico. [+ nota automática do que faltou: papel/contexto/formato]";
      
      respostaFinal = {
        selo: "🟡 Quase lá",
        resposta: textoBase.replace(
          '[+ nota automática do que faltou: papel/contexto/formato]', 
          `\n\n💡 Dica: Para extrair o melhor da IA, nunca esqueça de definir a carta de ${faltantes.join(' e ')}.`
        )
      };
    } else {
      const papelAceito = missao.cartas_aceitas.papel.includes(papelCard.id);
      const contextoAceito = missao.cartas_aceitas.contexto.includes(contextoCard.id);
      const formatoAceito = missao.cartas_aceitas.formato.includes(formatoCard.id);

      if (papelAceito && contextoAceito && formatoAceito) {
        respostaFinal = {
          selo: "🏆 Prompt Nível Mestre",
          resposta: montarTextoDinamico(missao, papelCard, contextoCard, formatoCard)
        };
      } else {
        let destoou = [];
        if (!papelAceito) destoou.push('o Papel');
        if (!contextoAceito) destoou.push('o Contexto');
        if (!formatoAceito) destoou.push('o Formato');

        respostaFinal = {
          selo: "🟡 Quase lá",
          resposta: `A IA gerou a resposta, mas o resultado ficou um pouco esquisito.\n\n💡 Dica: ${destoou.join(' e ')} que você escolheu não combina muito bem com esta missão específica. Tente trocar essa carta!`
        };
      }
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
                  key={carta.instanceId} 
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
              {/* Utilizando whiteSpace pre-wrap para renderizar as quebras de linha dinâmicas \n */}
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {resultado.resposta}
              </div>
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

        {/* RODAPÉ GLOBAL */}
        <footer className="app-footer">
          <p><strong>Feira de Graduação UEFS 2026</strong> | Disciplina: EXA085 - Inteligência Artificial Generativa na Educação</p>
          <p><strong>Desenvolvedores:</strong> Ítallo Guimarães, Levi Vasconcelos, Davi Oliveira, Guilherme Lima e Sinval Victor Mota</p>
          <p className="ai-declaration">🤖 Aplicação desenvolvida com o auxílio de IA Generativa (Pair Programming) para fins educacionais.</p>
        </footer>

      </div>
    </div>
  );
}

export default App;