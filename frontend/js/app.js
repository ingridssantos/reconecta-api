
/* =================================
   RECONNECTA - APLICAÇÃO
================================= */

/* =================================
   AUTENTICAÇÃO DO ADMINISTRADOR
================================= */

let tokenAdmin = null;
let administradorLogado = null;

// Controle de edição
let doacaoEmEdicao = null;
let solicitacaoEmEdicao = null;


// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {

    console.log('ReConecta iniciado com sucesso!');

    iniciarTema();
    iniciarMurais();
    iniciarCadastroDoacao();
    iniciarCadastroSolicitacao();
    iniciarFiltros();
    iniciarAutenticacaoAdmin();

    carregarDoacoes();
    carregarSolicitacoes();

});


/* =================================
   GERENCIAMENTO DO TEMA
================================= */

function iniciarTema() {

    const temaSalvo = localStorage.getItem('reconecta-tema');
    const temaInicial = temaSalvo || 'clean';

    document.documentElement.setAttribute('data-theme', temaInicial);

}

function alternarTema() {

    const temaAtual = document.documentElement.getAttribute('data-theme');
    const novoTema = temaAtual === 'dark' ? 'clean' : 'dark';

    document.documentElement.setAttribute('data-theme', novoTema);

    localStorage.setItem('reconecta-tema', novoTema);

}


/* =================================
   NAVEGAÇÃO E MODAIS
================================= */

function iniciarMurais() {

    const abas = document.querySelectorAll('.mural-tab');
    const conteudos = document.querySelectorAll('.mural-content');

    abas.forEach(aba => {

        aba.addEventListener('click', () => {

            const muralSelecionado = aba.dataset.mural;

            abas.forEach(item => item.classList.remove('active'));
            aba.classList.add('active');

            conteudos.forEach(conteudo => {
                conteudo.classList.remove('active');
            });

            const conteudoSelecionado = document.getElementById(
                `mural-${muralSelecionado}`
            );

            if (conteudoSelecionado) {
                conteudoSelecionado.classList.add('active');
            }

            aplicarFiltros();

        });

    });


    function configurarModal(configuracao) {

        const btnAbrir = document.getElementById(configuracao.abrir);
        const modal = document.getElementById(configuracao.modal);
        const btnFechar = document.getElementById(configuracao.fechar);
        const btnCancelar = document.getElementById(configuracao.cancelar);
        const form = document.getElementById(configuracao.form);

        if (!modal) return null;

        function abrirModal() {

            modal.hidden = false;
            document.body.style.overflow = 'hidden';

        }

        function fecharModal() {

            modal.hidden = true;
            document.body.style.overflow = '';

        }

        if (btnAbrir) {
            btnAbrir.addEventListener('click', () => {
                configuracao.aoAbrir?.();
                abrirModal();
            });
        }

        if (btnFechar) {

            btnFechar.addEventListener('click', () => {
                configuracao.aoFechar?.();
                fecharModal();
            });

        }

        if (btnCancelar) {

            btnCancelar.addEventListener('click', () => {

                if (form) {
                    form.reset();
                }

                configuracao.aoFechar?.();
                fecharModal();

            });

        }

        modal.addEventListener('click', evento => {

            if (evento.target === modal) {
                configuracao.aoFechar?.();
                fecharModal();
            }

        });

        return fecharModal;

    }


    const fecharModalSolicitacao = configurarModal({
        abrir: 'cadastrar-solicitacao',
        modal: 'modal-solicitacao',
        fechar: 'btn-fechar-modal',
        cancelar: 'btn-cancelar-solicitacao',
        form: 'form-solicitacao',
        aoAbrir: prepararNovaSolicitacao,
        aoFechar: cancelarEdicaoSolicitacao
    });


    const fecharModalDoacao = configurarModal({
        abrir: 'cadastrar-doacao',
        modal: 'modal-doacao',
        fechar: 'btn-fechar-modal-doacao',
        cancelar: 'btn-cancelar-doacao',
        form: 'form-doacao',
        aoAbrir: prepararNovaDoacao,
        aoFechar: cancelarEdicaoDoacao
    });


    // BOTÃO DE DOAÇÃO DO BANNER
    const btnBannerDoacao = document.getElementById(
        'banner-cadastrar-doacao'
    );

    if (btnBannerDoacao) {
        btnBannerDoacao.addEventListener('click', () => {
            document.getElementById('cadastrar-doacao').click();
        });
    }


    // MENU DE CADASTRO DO CABEÇALHO
    const btnMenuCadastro = document.getElementById('btn-menu-cadastro');
    const menuCadastro = document.getElementById('menu-cadastro');

    const opcaoDoacao = document.getElementById('menu-cadastrar-doacao');
    const opcaoSolicitacao = document.getElementById('menu-cadastrar-solicitacao');

    if (btnMenuCadastro && menuCadastro) {

        btnMenuCadastro.addEventListener('click', () => {

            menuCadastro.hidden = !menuCadastro.hidden;

            btnMenuCadastro.setAttribute(
                'aria-expanded',
                String(!menuCadastro.hidden)
            );

        });

        if (opcaoDoacao) {

            opcaoDoacao.addEventListener('click', () => {

                menuCadastro.hidden = true;
                btnMenuCadastro.setAttribute('aria-expanded', 'false');

                document.getElementById('cadastrar-doacao').click();

            });

        }

        if (opcaoSolicitacao) {

            opcaoSolicitacao.addEventListener('click', () => {

                menuCadastro.hidden = true;
                btnMenuCadastro.setAttribute('aria-expanded', 'false');

                document.getElementById('cadastrar-solicitacao').click();

            });

        }

        document.addEventListener('click', evento => {

            if (
                !btnMenuCadastro.contains(evento.target) &&
                !menuCadastro.contains(evento.target)
            ) {
                menuCadastro.hidden = true;
                btnMenuCadastro.setAttribute('aria-expanded', 'false');
            }

        });

    }


    document.addEventListener('keydown', evento => {

        if (evento.key === 'Escape') {

            if (fecharModalSolicitacao) {
                fecharModalSolicitacao();
            }

            if (fecharModalDoacao) {
                fecharModalDoacao();
            }

        }

    });

}


