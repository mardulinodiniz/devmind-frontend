/*
|--------------------------------------------------------------------------
| PARÂMETROS DA URL
|--------------------------------------------------------------------------
*/

const parametros =
    new URLSearchParams(
        window.location.search
    );


const moduloId =
    parametros.get('id');


const cursoId =
    parametros.get('cursoId');


/*
|--------------------------------------------------------------------------
| ELEMENTOS
|--------------------------------------------------------------------------
*/

const tituloModulo =
    document.getElementById(
        'tituloModulo'
    );


const descricaoModulo =
    document.getElementById(
        'descricaoModulo'
    );


const listaAulas =
    document.getElementById(
        'listaAulas'
    );


const voltarCurso =
    document.getElementById(
        'voltarCurso'
    );


const linkCurso =
    document.getElementById(
        'linkCurso'
    );


/*
|--------------------------------------------------------------------------
| VERIFICAR URL
|--------------------------------------------------------------------------
*/

if (!moduloId) {

    tituloModulo.textContent =
        'Módulo inválido';


    descricaoModulo.textContent =
        'Não foi possível identificar o módulo.';


    listaAulas.innerHTML = `
        <div class="carregando">

            Módulo não encontrado.

        </div>
    `;

} else {

    carregarModulo();

}


/*
|--------------------------------------------------------------------------
| CARREGAR MÓDULO
|--------------------------------------------------------------------------
*/

async function carregarModulo() {

    try {

        /*
        Busca as aulas do módulo.

        Esta função já existe no seu api.js:

        buscarAulas(moduloId)
        */

        const aulas =
            await buscarAulas(
                moduloId
            );


        /*
        Define os links de retorno.
        */

        if (cursoId) {

            voltarCurso.href =
                `curso.html?id=${cursoId}`;


            linkCurso.href =
                `curso.html?id=${cursoId}`;

        }


        /*
        Caso existam aulas,
        usamos os dados da primeira
        apenas para identificar o módulo.
        */

        if (
            aulas.length === 0
        ) {

            tituloModulo.textContent =
                `Módulo ${moduloId}`;


            descricaoModulo.textContent =
                'Ainda não existem aulas disponíveis neste módulo.';

        } else {

            tituloModulo.textContent =
                `Módulo ${moduloId}`;


            descricaoModulo.textContent =
                `${aulas.length} aula(s) disponível(is) neste módulo.`;

        }


        mostrarAulas(
            aulas
        );


    } catch (erro) {

        console.error(
            'Erro ao carregar módulo:',
            erro
        );


        tituloModulo.textContent =
            'Erro ao carregar módulo';


        descricaoModulo.textContent =
            erro.message;


        listaAulas.innerHTML = `

            <div class="carregando">

                Não foi possível carregar
                as aulas deste módulo.

                <br><br>

                ${erro.message}

            </div>

        `;
    }
}


/*
|--------------------------------------------------------------------------
| MOSTRAR AULAS
|--------------------------------------------------------------------------
*/

function mostrarAulas(
    aulas
) {

    if (
        !aulas ||
        aulas.length === 0
    ) {

        listaAulas.innerHTML = `

            <div class="carregando">

                Ainda não existem aulas
                disponíveis neste módulo.

            </div>

        `;

        return;
    }


    listaAulas.innerHTML =
        '';


    aulas.forEach(
        function(aula, indice) {


            const numero =
                aula.ordem ||
                indice + 1;


            const descricao =
                aula.descricao ||
                'Assista à aula e continue evoluindo.';


            const aulaUrl =
                `aula.html?aulaId=${aula.id}&moduloId=${moduloId}&cursoId=${cursoId || ''}`;


            const item =
                document.createElement(
                    'a'
                );


            item.href =
                aulaUrl;


            item.className =
                'card-aula';


            item.innerHTML = `

                <div class="aula-numero">

                    ${numero}

                </div>


                <div class="aula-info">

                    <h3>

                        ${aula.titulo}

                    </h3>


                    <p>

                        ${descricao}

                    </p>

                </div>


                <div class="aula-acao">

                    Assistir
                    <span>→</span>

                </div>

            `;


            listaAulas.appendChild(
                item
            );

        }
    );
}