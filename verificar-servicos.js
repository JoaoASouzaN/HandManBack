const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON dos serviços
const servicosPath = path.join(__dirname, 'banco', 'handMan.servicoAgendados.json');

try {
    // Lê o arquivo JSON
    const servicosData = fs.readFileSync(servicosPath, 'utf8');
    const servicos = JSON.parse(servicosData);

    console.log('=== VERIFICAÇÃO DOS SERVIÇOS ===');
    console.log(`Total de serviços: ${servicos.length}`);
    
    // Verifica serviços com status "confirmar valor"
    const servicosConfirmarValor = servicos.filter(s => s.status === 'confirmar valor');
    console.log(`\nServiços com status "confirmar valor": ${servicosConfirmarValor.length}`);
    
    servicosConfirmarValor.forEach((servico, index) => {
        console.log(`\n--- Serviço ${index + 1} ---`);
        console.log(`ID do serviço: ${servico.id_servico}`);
        console.log(`ID do usuário: ${servico.id_usuario}`);
        console.log(`ID do fornecedor: ${servico.id_fornecedor}`);
        console.log(`Status: ${servico.status}`);
        console.log(`Valor: ${servico.valor}`);
        console.log(`Data: ${servico.data}`);
        console.log(`Horário: ${servico.horario}`);
        
        // Verifica se os IDs estão definidos
        if (!servico.id_servico) {
            console.log('❌ ID do serviço está UNDEFINED!');
        }
        if (!servico.id_usuario) {
            console.log('❌ ID do usuário está UNDEFINED!');
        }
        if (!servico.id_fornecedor) {
            console.log('❌ ID do fornecedor está UNDEFINED!');
        }
    });

    // Verifica todos os serviços para problemas
    console.log('\n=== VERIFICAÇÃO GERAL ===');
    servicos.forEach((servico, index) => {
        if (!servico.id_servico) {
            console.log(`❌ Serviço ${index + 1}: ID do serviço UNDEFINED`);
        }
        if (!servico.id_usuario) {
            console.log(`❌ Serviço ${index + 1}: ID do usuário UNDEFINED`);
        }
        if (!servico.id_fornecedor) {
            console.log(`❌ Serviço ${index + 1}: ID do fornecedor UNDEFINED`);
        }
    });

} catch (error) {
    console.error('Erro ao ler arquivo:', error);
} 