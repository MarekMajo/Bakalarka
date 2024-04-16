let EditListener = null;
let AddListener = null;

function searchFunction() {
    let filter, tr, tdName, tdId, i, txtValueName, txtValueId;
    filter = document.querySelector(".search-input").value.toUpperCase();
    tr = document.querySelector(".table").getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tdId = tr[i].getElementsByTagName("td")[1];
        tdName = tr[i].getElementsByTagName("td")[2];
        if (tdId || tdName) {
            txtValueId = tdId.textContent || tdId.innerText;
            txtValueName = tdName.textContent || tdName.innerText;
            if (txtValueId.toUpperCase().indexOf(filter) > -1 || txtValueName.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
function add(idCell, vyberZiakov) {
    return function () {
        let modal = document.getElementById('vyberZiaci');
        modal.style.display = 'block';
        document.getElementsByClassName('vyberZiaciclose')[0].onclick = function () {
            modal.style.display = 'none';
        };
        sendRequest('/Rocniky/getZiaci', 'POST', null, (osoby) => {
            let tbody = document.querySelector('#vyberZiaci .modal-table tbody');
            tbody.innerHTML = '';
            osoby.forEach((osoba) => {
                let [id, meno, role] = osoba;
                let rowHTML = `<tr>
                <td><input type="checkbox" value="${id}"></td>
                <td>${id}</td>
                <td>${meno}</td>
                <td>${role}</td>
                </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
            document.getElementById('vyberZiaciSaveButton').onclick = function () {
                vyberZiakov.length = 0;
                let checkboxes = document.querySelectorAll('#vyberZiaci .modal-table tbody input[type="checkbox"]');
                let vyberZiakovName = [];
                checkboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        vyberZiakov.push(parseInt(checkbox.value));
                        let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                        vyberZiakovName.push(nameCell.textContent.trim());
                    }
                });
                if (vyberZiakovName.length > 0) {
                    document.getElementById('Ziaci').value = vyberZiakovName.join(', ');
                } else {
                    document.getElementById('Ziaci').value = "None";
                }
                modal.style.display = 'none';
            };
        });
    }
}

function edit(idCell, vyberZiakov) {
    return function () {
        let modal = document.getElementById('vyberZiaci')
        modal.style.display = 'block';
        document.getElementsByClassName('vyberZiaciclose')[0].onclick = function () {
            modal.style.display = 'none';
            document.getElementById('Ziaci').removeEventListener('click', edit);
        };
        sendRequest('/Rocniky/getZiaci', 'POST', (idCell), (osoby) => {
            let tbody = document.querySelector('#vyberZiaci .modal-table tbody');
            tbody.innerHTML = '';
            osoby.forEach((osoba) => {
                let [id, meno, role] = osoba;
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
            });
            document.getElementById('vyberZiaciSaveButton').onclick = function () {
                vyberZiakov.length = 0;
                let checkboxes = document.querySelectorAll('#vyberZiaci .modal-table tbody input[type="checkbox"]');
                let vyberZiakovName = [];
                checkboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        vyberZiakov.push(parseInt(checkbox.value));
                        let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                        vyberZiakovName.push(nameCell.textContent.trim());
                    }
                });
                console.log(vyberZiakov)
                if (vyberZiakovName.length > 0) {
                    document.getElementById('Ziaci').value = vyberZiakovName.join(', ');
                } else {
                    document.getElementById('Ziaci').value = "None";
                }
                modal.style.display = 'none';
            };
        });
    }
}
if (document.getElementById('addUserButton')) {
    document.getElementById('addUserButton').onclick = function () {
        let modal = document.getElementById('addRocnik');
        modal.style.display = 'block';
        document.getElementById('Nazov').value = '';
        document.getElementById('Ziaci').value = 'None';
        document.getElementsByClassName('addRocnikModalclose')[0].onclick = function () {
            modal.style.display = 'none';
            document.getElementById('Ziaci').removeEventListener('click', AddListener);
        };
        let vyberZiakov = [];
        AddListener = add(null, vyberZiakov);
        document.getElementById('Ziaci').addEventListener('click', AddListener);

        document.getElementById('saveaddRocnik').onclick = function () {
            if (document.getElementById('Nazov').value !== "") {
                sendRequest('/Rocniky/saveRocnik', 'POST', ({
                    nazov: document.getElementById('Nazov').value,
                    ziaci: vyberZiakov
                }), (data) => {
                    if (data) {
                        window.location.reload();
                    } else if (!data) {
                        alert("Zadaný názov už existuje");
                    } else {
                        alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                        window.location.reload();
                    }
                });
            } else
                alert("Nezadali ste Názov");
        };
    };
}

const editRocnik = document.getElementsByClassName("editRocnik")
for (let i = 0; i < editRocnik.length; i++) {
    editRocnik[i].addEventListener("click", function() {
        let modal = document.getElementById('addRocnik');
        modal.style.display = 'block';
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        document.getElementsByClassName('addRocnikModalclose')[0].onclick = function () {
            modal.style.display = 'none';
            document.getElementById('Ziaci').removeEventListener('click', EditListener);
        };
        document.getElementById('Nazov').value = this.closest('tr').getElementsByTagName('td')[1].textContent;
        let vyberZiakov = [];
        EditListener = edit(idCell, vyberZiakov);
        sendRequest('/Rocniky/getZiaciVrocniku', 'POST', (idCell), (osoby) => {
            let vyberZiakovName = [];
            osoby.forEach((osoba) => {
                vyberZiakov.push(osoba[0]);
                vyberZiakovName.push(osoba[1]);
            });
            if (vyberZiakovName.length > 0) {
                document.getElementById('Ziaci').value = vyberZiakovName.join(', ');
            }else {
                document.getElementById('Ziaci').value = "None";
            }
        });
        document.getElementById('Ziaci').addEventListener('click', EditListener);
        document.getElementById('saveaddRocnik').onclick = function () {
            if (document.getElementById('Nazov').value !== "") {
                console.log(vyberZiakov)
                sendRequest('/Rocniky/updateRocnik', 'POST', ({id: idCell , nazov: document.getElementById('Nazov').value, ziaci:vyberZiakov}), (data)=> {
                if (data) {
                    window.location.reload();
                } else if (!data) {
                    alert("Zadaný názov už existuje");
                } else {
                    alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                    window.location.reload();
                }
            });
            } else
                alert("Nezadali ste Názov");
        };
    });
}

const dellRocnik = document.getElementsByClassName("delRocnik")
for (let i = 0; i < dellRocnik.length; i++) {
    dellRocnik[i].addEventListener("click", function () {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        let nazov = this.closest('tr').getElementsByTagName('td')[1].textContent;
        let modal = document.getElementById('delRocnik');
        modal.style.display = "block";
        document.getElementsByClassName('delRocnikModalclose')[0].onclick = function () {
            modal.style.display = 'none';
        };
        document.getElementById('textdelRocnik').textContent = "Vážne chcete odstrániť Triedu s názvom: " + nazov;
        document.getElementById('savedelRocnik').onclick = function () {
            sendRequest("/Rocniky/delRocnik", 'POST', (idCell), (data) => {
                if (data) {
                    window.location.reload();
                } else {
                    alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                    window.location.reload();
                }
            });
        }
    });
}
if (document.getElementById('skopirovať')) {
    document.getElementById('skopirovať').onclick = function () {
        let modal = document.getElementById('kopirka');
        modal.style.display = "block";
        document.getElementById('addRocnik').style.display = 'none';
        document.getElementsByClassName('kopirkaModalclose')[0].onclick = function () {
            modal.style.display = 'none';
        };
        sendRequest('/Rocniky/getMinulyRocnik', 'GET', null, (data) => {
            if (data['rok']) {
                let tbody = document.querySelector('#Rocniky');
                tbody.innerHTML = '';
                let rowHTML = '';
                let rocniky = data['rocniky'];
                rowHTML = '<a>Ak nebude zadaný nový názov pre jednotlivý ročník nebude skopírovaný do nového roka</a>' +
                    '<input class="search-input" style="width: 30%" value="Starý Názov" type="text" readonly> > ' +
                    '<input class="search-input" style="width: 30%" value="Nový názov" type="text" readonly> <br>'
                tbody.insertAdjacentHTML('beforeend', rowHTML);
                rowHTML = '';
                rocniky.forEach((rocnik) => {
                    let [id, nazov, rok] = rocnik;
                    rowHTML = `
                <input class="search-input" style="width: 30%" value="${nazov}" type="text" readonly> >
                <input class="search-input novyNazov" style="width: 30%" placeholder="${nazov}" data-id="${id}" type="text"><br>
                 `
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
                document.getElementById('kopirkaSave').onclick = function () {
                    let noveNazvy = {};
                    document.querySelectorAll('.novyNazov').forEach(input => {
                        let id = input.dataset.id;
                        let nazov = input.value.trim();
                        if (nazov) {
                            noveNazvy[id] = nazov;
                        }
                    });
                    sendRequest('/Rocniky/copyMinulyRocnik', 'POST', ({noveNazvy: noveNazvy}), (item) => {
                        if (item) {
                            window.location.reload();
                        }
                    });
                };
            } else {
                modal.style.display = 'none';
                alert("Nemôžno skopírovať z minulého roka, lebo minulý rok neexistuje");
            }
        });
    };
}

function vyberZiakaFilter() {
    let input, filter, table, tr, i;
    input = document.getElementById("vyberZiacifiler");
    filter = input.value.toUpperCase();
    table = document.querySelector(".modal-table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        let idCell = tr[i].getElementsByTagName("td")[1];
        let nameCell = tr[i].getElementsByTagName("td")[2];
        if (idCell || nameCell) {
            let idText = idCell ? idCell.textContent || idCell.innerText : "";
            let nameText = nameCell ? nameCell.textContent || nameCell.innerText : "";
            if (idText.toUpperCase().indexOf(filter) > -1 || nameText.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function filterRole() {
    let prava = document.getElementById('RoleSelector').value;
    let tr = document.querySelector(".modal-table").getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[3];
        let right = td.textContent === 'null' ? 'None' : td.textContent;
        if (prava == "All" || right == prava) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}