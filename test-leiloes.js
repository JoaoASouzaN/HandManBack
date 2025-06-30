const fs = require('fs');
const path = require('path');

// Verificar leilões no JSON
const verificarLeiloes = () => {
    try {
        console.log('Verificando leilões no banco JSON...');
        
        const leiloesPath = path.join(__dirname, 'banco', 'handMan.leiloes.json');
        
        if (!fs.existsSync(leiloesPath)) {
            console.log('❌ Arquivo de leilões não encontrado');
            return;
        }
        
        const leiloesData = fs.readFileSync(leiloesPath, 'utf8');
        const leiloes = JSON.parse(leiloesData);
        
        console.log(`📊 Total de leilões: ${leiloes.length}`);
        
        // Mostrar todos os leilões
        console.log('\n📋 Todos os leilões:');
        leiloes.forEach((leilao, index) => {
            console.log(`  ${index + 1}. ID: ${leilao.id}`);
            console.log(`     Título: ${leilao.titulo}`);
            console.log(`     Categoria: ${leilao.categoria}`);
            console.log(`     Valor Desejado: R$ ${leilao.valorDesejado || 'N/A'}`);
            console.log(`     Status: ${leilao.status || 'N/A'}`);
            console.log(`     Lances: ${leilao.lances ? leilao.lances.length : 0}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Erro ao verificar leilões:', error.message);
    }
};

// Executar verificação
verificarLeiloes(); 