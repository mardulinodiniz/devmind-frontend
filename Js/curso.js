/*
|--------------------------------------------------------------------------
| PARÂMETROS DA URL
|--------------------------------------------------------------------------
*/

const params =
    new URLSearchParams(
        window.location.search
    );


const cursoId =
    Number(
        params.get('id') || 1
    );


let modulosGlobais = [];


/*
|--------------------------------------------------------------------------
| CARREGAR CURSO
|--------------------------------------------------------------------------
*/

async function carregarCurso() {

    const lista =
        document.getElementById(
            'listaModulosCurso'
        );


    try {

        /*
        ------------------------------------------------------
        BUSCAR INFORMAÇÕES DO CURSO
        ------------------------------------------------------
        */

        const curso =
            await buscarCurso(
                cursoId
            );


        if (!curso) {

            throw new Error(
                'Curso não encontrado.'
            );

        }


        /*
        ------------------------------------------------------
        MOSTRAR TÍTULO E DESCRIÇÃO
        ------------------------------------------------------
        */

        document.getElementById(
            'cursoTitulo'
        ).textContent =
            curso.titulo;


        document.getElementById(
            'cursoDescricao'
        ).textContent =
            curso.descricao ||
            'Comece agora a sua jornada de aprendizado.';


        /*
        ------------------------------------------------------
        BUSCAR MÓDULOS
        ------------------------------------------------------
        */

        modulosGlobais =
            await buscarModulos(
                cursoId
            );


        /*
        ------------------------------------------------------
        VERIFICAR SE EXISTEM MÓDULOS
        ------------------------------------------------------
        */

        if (
            !modulosGlobais ||
            modulosGlobais.length === 0
        ) {

            lista.innerHTML = `

                <div class="loading">

                    Ainda não existem módulos
                    disponíveis neste curso.

                </div>

            `;


            return;

        }


        /*
        ------------------------------------------------------
        MOSTRAR MÓDULOS
        ------------------------------------------------------
        */

        lista.innerHTML =
            modulosGlobais
                .map(
                    function(modulo) {


                        const descricao =
                            modulo.descricao ||
                            'Conteúdo organizado para o seu aprendizado.';


                        /*
                        Se o módulo estiver bloqueado.
                        */

                        const bloqueado =
                            modulo.bloqueado === true ||
                            modulo.bloqueado === 1;


                        return `

                            <article
                                class="
                                    modulo
                                    modulo-curso
                                    ${bloqueado ? 'bloqueado' : ''}
                                "
                                id="modulo-${modulo.id}"
                            >


                                <div class="modulo-curso-numero">

                                    ${String(
                                        modulo.ordem
                                    ).padStart(
                                        2,
                                        '0'
                                    )}

                                </div>


                                <div class="modulo-curso-info">


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


                                <div class="modulo-curso-acao">


                                    ${
                                        bloqueado

                                            ? `

                                                <span
                                                    class="status-lock"
                                                >

                                                    🔒 Acesso bloqueado

                                                </span>

                                            `

                                            : `

                                                <button
                                                    class="
                                                        btn
                                                        btn-primary
                                                    "
                                                    onclick="
                                                        abrirModulo(
                                                            ${modulo.id}
                                                        )
                                                    "
                                                >

                                                    Ver aulas
                                                    <span>→</span>

                                                </button>

                                            `
                                    }


                                </div>


                            </article>

                        `;

                    }
                )
                .join('');


        /*
        ------------------------------------------------------
        ABRIR AUTOMATICAMENTE UM MÓDULO
        ------------------------------------------------------
        */

        const hash =
            window.location.hash;


        if (
            hash &&
            hash.startsWith(
                '#modulo-'
            )
        ) {

            const moduloElemento =
                document.querySelector(
                    hash
                );


            if (moduloElemento) {

                setTimeout(
                    function() {

                        moduloElemento
                            .scrollIntoView(
                                {
                                    behavior:
                                        'smooth',

                                    block:
                                        'center'
                                }
                            );

                    },
                    300
                );

            }

        }


    } catch (erro) {

        console.error(
            'Erro ao carregar curso:',
            erro
        );


        lista.innerHTML = `

            <div class="loading">

                <strong>

                    Não foi possível
                    carregar o curso.

                </strong>

                <br>

                ${erro.message}

            </div>

        `;

    }

}


