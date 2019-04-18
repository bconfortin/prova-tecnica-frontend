const FETCH_USER_URL = (username) => `https://api.github.com/users/${username}`;
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
    .then((data) => console.log(data))
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
    .then((data) => console.log(data))
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
