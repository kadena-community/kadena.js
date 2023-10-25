import fetch from 'cross-fetch';
export async function callLocal(apiHost, body) {
    const response = await fetch(`${apiHost}/api/v1/local`, {
        headers: {
            accept: 'application/json;charset=utf-8, application/json',
            'cache-control': 'no-cache',
            'content-type': 'application/json;charset=utf-8',
            pragma: 'no-cache',
        },
        body,
        method: 'POST',
    });
    let jsonResponse;
    let textResponse;
    try {
        jsonResponse = (await response.clone().json());
    }
    catch (e) {
        textResponse = await response.text();
    }
    return { textResponse, jsonResponse, response };
}