/* =================================
   LOGIN E LOGOUT DO ADMINISTRADOR
================================= */

function iniciarAutenticacaoAdmin() {

    const btnLoginAdmin = document.getElementById('btn-login-admin');
    const modalLoginAdmin = document.getElementById('modal-login-admin');
    const btnFecharLogin = document.getElementById('btn-fechar-login');
    const btnCancelarLogin = document.getElementById('btn-cancelar-login');
    const formLoginAdmin = document.getElementById('form-login-admin');
    const btnLogoutAdmin = document.getElementById('btn-logout-admin');

    function abrirLoginAdmin() {

        modalLoginAdmin.hidden = false;
        document.body.style.overflow = 'hidden';

    }

    function fecharLoginAdmin() {

        modalLoginAdmin.hidden = true;
        document.body.style.overflow = '';

    }


    if (btnLoginAdmin && modalLoginAdmin) {
        btnLoginAdmin.addEventListener('click', abrirLoginAdmin);
    }

    if (btnFecharLogin) {
        btnFecharLogin.addEventListener('click', fecharLoginAdmin);
    }

    if (btnCancelarLogin) {

        btnCancelarLogin.addEventListener('click', () => {

            formLoginAdmin.reset();
            fecharLoginAdmin();

        });

    }

    if (modalLoginAdmin) {

        modalLoginAdmin.addEventListener('click', evento => {

            if (evento.target === modalLoginAdmin) {
                fecharLoginAdmin();
            }

        });

    }


    // Realizar login
    if (formLoginAdmin) {

        formLoginAdmin.addEventListener('submit', async evento => {

            evento.preventDefault();

            const email = formLoginAdmin.elements['email'].value.trim();
            const senha = formLoginAdmin.elements['senha'].value;

            const mensagem = document.getElementById('mensagem-login-admin');

            mensagem.textContent = '';

            try {

                const resposta = await fetch('http://localhost:3000/api/auth/login', {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({ email, senha })

                });

                const resultado = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(
                        resultado.mensagem || resultado.erro ||
                        'Não foi possível realizar o login.'
                    );
                }

                tokenAdmin = resultado.token;
                administradorLogado = resultado.administrador;

                document.getElementById('admin-nome').textContent =
                    `Olá, ${administradorLogado.nome}`;

                document.getElementById('btn-login-admin').hidden = true;
                document.getElementById('admin-logado').hidden = false;

                formLoginAdmin.reset();
                fecharLoginAdmin();

                await carregarDoacoes();
                await carregarSolicitacoes();

                alert('Login realizado com sucesso!');

            } catch (erro) {

                console.error('Erro no login:', erro);
                mensagem.textContent = erro.message;

            }

        });

    }


    // Realizar logout
    if (btnLogoutAdmin) {

        btnLogoutAdmin.addEventListener('click', async () => {

            tokenAdmin = null;
            administradorLogado = null;

            cancelarEdicaoDoacao();
            cancelarEdicaoSolicitacao();

            document.getElementById('btn-login-admin').hidden = false;
            document.getElementById('admin-logado').hidden = true;

            await carregarDoacoes();
            await carregarSolicitacoes();

            alert('Você saiu da conta administrativa.');

        });

    }


    document.addEventListener('keydown', evento => {

        if (
            evento.key === 'Escape' &&
            modalLoginAdmin &&
            !modalLoginAdmin.hidden
        ) {
            fecharLoginAdmin();
        }

    });

}


