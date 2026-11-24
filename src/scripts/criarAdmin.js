
require('dotenv').config();

const bcrypt = require('bcryptjs');
const readline = require('readline');
const pool = require('../config/database');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(texto) {
    return new Promise((resolve) => {
        rl.question(texto, resolve);
    });
}

async function criarAdmin() {
    try {
        console.log('\n=== Cadastro de administrador ReConecta ===\n');

        const nome = (await perguntar('Nome: ')).trim();
        const email = (await perguntar('E-mail: ')).trim().toLowerCase();
        const senha = await perguntar('Senha: ');

        if (!nome || !email || !senha) {
            console.log('\nPreencha todos os campos.');
            return;
        }

        if (senha.length < 8) {
            console.log('\nA senha precisa ter pelo menos 8 caracteres.');
            return;
        }

        const senhaCriptografada = await bcrypt.hash(senha, 12);

        await pool.query(
            `INSERT INTO administradores (nome, email, senha)
             VALUES ($1, $2, $3)`,
            [nome, email, senhaCriptografada]
        );

        console.log('\nAdministrador cadastrado com sucesso!');

    } catch (erro) {
        console.error('\nErro ao cadastrar administrador:', erro.message);
    } finally {
        rl.close();
        await pool.end();
    }
}

criarAdmin();

