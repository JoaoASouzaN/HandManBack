import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export abstract class BaseBancoDeDados {
    constructor() {
        this.conectar();
    }
    
    protected async conectar(): Promise<void> {
        try {
            const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/handman';
            const dbName = process.env.DB_NAME_PATIENT || 'handman';
            
            await mongoose.connect(mongoUri, {
                dbName: dbName,
            });
            console.log('Conectado ao MongoDB com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            console.log('Continuando com dados JSON...');
            // Não encerra o processo, permite usar JSON como fallback
        }
    }
}
