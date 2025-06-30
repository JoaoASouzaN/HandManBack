const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

// Rota simples para testar
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando!' });
});

// Rota para usuários
app.get('/usuarios', (req, res) => {
    res.json([{ id: 'usuario001', nome: 'Teste' }]);
});

// Rota para histórico
app.get('/usuarios/historico/:id', (req, res) => {
    const { id } = req.params;
    res.json([
        {
            id_servico: 'servico001',
            id_usuario: id,
            id_fornecedor: 'fornecedor001',
            categoria: 'Limpeza',
            data: new Date(),
            horario: new Date(),
            status: 'pendente',
            valor: 100
        }
    ]);
});

// Rota para serviços do usuário
app.get('/servicos/usuario/:id', (req, res) => {
    const { id } = req.params;
    res.json([
        {
            id_servico: 'servico001',
            id_usuario: id,
            id_fornecedor: 'fornecedor001',
            categoria: 'Limpeza',
            data: new Date(),
            horario: new Date(),
            status: 'pendente',
            valor: 100
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Servidor de teste rodando na porta ${PORT}`);
}); 