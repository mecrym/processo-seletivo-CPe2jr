const botaoNovaTransacao = document.getElementById("nova-transacao");
const modal = document.getElementById("modal-transacao");
const botaoFechar = document.getElementById("modal-fechar");
const formulario = document.getElementById("form-transacao");

// Abrir modal ao clicar no botão
botaoNovaTransacao.addEventListener("click", function () {
    modal.classList.add("ativo");
    document.getElementById("nome").focus(); // foca no 1º campo
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

// Capturar envio do formulário
formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // evita recarregar página

    const descricao = document.getElementById("descricao").value;
    let preco = parseFloat(document.getElementById("preco").value);
    const categoria = document.getElementById("categoria").value;
    const tipo = document.querySelector("input[name='tipo']:checked").value;

    if(tipo === "saida" && preco > 0) {
        preco = preco * -1; // torna o valor negativo para saídas
    }

    console.log("Nova transação:", { descricao, preco, categoria, tipo });
    // Aqui você poderia salvar no backend ou adicionar ao DOM

    const novaTransacao = { 
        id: Date.now(),
        descricao: descricao, 
        preco: preco, 
        categoria: categoria, 
        tipo: tipo,
        data: new Date().toISOString()
    };
    modal.classList.remove("ativo"); // fecha modal
    formulario.reset(); // limpa os campos
});
