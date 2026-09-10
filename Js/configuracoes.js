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
| CARREGAR DADOS
|--------------------------------------------------------------------------
*/

async function carregarConfiguracoes() {

    try {

        const resposta =
            await buscarPerfil();


        const usuario =
            resposta.usuario ||
            resposta;


        const nome =
            usuario.nome ||
            'Aluno';


        const email =
            usuario.email ||
            '';


        const tipo =
            usuario.tipo ||
            'aluno';


        /*
        --------------------------------------------------------------
        FORMULÁRIO
        --------------------------------------------------------------
        */

        document.getElementById(
            'nome'
        ).value =
            nome;


        document.getElementById(
            'email'
        ).value =
            email;


        /*
        --------------------------------------------------------------
        RESUMO
        --------------------------------------------------------------
        */

        document.getElementById(
            'nomeResumo'
        ).textContent =
            nome;


        document.getElementById(
            'emailResumo'
        ).textContent =
            email;


        /*
        --------------------------------------------------------------
        CONTA
        --------------------------------------------------------------
        */

        document.getElementById(
            'tipoConta'
        ).textContent =
            tipo;


        if (
            usuario.data_cadastro
        ) {

            const data =
                new Date(
                    usuario.data_cadastro
                );


            document.getElementById(
                'membroDesde'
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
                'membroDesde'
            ).textContent =
                'DevMind';

        }


    } catch (erro) {

        console.error(
            'Erro ao carregar configurações:',
            erro
        );


        mostrarMensagem(
            'Não foi possível carregar os dados da conta.',
            'erro'
        );

    }

}


/*
|--------------------------------------------------------------------------
| SALVAR PERFIL
|--------------------------------------------------------------------------
*/

document
    .getElementById(
        'formPerfil'
    )
    .addEventListener(
        'submit',
        function(evento) {

            evento.preventDefault();


            /*
            Por enquanto o backend ainda
            não será chamado.
            */

            mostrarMensagem(
                'As alterações serão conectadas ao backend na próxima etapa.',
                'aviso'
            );

        }
    );


/*
|--------------------------------------------------------------------------
| ALTERAR SENHA
|--------------------------------------------------------------------------
*/

document
    .getElementById(
        'formSenha'
    )
    .addEventListener(
        'submit',
        function(evento) {

            evento.preventDefault();


            const novaSenha =
                document.getElementById(
                    'novaSenha'
                ).value;


            const confirmarSenha =
                document.getElementById(
                    'confirmarSenha'
                ).value;


            if (
                novaSenha !==
                confirmarSenha
            ) {

                mostrarMensagem(
                    'As novas senhas não coincidem.',
                    'erro'
                );

                return;

            }


            if (
                novaSenha.length < 6
            ) {

                mostrarMensagem(
                    'A nova senha deve ter pelo menos 6 caracteres.',
                    'erro'
                );

                return;

            }


            mostrarMensagem(
                'A alteração de senha será conectada ao backend na próxima etapa.',
                'aviso'
            );

        }
    );


/*
|--------------------------------------------------------------------------
| MENSAGENS
|--------------------------------------------------------------------------
*/

function mostrarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            'mensagemConfiguracao'
        );


    mensagem.className =
        `mensagem-config ${tipo}`;


    mensagem.textContent =
        texto;


    setTimeout(
        function() {

            mensagem.className =
                'mensagem-config';

        },
        5000
    );

}


/*
|--------------------------------------------------------------------------
| INICIAR
|--------------------------------------------------------------------------
*/

carregarConfiguracoes();