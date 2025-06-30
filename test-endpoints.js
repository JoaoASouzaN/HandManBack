const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
    console.log('=== TESTANDO ENDPOINTS ===\n');

    try {
        // Testar endpoint de todos os fornecedores
        console.log('1. Testando GET /fornecedor');
        const response1 = await axios.get(`${BASE_URL}/fornecedor`);
        console.log('Status:', response1.status);
        console.log('Dados:', response1.data);
        console.log('Quantidade de fornecedores:', response1.data.length);
        console.log('');

        // Testar endpoint de fornecedores por categoria
        console.log('2. Testando GET /fornecedor/categorias/Elétricista');
        const response2 = await axios.get(`${BASE_URL}/fornecedor/categorias/El%C3%A9tricista`);
        console.log('Status:', response2.status);
        console.log('Dados:', response2.data);
        console.log('Quantidade de fornecedores:', response2.data.length);
        console.log('');

        // Testar endpoint de leilões ativos
        console.log('3. Testando GET /leiloes/ativos');
        const response3 = await axios.get(`${BASE_URL}/leiloes/ativos`);
        console.log('Status:', response3.status);
        console.log('Dados:', response3.data);
        console.log('Quantidade de leilões:', response3.data.length);
        console.log('');

    } catch (error) {
        console.error('Erro:', error.response ? {
            status: error.response.status,
            data: error.response.data
        } : error.message);
    }
}

testEndpoints(); 