const botaoNovaTransacao = document.getElementById("nova-transacao");
const modal = document.getElementById("modal-transacao");
const botaoFechar = document.getElementById("modal-fechar");
const formulario = document.getElementById("form-transacao");

// Abrir modal ao clicar no botão
botaoNovaTransacao.addEventListener("click", function () {
    modal.classList.add("ativo");
    document.getElementById("descricao").focus();
});

// Fechar modal ao clicar no X
botaoFechar.addEventListener("click", function () {
    modal.classList.remove("ativo");
});

// Fechar modal ao clicar fora do conteúdo
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.classList.remove("ativo");
    }
});

// Fechar modal com ESC
window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        modal.classList.remove("ativo");
    }
});

function calcularSomaEntradas() {
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    
    let soma = 0;

    for (let i = 0; i < transacoes.length; i++) {
        if (transacoes[i].tipo === "entrada") {
            soma = soma + transacoes[i].preco;
        }
    }
    console.log("Soma das entradas:", soma);
    return soma;
}

function calcularSomaSaidas(){
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    
    let soma = 0;

    for(let i = 0; i < transacoes.length; i++){
        if (transacoes[i].tipo === "saida") {
            soma = soma + transacoes[i].preco;
        }
    }
    console.log("Soma das entradas:", soma);
    return soma;
}

function calcularTotalEntradaSaida( totalEntradas, totalSaidas ){
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    let soma = totalEntradas + totalSaidas;//aq tem q ser mais pq totalSaidas já é negativo, se for menos fica ( - - = +)

    console.log("Balanço total: ", soma);
    return soma;
}

// Capturar envio do formulário
formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // evita recarregar página

    const descricao = document.getElementById("descricao").value;
    let preco = parseFloat(document.getElementById("preco").value);
    const categoria = document.getElementById("categoria").value;
    const tipo = document.querySelector("input[name='tipo']:checked").value;

    if (tipo === "saida" && preco > 0) {
        preco = preco * -1; // deixa o valor das saídas negativo
    }

    console.log("Nova transação:", { descricao, preco, categoria, tipo });

    const novaTransacao = {
        id: Date.now(),
        descricao: descricao,
        preco: preco,
        categoria: categoria,
        tipo: tipo,
        data: new Date().toISOString()
    };

    //salvando no localStorage
    let transacoes = [];

    const dadosLocal = localStorage.getItem("transacoes");

    if (dadosLocal) {
        transacoes = JSON.parse(dadosLocal);
    }

    transacoes.push(novaTransacao);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
    console.log("Objeto salvo no localStorage:", novaTransacao);

    modal.classList.remove("ativo"); // fecha modal
    formulario.reset(); // limpa os campos
});

function numTotalTransacoes(){
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    
    let total = transacoes.length;

    const elementoTotal = document.getElementById("soma-num-total-transacoes");
    elementoTotal.innerHTML = `${total} itens`;
}

const totalEntradas = calcularSomaEntradas();
const totalSaidas = calcularSomaSaidas();
const balancoTotal = calcularTotalEntradaSaida(totalEntradas, totalSaidas);

cardTotal(totalEntradas, totalSaidas, balancoTotal);
gerarListaTransacoes();
numTotalTransacoes ();


