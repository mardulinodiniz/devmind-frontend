/*
|--------------------------------------------------------------------------
| ADMINISTRADOR - DEVMIND
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| ELEMENTOS
|--------------------------------------------------------------------------
*/

const adminNome =
    document.getElementById('adminNome');

const adminAvatar =
    document.getElementById('adminAvatar');

const adminMensagem =
    document.getElementById('adminMensagem');

const totalAlunos =
    document.getElementById('totalAlunos');

const totalModulos =
    document.getElementById('totalModulos');

const totalAulas =
    document.getElementById('totalAulas');

const totalAcessos =
    document.getElementById('totalAcessos');

const statusSistema =
    document.getElementById('statusSistema');

const formAcesso =
    document.getElementById('formAcesso');

const btnAtualizarAcesso =
    document.getElementById('btnAtualizarAcesso');


/*
|--------------------------------------------------------------------------
| VERIFICAR LOGIN
|--------------------------------------------------------------------------
*/

if (!usuarioLogado()) {

    window.location.href =
        'login.html';

}


/*
|--------------------------------------------------------------------------
| DADOS DO ADMINISTRADOR
|--------------------------------------------------------------------------
*/

const usuario =
    obterUsuario();


if (!usuario || usuario.tipo !== 'admin') {

    alert(
        'Acesso negado. Apenas administradores podem acessar esta página.'
    );

    sair();

}


/*
|--------------------------------------------------------------------------
| MOSTRAR ADMINISTRADOR
|--------------------------------------------------------------------------
*/

if (usuario) {

    const nome =
        usuario.nome || 'Administrador';

    adminNome.textContent =
        nome;

    adminAvatar.textContent =
        nome
            .charAt(0)
            .toUpperCase();

}


/*
|--------------------------------------------------------------------------
| MENSAGEM
|--------------------------------------------------------------------------
*/

function mostrarMensagem(
    texto,
    tipo = 'sucesso'
) {

    adminMensagem.textContent =
        texto;

    adminMensagem.className =
        `admin-mensagem ${tipo}`;

}


/*
|--------------------------------------------------------------------------
| CARREGAR ESTATÍSTICAS
|--------------------------------------------------------------------------
*/

async function carregarEstatisticas() {

    try {

        /*
        ----------------------------------------------------------
        BUSCAR MÓDULOS
        ----------------------------------------------------------
        */

        const modulos =
            await buscarModulos(1);

        totalModulos.textContent =
            modulos.length;


        /*
        ----------------------------------------------------------
        CONTAR AULAS
        ----------------------------------------------------------

        As aulas são buscadas módulo por módulo.
        */

        let quantidadeAulas = 0;

        for (
            const modulo of modulos
        ) {

            try {

                const aulas =
                    await buscarAulas(
                        modulo.id
                    );

                quantidadeAulas +=
                    aulas.length;

            } catch (erro) {

                console.warn(
                    `Não foi possível carregar as aulas do módulo ${modulo.id}`,
                    erro
                );

            }

        }

        totalAulas.textContent =
            quantidadeAulas;


        /*
        ----------------------------------------------------------
        BUSCAR USUÁRIOS
        ----------------------------------------------------------

        Esta parte depende do endpoint administrativo
        existente no backend.
        */

        await carregarUsuarios();


        /*
        ----------------------------------------------------------
        ACESSOS
        ----------------------------------------------------------
        */

        await carregarAcessos();


    } catch (erro) {

        console.error(
            'Erro nas estatísticas:',
            erro
        );

        totalModulos.textContent =
            '--';

        totalAulas.textContent =
            '--';

    }

}


/*
|--------------------------------------------------------------------------
| BUSCAR USUÁRIOS
|--------------------------------------------------------------------------
*/

async function carregarUsuarios() {

    try {

        /*
        O endpoint abaixo deverá existir no backend:
        
        GET /api/admin/usuarios
        */

        const token =
            localStorage.getItem(
                'token'
            );


        const resposta =
            await fetch(
                `${API_URL}/api/admin/usuarios`,
                {
                    method: 'GET',

                    headers: {
                        'Authorization':
                            `Bearer ${token}`,

                        'Content-Type':
                            'application/json'
                    }
                }
            );


        if (!resposta.ok) {

            throw new Error(
                'Não foi possível carregar os usuários.'
            );

        }


        const dados =
            await resposta.json();


        const usuarios =
            dados.usuarios ||
            dados;


        /*
        Conta somente alunos.
        */

        const alunos =
            Array.isArray(usuarios)
                ? usuarios.filter(
                    u => u.tipo === 'aluno'
                )
                : [];


        totalAlunos.textContent =
            alunos.length;


    } catch (erro) {

        console.warn(
            'Usuários:',
            erro.message
        );

        totalAlunos.textContent =
            '--';

    }

}


