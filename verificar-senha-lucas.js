const bcrypt = require('bcryptjs');

async function verificarSenhaLucas() {
    console.log('🔍 Verificando senha do Lucas Almeida...\n');
    
    const hashLucas = '$2b$12$sD/d4Gzz8quWodYTHQncx.DHIf3HpoOh54rBOiQGmwuPQtxtoFMGO';
    
    // Possíveis senhas baseadas no arquivo de credenciais
    const senhasPossiveis = [
        'lucas123',
        '123456',
        'lucas',
        'password',
        'senha',
        'teste'
    ];
    
    console.log('📋 Testando senhas possíveis...\n');
    
    for (const senha of senhasPossiveis) {
        try {
            const senhaCorreta = await bcrypt.compare(senha, hashLucas);
            console.log(`Senha "${senha}": ${senhaCorreta ? '✅ CORRETA' : '❌ Incorreta'}`);
            
            if (senhaCorreta) {
                console.log(`\n🎉 A senha correta do Lucas Almeida é: "${senha}"`);
                return;
            }
        } catch (error) {
            console.log(`Erro ao verificar senha "${senha}":`, error.message);
        }
    }
    
    console.log('\n❌ Nenhuma das senhas testadas corresponde ao hash.');
    console.log('💡 O hash pode ter sido gerado com uma senha diferente.');
}

// Executar a verificação
verificarSenhaLucas().catch(console.error); 