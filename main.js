/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 

//importação do módulo de conexão (database.js)
const { conectar, desconectar} = require('./database.js')

//importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

//importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')

// CRUD Create (função para criar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
              )
            // a linha abaixo salva os do cliente no banco
            await novoCliente.save()
            console.log("Cliente adicionado com sucesso.")
      
    } catch (error) {
        //tratamento de exceções específicas
        if(error.code = 11000){
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        }else {
        console.log(error)
        }
    }
}

//CRUD Read - Função para listar todos os clientes cadastrados
const listarClientes = async () => {
    try {
        //a linha abaixo lista todos os clientes cadastrados por ordem alfabética
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}

//CRUD Read - Função para buscar um cliente específico
const buscarCliente = async (nome) => {
    try {
        //find() buscar no banco
        //nomeCliente: new RegExp(nome) filtro pelo nome (partes que contenhm( expressão regular))
        //'i' insensitive (ignorar letras maiúsculas ou minúsculas)
        const cliente = await clienteModel.find(
            {
                nomeCliente: new RegExp(nome, 'i')
            }  
        ) 
        //calcular a similariadade entre os nomes retornados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)
        //validação (se não exixtir o cliente pesquisado)
        if (nomesClientes.length === 0){
            console.log("Cliente não cadstrado")
        }else{

     
        const match = stringSimilarity.findBestMatch(nome, nomesClientes)

        //cliente com melhor similaridade
        const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
        console.log(melhorCliente)
   }
    } catch (error) {
        console.log(error)
        
    }
}
//execção da aplicação
const app = async () =>{
    await conectar()
    //CRUD - Create

    //CRUD - Read
    //await criarCliente("Maria Aparecida", "99999-0000", "123.456.789-00")
    await criarCliente("Thiago Moura", "98888-0001", "123.456.789-01")
   // await criarCliente("Patricia Moura", "99999-0002", "123.456.789-02")
    //await criarCliente("Lucas Guimarães", "99999-0003", "123.456.789-03")
    //await criarCliente("João da Silva", "99999-0004", "123.456.789-04")

    //CRUD - Read (Exemplo 1 - listar clientes)
    //CRUD - Read (Exemplo 2 - buscar clientes)
    //await buscarCliente("João")
    await desconectar()
    await listarClientes()
}

console.clear()
app()*/

/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// Importação do módulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js');

// Importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js');

// Importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity');

// CRUD Create (função para criar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel({
            nomeCliente: nomeCli,
            foneCliente: foneCli,
            cpf: cpfCli
        });

        // Salva os dados do cliente no banco
        await novoCliente.save();
        console.log(`Cliente ${nomeCli} adicionado com sucesso.`);
    } catch (error) {
        // Tratamento de exceções específicas
        if (error.code === 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado.`);
        } else {
            console.log("Erro ao adicionar cliente:", error);
        }
    }
};

// CRUD Read - Função para listar todos os clientes cadastrados por ordem alfabética
const listarClientes = async () => {
    try {
        const clientes = await clienteModel.find().sort({ nomeCliente: 1 });

        if (clientes.length === 0) {
            console.log("Nenhum cliente cadastrado.");
        } else {
            console.log("\nLista de Clientes:");
            clientes.forEach(cliente => {
                console.log(`Nome: ${cliente.nomeCliente}, Telefone: ${cliente.foneCliente}, CPF: ${cliente.cpf}`);
            });
        }
    } catch (error) {
        console.log("Erro ao listar clientes:", error);
    }
};

// CRUD Read - Função para buscar um cliente específico
const buscarCliente = async (nome) => {
    try {
        const clientes = await clienteModel.find({
            nomeCliente: new RegExp(nome, 'i') // Filtro pelo nome (insensível a maiúsculas/minúsculas)
        });

        // Se nenhum cliente for encontrado
        if (clientes.length === 0) {
            console.log("Cliente não cadastrado.");
            return;
        }

        // Calcular a similaridade entre os nomes retornados e o nome pesquisado
        const nomesClientes = clientes.map(cliente => cliente.nomeCliente);
        const match = stringSimilarity.findBestMatch(nome, nomesClientes);

        // Cliente com melhor similaridade
        const melhorCliente = clientes.find(cliente => cliente.nomeCliente === match.bestMatch.target);
        console.log("\nCliente encontrado:");
        //formatação da data
        const clienteFormatado = {
            nomeCliente: melhorCliente.nomeCliente,
            foneCliente: melhorCliente.foneCliente,
            cpf: melhorCliente.cpf,
            dataCadastro: melhorCliente.dataCadastro.toLocaleDateString('pt-BR')
        }
        console.log(clienteFormatado)
        console.log(`Nome: ${melhorCliente.nomeCliente}, Telefone: ${melhorCliente.foneCliente}, CPF: ${melhorCliente.cpf}`);
    } catch (error) {
        console.log("Erro ao buscar cliente:", error);
    }
};

// Execução da aplicação
const app = async () => {
    await conectar();

    // CRUD - Create
    await criarCliente("Thiago Moura", "98888-0001", "123.456.789-01");

    // CRUD - Read
    await listarClientes();

    // CRUD - Read (Exemplo 2 - buscar cliente)
    await buscarCliente("João");

    await desconectar();
};

// Limpar console apenas se necessário
// console.clear();
app();
