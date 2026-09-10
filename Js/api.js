const API_URL = 'http://localhost:3000/api';

async function requisicao(endpoint, opcoes = {}) {
    const token = localStorage.getItem('token');
    const configuracao = {
        ...opcoes,
        headers: {
            'Content-Type': 'application/json',
            ...(opcoes.headers || {})
        }
    };
    if (token) configuracao.headers.Authorization = `Bearer ${token}`;

    const resposta = await fetch(`${API_URL}${endpoint}`, configuracao);
    let dados = {};
    try { dados = await resposta.json(); } catch (e) {}
    if (!resposta.ok) throw new Error(dados.erro || 'Ocorreu um erro na requisição');
    return dados;
}

async function buscarCursos(){ return await requisicao('/cursos'); }
async function buscarCurso(cursoId){
    const cursos = await buscarCursos();
    return cursos.find(c => Number(c.id) === Number(cursoId)) || null;
}
async function buscarModulos(cursoId){ return await requisicao(`/cursos/${cursoId}/modulos`); }
async function buscarAulas(moduloId){ return await requisicao(`/modulos/${moduloId}/aulas`); }

async function cadastrarUsuario(nome,email,senha){
    return await requisicao('/auth/register',{
        method:'POST',body:JSON.stringify({nome,email,senha})
    });
}
async function fazerLogin(email,senha){
    const dados = await requisicao('/auth/login',{
        method:'POST',body:JSON.stringify({email,senha})
    });
    localStorage.setItem('token',dados.token);
    localStorage.setItem('usuario',JSON.stringify(dados.usuario));
    return dados;
}
async function buscarPerfil(){ return await requisicao('/perfil'); }
async function buscarMeuAcesso(){ return await requisicao('/meu-acesso'); }
async function salvarProgresso(aulaId,concluida,ultimaPosicao){
    return await requisicao(`/progresso/${aulaId}`,{
        method:'PUT',body:JSON.stringify({concluida,ultima_posicao:ultimaPosicao})
    });
}
async function buscarProgressoCurso(cursoId){ return await requisicao(`/cursos/${cursoId}/progresso`); }
async function criarPagamento(cursoId,plano){
    return await requisicao('/pagamentos/criar',{
        method:'POST',body:JSON.stringify({curso_id:cursoId,plano})
    });
}
async function testarAdmin(){ return await requisicao('/admin/teste'); }
async function atualizarAcesso(usuarioId,moduloMaximo){
    return await requisicao(`/admin/acessos/${usuarioId}`,{
        method:'PUT',body:JSON.stringify({modulo_maximo:moduloMaximo})
    });
}
function usuarioLogado(){ return localStorage.getItem('token') !== null; }
function obterUsuario(){
    try{return JSON.parse(localStorage.getItem('usuario'));}catch(e){return null;}
}
function sair(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href='login.html';
}