/* =================================
   FILTROS DOS MURAIS
================================= */

function iniciarFiltros() {

    const busca = document.getElementById('filtro-busca');
    const categoria = document.getElementById('filtro-categoria');
    const localizacao = document.getElementById('filtro-localizacao');

    if (!busca || !categoria || !localizacao) {
        console.warn('Campos de filtro não encontrados.');
        return;
    }

    busca.addEventListener('input', aplicarFiltros);
    categoria.addEventListener('change', aplicarFiltros);
    localizacao.addEventListener('change', aplicarFiltros);

    aplicarFiltros();

}


/* =================================
   APLICAÇÃO DOS FILTROS
================================= */

function aplicarFiltros() {

    const busca = document.getElementById('filtro-busca');
    const categoria = document.getElementById('filtro-categoria');
    const localizacao = document.getElementById('filtro-localizacao');

    if (!busca || !categoria || !localizacao) return;

    const termoBusca = normalizarTexto(busca.value);
    const categoriaSelecionada = normalizarTexto(categoria.value);
    const localizacaoSelecionada = normalizarTexto(localizacao.value);

    const muralAtivo = document.querySelector('.mural-content.active');

    if (!muralAtivo) return;

    const cards = muralAtivo.querySelectorAll('.mural-card');

    cards.forEach(card => {

        const titulo = normalizarTexto(
            card.querySelector('.card-title')?.textContent || ''
        );

        const descricao = normalizarTexto(
            card.querySelector('.card-description')?.textContent || ''
        );

        const categoriaCard = normalizarTexto(
            card.querySelector('.card-category')?.textContent || ''
        );

        const informacoes = card.querySelector('.card-information-row');

        const localizacaoCard = normalizarTexto(
            informacoes?.querySelector('span:first-child')?.textContent || ''
        );

        const correspondeBusca =
            !termoBusca ||
            titulo.includes(termoBusca) ||
            descricao.includes(termoBusca);

        const correspondeCategoria =
            !categoriaSelecionada ||
            categoriaCard === categoriaSelecionada;

        const correspondeLocalizacao =
            !localizacaoSelecionada ||
            localizacaoCard.includes(localizacaoSelecionada);

        card.style.display =
            correspondeBusca &&
            correspondeCategoria &&
            correspondeLocalizacao
                ? ''
                : 'none';

    });


    let mensagemVazia = muralAtivo.querySelector('.mensagem-vazia');

    const resultadosVisiveis = [...cards].some(card => {
        return card.style.display !== 'none';
    });

    if (!resultadosVisiveis) {

        if (!mensagemVazia) {

            mensagemVazia = document.createElement('div');
            mensagemVazia.className = 'mensagem-vazia';

            mensagemVazia.textContent =
                'Nenhum resultado encontrado. Tente alterar os filtros ou buscar por outro termo.';

            muralAtivo.appendChild(mensagemVazia);

        }

    } else if (mensagemVazia) {

        mensagemVazia.remove();

    }

}


/* =================================
   NORMALIZAÇÃO DE TEXTO
================================= */

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

}


/* =================================
   CONTATO PELO WHATSAPP
================================= */

