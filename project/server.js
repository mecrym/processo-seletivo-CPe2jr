const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve o HTML e CSS

// GET: retornar todas as transações
app.get("/dados", (req, res) => {
    fs.readFile("dados.json", "utf8", (err, data) => {
        if (err) return res.json([]);
        res.json(JSON.parse(data));
    });
});

// POST: adicionar nova transação
app.post("/dados", (req, res) => {
    const novaTransacao = req.body;

    fs.readFile("dados.json", "utf8", (err, data) => {
        let transacoes = [];
        if (!err) transacoes = JSON.parse(data);
        transacoes.push(novaTransacao);

        fs.writeFile("dados.json", JSON.stringify(transacoes, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Erro ao salvar" });
            res.json({ message: "Transação adicionada!" });
        });
    });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
