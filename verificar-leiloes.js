const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON dos leilões
const leiloesPath = path.join(__dirname, 'banco', 'handMan.leiloes.json');

try {
    // Lê o arquivo JSON
    const leiloesData = fs.readFileSync(leiloesPath, 'utf8');
    const leiloes = JSON.parse(leiloesData);

    console.log('=== VERIFICAÇÃO DOS LEILÕES ===');
    console.log(`Total de leilões: ${leiloes.length}`);
    
    leiloes.forEach((leilao, index) => {
        console.log(`\n--- Leilão ${index + 1} ---`);
        console.log(`ID: ${leilao.id}`);
        console.log(`Título: ${leilao.titulo}`);
        console.log(`ID do usuário: ${leilao.id_usuario || 'NÃO DEFINIDO'}`);
        console.log(`Valor desejado: R$ ${leilao.valorDesejado}`);
        console.log(`Prazo limite: ${leilao.prazoLimite}`);
        console.log(`Quantidade de lances: ${leilao.lances ? leilao.lances.length : 0}`);
        
        // Verifica se os campos obrigatórios estão definidos
        if (!leilao.id_usuario) {
            console.log('❌ ID do usuário está UNDEFINED!');
        }
        if (!leilao.id) {
            console.log('❌ ID do leilão está UNDEFINED!');
        }
    });

    // Verifica leilões ativos (prazo futuro)
    const agora = new Date();
    const leiloesAtivos = leiloes.filter(leilao => new Date(leilao.prazoLimite) > agora);
    console.log(`\nLeilões ativos: ${leiloesAtivos.length}`);

} catch (error) {
    console.error('Erro ao ler arquivo:', error);
} 