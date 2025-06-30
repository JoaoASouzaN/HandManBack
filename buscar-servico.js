const axios = require('axios');

// Configuração da API
const API_URL = 'http://localhost:3004';

// Função para buscar um serviço específico
async function buscarServico(idServico) {
    try {
        console.log(`🔍 Buscando serviço: ${idServico}`);
        
        const response = await axios.get(`${API_URL}/servicos/${idServico}`);

        console.log('✅ Serviço encontrado!');
        console.log('📋 Dados do serviço:');
        console.log(JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error('❌ Serviço não encontrado!');
        } else {
            console.error('❌ Erro ao buscar serviço:', error.response?.data || error.message);
        }
        throw error;
    }
}

// Função para buscar histórico de serviços de um usuário
async function buscarHistoricoUsuario(idUsuario) {
    try {
        console.log(`🔍 Buscando histórico do usuário: ${idUsuario}`);
        
        const response = await axios.get(`${API_URL}/usuarios/historico/${idUsuario}`);

        console.log('✅ Histórico encontrado!');
        console.log(`📋 Total de serviços: ${response.data.length}`);
        
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
        
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.error('❌ Usuário não encontrado ou sem histórico!');
        } else {
            console.error('❌ Erro ao buscar histórico:', error.response?.data || error.message);
        }
        throw error;
    }
}

// Função principal
async function main() {
    console.log('🔍 Script para Buscar Serviços');
    console.log('==============================\n');
    
    // Verificar argumentos da linha de comando
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('❌ Uso: node buscar-servico.js <tipo> <id>');
        console.log('\n📋 Tipos disponíveis:');
        console.log('   - servico <id_servico>  - Buscar um serviço específico');
        console.log('   - historico <id_usuario> - Buscar histórico de um usuário');
        console.log('\n💡 Exemplos:');
        console.log('   node buscar-servico.js servico abc123');
        console.log('   node buscar-servico.js historico user456');
        return;
    }
    
    const [tipo, id] = args;
    
    try {
        if (tipo === 'servico') {
            await buscarServico(id);
        } else if (tipo === 'historico') {
            await buscarHistoricoUsuario(id);
        } else {
            console.log('❌ Tipo inválido! Use "servico" ou "historico"');
        }
    } catch (error) {
        console.log('\n💡 Dicas:');
        console.log('   - Verifique se o backend está rodando na porta 3004');
        console.log('   - Verifique se o ID está correto');
        console.log('   - Para serviços, use o ID completo do serviço');
        console.log('   - Para histórico, use o ID do usuário');
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    buscarServico,
    buscarHistoricoUsuario
}; 