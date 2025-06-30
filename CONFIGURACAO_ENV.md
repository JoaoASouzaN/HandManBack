# Configuração do Arquivo .env

## Problema Identificado
O backend não está gerando tokens JWT válidos porque a chave JWT_KEY não está configurada.

## Solução
Crie um arquivo `.env` na pasta `BackEnd` com o seguinte conteúdo:

```
JWT_KEY=handman_secret_key_2024_very_secure_and_unique
MONGODB_URI=mongodb://localhost:27017/handman
PORT=3003
```

## Passos:
1. Crie um arquivo chamado `.env` na pasta `5ADS-BackFrontMobile/BackEnd/`
2. Cole o conteúdo acima no arquivo
3. Salve o arquivo
4. Reinicie o backend: `npm run dev`
5. Faça login novamente no frontend
6. Agora o token será gerado corretamente com campo `exp`
7. A tela "Meus Serviços" deve funcionar normalmente

## Por que isso resolve o problema:
- O JWT_KEY é necessário para assinar os tokens JWT
- Sem essa chave, os tokens não são gerados corretamente
- O frontend espera tokens com campo `exp` (expiração)
- Com a chave configurada, os tokens terão o campo `exp` e funcionarão corretamente 