const axios = require('axios');

const API_URL = 'http://localhost:3004';

async function migrarDadosJSON() {
    console.log('🔄 Migrando dados do JSON para o sistema...\n');

    try {
        // 1. Testar se o sistema está funcionando
        console.log('1️⃣ Testando conexão com o sistema...');
        const response = await axios.get(`${API_URL}/usuarios`);
        console.log('✅ Sistema respondendo!');
        console.log(`📊 Usuários no sistema: ${response.data.length}`);
        console.log('');

        // 2. Testar login com usuário do JSON
        console.log('2️⃣ Testando login com usuário do JSON...');
        try {
            const loginResponse = await axios.post(`${API_URL}/usuarios/login`, {
                email: 'lucas.almeida@email.com',
                senha: 'lucas123'
            });
            console.log('✅ Login bem-sucedido!');
            console.log('Token:', loginResponse.data.token);
            console.log('');

            // 3. Testar histórico com o usuário logado
            console.log('3️⃣ Testando histórico do usuário...');
            const tokenParts = loginResponse.data.token.split('.');
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            const userId = payload.id;
            
            console.log(`ID do usuário: ${userId}`);
            
            const historicoResponse = await axios.get(`${API_URL}/usuarios/historico/${userId}`);
            console.log('✅ Histórico encontrado!');
            console.log(`📊 Serviços no histórico: ${historicoResponse.data.length}`);
            
            if (historicoResponse.data.length > 0) {
                historicoResponse.data.forEach((servico, index) => {
                    console.log(`   ${index + 1}. ${servico.categoria} - ${servico.status} - R$ ${servico.valor || 'A combinar'}`);
                });
            }
            console.log('');

        } catch (loginError) {
            console.log('❌ Erro no login:', loginError.response?.data?.error || loginError.message);
            console.log('');
        }

        // 4. Testar endpoint de serviços do usuário
        console.log('4️⃣ Testando endpoint de serviços do usuário...');
        try {
            const servicosResponse = await axios.get(`${API_URL}/servicos/usuario/usuario001`);
            console.log('✅ Serviços encontrados!');
            console.log(`📊 Total de serviços: ${servicosResponse.data.length}`);
            console.log('');
        } catch (servicosError) {
            console.log('❌ Erro ao buscar serviços:', servicosError.response?.data || servicosError.message);
            console.log('');
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

// Executar migração
migrarDadosJSON().catch(console.error); 