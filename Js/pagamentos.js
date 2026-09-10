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
| CONFIGURAÇÃO
|--------------------------------------------------------------------------
*/

const cursoId = 1;


const mensagem =
    document.getElementById(
        'mensagemPagamento'
    );


/*
|--------------------------------------------------------------------------
| MOSTRAR MENSAGEM
|--------------------------------------------------------------------------
*/

function mostrarMensagem(
    texto,
    tipo = 'sucesso'
) {

    mensagem.className =
        `mensagem-pagamento ${tipo}`;


    mensagem.textContent =
        texto;

}


/*
|--------------------------------------------------------------------------
| SELECIONAR PLANO
|--------------------------------------------------------------------------
*/

async function selecionarPlano(
    plano
) {

    const botoes =
        document.querySelectorAll(
            '.btn-plano'
        );


    /*
    Desabilitar botões durante
    o processamento.
    */

    botoes.forEach(
        function(botao) {

            botao.disabled =
                true;

        }
    );


    mostrarMensagem(
        'Processando seu pedido...',
        'carregando'
    );


    try {

        /*
        Usa a função que já existe
        no seu api.js.
        */

        const resposta =
            await criarPagamento(
                cursoId,
                plano
            );


        console.log(
            'Pagamento criado:',
            resposta
        );


        mostrarMensagem(
            'Pedido de pagamento criado com sucesso.',
            'sucesso'
        );


        /*
        Aqui vamos adaptar quando
        conectarmos uma forma real
        de pagamento.
        */

        if (
            resposta.url
        ) {

            setTimeout(
                function() {

                    window.location.href =
                        resposta.url;

                },
                1000
            );

        }


    } catch (erro) {

        console.error(
            erro
        );


        mostrarMensagem(
            erro.message ||
            'Não foi possível iniciar o pagamento.',
            'erro'
        );


    } finally {

        botoes.forEach(
            function(botao) {

                botao.disabled =
                    false;

            }
        );

    }

}