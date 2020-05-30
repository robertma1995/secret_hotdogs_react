// helper functions for accessing api (CRUD standards): get, post, put, delete

async function apiGet(path) {
    const response = await fetch('/api/' + path);
    return response.json();
}

async function apiPost(path, bodyJson) {
    const response = await fetch('/api/' + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyJson)
    });	
    return response.json();
}


// TODO: add put + delete when necessary

export {
    apiGet,
    apiPost,
}