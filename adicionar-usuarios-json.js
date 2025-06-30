const axios = require('axios');

const API_URL = 'http://localhost:3004';

// Dados dos usuários do JSON
const usuariosJSON = [
    {
        nome: "Lucas Almeida",
        email: "lucas.almeida@email.com",
        senha: "lucas123",
        telefone: "11987651234",
        endereco: {
            rua: "Rua Azul, 100",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01010-000"
        },
        formaPagamento: [
            { tipo: "cartão", detalhes: "**** **** **** 4321" },
            { tipo: "pix", detalhes: "lucas@email.com" }
        ],
        role: "usuario"
    },
    {
        nome: "Fernanda Costa",
        email: "fernanda.costa@email.com",
        senha: "fernanda123",
        telefone: "21998761234",
        endereco: {
            rua: "Rua das Palmeiras, 55",
            cidade: "Rio de Janeiro",
            estado: "RJ",
            cep: "22020-000"
        },
        formaPagamento: [
            { tipo: "boleto", detalhes: "Banco do Brasil" }
        ],
        role: "usuario"
    },
    {
        nome: "Carlos Henrique",
        email: "carlos.henrique@email.com",
        senha: "carlos123",
        telefone: "31988887777",
        endereco: {
            rua: "Av. Minas, 200",
            cidade: "Belo Horizonte",
            estado: "MG",
            cep: "30110-070"
        },
        formaPagamento: [
            { tipo: "pix", detalhes: "carlos.pix@bank.com" },
            { tipo: "cartão", detalhes: "**** **** **** 5678" }
        ],
        role: "usuario"
    },
    {
        nome: "Aline Ribeiro",
        email: "aline.ribeiro@email.com",
        senha: "aline123",
        telefone: "21991234567",
        endereco: {
            rua: "Rua das Acácias, 90",
            cidade: "Niterói",
            estado: "RJ",
            cep: "24030-125"
        },
        formaPagamento: [
            { tipo: "pix", detalhes: "aline.ribeiro@email.com" }
        ],
        role: "usuario"
    },
    {
        nome: "Marcos Souza",
        email: "marcos.souza@email.com",
        senha: "marcos123",
        telefone: "11994445555",
        endereco: {
            rua: "Alameda das Rosas, 321",
            cidade: "Campinas",
            estado: "SP",
            cep: "13010-100"
        },
        formaPagamento: [
            { tipo: "cartão", detalhes: "**** **** **** 1010" },
            { tipo: "boleto", detalhes: "Caixa Econômica" }
        ],
        role: "usuario"
    }
];

async function adicionarUsuarios() {
    console.log('🔄 Adicionando usuários do JSON ao sistema...\n');

    for (let i = 0; i < usuariosJSON.length; i++) {
        const usuario = usuariosJSON[i];
        console.log(`${i + 1}️⃣ Adicionando usuário: ${usuario.nome} (${usuario.email})`);
        
        try {
            const response = await axios.post(`${API_URL}/usuarios`, usuario);
            console.log('✅ Usuário adicionado com sucesso!');
            console.log(`   ID: ${response.data.id_usuario}`);
            console.log('');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.error?.includes('já existe')) {
                console.log('⚠️  Usuário já existe no sistema');
                console.log('');
            } else {
                console.log('❌ Erro ao adicionar usuário:', error.response?.data?.error || error.message);
                console.log('');
            }
        }
    }

    console.log('🎉 Processo concluído!');
    console.log('💡 Agora você pode testar o login com qualquer um dos usuários:');
    usuariosJSON.forEach(usuario => {
        console.log(`   - ${usuario.email} / ${usuario.senha}`);
    });
}

// Executar adição de usuários
adicionarUsuarios().catch(console.error); 