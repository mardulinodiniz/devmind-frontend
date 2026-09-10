const paramsAula = new URLSearchParams(window.location.search);
const aulaIdAtual = Number(paramsAula.get('id'));
const moduloIdAtual = Number(paramsAula.get('modulo'));

function converterYoutube(url){
    if(!url) return null;
    if(url.includes('youtu.be/')) return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split(/[?&]/)[0];
    if(url.includes('watch?v=')) return 'https://www.youtube.com/embed/' + url.split('watch?v=')[1].split('&')[0];
    if(url.includes('/embed/')) return url;
    return null;
}

async function carregarAula(){
    if(!aulaIdAtual || !moduloIdAtual){
        document.getElementById('conteudoAula').innerHTML='<div class="loading">Link da aula inválido.</div>';
        return;
    }
    try{
        const aulas = await buscarAulas(moduloIdAtual);
        const aula = aulas.find(a => Number(a.id) === aulaIdAtual);
        if(!aula) throw new Error('Aula não encontrada ou sem acesso.');

        document.getElementById('tituloAula').textContent = aula.titulo;
        document.getElementById('descricaoAula').textContent = aula.descricao || 'Continue aprendendo no seu ritmo.';
        document.getElementById('listaAulas').innerHTML = aulas.map(a => `
            <a class="aula-item ${Number(a.id)===aulaIdAtual?'ativa':''}" href="aula.html?id=${a.id}&modulo=${moduloIdAtual}">
                ▶ Aula ${a.ordem}: ${a.titulo}
            </a>
        `).join('');

        const embed = converterYoutube(aula.video_url);
        const video = document.getElementById('videoArea');
        video.innerHTML = embed
            ? `<iframe src="${embed}" title="${aula.titulo}" allowfullscreen></iframe>`
            : `<div class="player-placeholder"><strong>🎬 Vídeo em preparação</strong><span>O vídeo desta aula ainda será disponibilizado.</span></div>`;

        document.getElementById('concluirAula').onclick = async () => {
            try{
                await salvarProgresso(aulaIdAtual,true,0);
                alert('Aula marcada como concluída!');
            }catch(e){ alert(e.message); }
        };
    }catch(e){
        document.getElementById('conteudoAula').innerHTML=`<div class="loading">Erro: ${e.message}</div>`;
    }
}
carregarAula();
