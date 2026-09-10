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
| CARREGAR PERFIL
|--------------------------------------------------------------------------
*/

async function carregarPerfil() {

    try {

        const perfil =
            await buscarPerfil();


        /*
        Dependendo da resposta
        do backend, usamos perfil.usuario
        ou o próprio objeto.
        */

        const usuario =
            perfil.usuario ||
            perfil;


        const nome =
            usuario.nome ||
            'Aluno';


        const email =
            usuario.email ||
            '-';


        const tipo =
            usuario.tipo ||
            'aluno';


        /*
        --------------------------------------------------------------
        AVATAR
        --------------------------------------------------------------
        */

        document.getElementById(
            'avatarPerfil'
        ).textContent =
            nome
                .charAt(0)
                .toUpperCase();


        /*
        --------------------------------------------------------------
        PERFIL
        --------------------------------------------------------------
        */

        document.getElementById(
            'nomePerfil'
        ).textContent =
            nome;


        document.getElementById(
            'emailPerfil'
        ).textContent =
            email;


        document.getElementById(
            'tipoPerfil'
        ).textContent =
            tipo;


        /*
        --------------------------------------------------------------
        INFORMAÇÕES
        --------------------------------------------------------------
        */

        document.getElementById(
            'infoNome'
        ).textContent =
            nome;


        document.getElementById(
            'infoEmail'
        ).textContent =
            email;


        document.getElementById(
            'infoTipo'
        ).textContent =
            tipo;


        /*
        --------------------------------------------------------------
        DATA DE CADASTRO
        --------------------------------------------------------------
        */

        if (
            usuario.data_cadastro
        ) {

            const data =
                new Date(
                    usuario.data_cadastro
                );


            document.getElementById(
                'dataCadastro'
            ).textContent =
                data.toLocaleDateString(
                    'pt-AO',
                    {

                        day:
                            '2-digit',

                        month:
                            'long',

                        year:
                            'numeric'

                    }
                );

        } else {

            document.getElementById(
                'dataCadastro'
            ).textContent =
                'DevMind';

        }


    } catch (erro) {

        console.error(
            'Erro ao carregar perfil:',
            erro
        );

    }

}


/*
|--------------------------------------------------------------------------
| CARREGAR PROGRESSO
|--------------------------------------------------------------------------
*/

async function carregarProgresso() {

    try {

        const progresso =
            await buscarProgressoCurso(
                1
            );


        const percentual =
            Number(
                progresso.percentual || 0
            );


        const concluidas =
            Number(
                progresso.aulas_concluidas || 0
            );


        const total =
            Number(
                progresso.total_aulas || 0
            );


        document.getElementById(
            'progressoPerfil'
        ).textContent =
            `${percentual}%`;


        document.getElementById(
            'aulasPerfil'
        ).textContent =
            concluidas;


        document.getElementById(
            'barraPerfil'
        ).style.width =
            `${percentual}%`;


        document.getElementById(
            'textoProgresso'
        ).textContent =
            `${concluidas} de ${total} aulas concluídas`;


    } catch (erro) {

        console.error(
            'Erro ao carregar progresso:',
            erro
        );

    }

}


/*
|--------------------------------------------------------------------------
| EDITAR PERFIL
|--------------------------------------------------------------------------
*/

function editarPerfil() {

    /*
    Por enquanto vamos usar
    a página de configurações.
    */

    window.location.href =
        'configuracoes.html';

}


/*
|--------------------------------------------------------------------------
| INICIAR
|--------------------------------------------------------------------------
*/

carregarPerfil();

carregarProgresso();