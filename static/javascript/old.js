let TriednyListener = null;
let ZadanyZiaciListener = null;
let UcebnaListener = null;
let tBodyListener = null;

function triedyFilter() {
    var filter, tr, tdUcebna, tdUcitel, tdId, i, txtValuetdUcebna, txtValueId, txtValuetdUcitel;
    filter = document.querySelector(".search-input").value.toUpperCase();
    tr = document.querySelector(".table").getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tdId = tr[i].getElementsByTagName("td")[1];
        tdUcebna = tr[i].getElementsByTagName("td")[2];
        tdUcitel = tr[i].getElementsByTagName("td")[3];
        if (tdId || tdUcebna || tdUcitel) {
            txtValueId = tdId.textContent || tdId.innerText;
            txtValuetdUcebna = tdUcebna.textContent || tdUcebna.innerText;
            txtValuetdUcitel = tdUcitel.textContent || tdUcitel.innerText;
            if (txtValueId.toUpperCase().indexOf(filter) > -1 || txtValuetdUcebna.toUpperCase().indexOf(filter) > -1 || txtValuetdUcitel.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function filterRocniky() {
    var prava = document.querySelector(".rights-selector").value;
    var tr = document.querySelector(".table").getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        var right = tr[i].getElementsByTagName("td")[5].textContent;
        if (prava == "All" || right == prava) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function tBody(tbody){
    return function (event) {
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
            const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
            for (let checkbox of checkboxes) {
                if (checkbox !== event.target) {
                    checkbox.checked = false;
                }
            }
        }
    };
}

function Triedny(vyberTriedneho, vyberZiakov, trieda, triedny) {
    return function () {
        let modal = document.getElementById('vyberTriedny_Ziaci');
        let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
        modal.style.display = 'block';
        document.getElementsByClassName('vyberTriedny_Ziaciclose')[0].onclick = function () {
            modal.style.display = 'none';
            tbody.removeEventListener('click', (tBodyListener));
        };
        if (trieda){
            sendRequest('/Triedy/getOsoby', 'POST', ({triedny: trieda}), (osoby) => {
                document.getElementById("meno").textContent = "Meno Priezvisko";
                document.getElementById("role").textContent = "Práva";
                tbody.innerHTML = '';
                osoby.forEach((osoba) => {
                    let [id, meno, role] = osoba;
                    if (!vyberZiakov.includes(id) || triedny === id) {
                        let checkedAttribute = '';
                        if (triedny === id) {
                            checkedAttribute = "checked";
                        }
                        let rowHTML = `<tr>
                        <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                        <td>${id}</td>
                        <td>${meno}</td>
                        <td>${role}</td>
                        </tr>`;
                        tbody.insertAdjacentHTML('beforeend', rowHTML);
                    }
                });
                tBodyListener = tBody(tbody);
                tbody.addEventListener('click', (tBodyListener));
                document.getElementById('vyberTriedny_ZiaciSaveButton').onclick = function () {
                    let checkboxes = document.querySelectorAll('#vyberTriedny_Ziaci .modal-table tbody input[type="checkbox"]');
                    let vyberTriednehoName = [];
                    vyberTriedneho.length = 0;
                    checkboxes.forEach(function (checkbox) {
                        if (checkbox.checked) {
                            vyberTriedneho.push(parseInt(checkbox.value));
                            let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                            vyberTriednehoName.push(nameCell.textContent.trim());
                        }
                    });
                    if (vyberTriednehoName.length > 0) {
                        document.getElementById('Triedny').value = vyberTriednehoName.join(', ');
                    } else {
                        document.getElementById('Triedny').value = "None";
                    }
                    triedny = '';
                    tbody.removeEventListener('click', (tBodyListener));
                    modal.style.display = 'none';
                };
            });
        } else {
            sendRequest('/Triedy/getOsoby', 'GET', null, (osoby) => {
                document.getElementById("meno").textContent = "Meno Priezvisko";
                document.getElementById("role").textContent = "Práva";
                tbody.innerHTML = '';
                osoby.forEach((osoba) => {
                    let [id, meno, role] = osoba;
                    if (!vyberZiakov.includes(id)) {
                        let rowHTML = `    <tr>
                            <td><input type="checkbox" value="${id}"></td>
                            <td>${id}</td>
                            <td>${meno}</td>
                            <td>${role}</td>
                            </tr>`;
                        tbody.insertAdjacentHTML('beforeend', rowHTML);
                    }
                });
                tBodyListener = tBody(tbody);
                tbody.addEventListener('click', (tBodyListener));
                document.getElementById('vyberTriedny_ZiaciSaveButton').onclick = function () {
                    let checkboxes = document.querySelectorAll('#vyberTriedny_Ziaci .modal-table tbody input[type="checkbox"]');
                    let vyberTriednehoName = [];
                    vyberTriedneho.length = 0;
                    checkboxes.forEach(function (checkbox) {
                        if (checkbox.checked) {
                            vyberTriedneho.push(parseInt(checkbox.value));
                            let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                            vyberTriednehoName.push(nameCell.textContent.trim());
                        }
                    });
                    if (vyberTriednehoName.length > 0) {
                        document.getElementById('Triedny').value = vyberTriednehoName.join(', ');
                    } else {
                        document.getElementById('Triedny').value = "None";
                    }
                    tbody.removeEventListener('click', (tBodyListener));
                    modal.style.display = 'none';
                };
            });
        }
    };
}

function ZadanyZiaci(vyberTriedneho, vyberZiakov, trieda) {
    return function () {
        let modal = document.getElementById('vyberTriedny_Ziaci');
        let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
        modal.style.display = 'block';
        document.getElementsByClassName('vyberTriedny_Ziaciclose')[0].onclick = function () {
            modal.style.display = 'none';
        };
        if (trieda){
            sendRequest('/Triedy/getOsoby', 'POST', ({ziak: trieda}), (osoby) => {
                document.getElementById("meno").textContent = "Meno Priezvisko";
                document.getElementById("role").textContent = "Práva";
                tbody.innerHTML = '';
                osoby.forEach((osoba) => {
                    let [id, meno, role] = osoba;
                    if ((!vyberZiakov.includes(id) || vyberZiakov.includes(id))&& !vyberTriedneho.includes(id)) {
                        let checkedAttribute = '';
                        if (vyberZiakov.includes(id)) {
                            checkedAttribute = "checked";
                        }
                        let rowHTML = `<tr>
                        <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                        <td>${id}</td>
                        <td>${meno}</td>
                        <td>${role}</td>
                        </tr>`;
                        tbody.insertAdjacentHTML('beforeend', rowHTML);
                    }
                });
                document.getElementById('vyberTriedny_ZiaciSaveButton').onclick = function () {
                    let checkboxes = document.querySelectorAll('#vyberTriedny_Ziaci .modal-table tbody input[type="checkbox"]');
                    let vyberZiakovName = [];
                    vyberZiakov.length = 0;
                    checkboxes.forEach(function (checkbox) {
                        if (checkbox.checked) {
                            vyberZiakov.push(parseInt(checkbox.value));
                            let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                            vyberZiakovName.push(nameCell.textContent.trim());
                        }
                    });
                    if (vyberZiakovName.length > 0) {
                        document.getElementById('ZadanyZiaci').value = vyberZiakovName.join(', ');
                    } else {
                        document.getElementById('ZadanyZiaci').value = "None";
                    }
                    modal.style.display = 'none';
                };
            });
        } else {
            sendRequest('/Triedy/getOsoby', 'GET', null, (osoby) => {
                document.getElementById("meno").textContent = "Meno Priezvisko";
                document.getElementById("role").textContent = "Práva";
                let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
                tbody.innerHTML = '';
                osoby.forEach((osoba) => {
                    let [id, meno, role] = osoba;
                    if (id !== vyberTriedneho[0]) {
                        let rowHTML = `<tr>
                        <td><input type="checkbox" value="${id}"></td>
                        <td>${id}</td>
                        <td>${meno}</td>
                        <td>${role}</td>
                        </tr>`;
                        tbody.insertAdjacentHTML('beforeend', rowHTML);
                    }
                });
                document.getElementById('vyberTriedny_ZiaciSaveButton').onclick = function () {
                    let checkboxes = document.querySelectorAll('#vyberTriedny_Ziaci .modal-table tbody input[type="checkbox"]');
                    let vyberZiakovName = [];
                    vyberZiakov.length = 0;
                    checkboxes.forEach(function (checkbox) {
                        if (checkbox.checked) {
                            vyberZiakov.push(parseInt(checkbox.value));
                            let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                            vyberZiakovName.push(nameCell.textContent.trim());
                        }
                    });
                    if (vyberZiakovName.length > 0) {
                        document.getElementById('ZadanyZiaci').value = vyberZiakovName.join(', ');
                    } else {
                        document.getElementById('ZadanyZiaci').value = "None";
                    }
                    modal.style.display = 'none';
                };
            });
        }
    }
}

function Ucebna(vyberZiakov, vyberUcebne) {
    return function () {
        let modal = document.getElementById('vyberTriedny_Ziaci');
        let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
        modal.style.display = 'block';
        document.getElementById('rocnik').style.display = "none";
        document.getElementsByClassName('vyberTriedny_Ziaciclose')[0].onclick = function () {
            modal.style.display = 'none';
            tbody.removeEventListener('click', (tBodyListener));
        };
        sendRequest('/Predmety/getUcebne', 'GET', null, (ucebne) => {
            document.getElementById("meno").textContent = "Názov";
            document.getElementById("role").textContent = "Skratka";
            tbody.innerHTML = '';
            ucebne.forEach((ucebna) => {
                let [id, nazov, skratka] = ucebna;
                let rowHTML = `<tr>
                    <td><input type="checkbox" value="${id}"></td>
                    <td>${id}</td>
                    <td>${nazov}</td>
                    <td>${skratka}</td>
                    </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
            tBodyListener = tBody(tbody);
            tbody.addEventListener('click', (tBodyListener));
            document.getElementById('vyberTriedny_ZiaciSaveButton').onclick = function () {
                let checkboxes = document.querySelectorAll('#vyberTriedny_Ziaci .modal-table tbody input[type="checkbox"]');
                vyberUcebne.length = 0;
                let vyberUcebneName = [];
                checkboxes.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        vyberUcebne.push(parseInt(checkbox.value));
                        let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                        vyberUcebneName.push(nameCell.textContent.trim());
                    }
                });
                if (vyberUcebneName.length > 0) {
                    document.getElementById('Ucebna').value = vyberUcebneName.join(', ');
                }else {
                    document.getElementById('Ucebna').value = "None";
                }
                tbody.removeEventListener('click', (tBodyListener));
                modal.style.display = 'none';
            };
        });
    };
}

document.getElementById('addTriedaButton').onclick = function () {
    document.getElementById('addTriedu').style.display = 'block';
    document.getElementById('Nazov').value = "";
    document.getElementById('Triedny').value = "None";
    document.getElementById('ZadanyZiaci').value = "None";
    document.getElementById('Ucebna').value = "None";
    document.querySelector(".rights-selector.addTriedu").value = "None";
    document.getElementsByClassName('addUcebnuclose')[0].onclick = function() {
        document.getElementById('addTriedu').style.display =  'none';
        document.getElementById('Triedny').removeEventListener('click', TriednyListener);
        document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
        document.getElementById('Ucebna').removeEventListener('click', UcebnaListener);
    };
    let vyberTriedneho = [];
    let vyberZiakov = [];
    let vyberUcebne = [];
    TriednyListener = Triedny(vyberTriedneho, vyberZiakov, null, null);
    ZadanyZiaciListener = ZadanyZiaci(vyberTriedneho, vyberZiakov);
    UcebnaListener = Ucebna(vyberZiakov, vyberUcebne);
    document.getElementById('Triedny').addEventListener('click', TriednyListener);
    document.getElementById('ZadanyZiaci').addEventListener('click', ZadanyZiaciListener);
    document.getElementById('Ucebna').addEventListener('click', UcebnaListener);

    document.getElementById('addTrieduSave').onclick = function () {
        let nazov = document.getElementById('Nazov').value;
        var rocnik = document.querySelector(".rights-selector.addTriedu").value;
        if (nazov) {
            sendRequest('/Triedy/saveTriedu', 'POST', ({nazov:nazov, vyberTriedneho:vyberTriedneho, vyberZiakov:vyberZiakov, vyberUcebne:vyberUcebne, rocnik:rocnik}), (data) => {
                if (data) {
                    window.location.reload();
                } else {
                    alert("Zadaný názov už existuje");
                }
            });
        } else {
            alert("Nezadali ste žiadny Názov");
        }
    };
};

const delTriedu = document.getElementsByClassName("delTrieda")
for (let i = 0; i < delTriedu.length; i++) {
    delTriedu[i].addEventListener("click", function () {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        sendRequest('/Triedy/delTriedu', 'POST', (idCell), (data)=> {
           if (data) {
               window.location.reload()
           }
        });
    });
}

const editTriedu = document.getElementsByClassName("EditTrieda")
for (let i = 0; i < editTriedu.length; i++) {
    editTriedu[i].addEventListener("click", function() {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        let vyberTriedneho = [];
        let vyberZiakov = [];
        let vyberUcebne = [];
        let ziaci = [];
        document.getElementById('addTriedu').style.display = 'block';
        document.getElementsByClassName('addUcebnuclose')[0].onclick = function() {
            document.getElementById('addTriedu').style.display =  'none';
            document.getElementById('Triedny').removeEventListener('click', TriednyListener);
            document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
            document.getElementById('Ucebna').removeEventListener('click', UcebnaListener);
        };
        sendRequest('/Triedy/getTriedu', 'POST', (idCell), (data) => {
            document.getElementById('Nazov').value = data['nazov'];
            if (data['rocnik'].length >0) {
                document.querySelector(".rights-selector.addTriedu").value = data['rocnik'][0][0];
            }
            let triedny = null;
            if (data['triedny'].length > 0) {
                document.getElementById('Triedny').value = data['triedny'][0][1];
                triedny = data['triedny'][0][0];
                vyberTriedneho.push(data['triedny'][0][0]);
            }else {
                document.getElementById('Triedny').value = "None";
            }
            data['ziaci'].forEach((ziak) => {
                vyberZiakov.push(ziak[0]);
                ziaci.push(ziak[1]);
            });
            if (ziaci.length > 0) {
                document.getElementById('ZadanyZiaci').value = ziaci.join(', ');
            } else {
                document.getElementById('ZadanyZiaci').value = "None";
            }
            if (data['ucebna'].length > 0) {
                document.getElementById('Ucebna').value = data['ucebna'][0][1];
                vyberUcebne.push(data['ucebna'][0][0]);
            }else {
                document.getElementById('Ucebna').value = "None";
            }
            TriednyListener = Triedny(vyberTriedneho, vyberZiakov, idCell, triedny);
            ZadanyZiaciListener = ZadanyZiaci(vyberTriedneho, vyberZiakov, idCell, null);
            UcebnaListener = Ucebna(vyberZiakov, vyberUcebne);
            document.getElementById('Triedny').addEventListener('click', TriednyListener);
            document.getElementById('ZadanyZiaci').addEventListener('click', ZadanyZiaciListener);
            document.getElementById('Ucebna').addEventListener('click', UcebnaListener);
        });
        document.getElementById('addTrieduSave').onclick = function () {
        let nazov = document.getElementById('Nazov').value;
        var rocnik = document.querySelector(".rights-selector.addTriedu").value;
        if (nazov) {
            sendRequest('/Triedy/updateTriedu', 'POST', ({id: idCell, nazov:nazov, vyberTriedneho:vyberTriedneho, vyberZiakov:vyberZiakov, vyberUcebne:vyberUcebne, rocnik:rocnik}), (data)=> {
               if (data){
                   window.location.reload();
               }
            });
        } else {
            alert("Nezadali ste žiadny Názov");
        }
    };
    });
}