const FETCH_USER_URL = (username) => `https://api.github.com/users/${username}`
const FETCH_USER_REPOSITORIES = (username) => `https://api.github.com/users/${username}/repos`;
const FETCH_REPOSITORY_DETAILS = (username, repositoryName) => `https://api.github.com/repos/${username}/${repositoryName}`;

/**
 * @description Função que retorna um console.log estilizado.
 * @param message
 */
function defaultConsoleLogError(message) {
    return console.log('%c Erro ',
        'color: white; background-color: #D33F49',
        message);
}

/**
 * @description Função que retorna os dados de um usuário do GitHub e envia os dados para serem mostrados na interface gráfica.
 * @param username
 */
function fetchUser(username = '') {
    if (!username) {
        defaultConsoleLogError('O parâmetro passado na função fetchUser() é inválido.');
    }

    fetch(FETCH_USER_URL(username), {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((dadosDoUsuario) => montaDadosDoUsuario(dadosDoUsuario))
    .catch((error) => defaultConsoleLogError(`Houve um erro ao tentar buscar as informações do usuário ${username}. Detalhes: ${error}.`));
}

/**
 * @description Função que retorna a lista de repositórios de um usuário do GitHub e envia os dados para serem mostrados
 * na interface.
 * @param username
 */
function fetchUserRepositories(username = '') {
    if (!username) {
        defaultConsoleLogError('O parâmetro passado na função fetchUserRepositories() é inválido.');
    }

    fetch(FETCH_USER_REPOSITORIES(username), {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((listaDeRepositorios) => montaListaDeRepositorios(listaDeRepositorios))
    .catch((error) => defaultConsoleLogError(`Houve um erro ao tentar buscar as informações do usuário ${username}. Detalhes: ${error}.`));
}

/**
 * @description Função que retorna os detalhes de um repositório de um usuário do GitHub e envia os dados para serem
 * mostrados na interface gráfica.
 * @param username
 * @param repositoryName
 */
function fetchRepositoryDetails(username = '', repositoryName = '') {
    if (!username || !repositoryName) {
        defaultConsoleLogError('Um ou mais parâmetros passados na função fetchRepositoryDetails() são inválidos.');
    }

    fetch(FETCH_REPOSITORY_DETAILS(username, repositoryName), {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((detalhesDoRepositorio) => montaDetalhesDoRepositorio(detalhesDoRepositorio))
    .catch((error) => defaultConsoleLogError(`Houve um erro ao tentar buscar as informações do usuário ${repositoryName}. Detalhes: ${error}.`));
}

/**
 * @description Adiciona as funções "fetchUser" e "fetchUserRepositories" ao botão de busca de usuário.
 */
if ($("#buscarUsuario").length) {
    $("#buscarUsuario").on("click", () => {
        let username = $("#username").val();
        if (username) {
            fetchUser(username);
            fetchUserRepositories(username);
        } else {
            alert("Por favor, preencha um nome de usuário e tente novamente.")
        }
    });
}

/**
 * @description Adiciona as funções "fetchUser" e "fetchUserRepositories" ao botão de busca de usuário.
 */
if ($("#username").length) {
    $("#username").keypress((event) => {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            let username = $("#username").val();
            if (username) {
                fetchUser(username);
                fetchUserRepositories(username);
            } else {
                alert("Por favor, preencha um nome de usuário e tente novamente.")
            }
        }
    });
}

/**
 * @description Recebe os dados de um usuário, monta elementos em HTML e adiciona na página solicitante.
 * @param dadosDoUsuario
 */
function montaDadosDoUsuario (dadosDoUsuario) {
    if ($("#divDadosDoUsuario").length) {
        $("#divDadosDoUsuario").empty();
        let html = '';
        html += `
            <div class="card">
                <div class="row">
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                        <img src="${dadosDoUsuario.avatar_url}" alt="Avatar do usuário ${dadosDoUsuario.login}." class="img-fluid rounded-circle">
                    </div>
                    <div class="col-12 col-sm-6 col-md-8 col-lg-9">
                        <h2 class="mbottom-30 font-1-3em font-700">Usuário buscado: ${dadosDoUsuario.login}</h2>
                        <p class="mbottom-5">Nome completo: ${dadosDoUsuario.name}</p>
                        <p class="mbottom-5">Seguidores: ${dadosDoUsuario.followers}</p>
                        <p class="mbottom-5">Seguindo: ${dadosDoUsuario.following}</p>
                        <p class="mbottom-5">E-mail: ${dadosDoUsuario.email ? dadosDoUsuario.email : "E-mail definido como privado"}</p>
                        <p class="mbottom-5">Biografia: ${dadosDoUsuario.bio}</p>
                    </div>
                </div>
            </div>
        `
        $("#divDadosDoUsuario").append(html);
        $("#divDadosDoUsuario").removeClass("invisible");
    }
}

/**
 * @description Recebe uma lista de repositórios de um usuário, monta elementos em HTML e adiciona na página solicitante
 * em forma de tabela.
 * @param listaDeRepositorios
 */
function montaListaDeRepositorios (listaDeRepositorios) {
    if ($("#divListaDeRepositorios").length && $("#divTBodyListaDeRepositorios").length) {
        const MAKE_INDEX_START_AT_1 = 1
        $("#divTBodyListaDeRepositorios").empty();
        let html = ''
        listaDeRepositorios.map((repositorio, index) => {
            html += `
                <tr>
                    <th>${index + MAKE_INDEX_START_AT_1}</th>
                    <td>${repositorio.full_name}</td>
                    <td>${repositorio.stargazers_count}</td>
                    <td><a href="detalhes-do-repositorio.html?username=${repositorio.owner.login}&repository=${repositorio.name}" class="btn btn-success text-uppercase font-700">Acessar</a></td>
                </tr>
            `
        })
        $("#divTBodyListaDeRepositorios").append(html);
        $("#divListaDeRepositorios").removeClass("invisible");
    }
}

/**
 * @description Solução retirada do StackOverflow para pegar os parâmetos (query params) de uma URL
 * https://stackoverflow.com/a/21903119/4529628
 * @param sParam
 * @returns {*}
 */
let getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

/**
 * @descriptino Se o elemento com ID "divDetalhesDoRepositorio" é encontrado na página, é sinal que a pessoa está na
 * página de detalhes do repositório, o que acarreta na solicitação desses detalhes do repositório para a API do GitHub.
 */
if ($("#divDetalhesDoRepositorio").length) {
    let username = getUrlParameter('username')
    let repositoryName = getUrlParameter('repository')
    if (username && repositoryName) {
        fetchRepositoryDetails(username, repositoryName)
    } else {
        defaultConsoleLogError('Não foram passados os nomes do usuário e/ou do repositório.')
    }
}

/**
 * @description Recebe os dados de um repositório, monta elementos em HTML e adiciona na página solicitante.
 * @param detalhesDoRepositorio
 */
function montaDetalhesDoRepositorio (detalhesDoRepositorio) {
    if ($("#divDetalhesDoRepositorio").length) {
        $("#divDetalhesDoRepositorio").empty();
        let html = ''
        html += `
            <h2 class="mbottom-30 font-1-3em font-700">Nome: ${detalhesDoRepositorio.name}</h2>
            <p class="mbottom-5">Descrição: ${detalhesDoRepositorio.description ? detalhesDoRepositorio.description : "Nenhuma descrição informada."}</p>
            <p class="mbottom-5">Estrelas: ${detalhesDoRepositorio.stargazers_count}</p>
            <p class="mbottom-30">Linguagem: ${detalhesDoRepositorio.language}</p>
            <div><a href="${detalhesDoRepositorio.html_url}" class="btn btn-success text-uppercase font-700">Acessar repositório</a></div>
        `
        $("#divDetalhesDoRepositorio").append(html);
        $("#divDetalhesDoRepositorio").removeClass("invisible");
    }
}
