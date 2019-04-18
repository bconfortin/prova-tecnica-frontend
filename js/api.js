const FETCH_USER_URL = (username) => `https://api.github.com/users/${username}`
const FETCH_USER_REPOSITORIES = (username) => `https://api.github.com/users/${username}/repos`;
const FETCH_REPOSITORY_DETAILS = (username, repositoryName) => `https://api.github.com/repos/${username}/${repositoryName}`;

function defaultConsoleLogError(message) {
    return console.log('%c Erro ',
        'color: white; background-color: #D33F49',
        message);
}

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
    .then((data) => console.log(data))
    .catch((error) => defaultConsoleLogError(`Houve um erro ao tentar buscar as informações do usuário ${repositoryName}. Detalhes: ${error}.`));
}

if ($("#buscarUsuario")) {
    $("#buscarUsuario").on("click", () => {
        let username = $("#username").val();
        fetchUser(username);
        fetchUserRepositories(username);
    });
}

function montaDadosDoUsuario (dadosDoUsuario) {
    if ($("#divDadosDoUsuario")) {
        $("#divDadosDoUsuario").empty();
        let html = '';
        html += `
            <div>Usuário buscado: ${dadosDoUsuario.login}</div>
            <div>Nome completo: ${dadosDoUsuario.name}</div>
            <div>Seguidores: ${dadosDoUsuario.followers}</div>
            <div>Seguindo: ${dadosDoUsuario.following}</div>
            <div><img src="${dadosDoUsuario.avatar_url}" alt="Avatar do usuário ${dadosDoUsuario.login}." class="img-fluid"></div>
            <div>Biografia: ${dadosDoUsuario.email ? dadosDoUsuario.email : "E-mail definido como privado"}</div>
            <div>Biografia: ${dadosDoUsuario.bio}</div>
        `
        $("#divDadosDoUsuario").append(html);
        $("#divDadosDoUsuario").removeClass("invisible");
    }
}

function montaListaDeRepositorios (listaDeRepositorios) {
    if ($("#divListaDeRepositorios") && $("#divTBodyListaDeRepositorios")) {
        const MAKE_INDEX_START_AT_1 = 1
        $("#divTBodyListaDeRepositorios").empty();
        let html = ''
        listaDeRepositorios.map((repositorio, index) => {
            html += `
                <tr>
                    <th>${index + MAKE_INDEX_START_AT_1}</th>
                    <td>${repositorio.full_name}</td>
                    <td>${repositorio.stargazers_count}</td>
                    <td><a href="/detalhes-do-repositorio.html?username=${repositorio.owner.login}&repository=${repositorio.name}" class="btn btn-success text-uppercase font-700">Acessar</a></td>
                </tr>
            `
        })
        $("#divTBodyListaDeRepositorios").append(html);
        $("#divListaDeRepositorios").removeClass("invisible");
    }
}

