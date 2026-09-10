const params = new URLSearchParams(window.location.search);
const cursoId = Number(params.get('id') || 1);
let modulosGlobais = [];

async function carregarCurso(){
    try{
        const curso = await buscarCurso(cursoId);
        if(!curso) throw new Error('Curso não encontrado.');
        document.getElementById('cursoTitulo').textContent = curso.titulo;
        document.getElementById('cursoDescricao').textContent = curso.descricao || '';

        modulosGlobais = await buscarModulos(cursoId);
        const lista = document.getElementById('listaModulosCurso');

        lista.innerHTML = modulosGlobais.map(m => `
            <article class="modulo" id="modulo-${m.id}">
                <div>
                    <h3>Módulo ${m.ordem} — ${m.titulo}</h3>
                    <p>${m.descricao || 'Conteúdo do módulo.'}</p>
                </div>
                ${m.bloqueado
                    ? '<span class="status-lock">🔒 Acesso bloqueado</span>'
                    : `<button class="btn btn-primary" onclick="abrirModulo(${m.id})">Ver aulas</button>`
                }
            </article>
        `).join('');
    }catch(e){
        document.getElementById('listaModulosCurso').innerHTML =
            `<div class="loading">Erro: ${e.message}</div>`;
    }
}

async function abrirModulo(moduloId){
    try{
        const aulas = await buscarAulas(moduloId);
        const box = document.getElementById('aulasModulo');
        box.innerHTML = `
            <div class="panel" style="margin-top:22px">
                <h2>Aulas do módulo</h2>
                <div class="aulas-lista">
                    ${aulas.length ? aulas.map(a => `
                        <a class="aula-item" href="aula.html?id=${a.id}&modulo=${moduloId}">
                            ▶ Aula ${a.ordem}: ${a.titulo}
                        </a>
                    `).join('') : '<div class="loading">Ainda não existem aulas ativas neste módulo.</div>'}
                </div>
            </div>
        `;
        box.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(e){
        alert(e.message);
    }
}
carregarCurso();
