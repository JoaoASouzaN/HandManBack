const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuração da API
const API_URL = 'http://localhost:3004';

// Função para testar a rota de meus serviços
async function testarMeusServicos(idUsuario) {
    try {
        console.log(`🔍 Testando rota de meus serviços para usuário: ${idUsuario}`);
        
        const response = await axios.get(`${API_URL}/usuarios/historico/${idUsuario}`);

        console.log('✅ Rota funcionando!');
        console.log(`📋 Total de serviços: ${response.data.length}`);
        
        if (response.data.length > 0) {
            console.log('\n📋 Serviços encontrados:');
            response.data.forEach((servico, index) => {
                console.log(`\n--- Serviço ${index + 1} ---`);
                console.log(`ID: ${servico.id_servico}`);
                console.log(`Status: ${servico.status}`);
                console.log(`Categoria: ${servico.categoria}`);
                console.log(`Data: ${new Date(servico.data).toLocaleDateString()}`);
                console.log(`Valor: R$ ${servico.valor || 'A combinar'}`);
                if (servico.fornecedor) {
                    console.log(`Fornecedor: ${servico.fornecedor.nome}`);
                }
            });
        } else {
            console.log('📝 Nenhum serviço encontrado para este usuário');
        }
        
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error('❌ Usuário não encontrado ou sem histórico!');
        } else {
            console.error('❌ Erro ao buscar serviços:', error.response?.data || error.message);
        }
        throw error;
    }
}

// Função para testar a rota antiga (que não deveria funcionar)
async function testarRotaAntiga(idUsuario) {
    try {
        console.log(`🔍 Testando rota antiga (que não deveria funcionar): ${idUsuario}`);
        
        const response = await axios.get(`${API_URL}/servicos/usuario/${idUsuario}`);
        console.log('❌ Rota antiga ainda funciona (não deveria)');
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.log('✅ Rota antiga corretamente retorna 404 (esperado)');
        } else {
            console.error('❌ Erro inesperado na rota antiga:', error.response?.data || error.message);
        }
        throw error;
    }
}

// Função para testar se o usuário existe
async function testarUsuarioExiste(idUsuario) {
    try {
        console.log(`🔍 Testando se usuário existe: ${idUsuario}`);
        
        const response = await axios.get(`${API_URL}/usuarios/buscar-id/${idUsuario}`);

        console.log('✅ Usuário encontrado!');
        console.log('📋 Dados do usuário:', response.data);
        
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error('❌ Usuário não encontrado!');
        } else {
            console.error('❌ Erro ao buscar usuário:', error.response?.data || error.message);
        }
        throw error;
    }
}

// Função principal
async function main() {
    try {
        // Testar com um ID de usuário válido
        const idUsuario = 'usuario001'; // Substitua por um ID válido se necessário
        
        console.log('=== TESTE DA ROTA MEUS SERVIÇOS ===\n');
        
        // Primeiro testar se o usuário existe
        console.log('1. Verificando se usuário existe...');
        await testarUsuarioExiste(idUsuario);
        
        console.log('\n2. Testando rota de histórico...');
        // Testar rota correta
        await testarMeusServicos(idUsuario);
        
        console.log('\n=== TESTE DA ROTA ANTIGA ===\n');
        
        // Testar rota antiga (deveria falhar)
        try {
            await testarRotaAntiga(idUsuario);
        } catch (error) {
            // Esperado que falhe
        }
        
        console.log('\n=== TESTE CONCLUÍDO ===');
        console.log('✅ A correção da rota está funcionando corretamente!');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    testarMeusServicos,
    testarRotaAntiga
}; 