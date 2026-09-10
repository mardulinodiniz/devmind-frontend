/*
|--------------------------------------------------------------------------
| VERIFICAR LOGIN
|--------------------------------------------------------------------------
*/

if (!usuarioLogado()) {

    window.location.href = 'login.html';

}


/*
|--------------------------------------------------------------------------
| CARREGAR CERTIFICADOS
|--------------------------------------------------------------------------
*/

async function carregarCertificados() {

    const lista =
        document.getElementById(
            'listaCertificados'
        );

    try {

        /*
        O backend de certificados será
        ligado nesta etapa.

        Por enquanto mostramos o estado
        inicial da conta.
        */

        const certificados = [];


        document.getElementById(
            'totalCertificados'
        ).textContent =
            certificados.length;


        if (certificados.length === 0) {

            return;

        }


        lista.innerHTML =
            certificados.map(
                certificado => `

                <article
                    class="certificado-item"
                >

                    <div>

                        <h3>
                            ${certificado.curso}
                        </h3>

                        <p>
                            Concluído em:
                            ${certificado.data}
                        </p>

                    </div>

                    <a
                        href="${certificado.url}"
                        target="_blank"
                        class="btn btn-primary"
                    >
                        Ver certificado
                    </a>

                </article>

            `
            ).join('');


    } catch (erro) {

        console.error(
            'Erro ao carregar certificados:',
            erro
        );

        lista.innerHTML = `

            <div class="estado-vazio">

                <h3>
                    Não foi possível carregar
                    os certificados.
                </h3>

                <p>
                    Tente novamente mais tarde.
                </p>

            </div>

        `;

    }

}


carregarCertificados();