function abrirWhatsApp(contato, telefone, tipo, titulo) {

    if (!telefone) {

        alert(
            'Este cadastro ainda não possui um WhatsApp informado.'
        );

        return;

    }

    // Mantém somente os números do telefone
    let numero = String(telefone).replace(/\D/g, '');

    // Adiciona o código do Brasil quando necessário
    if (numero.length === 10 || numero.length === 11) {
        numero = `55${numero}`;
    }

    if (numero.length < 12 || numero.length > 13) {

        alert(
            'O número de WhatsApp cadastrado parece inválido.'
        );

        return;

    }

    let mensagem;

    if (tipo === 'doacao') {

        mensagem =
            `Olá, ${contato || 'tudo bem'}! Tenho interesse na doação "${titulo}" que vi no ReConecta.`;

    } else {

        mensagem =
            `Olá, ${contato || 'tudo bem'}! Vi sua solicitação "${titulo}" no ReConecta e gostaria de ajudar.`;

    }

    const url =
        `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank', 'noopener,noreferrer');

}


/* =================================
   PREPARAR FORMULÁRIOS
================================= */

function prepararNovaDoacao() {

    const form = document.getElementById('form-doacao');

    if (!form || doacaoEmEdicao !== null) return;

    form.reset();

    form.querySelector('button[type="submit"]').textContent =
        'Cadastrar doação';

    document.querySelector('#modal-doacao h2').textContent =
        'Quero fazer uma doação';

    document.querySelector('#modal-doacao .modal-header p').textContent =
        'Compartilhe o que você pode oferecer à comunidade.';

}


function prepararNovaSolicitacao() {

    const form = document.getElementById('form-solicitacao');

    if (!form || solicitacaoEmEdicao !== null) return;

    form.reset();

    form.querySelector('button[type="submit"]').textContent =
        'Enviar solicitação';

    document.querySelector('#modal-solicitacao h2').textContent =
        'Nova solicitação';

    document.querySelector('#modal-solicitacao .modal-header p').textContent =
        'Compartilhe sua necessidade com a comunidade.';

}


function cancelarEdicaoDoacao() {

    doacaoEmEdicao = null;

    const form = document.getElementById('form-doacao');

    if (!form) return;

    form.reset();

    form.querySelector('button[type="submit"]').textContent =
        'Cadastrar doação';

    document.querySelector('#modal-doacao h2').textContent =
        'Quero fazer uma doação';

    document.querySelector('#modal-doacao .modal-header p').textContent =
        'Compartilhe o que você pode oferecer à comunidade.';

}


function cancelarEdicaoSolicitacao() {

    solicitacaoEmEdicao = null;

    const form = document.getElementById('form-solicitacao');

    if (!form) return;

    form.reset();

    form.querySelector('button[type="submit"]').textContent =
        'Enviar solicitação';

    document.querySelector('#modal-solicitacao h2').textContent =
        'Nova solicitação';

    document.querySelector('#modal-solicitacao .modal-header p').textContent =
        'Compartilhe sua necessidade com a comunidade.';

}


/* =================================
   EDITAR DOAÇÃO
================================= */

function editarDoacao(doacao) {

    if (!tokenAdmin) {
        alert('Faça login como administrador para editar.');
        return;
    }

    const form = document.getElementById('form-doacao');
    const modal = document.getElementById('modal-doacao');

    doacaoEmEdicao = doacao.id;

    form.elements['titulo'].value = doacao.titulo || '';
    form.elements['descricao'].value = doacao.descricao || '';
    form.elements['categoria'].value = doacao.categoria || '';
    form.elements['localizacao'].value = doacao.localizacao || '';
    form.elements['nomeContato'].value = doacao.nomeContato || '';
    form.elements['whatsapp'].value = doacao.whatsapp || '';

    document.querySelector('#modal-doacao h2').textContent =
        'Editar doação';

    document.querySelector('#modal-doacao .modal-header p').textContent =
        'Atualize as informações desta doação.';

    form.querySelector('button[type="submit"]').textContent =
        'Salvar alterações';

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

}


/* =================================
   EDITAR SOLICITAÇÃO
================================= */

function editarSolicitacao(solicitacao) {

    if (!tokenAdmin) {
        alert('Faça login como administrador para editar.');
        return;
    }

    const form = document.getElementById('form-solicitacao');
    const modal = document.getElementById('modal-solicitacao');

    solicitacaoEmEdicao = solicitacao.id;

    form.elements['titulo'].value = solicitacao.titulo || '';
    form.elements['descricao'].value = solicitacao.descricao || '';
    form.elements['categoria'].value = solicitacao.categoria || '';
    form.elements['localizacao'].value = solicitacao.localizacao || '';
    form.elements['prioridade'].value =
        solicitacao.prioridade || 'moderada';
    form.elements['nomeContato'].value = solicitacao.nomeContato || '';
    form.elements['whatsapp'].value = solicitacao.whatsapp || '';

    document.querySelector('#modal-solicitacao h2').textContent =
        'Editar solicitação';

    document.querySelector('#modal-solicitacao .modal-header p').textContent =
        'Atualize as informações desta solicitação.';

    form.querySelector('button[type="submit"]').textContent =
        'Salvar alterações';

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

}


/* =================================
   AÇÕES ADMINISTRATIVAS DOS CARDS
================================= */

function criarAcoesAdmin(tipo, registro) {

    if (!tokenAdmin) return null;

    const acoesAdmin = document.createElement('div');
    acoesAdmin.className = 'card-admin-actions';

    const botaoEditar = document.createElement('button');

    botaoEditar.type = 'button';
    botaoEditar.className = 'button-secondary';
    botaoEditar.textContent = 'Editar';

    botaoEditar.addEventListener('click', () => {

        if (tipo === 'doacao') {
            editarDoacao(registro);
        }

        if (tipo === 'solicitacao') {
            editarSolicitacao(registro);
        }

    });


    const botaoExcluir = document.createElement('button');

    botaoExcluir.type = 'button';
    botaoExcluir.className = 'button-secondary';
    botaoExcluir.textContent = 'Excluir';

    botaoExcluir.addEventListener('click', () => {

        if (tipo === 'doacao') {
            excluirDoacao(registro.id);
        }

        if (tipo === 'solicitacao') {
            excluirSolicitacao(registro.id);
        }

    });

    acoesAdmin.append(botaoEditar, botaoExcluir);

    return acoesAdmin;

}


/* =================================
   INTEGRAÇÃO COM A API - DOAÇÕES
================================= */

async function carregarDoacoes() {

    const listaDoacoes = document.getElementById('lista-doacoes');

    try {

        const resposta = await fetch('http://localhost:3000/api/doacoes');

        if (!resposta.ok) {
            throw new Error('Não foi possível carregar as doações.');
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
            throw new Error('Formato de resposta inválido.');
        }

        listaDoacoes.innerHTML = '';

        dados.forEach(doacao => {

            const card = document.createElement('article');
            card.className = 'mural-card';

            const tags = document.createElement('div');
            tags.className = 'card-tags';

            const categoria = document.createElement('span');
            categoria.className = 'card-category';
            categoria.textContent = doacao.categoria;

            const status = document.createElement('span');
            status.className = 'card-status available';

            status.textContent =
                doacao.status === 'disponivel'
                    ? 'Disponível'
                    : doacao.status;

            tags.append(categoria, status);

            const titulo = document.createElement('h3');
            titulo.className = 'card-title';
            titulo.textContent = doacao.titulo;

            const descricao = document.createElement('p');
            descricao.className = 'card-description';
            descricao.textContent = doacao.descricao;

            const informacoes = document.createElement('div');
            informacoes.className = 'card-information';

            const linhaInformacoes = document.createElement('div');
            linhaInformacoes.className = 'card-information-row';

            const localizacao = document.createElement('span');
            localizacao.textContent = `📍 ${doacao.localizacao}`;

            const data = document.createElement('span');

            data.textContent = doacao.dataCadastro
                ? `Publicado em ${new Date(doacao.dataCadastro).toLocaleDateString('pt-BR')}`
                : 'Data não informada';

            linhaInformacoes.append(localizacao, data);
            informacoes.appendChild(linhaInformacoes);

            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'card-action';
            botao.textContent = 'TENHO INTERESSE';

            botao.addEventListener('click', () => {

                abrirWhatsApp(
                    doacao.nomeContato,
                    doacao.whatsapp,
                    'doacao',
                    doacao.titulo
                );

            });

            card.append(tags, titulo, descricao, informacoes, botao);

            const acoesAdmin = criarAcoesAdmin('doacao', doacao);

            if (acoesAdmin) {
                card.appendChild(acoesAdmin);
            }

            listaDoacoes.appendChild(card);

        });

        aplicarFiltros();

    } catch (erro) {

        console.error('Erro ao carregar doações:', erro);

        listaDoacoes.innerHTML = `
            <p class="mensagem-vazia">
                Não foi possível carregar as doações.
                Tente novamente mais tarde.
            </p>
        `;

    }

}


/* =================================
   INTEGRAÇÃO COM A API - SOLICITAÇÕES
================================= */

async function carregarSolicitacoes() {

    const listaSolicitacoes = document.getElementById('lista-solicitacoes');

    try {

        const resposta = await fetch('http://localhost:3000/api/solicitacoes');

        if (!resposta.ok) {
            throw new Error('Não foi possível carregar as solicitações.');
        }

        const dados = await resposta.json();

        const solicitacoes = Array.isArray(dados) ? dados : [dados];

        listaSolicitacoes.innerHTML = '';

        solicitacoes.forEach(solicitacao => {

            const card = document.createElement('article');
            card.className = 'mural-card';

            const tags = document.createElement('div');
            tags.className = 'card-tags';

            const categoria = document.createElement('span');
            categoria.className = 'card-category';
            categoria.textContent = solicitacao.categoria;

            const status = document.createElement('span');
            status.className = 'card-status';

            status.textContent =
                solicitacao.status === 'aberta'
                    ? 'Aberta'
                    : solicitacao.status;

            const prioridade = document.createElement('span');

            prioridade.className =
                `card-priority ${solicitacao.prioridade || 'moderada'}`;

            const prioridades = {
                urgente: 'Urgente',
                moderada: 'Moderada',
                continua: 'Contínua'
            };

            prioridade.textContent =
                prioridades[solicitacao.prioridade] || 'Moderada';

            tags.append(categoria, status, prioridade);

            const titulo = document.createElement('h3');
            titulo.className = 'card-title';
            titulo.textContent = solicitacao.titulo;

            const descricao = document.createElement('p');
            descricao.className = 'card-description';
            descricao.textContent = solicitacao.descricao;

            const informacoes = document.createElement('div');
            informacoes.className = 'card-information';

            const linhaInformacoes = document.createElement('div');
            linhaInformacoes.className = 'card-information-row';

            const localizacao = document.createElement('span');
            localizacao.textContent = `📍 ${solicitacao.localizacao}`;

            const data = document.createElement('span');

            data.textContent = solicitacao.dataCadastro
                ? `Publicado em ${new Date(solicitacao.dataCadastro).toLocaleDateString('pt-BR')}`
                : 'Data não informada';

            linhaInformacoes.append(localizacao, data);
            informacoes.appendChild(linhaInformacoes);

            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'card-action';
            botao.textContent = 'QUERO AJUDAR';

            botao.addEventListener('click', () => {

                abrirWhatsApp(
                    solicitacao.nomeContato,
                    solicitacao.whatsapp,
                    'solicitacao',
                    solicitacao.titulo
                );

            });

            card.append(tags, titulo, descricao, informacoes, botao);

            const acoesAdmin = criarAcoesAdmin(
                'solicitacao',
                solicitacao
            );

            if (acoesAdmin) {
                card.appendChild(acoesAdmin);
            }

            listaSolicitacoes.appendChild(card);

        });

        aplicarFiltros();

    } catch (erro) {

        console.error('Erro ao carregar solicitações:', erro);

        listaSolicitacoes.innerHTML = `
            <p class="mensagem-vazia">
                Não foi possível carregar as solicitações.
                Tente novamente mais tarde.
            </p>
        `;

    }

}


/* =================================
   CADASTRO E EDIÇÃO DE DOAÇÕES
================================= */

function iniciarCadastroDoacao() {

    const form = document.getElementById('form-doacao');
    const modal = document.getElementById('modal-doacao');

    if (!form) return;

    form.addEventListener('submit', async evento => {

        evento.preventDefault();

        const dadosDoacao = {

            titulo: form.elements['titulo'].value.trim(),
            descricao: form.elements['descricao'].value.trim(),
            categoria: form.elements['categoria'].value.trim(),
            localizacao: form.elements['localizacao'].value.trim(),
            nomeContato: form.elements['nomeContato'].value.trim(),
            whatsapp: form.elements['whatsapp'].value.trim()

        };

        const editando = doacaoEmEdicao !== null;

        const url = editando
            ? `http://localhost:3000/api/doacoes/${doacaoEmEdicao}`
            : 'http://localhost:3000/api/doacoes';

        try {

            const resposta = await fetch(url, {

                method: editando ? 'PUT' : 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    ...(editando
                        ? { 'Authorization': `Bearer ${tokenAdmin}` }
                        : {})
                },

                body: JSON.stringify(dadosDoacao)

            });

            const resultado = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    resultado.mensagem ||
                    resultado.erro ||
                    'Não foi possível salvar a doação.'
                );

            }

            alert(
                editando
                    ? 'Doação atualizada com sucesso!'
                    : 'Doação cadastrada com sucesso!'
            );

            cancelarEdicaoDoacao();

            modal.hidden = true;
            document.body.style.overflow = '';

            await carregarDoacoes();

        } catch (erro) {

            console.error('Erro ao salvar doação:', erro);
            alert(erro.message);

        }

    });

}


