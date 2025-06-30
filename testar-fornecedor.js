const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuração da API
const API_URL = 'http://localhost:3004';

// Função para testar login de fornecedor
async function testarLoginFornecedor(email, senha) {
    try {
        console.log(`🔐 Testando login do fornecedor: ${email}`);
        
        const response = await axios.post(`${API_URL}/fornecedor/login`, {
            email,
            senha
        });

        console.log('✅ Login bem-sucedido!');
        console.log('📋 Token:', response.data.token);
        
        // Decodificar o token para ver os dados
        const token = response.data.token;
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log('📋 Dados do token:', payload);
        
        return { token, payload };
    } catch (error) {
        console.error('❌ Erro no login:', error.response?.data || error.message);
        throw error;
    }
}

// Função para testar busca de fornecedor por ID
async function testarBuscarFornecedor(id) {
    try {
        console.log(`🔍 Testando busca do fornecedor: ${id}`);
        
        const response = await axios.get(`${API_URL}/fornecedor/${id}`);

        console.log('✅ Fornecedor encontrado!');
        console.log('📋 Dados do fornecedor:');
        console.log(JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar fornecedor:', error.response?.data || error.message);
        throw error;
    }
}

// Função para listar todos os fornecedores
async function listarFornecedores() {
    try {
        console.log('📋 Listando todos os fornecedores...');
        
        const response = await axios.get(`${API_URL}/fornecedor`);

        console.log(`✅ Encontrados ${response.data.length} fornecedores`);
        
        response.data.forEach((fornecedor, index) => {
            console.log(`\n--- Fornecedor ${index + 1} ---`);
            console.log(`ID: ${fornecedor.id_fornecedor || fornecedor._id}`);
            console.log(`Nome: ${fornecedor.nome}`);
            console.log(`Email: ${fornecedor.email}`);
            console.log(`Telefone: ${fornecedor.telefone}`);
            console.log(`Categorias: ${fornecedor.categoria_servico?.join(', ')}`);
            console.log(`Valor: R$ ${fornecedor.valor}`);
        });
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao listar fornecedores:', error.response?.data || error.message);
        throw error;
    }
}

// Função principal
async function main() {
    console.log('🧪 Testando Sistema de Fornecedores');
    console.log('==================================\n');
    
    try {
        // 1. Listar fornecedores disponíveis
        console.log('1️⃣ Listando fornecedores disponíveis...\n');
        const fornecedores = await listarFornecedores();
        
        if (fornecedores.length === 0) {
            console.log('❌ Nenhum fornecedor encontrado!');
            return;
        }
        
        // 2. Testar login com o primeiro fornecedor
        const primeiroFornecedor = fornecedores[0];
        console.log('\n2️⃣ Testando login...\n');
        
        const loginResult = await testarLoginFornecedor(
            primeiroFornecedor.email, 
            primeiroFornecedor.senha
        );
        
        // 3. Testar busca por ID usando o token
        console.log('\n3️⃣ Testando busca por ID...\n');
        const fornecedorId = loginResult.payload.id;
        await testarBuscarFornecedor(fornecedorId);
        
        console.log('\n🎉 Todos os testes passaram!');
        console.log('\n💡 Dados para teste no mobile:');
        console.log(`Email: ${primeiroFornecedor.email}`);
        console.log(`Senha: ${primeiroFornecedor.senha}`);
        console.log(`ID: ${fornecedorId}`);
        
    } catch (error) {
        console.log('\n❌ Alguns testes falharam!');
        console.log('💡 Verifique se o backend está rodando na porta 3004');
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    testarLoginFornecedor,
    testarBuscarFornecedor,
    listarFornecedores
}; 