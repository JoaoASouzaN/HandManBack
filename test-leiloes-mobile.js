const axios = require('axios');

const API_URL = 'http://localhost:3004';

async function testarLeiloesMobile() {
    console.log('🧪 Testando endpoint de leilões do mobile...\n');

    try {
        console.log('1️⃣ Testando GET /leiloes (endpoint usado pelo mobile)...');
        const response = await axios.get(`${API_URL}/leiloes`);
        
        console.log('✅ Resposta recebida!');
        console.log('Status:', response.status);
        console.log('Quantidade de leilões:', response.data.length);
        console.log('Leilões:', response.data.map(l => ({ id: l.id, titulo: l.titulo })));
        console.log('');
        
    } catch (error) {
        console.log('❌ Erro ao buscar leilões:', error.response?.data || error.message);
        console.log('💡 Certifique-se de que o servidor está rodando na porta 3004');
        console.log('');
    }

    try {
        console.log('2️⃣ Testando GET /leiloes/ativos (endpoint usado pelo web)...');
        const response = await axios.get(`${API_URL}/leiloes/ativos`);
        
        console.log('✅ Resposta recebida!');
        console.log('Status:', response.status);
        console.log('Quantidade de leilões ativos:', response.data.length);
        console.log('Leilões ativos:', response.data.map(l => ({ id: l.id, titulo: l.titulo })));
        console.log('');
        
    } catch (error) {
        console.log('❌ Erro no endpoint /leiloes/ativos:', error.response?.data || error.message);
        console.log('');
    }

    try {
        console.log('3️⃣ Verificando se o servidor está rodando...');
        const response = await axios.get(`${API_URL}/leiloes`);
        console.log('✅ Servidor está respondendo');
        console.log('');
    } catch (error) {
        console.log('❌ Servidor não está respondendo:', error.message);
        console.log('💡 Certifique-se de que o servidor está rodando na porta 3004');
        console.log('');
    }
}

// Executar os testes
testarLeiloesMobile().catch(console.error); 