/* =================================
   CADASTRO E EDIÇÃO DE SOLICITAÇÕES
================================= */

function iniciarCadastroSolicitacao() {

    const form = document.getElementById('form-solicitacao');
    const modal = document.getElementById('modal-solicitacao');

    if (!form) return;

    form.addEventListener('submit', async evento => {

        evento.preventDefault();

        const dadosSolicitacao = {

            titulo: form.elements['titulo'].value.trim(),
            descricao: form.elements['descricao'].value.trim(),
            categoria: form.elements['categoria'].value.trim(),
            localizacao: form.elements['localizacao'].value.trim(),
            prioridade: form.elements['prioridade'].value,
            nomeContato: form.elements['nomeContato'].value.trim(),
            whatsapp: form.elements['whatsapp'].value.trim()

        };

        const editando = solicitacaoEmEdicao !== null;

        const url = editando
            ? `http://localhost:3000/api/solicitacoes/${solicitacaoEmEdicao}`
            : 'http://localhost:3000/api/solicitacoes';

        try {

            const resposta = await fetch(url, {

                method: editando ? 'PUT' : 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    ...(editando
                        ? { 'Authorization': `Bearer ${tokenAdmin}` }
                        : {})
                },

                body: JSON.stringify(dadosSolicitacao)

            });

            const resultado = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    resultado.mensagem ||
                    resultado.erro ||
                    'Não foi possível salvar a solicitação.'
                );

            }

            alert(
                editando
                    ? 'Solicitação atualizada com sucesso!'
                    : 'Solicitação cadastrada com sucesso!'
            );

            cancelarEdicaoSolicitacao();

            modal.hidden = true;
            document.body.style.overflow = '';

            await carregarSolicitacoes();

        } catch (erro) {

            console.error('Erro ao salvar solicitação:', erro);
            alert(erro.message);

        }

    });

}


