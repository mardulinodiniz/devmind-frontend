if (!usuarioLogado()) {
    window.location.href = 'login.html';
}


async function carregarProgresso() {

    try {

        const progresso =
            await buscarProgressoCurso(1);


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


        const restantes =
            Math.max(
                0,
                total - concluidas
            );


        /*
        ==================================================
        PROGRESSO GERAL
        ==================================================
        */

        document.getElementById(
            'percentualGeral'
        ).textContent =
            `${percentual}%`;


        document.getElementById(
            'barraProgressoGeral'
        ).style.width =
            `${percentual}%`;


        document.getElementById(
            'aulasConcluidas'
        ).textContent =
            concluidas;


        document.getElementById(
            'totalAulas'
        ).textContent =
            total;


        /*
        ==================================================
        ESTATÍSTICAS
        ==================================================
        */

        document.getElementById(
            'statConcluidas'
        ).textContent =
            concluidas;


        document.getElementById(
            'statRestantes'
        ).textContent =
            restantes;


        /*
        ==================================================
        MÓDULOS
        ==================================================
        */

        const modulos =
            await buscarModulos(1);


        document.getElementById(
            'totalModulos'
        ).textContent =
            modulos.length;


        mostrarProgressoModulos(
            modulos,
            progresso
        );


    } catch (erro) {

        console.error(
            'Erro ao carregar progresso:',
            erro
        );


        document.getElementById(
            'listaProgressoModulos'
        ).innerHTML = `

            <div class="carregando">

                Não foi possível carregar
                o seu progresso.

            </div>

        `;

    }

}


/*
|--------------------------------------------------------------------------
| MOSTRAR PROGRESSO DOS MÓDULOS
|--------------------------------------------------------------------------
*/

function mostrarProgressoModulos(
    modulos,
    progresso
) {

    const lista =
        document.getElementById(
            'listaProgressoModulos'
        );


    /*
    Nesta primeira versão,
    o backend ainda não devolve
    o progresso individual de cada módulo.

    Por isso começamos mostrando
    todos os módulos.
    */


    if (
        !modulos ||
        modulos.length === 0
    ) {

        lista.innerHTML = `

            <div class="carregando">

                Nenhum módulo encontrado.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        modulos.map(
            function(modulo) {

                return `

                    <article
                        class="progresso-modulo"
                    >

                        <div
                            class="numero-modulo"
                        >

                            ${modulo.ordem}

                        </div>


                        <div
                            class="modulo-progresso-info"
                        >

                            <h3>

                                ${modulo.titulo}

                            </h3>


                            <p>

                                ${modulo.descricao ||
                                'Continue aprendendo neste módulo.'}

                            </p>


                            <div
                                class="modulo-progresso-barra"
                            >

                                <span
                                    style="width: 0%"
                                ></span>

                            </div>

                        </div>


                        <div
                            class="percentual-modulo"
                        >

                            0%

                        </div>


                    </article>

                `;

            }
        ).join('');

}


/*
|--------------------------------------------------------------------------
| INICIAR
|--------------------------------------------------------------------------
*/

carregarProgresso();