const path = require('path');

console.log('=== VERIFICANDO CAMINHOS ===\n');

console.log('1. __dirname atual:', __dirname);
console.log('');

const fornecedoresPath1 = path.join(__dirname, '../../../banco/handMan.fornecedores.json');
console.log('2. Caminho usado no repositório:', fornecedoresPath1);
console.log('');

const fornecedoresPath2 = path.join(__dirname, 'banco/handMan.fornecedores.json');
console.log('3. Caminho correto:', fornecedoresPath2);
console.log('');

const fs = require('fs');
console.log('4. Verificando se os caminhos existem:');
console.log('Caminho do repositório existe:', fs.existsSync(fornecedoresPath1));
console.log('Caminho correto existe:', fs.existsSync(fornecedoresPath2));
console.log('');

if (fs.existsSync(fornecedoresPath2)) {
    console.log('5. Testando leitura do caminho correto:');
    const data = fs.readFileSync(fornecedoresPath2, 'utf-8');
    const fornecedores = JSON.parse(data);
    console.log('Quantidade de fornecedores:', fornecedores.length);
} 