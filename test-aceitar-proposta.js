const axios = require('axios');

// Configuração da API
const API_URL = 'http://192.168.18.27:3004';

// Teste de aceitação de proposta
const testAceitarProposta = async () => {
    try {
        console.log('Testando aceitação de proposta...');
        
        // Primeiro, vamos buscar um serviço com status "confirmar valor"
        const response = await axios.get('http://192.168.18.27:3004/servicos/test-service-id');
        
        if (response.data) {
            console.log('Serviço encontrado:', response.data);
            
            // Tentar atualizar o status para "confirmado"
            const updateResponse = await axios.put('http://192.168.18.27:3004/servicos', {
                id_servico: 'test-service-id',
                status: 'confirmado'
            });
            
            console.log('✅ Status atualizado com sucesso:', updateResponse.data);
        } else {
            console.log('❌ Serviço não encontrado');
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar aceitação:', error.response?.data || error.message);
    }
};

// Executar teste
testAceitarProposta(); 