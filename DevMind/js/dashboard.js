const usuario = obterUsuario();
if(!usuarioLogado()) window.location.href='login.html';

document.getElementById('nomeUsuario').textContent = usuario?.nome || 'Aluno';
document.getElementById('avatarUsuario').textContent = (usuario?.nome || 'A').charAt(0).toUpperCase();

async function carregarDashboard(){
    try{
        const acesso = await buscarMeuAcesso();
        document.getElementById('cursoNome').textContent = 'Estruturas de Dados';
        document.getElementById('moduloMaximo').textContent = acesso.acesso.modulo_maximo;
        document.getElementById('statusAcesso').textContent = acesso.acesso.status;

        const progresso = await buscarProgressoCurso(1);
        const percentual = Number(progresso.percentual || 0);
        document.getElementById('percentual').textContent = `${percentual}%`;
        document.getElementById('barraProgresso').style.width = `${percentual}%`;
        document.getElementById('aulasConcluidas').textContent =
            `${progresso.aulas_concluidas} de ${progresso.total_aulas} aulas concluídas`;

        const modulos = await buscarModulos(1);
        const lista = document.getElementById('listaModulos');
        lista.innerHTML = modulos.map(m => `
            <div class="modulo ${m.bloqueado ? 'bloqueado' : ''}">
                <div>
                    <h3>Módulo ${m.ordem} — ${m.titulo}</h3>
                    <p>${m.descricao || 'Conteúdo organizado para o seu aprendizado.'}</p>
                </div>
                ${m.bloqueado
                    ? '<span class="status-lock">🔒 Bloqueado</span>'
                    : `<a class="btn btn-primary" href="curso.html?id=1#modulo-${m.id}">Abrir</a>`
                }
            </div>
        `).join('');
    }catch(e){
        document.getElementById('dashboardErro').textContent = e.message;
    }
}
carregarDashboard();
