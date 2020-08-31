function httpExcGET(method, url, data, handleSuccess, handleDeny, ...params) {
    return fetch(url + createQuery(params), {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    }).then(response => success(response, handleSuccess, handleDeny))
        .catch(deny);
}
function createQuery(params) {
    let query = "";
    let shekCreator = param => param.key + "=" + param.value;
    if (params.length > 0) {
        query += "?" + shekCreator(params[0]);
        for (let i = 1; i < params.length; i++) query += "&" + shekCreator(params[i]);
    }
    return query;
}


function success(response, handleSuccess, handleError) {
    alert("Connected to Server SuccessFully");
    // todo alerting response message
    response.json()
        .then(value => {
            if (response.status === 200) {
                // todo go to Profile Menu And Save Auth
                handleSuccess(parseValue(value))
                // window.location.href = profilePageName;
            } else {
                handleError(parseValue(value))
                // todo error the fields
            }
        })
}
function deny(response) {
    alert('Error Connecting To Licencia Server')
    // todo
}

function handleResponseJsonCatch(reason) {
    alert("Raft To Catche Response.json()")
    alert("Reason: " + JSON.stringify(reason))
}

function parseValue(value) {
    let splitter = value.message.indexOf(':');
    return {
        message: value.message,
        messageError: value.message.substring(0, splitter),
        messageField: value.message.substring(splitter + 1),
        // Type
    }
}
