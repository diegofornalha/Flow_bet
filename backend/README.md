## Passo a Passo

1. **Instalar Dependências**

   ```shell
   npm install
   ```

2. **Compilar o Contrato**

   ```shell
   npx hardhat compile
   ```

3. **Executar Testes**

   ```shell
   npx hardhat test
   ```

4. **Executar um Nó Local**

   ```shell
   npx hardhat node
   ```

5. **Fazer Deploy do Contrato**

   ```shell
   npx hardhat ignition deploy ./ignition/modules/Lock.ts
   ```

6. **Obter Ajuda**
   ```shell
   npx hardhat help
   ```

## Variáveis de Ambiente

Certifique-se de configurar suas variáveis de ambiente no arquivo `.env`. Por exemplo, defina sua chave privada:

```
FLOW_PRIVATE_KEY=seu_valor_aqui
```

## Observações

- **Configuração de Rede**: O arquivo `hardhat.config.ts` está configurado para usar a rede de teste do Flow. Certifique-se de que as credenciais e URLs estão corretas.
- **Segurança**: Não compartilhe seu arquivo `.env` ou qualquer informação sensível.

Siga esses passos para configurar e executar seu projeto Hardhat de forma eficaz. Se precisar de mais informações, consulte a documentação oficial do Hardhat.
