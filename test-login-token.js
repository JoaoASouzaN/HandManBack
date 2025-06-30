const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuração da API
const API_URL = 'http://localhost:3004';

// Função para testar login e verificar token
async function testarLogin() {
    try {
        console.log('🔍 Testando login...');
        
        const loginData = {
            email: 'lucas.almeida@email.com',
            senha: '123456' // Senha padrão para teste
        };
        
        console.log('📧 Email:', loginData.email);
        console.log('🔑 Senha:', loginData.senha);
        
        const response = await axios.post(`${API_URL}/usuarios/login`, loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Login bem-sucedido!');
        console.log('📋 Resposta completa:', response.data);
        
        if (response.data && response.data.token) {
            const token = response.data.token;
            console.log('🎫 Token recebido:', token);
            
            // Decodificar o token para verificar se tem campo exp
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                console.log('🔍 Payload do token:', payload);
                
                if (payload.exp) {
                    const expDate = new Date(payload.exp * 1000);
                    console.log('⏰ Token expira em:', expDate.toLocaleString());
                    console.log('✅ Token tem campo exp - CORRETO!');
                } else {
                    console.log('❌ Token NÃO tem campo exp - PROBLEMA!');
                }
                
                if (payload.id) {
                    console.log('👤 ID do usuário:', payload.id);
                }
            } else {
                console.log('❌ Token mal formado');
            }
        } else {
            console.log('❌ Token não encontrado na resposta');
        }
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro no login:', error.response?.data || error.message);
        console.error('📊 Status:', error.response?.status);
        throw error;
    }
}

// Função para testar se o backend está rodando
async function testarBackend() {
    try {
        console.log('🔍 Testando se o backend está rodando...');
        
        const response = await axios.get(`${API_URL}/usuarios`, {
            timeout: 5000
        });
        
        console.log('✅ Backend está rodando!');
        console.log('📊 Status:', response.status);
        return true;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Backend não está rodando!');
            console.error('💡 Execute: npm run dev');
        } else {
            console.error('❌ Erro ao conectar com backend:', error.message);
        }
        return false;
    }
}

// Função principal
async function main() {
    try {
        console.log('=== TESTE DE LOGIN E TOKEN ===\n');
        
        // Primeiro testar se o backend está rodando
        const backendOk = await testarBackend();
        
        if (!backendOk) {
            console.log('\n❌ Backend não está rodando. Inicie o servidor primeiro.');
            return;
        }
        
        console.log('\n=== TESTE DE LOGIN ===\n');
        
        // Testar login
        await testarLogin();
        
        console.log('\n=== TESTE CONCLUÍDO ===');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    testarLogin,
    testarBackend
}; 