/*
|--------------------------------------------------------------------------
| ABRIR MÓDULO
|--------------------------------------------------------------------------
*/

async function abrirModulo(moduloId) {

    const box =
        document.getElementById(
            'aulasModulo'
        );


    /*
    Mostrar carregamento.
    */

    box.innerHTML = `

        <div
            class="panel aulas-panel"
        >

            <div class="loading">

                Carregando aulas...

            </div>

        </div>

    `;


    try {

        /*
        ------------------------------------------------------
        BUSCAR MÓDULO
        ------------------------------------------------------
        */

        const modulo =
            modulosGlobais.find(
                function(item) {

                    return (
                        Number(item.id) ===
                        Number(moduloId)
                    );

                }
            );


        /*
        ------------------------------------------------------
        BUSCAR AULAS
        ------------------------------------------------------
        */

        const aulas =
            await buscarAulas(
                moduloId
            );


        /*
        ------------------------------------------------------
        MOSTRAR AULAS
        ------------------------------------------------------
        */

        box.innerHTML = `

            <div class="panel aulas-panel">


                <div
                    class="aulas-cabecalho"
                >


                    <div>


                        <span
                            class="
                                etiqueta
                                pequena
                            "
                        >

                            ${
                                modulo
                                    ? `MÓDULO ${modulo.ordem}`
                                    : 'AULAS'
                            }

                        </span>


                        <h2>

                            ${
                                modulo
                                    ? modulo.titulo
                                    : 'Aulas do módulo'
                            }

                        </h2>


                        <p>

                            Selecione uma aula
                            para continuar
                            aprendendo.

                        </p>


                    </div>


                    <button
                        class="
                            btn
                            btn-outline
                        "
                        onclick="
                            fecharAulas()
                        "
                    >

                        Fechar

                    </button>


                </div>


                <div
                    class="aulas-lista"
                >


                    ${
                        aulas.length > 0

                            ? aulas
                                .map(
                                    function(aula) {

                                        return `

                                            <a
                                                class="aula-item"
                                                href="
                                                    aula.html?id=${aula.id}&modulo=${moduloId}&curso=${cursoId}
                                                "
                                            >


                                                <div
                                                    class="
                                                        aula-numero
                                                    "
                                                >

                                                    ${String(
                                                        aula.ordem
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}

                                                </div>


                                                <div
                                                    class="
                                                        aula-info
                                                    "
                                                >


                                                    <span>

                                                        AULA
                                                        ${aula.ordem}

                                                    </span>


                                                    <strong>

                                                        ${aula.titulo}

                                                    </strong>


                                                </div>


                                                <div
                                                    class="
                                                        aula-play
                                                    "
                                                >

                                                    ▶

                                                </div>


                                            </a>

                                        `;

                                    }
                                )
                                .join('')

                            : `

                                <div
                                    class="loading"
                                >

                                    Ainda não existem
                                    aulas ativas
                                    neste módulo.

                                </div>

                            `
                    }


                </div>


            </div>

        `;


        /*
        ------------------------------------------------------
        ROLAR ATÉ AS AULAS
        ------------------------------------------------------
        */

        setTimeout(
            function() {

                box.scrollIntoView(
                    {
                        behavior:
                            'smooth',

                        block:
                            'start'
                    }
                );

            },
            100
        );


    } catch (erro) {

        console.error(
            'Erro ao carregar aulas:',
            erro
        );


        box.innerHTML = `

            <div
                class="panel aulas-panel"
            >

                <div class="loading">

                    Não foi possível
                    carregar as aulas.

                    <br>

                    ${erro.message}

                </div>

            </div>

        `;

    }

}


/*
|--------------------------------------------------------------------------
| FECHAR AULAS
|--------------------------------------------------------------------------
*/

function fecharAulas() {

    const box =
        document.getElementById(
            'aulasModulo'
        );


    box.innerHTML = '';


    box.scrollIntoView(
        {
            behavior: 'smooth',
            block: 'start'
        }
    );

}


/*
|--------------------------------------------------------------------------
| INICIAR
|--------------------------------------------------------------------------
*/

carregarCurso();