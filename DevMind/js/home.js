const lista = document.getElementById('listaCursos');

async function carregarCursos(){
    try{
        const cursos = await buscarCursos();
        if(!cursos.length){
            lista.innerHTML='<div class="loading">Ainda não existem cursos publicados.</div>';
            return;
        }
        lista.innerHTML = cursos.map(curso => `
            <article class="curso-card">
                <div class="curso-icon">💻</div>
                <h3>${curso.titulo}</h3>
                <p>${curso.descricao || 'Curso organizado para desenvolver competências reais em tecnologia.'}</p>
                <div class="curso-meta">
                    <span class="badge">${Number(curso.gratuito) === 1 ? 'Acesso inicial gratuito' : 'Curso premium'}</span>
                    <a class="btn btn-primary" href="curso.html?id=${curso.id}">Ver curso</a>
                </div>
            </article>
        `).join('');
    }catch(erro){
        lista.innerHTML=`<div class="loading">Não foi possível carregar os cursos.<br><small>${erro.message}</small></div>`;
    }
}
carregarCursos();