/* =================================
   EXCLUIR DOAÇÃO
================================= */

async function excluirDoacao(id) {

    const confirmar = confirm(
        'Tem certeza de que deseja excluir esta doação?'
    );

    if (!confirmar) return;

    try {

        const resposta = await fetch(
            `http://localhost:3000/api/doacoes/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenAdmin}`
                }
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                resultado.erro ||
                'Não foi possível excluir a doação.'
            );

        }

        alert('Doação excluída com sucesso!');

        await carregarDoacoes();

    } catch (erro) {

        console.error('Erro ao excluir doação:', erro);
        alert(erro.message);

    }

}


/* =================================
   EXCLUIR SOLICITAÇÃO
================================= */

async function excluirSolicitacao(id) {

    const confirmar = confirm(
        'Tem certeza de que deseja excluir esta solicitação?'
    );

    if (!confirmar) return;

    try {

        const resposta = await fetch(
            `http://localhost:3000/api/solicitacoes/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenAdmin}`
                }
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                resultado.erro ||
                'Não foi possível excluir a solicitação.'
            );

        }

        alert('Solicitação excluída com sucesso!');

        await carregarSolicitacoes();

    } catch (erro) {

        console.error('Erro ao excluir solicitação:', erro);
        alert(erro.message);

    }

}
