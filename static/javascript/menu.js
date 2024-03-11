function toggleNav() {
    var sidebar = document.getElementById("mySidebar");
    sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
    document.body.style.marginLeft = sidebar.style.width === "250px" ? "250px" : "0";
}

function changeRok() {
    let rok = document.getElementById('zvolenýRok').value;
    sendRequest('zmenaGlobalRoku', 'POST', (rok), (data) => {
        if (data['result']) {
            window.location.reload()
        }
    });
}
function sendRequest(url, method, body, onSuccess, onError) {
    let fetchOptions = {
        method: method,
        headers: {'Content-Type': 'application/json'}
    };
    if (method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
    }

    fetch(url, fetchOptions)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Nedostatočné oprávnenia');
        }
    })
    .then(data => onSuccess(data))
    .catch(error => {
        alert(error.message);
        if (onError) onError();
    });
}