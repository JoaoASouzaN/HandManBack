const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('JWT_KEY:', process.env.JWT_KEY);

const payload = {
    id: 'usuario001',
    nome: 'Lucas Almeida',
    email: 'lucas.almeida@email.com',
    imagemPerfil: 'https://example.com/image.jpg',
    role: 'usuario'
};

const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' });
console.log('Token gerado:', token);

try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log('Token decodificado:', decoded);
    console.log('Campo exp existe:', 'exp' in decoded);
    console.log('Expira em:', new Date(decoded.exp * 1000));
} catch (error) {
    console.error('Erro ao decodificar token:', error);
} 