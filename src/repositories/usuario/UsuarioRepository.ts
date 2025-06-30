import { IUsuario, Usuario } from '../../models/usuario/Usuario';
import { typeUsuario, typeUsuarioGoogle } from '../../types/usuarioType';
import * as fs from 'fs';
import * as path from 'path';

export class UsuarioRepository {

    private model = Usuario.getInstance().getModel();

    private getJsonData() {
        try {
            const jsonPath = path.join(__dirname, '../../../banco/handMan.usuarios.json');
            const data = fs.readFileSync(jsonPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Erro ao ler arquivo JSON de usuários:', error);
            return [];
        }
    }

    public async criarUsuario(usuario:typeUsuario): Promise<IUsuario> {
        try {
            const usuarioSalvar = new this.model( usuario );

            return await usuarioSalvar.save();
        } catch (error:unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar usuário');
            }
        }
    }

    public async criarUsuarioGoogle(usuario:typeUsuarioGoogle): Promise<IUsuario> {
        try {
            const usuarioSalvar = new this.model( usuario );

            return await usuarioSalvar.save();
        } catch (error:unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao criar usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao criar usuário');
            }
        }
    }

    public async updateUser(id_usuario: string, dadosAtualizados: Partial<typeUsuario>): Promise<IUsuario | null> {
        try {
            return await this.model.findOneAndUpdate(
                { id_usuario }, // busca pelo campo "id_usuario"
                { $set: dadosAtualizados },
                { new: true, runValidators: true }
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao atualizar usuário: ${error.message}`);
            } else {
                throw new Error('Erro desconhecido ao atualizar usuário');
            }
        }
    }
    
    
    public async buscarUsuarios() {
        try{
            return await this.model.find();
        } catch (error:unknown) {
            // Fallback para JSON
            console.log('MongoDB falhou, usando dados JSON para usuários');
            const jsonData = this.getJsonData();
            return jsonData.map((user: any) => ({
                ...user,
                id_usuario: user._id || user.id_usuario,
                role: user.role || 'usuario',
                formaPagamento: user.formas_pagamento || user.formaPagamento || []
            }));
        }
    }

    public async buscarPorId(id_usuario: string): Promise<IUsuario | null> {
        try {
            return await this.model.findOne({ id_usuario }); // busca pelo campo id_usuario
        } catch (error: unknown) {
            // Fallback para JSON
            console.log('MongoDB falhou, usando dados JSON para buscar usuário por ID');
            const jsonData = this.getJsonData();
            const user = jsonData.find((u: any) => u._id === id_usuario || u.id_usuario === id_usuario);
            return user ? {
                ...user,
                id_usuario: user._id || user.id_usuario,
                role: user.role || 'usuario'
            } : null;
        }
    }
     

    public async buscarEmail(email:string){
        try{
            const usuario = await this.model.findOne({ email: email });
            
            // Se não encontrou no MongoDB, tenta no JSON
            if (!usuario) {
                const jsonData = this.getJsonData();
                const user = jsonData.find((u: any) => u.email === email);
                return user ? {
                    ...user,
                    id_usuario: user._id || user.id_usuario,
                    role: user.role || 'usuario'
                } : null;
            }
            
            return usuario;

        }catch (error:unknown) {
            // Fallback para JSON em caso de erro
            const jsonData = this.getJsonData();
            const user = jsonData.find((u: any) => u.email === email);
            return user ? {
                ...user,
                id_usuario: user._id || user.id_usuario,
                role: user.role || 'usuario'
            } : null;
        }
    }
}