//função para atualizar os valores dos cards que mostram os totais
function cardTotal(totalEntradas, totalSaidas, balancoTotal){
    totalSaidas = totalSaidas * -1; //pra garantir q o valor apresntado vai estar igual ao figma
    const entradas = document.getElementById("total-entradas");
    const saidas = document.getElementById("total-saidas");
    const balanco = document.getElementById("valor-balanco-total");

    entradas.innerHTML = totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    saidas.innerHTML = totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    balanco.innerHTML = balancoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/*coloque a função da busca aq depois de fazer os cards!! */

//função para gerar a lista de transações
function gerarListaTransacoes() {
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    const container = document.getElementById("lista-transacoes");

    console.log("container lista-transacoes:", container);
    if (!container) {
        console.error('ERRO: elemento com id "lista-transacoes" não encontrado no HTML.');
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < transacoes.length; i++) {
        const transacao = transacoes[i];

        const transacaoItem = document.createElement("div");
        transacaoItem.classList.add("transacoes-card", "card");

        let precoClasse;
        if (transacao.preco >= 0) {
            precoClasse = "preco-positivo";
        } else {
            precoClasse = "preco-negativo";
        }

        // monta o HTML do card — repare no <div class="categoria-data"> incluído
        transacaoItem.innerHTML = `
            <p class="dados-transacoes">${transacao.descricao}</p>
            <p class="dados-transacao preco-transacao ${precoClasse}">
                ${transacao.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <div class="categoria-data">
                <p class="dados-transacoes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7294 3.00002C11.8957 2.99894 12.0596 3.03963 12.2061 3.11836C12.3524 3.19694 12.4766 3.31089 12.5674 3.44979L15.416 7.72267C15.528 7.89062 15.528 8.10942 15.416 8.27737L12.5674 12.5503C12.4766 12.6892 12.3524 12.8031 12.2061 12.8817C12.0596 12.9604 11.8957 13.0011 11.7293 13H2.5C2.23478 13 1.98043 12.8947 1.79289 12.7071C1.60536 12.5196 1.5 12.2652 1.5 12V4.00002C1.5 3.7348 1.60536 3.48045 1.79289 3.29291C1.98043 3.10538 2.23478 3.00002 2.5 3.00002H11.7294ZM12.15 12.275L11.734 11.9977L14.3991 8.00002L11.7324 4.00003L11.7312 4.00004L2.5 4.00002L2.5 12H11.7358C11.7351 12 11.7343 12.0002 11.7336 12.0004C11.7333 12.0005 11.7331 12.0007 11.7328 12.0008C11.7322 12.0011 11.7317 12.0015 11.7312 12.002C11.731 12.0023 11.7308 12.0026 11.7305 12.0029L12.15 12.275Z" fill="white"/>
                </svg>
                ${transacao.categoria}</p>
                <p class="dados-transacoes">${new Date(transacao.data).toLocaleDateString('pt-BR')}</p>
            </div>
        `;

        // debug: verifique o HTML do item antes de anexar
        console.log("transacaoItem.innerHTML:", transacaoItem.innerHTML);

        // anexa o novo card ao container
        container.appendChild(transacaoItem);
    }
}

// Seleciona os elementos do HTML
const inputBusca = document.getElementById("busca");
const botaoBusca = document.getElementById("botao-busca");

// Adiciona o evento de clique no botão de busca
botaoBusca.addEventListener("click", function(event) {
    event.preventDefault();

    const termo = inputBusca.value.toLowerCase();
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    const resultados = transacoes.filter(function(transacao) {
        const descricaoMinuscula = transacao.descricao.toLowerCase();
        const contemTermo = descricaoMinuscula.includes(termo);
        
        return contemTermo;
    });

    atualizarListaResultados(resultados);
});

// Função que atualiza a lista de transações exibidas
function atualizarListaResultados(transacoesFiltradas) {
    const container = document.getElementById("lista-transacoes");
    container.innerHTML = "";

    transacoesFiltradas.forEach(transacao => {
        let precoClasse = transacao.preco >= 0 ? "preco-positivo" : "preco-negativo";

        const transacaoItem = document.createElement("div");
        transacaoItem.classList.add("transacoes-card");

        transacaoItem.innerHTML = `
            <p class="dados-transacoes">${transacao.descricao}</p>
            <p class="dados-transacoes ${precoClasse}">
                ${transacao.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <div class="categoria-data">
                <p class="dados-transacoes">${transacao.categoria}</p>
                <p class="dados-transacoes">${new Date(transacao.data).toLocaleDateString('pt-BR')}</p>
            </div>
        `;

        container.appendChild(transacaoItem);
    });
}






