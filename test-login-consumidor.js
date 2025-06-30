const axios = require('axios');

const API_URL = 'http://localhost:3004';

async function testarLoginConsumidor() {
    console.log('🧪 Testando login de consumidor (usuário comum)...\n');

    // Credenciais de teste válidas
    const credenciais = [
        { email: 'lucas.almeida@email.com', senha: 'lucas123', nome: 'Lucas Almeida' },
        { email: 'fernanda.costa@email.com', senha: 'fernanda123', nome: 'Fernanda Costa' },
        { email: 'carlos.henrique@email.com', senha: 'carlos123', nome: 'Carlos Henrique' },
        { email: 'aline.ribeiro@email.com', senha: 'aline123', nome: 'Aline Ribeiro' },
        { email: 'marcos.souza@email.com', senha: 'marcos123', nome: 'Marcos Souza' }
    ];

    console.log('📋 Testando login com todas as credenciais de teste...\n');

    for (let i = 0; i < credenciais.length; i++) {
        const cred = credenciais[i];
        console.log(`${i + 1}️⃣ Testando login para ${cred.nome}...`);
        
        try {
            const response = await axios.post(`${API_URL}/usuarios/login`, {
                email: cred.email,
                senha: cred.senha
            });
            
            console.log('✅ Login bem-sucedido!');
            console.log('Token:', response.data.token);
            
            // Decodificar o token para verificar o role
            const tokenParts = response.data.token.split('.');
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            console.log('Role do usuário:', payload.role);
            console.log('ID do usuário:', payload.id);
            console.log('');
            
        } catch (error) {
            console.log('❌ Erro no login:', error.response?.data?.error || error.message);
            console.log('');
        }
    }

    // Teste com credenciais inválidas
    console.log('🔍 Testando login com credenciais inválidas...');
    try {
        const response = await axios.post(`${API_URL}/usuarios/login`, {
            email: 'email.invalido@teste.com',
            senha: 'senhaerrada'
        });
        
        console.log('❌ Login não deveria ter funcionado:', response.data);
    } catch (error) {
        console.log('✅ Erro esperado para credenciais inválidas:', error.response?.data?.error || error.message);
    }
}

// Executar os testes
testarLoginConsumidor().catch(console.error); 