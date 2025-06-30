const axios = require('axios');

// Configuração da API
const API_URL = 'http://localhost:3004';

// Função para atualizar o status de um serviço
async function atualizarStatusServico(idServico, novoStatus) {
    try {
        console.log(`🔄 Atualizando status do serviço ${idServico} para: ${novoStatus}`);
        
        const response = await axios.put(`${API_URL}/servicos`, {
            id_servico: idServico,
            status: novoStatus
        });

        console.log('✅ Status atualizado com sucesso!');
        console.log('📋 Dados do serviço:', JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao atualizar status:', error.response?.data || error.message);
        throw error;
    }
}

// Função para listar todos os serviços
async function listarServicos() {
    try {
        console.log('📋 Listando todos os serviços...');
        
        // Como não temos um endpoint para listar todos os serviços, 
        // vamos usar um ID de exemplo ou você pode fornecer um ID específico
        console.log('💡 Para listar serviços específicos, use o endpoint:');
        console.log(`   GET ${API_URL}/usuarios/historico/{id_usuario}`);
        console.log(`   GET ${API_URL}/servicos/{id_servico}`);
        
    } catch (error) {
        console.error('❌ Erro ao listar serviços:', error.response?.data || error.message);
    }
}

// Status disponíveis
const STATUS_DISPONIVEIS = [
    'pendente',
    'confirmado', 
    'negociar valor',
    'cancelado',
    'concluido',
    'Em Andamento',
    'Aguardando pagamento',
    'Recusado',
    'confirmar valor'
];

// Função principal
async function main() {
    console.log('🚀 Script para Atualizar Status de Serviços');
    console.log('==========================================\n');
    
    // Verificar argumentos da linha de comando
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('❌ Uso: node atualizar-status-servico.js <id_servico> <novo_status>');
        console.log('\n📋 Status disponíveis:');
        STATUS_DISPONIVEIS.forEach(status => console.log(`   - ${status}`));
        console.log('\n💡 Exemplo:');
        console.log('   node atualizar-status-servico.js abc123 confirmado');
        console.log('   node atualizar-status-servico.js abc123 "Em Andamento"');
        return;
    }
    
    const [idServico, novoStatus] = args;
    
    // Validar status
    if (!STATUS_DISPONIVEIS.includes(novoStatus)) {
        console.log('❌ Status inválido! Status disponíveis:');
        STATUS_DISPONIVEIS.forEach(status => console.log(`   - ${status}`));
        return;
    }
    
    try {
        await atualizarStatusServico(idServico, novoStatus);
    } catch (error) {
        console.log('\n💡 Dicas:');
        console.log('   - Verifique se o backend está rodando na porta 3004');
        console.log('   - Verifique se o ID do serviço está correto');
        console.log('   - Verifique se o status está escrito exatamente como na lista');
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    atualizarStatusServico,
    listarServicos,
    STATUS_DISPONIVEIS
}; 