const axios = require('axios');

// Configuração da API
const API_URL = 'http://localhost:3004';

// Função para buscar usuário por email
async function buscarUsuarioPorEmail(email) {
    try {
        console.log(`🔍 Buscando usuário com email: ${email}`);
        
        // Primeiro, vamos buscar todos os usuários para encontrar o email
        const response = await axios.get(`${API_URL}/usuarios`);
        
        const usuario = response.data.find(user => user.email === email);
        
        if (usuario) {
            console.log('✅ Usuário encontrado!');
            console.log(`📋 ID: ${usuario.id_usuario}`);
            console.log(`📋 Nome: ${usuario.nome}`);
            console.log(`📋 Email: ${usuario.email}`);
            return usuario;
        } else {
            console.log('❌ Usuário não encontrado!');
            return null;
        }
    } catch (error) {
        console.error('❌ Erro ao buscar usuário:', error.response?.data || error.message);
        throw error;
    }
}

// Função para buscar fornecedores disponíveis
async function buscarFornecedores() {
    try {
        console.log('🔍 Buscando fornecedores disponíveis...');
        
        const response = await axios.get(`${API_URL}/fornecedores`);
        
        console.log(`✅ Encontrados ${response.data.length} fornecedores`);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar fornecedores:', error.response?.data || error.message);
        throw error;
    }
}

// Função para criar um serviço
async function criarServico(dadosServico) {
    try {
        console.log(`🔄 Criando serviço: ${dadosServico.categoria}`);
        
        const response = await axios.post(`${API_URL}/servicos`, dadosServico);
        
        console.log('✅ Serviço criado com sucesso!');
        console.log(`📋 ID do serviço: ${response.data.id_servico}`);
        console.log(`📋 Status: ${response.data.status}`);
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao criar serviço:', error.response?.data || error.message);
        throw error;
    }
}

// Função para criar serviços de teste
async function criarServicosTeste(emailUsuario) {
    try {
        console.log('🚀 Criando Serviços de Teste para Agenda');
        console.log('========================================\n');
        
        // 1. Buscar usuário
        const usuario = await buscarUsuarioPorEmail(emailUsuario);
        if (!usuario) {
            console.log('❌ Não foi possível continuar sem encontrar o usuário');
            return;
        }
        
        // 2. Buscar fornecedores
        const fornecedores = await buscarFornecedores();
        if (!fornecedores || fornecedores.length === 0) {
            console.log('❌ Não foi possível continuar sem fornecedores');
            return;
        }
        
        console.log('\n📅 Criando serviços com diferentes status...\n');
        
        // Serviços de teste com diferentes status
        const servicosTeste = [
            {
                categoria: 'Limpeza',
                descricao: 'Limpeza completa da casa - 3 quartos, sala, cozinha e banheiros',
                status: 'pendente',
                valor: 150.00,
                data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias a partir de hoje
                horario: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 9h da manhã
                fornecedor: fornecedores[0]
            },
            {
                categoria: 'Jardinagem',
                descricao: 'Poda de árvores e manutenção do jardim',
                status: 'confirmado',
                valor: 200.00,
                data: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias a partir de hoje
                horario: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 14h da tarde
                fornecedor: fornecedores[1] || fornecedores[0]
            },
            {
                categoria: 'Encanamento',
                descricao: 'Reparo no encanamento da cozinha - vazamento na pia',
                status: 'Em Andamento',
                valor: 120.00,
                data: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia a partir de hoje
                horario: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 10h da manhã
                fornecedor: fornecedores[2] || fornecedores[0]
            },
            {
                categoria: 'Elétrica',
                descricao: 'Instalação de novos pontos de luz na sala',
                status: 'Aguardando pagamento',
                valor: 180.00,
                data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
                horario: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // 15h da tarde
                fornecedor: fornecedores[3] || fornecedores[0]
            },
            {
                categoria: 'Carpintaria',
                descricao: 'Fabricação de uma mesa de jantar personalizada',
                status: 'concluido',
                valor: 450.00,
                data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
                horario: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 11h da manhã
                fornecedor: fornecedores[4] || fornecedores[0]
            },
            {
                categoria: 'Pintura',
                descricao: 'Pintura das paredes do quarto principal',
                status: 'negociar valor',
                valor: 0, // A combinar
                data: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 dias a partir de hoje
                horario: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // 13h da tarde
                fornecedor: fornecedores[5] || fornecedores[0]
            }
        ];
        
        const servicosCriados = [];
        
        // Criar cada serviço
        for (const servicoTeste of servicosTeste) {
            try {
                const dadosServico = {
                    id_usuario: usuario.id_usuario,
                    id_fornecedor: servicoTeste.fornecedor.id_fornecedor,
                    categoria: servicoTeste.categoria,
                    data: servicoTeste.data.toISOString(),
                    horario: servicoTeste.horario.toISOString(),
                    status: servicoTeste.status,
                    valor: servicoTeste.valor,
                    descricao: servicoTeste.descricao
                };
                
                const servicoCriado = await criarServico(dadosServico);
                servicosCriados.push(servicoCriado);
                
                console.log(`✅ ${servicoTeste.categoria} - ${servicoTeste.status}\n`);
                
            } catch (error) {
                console.log(`❌ Erro ao criar serviço ${servicoTeste.categoria}:`, error.message);
            }
        }
        
        console.log('🎉 Serviços de teste criados com sucesso!');
        console.log(`📊 Total criado: ${servicosCriados.length} serviços`);
        
        // Mostrar resumo
        console.log('\n📋 Resumo dos Serviços Criados:');
        servicosCriados.forEach((servico, index) => {
            console.log(`${index + 1}. ${servico.categoria} - ${servico.status} - R$ ${servico.valor || 'A combinar'}`);
        });
        
        console.log('\n💡 Agora você pode testar a agenda no mobile ou web!');
        console.log('🔍 Para ver os serviços, use: node buscar-servico.js historico ' + usuario.id_usuario);
        
        return servicosCriados;
        
    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

// Função principal
async function main() {
    const args = process.argv.slice(2);
    const email = args[0] || 'joaoif.eletro@gmail.com';
    
    await criarServicosTeste(email);
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    criarServicosTeste,
    buscarUsuarioPorEmail,
    buscarFornecedores
}; 