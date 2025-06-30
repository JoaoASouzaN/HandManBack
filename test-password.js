const bcrypt = require('bcrypt');

async function testPassword() {
    const senha = "123456";
    const hash = "$2b$12$3UQzmAfvMSsaH/.VOtNR5ONVg56kHGWaAQW05gFtWPGoZt4fyHXFO";
    
    console.log('Testando senha:', senha);
    console.log('Hash no banco:', hash);
    
    const isMatch = await bcrypt.compare(senha, hash);
    console.log('Senha corresponde:', isMatch);
    
    // Gerar novo hash para comparação
    const newHash = await bcrypt.hash(senha, 12);
    console.log('Novo hash gerado:', newHash);
    
    const isMatchNew = await bcrypt.compare(senha, newHash);
    console.log('Novo hash funciona:', isMatchNew);
}

testPassword().catch(console.error); 