/*
|--------------------------------------------------------------------------
| CONTAR ACESSOS
|--------------------------------------------------------------------------
*/

async function carregarAcessos() {

    try {

        /*
        Este endpoint será ligado ao backend.
        */

        const token =
            localStorage.getItem(
                'token'
            );


        const resposta =
            await fetch(
                `${API_URL}/api/admin/acessos`,
                {
                    method: 'GET',

                    headers: {
                        'Authorization':
                            `Bearer ${token}`,

                        'Content-Type':
                            'application/json'
                    }
                }
            );


        if (!resposta.ok) {

            throw new Error(
                'Não foi possível carregar os acessos.'
            );

        }


        const dados =
            await resposta.json();


        const acessos =
            dados.acessos ||
            dados;


        totalAcessos.textContent =
            Array.isArray(acessos)
                ? acessos.filter(
                    acesso =>
                        acesso.status === 'ativo'
                ).length
                : '--';


    } catch (erro) {

        console.warn(
            'Acessos:',
            erro.message
        );

        totalAcessos.textContent =
            '--';

    }

}


/*
|--------------------------------------------------------------------------
| ATUALIZAR ACESSO DO ALUNO
|--------------------------------------------------------------------------
*/

if (formAcesso) {

    formAcesso.addEventListener(
        'submit',
        async function(evento) {

            evento.preventDefault();


            const usuarioId =
                document.getElementById(
                    'usuarioId'
                ).value;


            const moduloMaximo =
                document.getElementById(
                    'moduloMaximo'
                ).value;


            if (!usuarioId) {

                mostrarMensagem(
                    'Informe o ID do aluno.',
                    'erro'
                );

                return;

            }


            if (!moduloMaximo) {

                mostrarMensagem(
                    'Informe o módulo máximo.',
                    'erro'
                );

                return;

            }


            btnAtualizarAcesso.disabled =
                true;

            btnAtualizarAcesso.innerHTML =
                'Atualizando...';


            try {

                /*
                --------------------------------------------------
                ENDPOINT EXISTENTE DO BACKEND
                --------------------------------------------------

                PUT /api/admin/acessos/:usuarioId
                */

                const token =
                    localStorage.getItem(
                        'token'
                    );


                const resposta =
                    await fetch(
                        `${API_URL}/api/admin/acessos/${usuarioId}`,
                        {
                            method: 'PUT',

                            headers: {
                                'Authorization':
                                    `Bearer ${token}`,

                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                modulo_maximo:
                                    Number(
                                        moduloMaximo
                                    )
                            })
                        }
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        dados.message ||
                        'Não foi possível atualizar o acesso.'
                    );

                }


                mostrarMensagem(
                    'Acesso do aluno atualizado com sucesso!',
                    'sucesso'
                );


                /*
                Atualiza as estatísticas.
                */

                await carregarAcessos();


            } catch (erro) {

                console.error(
                    'Erro ao atualizar acesso:',
                    erro
                );


                mostrarMensagem(
                    erro.message ||
                    'Erro ao atualizar acesso.',
                    'erro'
                );


            } finally {

                btnAtualizarAcesso.disabled =
                    false;

                btnAtualizarAcesso.innerHTML =
                    `
                    Atualizar acesso
                    <span>→</span>
                    `;

            }

        }
    );

}


/*
|--------------------------------------------------------------------------
| TESTAR BACKEND
|--------------------------------------------------------------------------
*/

async function verificarSistema() {

    if (!statusSistema) return;


    statusSistema.innerHTML =
        `
        <span class="status-loader"></span>
        Verificando...
        `;


    try {

        /*
        Testa o backend.
        */

        const resposta =
            await fetch(
                `${API_URL}/api/meu-acesso`,
                {
                    method: 'GET',

                    headers: {
                        'Authorization':
                            `Bearer ${
                                localStorage.getItem('token')
                            }`,

                        'Content-Type':
                            'application/json'
                    }
                }
            );


        if (!resposta.ok) {

            throw new Error(
                'Backend indisponível'
            );

        }


        statusSistema.innerHTML =
            `
            <span class="status-ponto"></span>
            Backend conectado
            `;


    } catch (erro) {

        console.error(
            'Erro de conexão:',
            erro
        );


        statusSistema.innerHTML =
            `
            <span class="status-ponto erro"></span>
            Backend indisponível
            `;

    }

}


/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO
|--------------------------------------------------------------------------
*/

async function iniciarAdmin() {

    await verificarSistema();

    await carregarEstatisticas();

}


iniciarAdmin();