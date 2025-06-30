const axios = require('axios');

const API_URL = 'http://localhost:3004';

async function testarAgendaMobile() {
    console.log('🧪 Testando endpoints da agenda do mobile...\n');

    // Teste com um usuário válido (usando o ID do primeiro usuário do JSON)
    const userId = 'usuario001';

    try {
        console.log('1️⃣ Testando GET /usuarios/historico/${userId}...');
        const response = await axios.get(`${API_URL}/usuarios/historico/${userId}`);
        
        console.log('✅ Resposta recebida!');
        console.log('Status:', response.status);
        console.log('Quantidade de serviços:', response.data.length);
        console.log('Serviços:', response.data.map(s => ({ 
            id: s.id_servico, 
            status: s.status, 
            categoria: s.categoria 
        })));
        console.log('');
        
    } catch (error) {
        console.log('❌ Erro no endpoint /usuarios/historico:', error.response?.data || error.message);
        console.log('');
    }

    try {
        console.log('2️⃣ Testando GET /servicos/usuario/${userId}...');
        const response = await axios.get(`${API_URL}/servicos/usuario/${userId}`);
        
        console.log('✅ Resposta recebida!');
        console.log('Status:', response.status);
        console.log('Quantidade de serviços:', response.data.length);
        console.log('');
        
    } catch (error) {
        console.log('❌ Erro no endpoint /servicos/usuario:', error.response?.data || error.message);
        console.log('');
    }

    try {
        console.log('3️⃣ Verificando se o servidor está rodando...');
        const response = await axios.get(`${API_URL}/usuarios`);
        console.log('✅ Servidor está respondendo');
        console.log('');
    } catch (error) {
        console.log('❌ Servidor não está respondendo:', error.message);
        console.log('💡 Certifique-se de que o servidor está rodando na porta 3004');
        console.log('');
    }
}

// Executar os testes
testarAgendaMobile().catch(console.error); 