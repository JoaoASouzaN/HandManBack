const fs = require('fs');
const path = require('path');

const fornecedoresPath = path.join(__dirname, 'banco/handMan.fornecedores.json');

async function testJson() {
    console.log('=== TESTANDO LEITURA DO JSON ===\n');

    try {
        console.log('1. Verificando se o arquivo existe');
        const fileExists = fs.existsSync(fornecedoresPath);
        console.log('Arquivo existe:', fileExists);
        console.log('Caminho:', fornecedoresPath);
        console.log('');

        if (fileExists) {
            console.log('2. Lendo o arquivo JSON');
            const data = fs.readFileSync(fornecedoresPath, 'utf-8');
            const fornecedores = JSON.parse(data);
            
            console.log('Quantidade de fornecedores:', fornecedores.length);
            console.log('Primeiro fornecedor:', fornecedores[0]);
            console.log('');

            console.log('3. Testando filtro por categoria "Elétricista"');
            const fornecedoresFiltrados = fornecedores.filter(f => 
                f.categoria_servico && f.categoria_servico.includes('Elétricista')
            );
            console.log('Quantidade de fornecedores na categoria:', fornecedoresFiltrados.length);
            console.log('Primeiro fornecedor da categoria:', fornecedoresFiltrados[0]);
            console.log('');

            console.log('4. Categorias disponíveis:');
            const categorias = new Set();
            fornecedores.forEach(f => {
                if (f.categoria_servico) {
                    f.categoria_servico.forEach(cat => categorias.add(cat));
                }
            });
            console.log(Array.from(categorias));
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

testJson(); 