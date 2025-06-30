const { FornecedorRepository } = require('./src/repositories/fornecedor/FornecedorRepository');

async function testRepository() {
    console.log('=== TESTANDO REPOSITÓRIO ===\n');

    try {
        const repository = new FornecedorRepository();

        console.log('1. Testando buscarFornecedores()');
        const fornecedores = await repository.buscarFornecedores();
        console.log('Quantidade de fornecedores:', fornecedores.length);
        console.log('Primeiro fornecedor:', fornecedores[0]);
        console.log('');

        console.log('2. Testando buscarFornecedoresPorCategoria("Elétricista")');
        const fornecedoresCategoria = await repository.buscarFornecedoresPorCategoria('Elétricista');
        console.log('Quantidade de fornecedores na categoria:', fornecedoresCategoria.length);
        console.log('Primeiro fornecedor da categoria:', fornecedoresCategoria[0]);
        console.log('');

    } catch (error) {
        console.error('Erro:', error);
    }
}

testRepository(); 