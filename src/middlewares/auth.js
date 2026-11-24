
const jwt = require('jsonwebtoken');

function autenticarAdmin(req, res, next) {
    const autorizacao = req.headers.authorization;

    if (!autorizacao) {
        return res.status(401).json({
            mensagem: 'Acesso não autorizado. Faça login.'
        });
    }

    const partes = autorizacao.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            mensagem: 'Formato de token inválido.'
        });
    }

    const token = partes[1];

    try {
        const segredo = process.env.JWT_SECRET;

        if (!segredo) {
            throw new Error('JWT_SECRET não configurado.');
        }

        const dados = jwt.verify(token, segredo);

        if (dados.tipo !== 'admin') {
            return res.status(403).json({
                mensagem: 'Acesso permitido somente para administradores.'
            });
        }

        req.admin = {
            id: dados.id,
            email: dados.email
        };

        next();

    } catch (erro) {
        return res.status(401).json({
            mensagem: 'Token inválido ou expirado.'
        });
    }
}

module.exports = autenticarAdmin;
