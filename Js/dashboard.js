/*
|--------------------------------------------------------------------------
| VERIFICAR AUTENTICAÇÃO
|--------------------------------------------------------------------------
*/

const usuario = obterUsuario();

if (!usuarioLogado()) {

    window.location.href =
        'login.html';

}


/*
|--------------------------------------------------------------------------
| ELEMENTOS DO USUÁRIO
|--------------------------------------------------------------------------
*/

const nomeUsuario =
    document.getElementById(
        'nomeUsuario'
    );


const nomeUsuarioTopo =
    document.getElementById(
        'nomeUsuarioTopo'
    );


const avatarUsuario =
    document.getElementById(
        'avatarUsuario'
    );


/*
|--------------------------------------------------------------------------
| MOSTRAR DADOS DO USUÁRIO
|--------------------------------------------------------------------------
*/

const nome =
    usuario?.nome || 'Aluno';


if (nomeUsuario) {

    nomeUsuario.textContent =
        nome;

}


if (nomeUsuarioTopo) {

    nomeUsuarioTopo.textContent =
        nome;

}


if (avatarUsuario) {

    avatarUsuario.textContent =
        nome
            .charAt(0)
            .toUpperCase();

}


/*
|--------------------------------------------------------------------------
| CARREGAR DASHBOARD
|--------------------------------------------------------------------------
*/

async function carregarDashboard() {

    const mensagemErro =
        document.getElementById(
            'dashboardErro'
        );


    try {

        /*
        ------------------------------------------------------
        ACESSO DO USUÁRIO
        ------------------------------------------------------
        */

        const acesso =
            await buscarMeuAcesso();


        document.getElementById(
            'cursoNome'
        ).textContent =
            'Estruturas de Dados';


        document.getElementById(
            'moduloMaximo'
        ).textContent =
            acesso.acesso.modulo_maximo;


        const status =
            acesso.acesso.status;


        const statusElemento =
            document.getElementById(
                'statusAcesso'
            );


        statusElemento.textContent =
            status === 'ativo'
                ? '✓ Ativo'
                : status;


        /*
        ------------------------------------------------------
        PROGRESSO DO CURSO
        ------------------------------------------------------
        */

        const progresso =
            await buscarProgressoCurso(
                1
            );


        const percentual =
            Number(
                progresso.percentual || 0
            );


        document.getElementById(
            'percentual'
        ).textContent =
            `${percentual}%`;


        document.getElementById(
            'barraProgresso'
        ).style.width =
            `${percentual}%`;


        document.getElementById(
            'aulasConcluidas'
        ).textContent =
            `${progresso.aulas_concluidas} de ${progresso.total_aulas} aulas concluídas`;


        /*
        ------------------------------------------------------
        MÓDULOS DO CURSO
        ------------------------------------------------------
        */

        const modulos =
            await buscarModulos(
                1
            );


        const lista =
            document.getElementById(
                'listaModulos'
            );


        /*
        Caso não existam módulos.
        */

        if (
            !modulos ||
            modulos.length === 0
        ) {

            lista.innerHTML = `

                <div class="loading">

                    Nenhum módulo disponível.

                </div>

            `;


            return;

        }


        /*
        Criar os módulos.
        */

        lista.innerHTML =
            modulos.map(
                function(modulo) {


                    const descricao =
                        modulo.descricao ||
                        'Conteúdo organizado para o seu aprendizado.';


                    /*
                    Link direto para a página
                    do módulo.
                    */

                    const linkModulo =
                        `modulo.html?id=${modulo.id}&cursoId=1`;


                    return `

                        <div
                            class="modulo-dashboard ${modulo.bloqueado ? 'bloqueado' : ''}"
                        >


                            <div class="modulo-dashboard-numero">

                                ${String(
                                    modulo.ordem
                                ).padStart(2, '0')}

                            </div>


                            <div class="modulo-dashboard-info">


                                <span>

                                    MÓDULO
                                    ${modulo.ordem}

                                </span>


                                <h3>

                                    ${modulo.titulo}

                                </h3>


                                <p>

                                    ${descricao}

                                </p>


                            </div>


                            <div class="modulo-dashboard-acao">


                                ${
                                    modulo.bloqueado

                                        ? `

                                            <span class="status-lock">

                                                🔒 Bloqueado

                                            </span>

                                        `

                                        : `

                                            <a
                                                class="btn btn-primary"
                                                href="${linkModulo}"
                                            >

                                                Abrir
                                                <span>→</span>

                                            </a>

                                        `
                                }


                            </div>


                        </div>

                    `;

                }
            )
            .join('');


    } catch (erro) {

        console.error(
            'Erro ao carregar dashboard:',
            erro
        );


        if (mensagemErro) {

            mensagemErro.textContent =
                erro.message ||
                'Não foi possível carregar o dashboard.';


            mensagemErro.style.display =
                'block';

        }

    }

}


/*
|--------------------------------------------------------------------------
| INICIAR DASHBOARD
|--------------------------------------------------------------------------
*/

carregarDashboard();