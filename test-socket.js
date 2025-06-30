const io = require('socket.io-client');

// Teste de conexão Socket.IO
const testSocketConnection = () => {
    console.log('Testando conexão Socket.IO...');
    
    const socket = io('http://192.168.18.27:3004', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log('✅ Socket conectado com sucesso!');
        console.log('Socket ID:', socket.id);
        
        // Teste de join em sala
        socket.emit('join', 'test-user-id');
        console.log('✅ Join em sala realizado');
        
        // Desconectar após teste
        setTimeout(() => {
            socket.disconnect();
            console.log('✅ Teste concluído - Socket desconectado');
            process.exit(0);
        }, 2000);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Erro na conexão:', error.message);
        console.error('Detalhes:', error);
        process.exit(1);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket desconectado:', reason);
    });

    socket.on('error', (error) => {
        console.error('Erro geral:', error);
    });

    // Timeout para o teste
    setTimeout(() => {
        console.error('❌ Timeout - Socket não conseguiu conectar em 10 segundos');
        socket.disconnect();
        process.exit(1);
    }, 10000);
};

// Executar teste
testSocketConnection(); 