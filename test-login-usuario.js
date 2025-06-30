const axios = require('axios');

const API_URL = 'http://localhost:3004';

async function testarLoginUsuario() {
    console.log('🧪 Testando login de usuário...\n');

    // Teste 1: Login com usuário válido
    console.log('1️⃣ Testando login com usuário válido...');
    try {
        const response = await axios.post(`${API_URL}/usuarios/login`, {
            email: 'lucas.almeida@email.com',
            senha: '123456'
        });
        
        console.log('✅ Login bem-sucedido!');
        console.log('Token:', response.data.token);
        console.log('');
    } catch (error) {
        console.log('❌ Erro no login:', error.response?.data || error.message);
        console.log('💡 Certifique-se de que o servidor está rodando na porta 3004');
        console.log('');
    }

    // Teste 2: Login com email inválido
    console.log('2️⃣ Testando login com email inválido...');
    try {
        const response = await axios.post(`${API_URL}/usuarios/login`, {
            email: 'email.inexistente@email.com',
            senha: '123456'
        });
        
        console.log('✅ Login bem-sucedido (não deveria ser):', response.data);
    } catch (error) {
        console.log('✅ Erro esperado para email inválido:', error.response?.data?.error || error.message);
        console.log('');
    }

    // Teste 3: Login com senha incorreta
    console.log('3️⃣ Testando login com senha incorreta...');
    try {
        const response = await axios.post(`${API_URL}/usuarios/login`, {
            email: 'lucas.almeida@email.com',
            senha: 'senhaerrada'
        });
        
        console.log('✅ Login bem-sucedido (não deveria ser):', response.data);
    } catch (error) {
        console.log('✅ Erro esperado para senha incorreta:', error.response?.data?.error || error.message);
        console.log('');
    }

    // Teste 4: Verificar se o servidor está rodando
    console.log('4️⃣ Verificando se o servidor está rodando...');
    try {
        const response = await axios.get(`${API_URL}/usuarios`);
        console.log('✅ Servidor está rodando e respondendo');
        console.log(`📊 Total de usuários: ${response.data.length}`);
        console.log('');
    } catch (error) {
        console.log('❌ Servidor não está respondendo:', error.message);
        console.log('💡 Certifique-se de que o servidor está rodando na porta 3004');
        console.log('');
    }

    // Teste 5: Listar todos os usuários disponíveis
    console.log('5️⃣ Listando usuários disponíveis para teste...');
    try {
        const response = await axios.get(`${API_URL}/usuarios`);
        console.log('📋 Usuários disponíveis:');
        response.data.forEach((usuario, index) => {
            console.log(`${index + 1}. ${usuario.nome} (${usuario.email})`);
        });
        console.log('');
    } catch (error) {
        console.log('❌ Erro ao listar usuários:', error.response?.data || error.message);
        console.log('');
    }
}

// Executar os testes
testarLoginUsuario().catch(console.error); 