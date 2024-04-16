let TriednyListener = null;
let ZadanyZiaciListener = null;
let ZadanePredmetyListener = null;
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
        if (prava === "All" || right === prava) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
function filterRocnikyPredmetu() {
    var select = document.getElementById('predmeSelect').value;
    var tr = document.querySelector(".modal-table").getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        var rocnik = tr[i].getElementsByTagName("td")[4].textContent;
        if (rocnik === select) {
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

function Triedny(typ, vyberTriedneho){
    return function () {
        let modal = document.getElementById('vyberTriedny_Ziaci');
        let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
        modal.style.display = 'block';
        document.getElementsByClassName('vyberTriedny_Ziaciclose')[0].onclick = function () {
            modal.style.display = 'none';
            tbody.removeEventListener('click', (tBodyListener));
        };
        document.getElementById("meno").textContent = "Meno Priezvisko";
        document.getElementById('rocnik').style.display = 'none';
        document.getElementById('role').style.display = 'none';
        if (typ === 'add') {
            sendRequest('/Triedy/getTriedny', 'POST', null, (osoby)=> {
                tbody.innerHTML = '';
                osoby.forEach((osoba) => {
                    let [id, meno] = osoba;
                    let rowHTML = `    <tr>
                           <td><input type="checkbox" value="${id}"></td>
                           <td>${id}</td>
                           <td>${meno}</td>
                           </tr>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
                tBodyListener = tBody(tbody);
                tbody.addEventListener('click', (tBodyListener));
            });
        } else {
            sendRequest('/Triedy/getTriedny', 'POST', (typ), (osoby)=> {
                tbody.innerHTML = '';
                osoby.forEach((osoba) => {
                    console.log(osoba)
                    let [id, meno] = osoba;
                    let checkedAttribute = '';
                    if (vyberTriedneho.includes(id)) {
                            checkedAttribute = "checked";
                        }
                    let rowHTML = `    <tr>
                           <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                           <td>${id}</td>
                           <td>${meno}</td>
                           </tr>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
                tBodyListener = tBody(tbody);
                tbody.addEventListener('click', (tBodyListener));
            });
        }
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
    };
}

function ZadanyZiaci(typ, rocnik, vyberZiakov) {
    return function () {
        let modal = document.getElementById('vyberTriedny_Ziaci');
        let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
        modal.style.display = 'block';
        document.getElementsByClassName('vyberTriedny_Ziaciclose')[0].onclick = function () {
            modal.style.display = 'none';
        };
        document.getElementById("meno").textContent = "Meno Priezvisko";
        document.getElementById('rocnik').style.display = 'none';
        document.getElementById('role').style.display = 'none';
        if (typ === 'add') {
            sendRequest('/Triedy/getZiaci', 'POST', ({rocnik:rocnik}), (osoby)=> {
                tbody.innerHTML = '';
                osoby.forEach((osoba) => {
                    let [id, meno] = osoba;
                    let rowHTML = `    <tr>
                           <td><input type="checkbox" value="${id}"></td>
                           <td>${id}</td>
                           <td>${meno}</td>
                           </tr>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
            });
        } else {
            sendRequest('/Triedy/getZiaci', 'POST', ({rocnik:rocnik}), (osoby)=> {
                tbody.innerHTML = '';
                console.log(rocnik);
                console.log(osoby);
                osoby.forEach((osoba) => {
                    console.log(osoba)
                    let [id, meno] = osoba;
                    let checkedAttribute = '';
                    if (vyberZiakov.includes(id)) {
                        checkedAttribute = "checked";
                    }
                    let rowHTML = `<tr>
                        <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                        <td>${id}</td>
                        <td>${meno}</td>
                        </tr>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
            });
        }
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
    };
}

function ZadanePredmety(typ, rocnik, vyberPredmety) {
    return function () {
        let modal = document.getElementById('vyberTriedny_Ziaci');
        let select = document.getElementById('predmeSelect');
        let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
        select.style.display = 'block';
        modal.style.display = 'block';
        document.getElementById("meno").textContent = "Názov Predmetu";
        document.getElementById('role').textContent = 'Meno Učiteľa';
        document.getElementById('role').style.display = 'table-cell';
        document.getElementById('rocnik').textContent = 'Ročník';
        document.getElementById('rocnik').style.display = 'table-cell';
        document.getElementsByClassName('vyberTriedny_Ziaciclose')[0].onclick = function () {
            modal.style.display = 'none';
            select.style.display = 'none';
        };
        if (typ === 'add') {
            sendRequest('/Triedy/getPredmetyRocniku', 'GET', null, (data)=> {
                tbody.innerHTML = '';
                select.innerHTML = '';
                let Predmety = data['predmety'];
                let Rocniky = data['rocniky'];
                Rocniky.forEach((rocniky) =>{
                    let temp;
                    if (rocniky[1] === rocnik){
                        temp = `<option value="${rocniky[1]}" selected>${rocniky[1]}</option>`;
                    }else {
                        temp = `<option value="${rocniky[1]}">${rocniky[1]}</option>`;
                    }
                    select.insertAdjacentHTML('beforeend', temp);
                });
                Predmety.forEach((predmet) => {
                    console.log(predmet)
                    let [id,rocnik, meno, ucitel] = predmet;
                    let rowHTML = `    <tr>
                           <td><input type="checkbox" value="${id}"></td>
                           <td>${id}</td>
                           <td>${meno}</td>
                           <td>${ucitel}</td>
                           <td>${rocnik}</td>
                           </tr>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
                filterRocnikyPredmetu();
            });
        } else {
            sendRequest('/Triedy/getPredmetyRocniku', 'GET', null, (data)=> {
                tbody.innerHTML = '';
                select.innerHTML = '';
                let Predmety = data['predmety'];
                let Rocniky = data['rocniky'];
                Rocniky.forEach((rocniky) =>{
                    let temp;
                    if (rocniky[1] === rocnik){
                        temp = `<option value="${rocniky[1]}" selected>${rocniky[1]}</option>`;
                    }else {
                        temp = `<option value="${rocniky[1]}">${rocniky[1]}</option>`;
                    }
                    select.insertAdjacentHTML('beforeend', temp);
                });
                Predmety.forEach((predmet) => {
                    let [id,rocnik, meno, ucitel] = predmet;
                    let checkedAttribute = '';
                    if (vyberPredmety.includes(id)) {
                        checkedAttribute = "checked";
                    }
                    let rowHTML = `    <tr>
                           <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                           <td>${id}</td>
                           <td>${meno}</td>
                           <td>${ucitel}</td>
                           <td>${rocnik}</td>
                           </tr>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
                filterRocnikyPredmetu();
            });
        }
        document.getElementById('vyberTriedny_ZiaciSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberTriedny_Ziaci .modal-table tbody input[type="checkbox"]');
            let vyberPredmetyName = [];
            vyberPredmety.length = 0;
            checkboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    vyberPredmety.push(parseInt(checkbox.value));
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    vyberPredmetyName.push(nameCell.textContent.trim());
                }
            });
            if (vyberPredmetyName.length > 0) {
                document.getElementById('ZadanePredmety').value = vyberPredmetyName.join(', ');
            } else {
                document.getElementById('ZadanePredmety').value = "None";
            }
            modal.style.display = 'none';
            select.style.display = 'none';
        };
    };
}
function Ucebna(typ, vyberUcebne) {
    return function () {
        let modal = document.getElementById('vyberTriedny_Ziaci');
        let tbody = document.querySelector('#vyberTriedny_Ziaci .modal-table tbody');
        modal.style.display = 'block';
        document.getElementById('rocnik').style.display = "none";
        document.getElementsByClassName('vyberTriedny_Ziaciclose')[0].onclick = function () {
            modal.style.display = 'none';
            document.getElementById('rocnik').style.display = "block";
            tbody.removeEventListener('click', (tBodyListener));
        };
        document.getElementById("meno").textContent = "Názov";
        document.getElementById("role").style.display = "table-cell";
        document.getElementById("role").textContent = "Skratka";
        if (typ === 'add') {
            sendRequest('/Predmety/getUcebne', 'GET', null, (ucebne)=> {
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
            });
        } else {
            sendRequest('/Predmety/getUcebne', 'GET', null, (ucebne)=> {
                tbody.innerHTML = '';
                ucebne.forEach((ucebna) => {
                    console.log(ucebna)
                    let [id, nazov, skratka] = ucebna;
                    let checkedAttribute = '';
                    if (vyberUcebne.includes(id)) {
                            checkedAttribute = "checked";
                    }
                    let rowHTML = `<tr>
                           <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                           <td>${id}</td>
                           <td>${nazov}</td>
                           <td>${skratka}</td>
                           </tr>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                });
                tBodyListener = tBody(tbody);
                tbody.addEventListener('click', (tBodyListener));
            });
        }
        document.getElementById('vyberTriedny_ZiaciSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberTriedny_Ziaci .modal-table tbody input[type="checkbox"]');
            let vyberUcebneName = [];
            vyberUcebne.length = 0;
            checkboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    vyberUcebne.push(parseInt(checkbox.value));
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    vyberUcebneName.push(nameCell.textContent.trim());
                }
            });
            if (vyberUcebneName.length > 0) {
                document.getElementById('Ucebna').value = vyberUcebneName.join(', ');
            } else {
                document.getElementById('Ucebna').value = "None";
            }
            tbody.removeEventListener('click', (tBodyListener));
            document.getElementById('rocnik').style.display = "block";
            modal.style.display = 'none';
        };
    };
}
if (document.getElementById('addTriedaButton')) {
    document.getElementById('addTriedaButton').onclick = function () {
        document.getElementById('addTriedu').style.display = 'block';
        document.getElementById('Nazov').value = "";
        document.getElementById('Triedny').value = "None";
        document.getElementById('ZadanyZiaci').value = "None";
        document.getElementById('Ucebna').value = "None";
        document.querySelector(".rights-selector.addTriedu").value = "None";
        document.getElementsByClassName('addUcebnuclose')[0].onclick = function () {
            document.getElementById('addTriedu').style.display = 'none';
            document.getElementById('Triedny').removeEventListener('click', TriednyListener);
            document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
            document.getElementById('ZadanePredmety').removeEventListener('click', ZadanePredmetyListener);
            document.getElementById('Ucebna').removeEventListener('click', UcebnaListener);
            document.getElementById('ziaci').style.display = 'none';
            document.getElementById('predmety').style.display = 'none';
        };
        let vyberTriedneho = [];
        let vyberZiakov = [];
        let vyberUcebne = [];
        let vyberPredmety = [];
        let rocnik = '';
        document.querySelector(".rights-selector.addTriedu").onchange = function () {
            rocnik = document.querySelector(".rights-selector.addTriedu").value;
            if (rocnik === 'None') {
                document.getElementById('ziaci').style.display = 'none';
                vyberZiakov.length = 0;
                document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
                document.getElementById('ZadanePredmety').removeEventListener('click', ZadanePredmetyListener);
            } else {
                document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
                document.getElementById('ZadanePredmety').removeEventListener('click', ZadanePredmetyListener);
                vyberZiakov.length = 0;
                vyberPredmety.length = 0;
                document.getElementById('ZadanyZiaci').value = "None";
                document.getElementById('ZadanePredmety').value = "None";
                ZadanyZiaciListener = ZadanyZiaci('add', rocnik, vyberZiakov);
                ZadanePredmetyListener = ZadanePredmety('add', rocnik, vyberPredmety);
                document.getElementById('ZadanyZiaci').addEventListener('click', ZadanyZiaciListener);
                document.getElementById('ZadanePredmety').addEventListener('click', ZadanePredmetyListener);
                document.getElementById('ziaci').style.display = 'block';
                document.getElementById('predmety').style.display = 'block';
            }
        }
        TriednyListener = Triedny('add', vyberTriedneho);

        UcebnaListener = Ucebna('add', vyberUcebne);
        document.getElementById('Triedny').addEventListener('click', TriednyListener);
        document.getElementById('Ucebna').addEventListener('click', UcebnaListener);

        document.getElementById('addTrieduSave').onclick = function () {
            let nazov = document.getElementById('Nazov').value;
            var rocnik = document.querySelector(".rights-selector.addTriedu").value;
            if (nazov) {
                sendRequest('/Triedy/saveTriedu', 'POST', ({
                    nazov: nazov, vyberTriedneho: vyberTriedneho, vyberZiakov: vyberZiakov,
                    vyberUcebne: vyberUcebne, rocnik: rocnik, vyberPredmety: vyberPredmety
                }), (data) => {
                    if (data) {
                        window.location.reload();
                    } else if(!data) {
                        alert("Zadaný názov už existuje");
                    } else {
                        alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                    }
                });
            } else {
                alert("Nezadali ste žiadny Názov");
            }
        };
    };
}

const editTriedu = document.getElementsByClassName("EditTrieda")
for (let i = 0; i < editTriedu.length; i++) {
    editTriedu[i].addEventListener("click", function () {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        document.getElementById('addTriedu').style.display = 'block';
        document.getElementsByClassName('addUcebnuclose')[0].onclick = function() {
            document.getElementById('addTriedu').style.display =  'none';
            document.getElementById('Triedny').removeEventListener('click', TriednyListener);
            document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
            document.getElementById('Ucebna').removeEventListener('click', UcebnaListener);
            document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
            document.getElementById('ziaci').style.display = 'none';
            document.getElementById('predmety').style.display = 'none';
        };
        let vyberTriedneho = [];
        let vyberZiakov = [];
        let vyberUcebne = [];
        let vyberPredmety = [];
        let ziaci = [];
        let predmety = [];
        sendRequest('/Triedy/getTriedu', 'POST', (idCell), (data) => {
            document.getElementById('Nazov').value = data['nazov'];
            let permission = data['user_permissions'];
            let rocnik = '';
            if (data['rocnik'].length >0) {
                rocnik = data['rocnik'][0][0];
                document.querySelector(".rights-selector.addTriedu").value = data['rocnik'][0][0];
                document.getElementById('ziaci').style.display = 'block';
                document.getElementById('predmety').style.display = 'block';
            }
            if (data['triedny'].length > 0) {
                document.getElementById('Triedny').value = data['triedny'][0][1];
                vyberTriedneho.push(data['triedny'][0][0]);
            }else {
                document.getElementById('Triedny').value = "None";
            }
            data['predmety'].forEach((predmet)=> {
                vyberPredmety.push(predmet[0]);
                predmety.push(predmet[1]);
            });
            if (predmety.length > 0) {
                document.getElementById('ZadanePredmety').value = predmety.join(', ');
            } else {
                document.getElementById('ZadanePredmety').value = "None";
            }
            data['ziaci'].forEach((ziak)=> {
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
            document.querySelector(".rights-selector.addTriedu").onchange = function () {
                rocnik = document.querySelector(".rights-selector.addTriedu").value;
                if (rocnik === 'None') {
                    document.getElementById('ziaci').style.display = 'none';
                    document.getElementById('predmety').style.display = 'none';
                    vyberZiakov.length = 0;
                    vyberPredmety.length = 0;
                    document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
                } else {
                    document.getElementById('ZadanyZiaci').removeEventListener('click', ZadanyZiaciListener);
                    vyberZiakov.length = 0;
                    vyberPredmety.length = 0;
                    document.getElementById('ZadanyZiaci').value = "None";
                    document.getElementById('ZadanePredmety').value = "None";
                    ZadanyZiaciListener = ZadanyZiaci(idCell, rocnik, vyberZiakov);
                    document.getElementById('ZadanyZiaci').addEventListener('click', ZadanyZiaciListener);
                    ZadanePredmetyListener = ZadanePredmety(idCell, rocnik, vyberPredmety);
                    document.getElementById('ZadanePredmety').addEventListener('click', ZadanePredmetyListener);
                    document.getElementById('ziaci').style.display = 'block';
                    document.getElementById('predmety').style.display = 'block';
                }
            };
            TriednyListener = Triedny(idCell, vyberTriedneho);
            UcebnaListener = Ucebna(idCell, vyberUcebne);
            ZadanyZiaciListener = ZadanyZiaci(idCell, rocnik, vyberZiakov);
            ZadanePredmetyListener = ZadanePredmety(idCell, rocnik, vyberPredmety);
            if (permission.includes(35)) {
                document.getElementById('Triedny').addEventListener('click', TriednyListener);
            }
            if (permission.includes(38)) {
                document.getElementById('Ucebna').addEventListener('click', UcebnaListener);
            }
            if (permission.includes(36)) {
                document.getElementById('ZadanyZiaci').addEventListener('click', ZadanyZiaciListener);
            }
            if (permission.includes(37)) {
                document.getElementById('ZadanePredmety').addEventListener('click', ZadanePredmetyListener);
            }
            document.getElementById('Nazov').disabled = !permission.includes(34);
            document.getElementsByClassName('rights-selector addTriedu')[0].disabled = !permission.includes(39);

            document.getElementById('addTrieduSave').onclick = function () {
                let nazov = document.getElementById('Nazov').value;
                var rocnik = document.querySelector(".rights-selector.addTriedu").value;
                if (nazov) {
                    sendRequest('/Triedy/updateTriedu', 'POST', ({id: idCell, nazov:nazov, vyberTriedneho:vyberTriedneho,
                        vyberZiakov:vyberZiakov, vyberUcebne:vyberUcebne, rocnik:rocnik, vyberPredmety:vyberPredmety}), (data)=> {
                    if (data){
                        window.location.reload();
                    } else if (!data) {
                        alert("Neopravnená zmena názvu");
                        window.location.reload();
                    } else {
                        alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                    }
                });
                } else {
                    alert("Nezadali ste žiadny Názov");
                }
            };
        });
    });
}

const delTriedu = document.getElementsByClassName("delTrieda")
for (let i = 0; i < delTriedu.length; i++) {
    delTriedu[i].addEventListener("click", function () {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        sendRequest('/Triedy/delTriedu', 'POST', (idCell), (data)=> {
           if (data) {
               window.location.reload()
           } else {
               alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
           }
        });
    });
}