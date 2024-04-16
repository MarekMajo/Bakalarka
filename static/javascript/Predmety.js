let tBodyListener = null;
let addZadanyVyucujuciListener = null;
let addZadanyAsistentListener = null;
let addZadanaUcebnaListener = null;
let addZiaciListener = null;
let editZadanyVyucujuciListener = null;
let editZadanyAsistentListener = null;
let editZadanaUcebnaListener = null;
let editZiaciListener = null;
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
function filterVyucujuci() {
    let prava = document.getElementById('vyucujuciSelector').value;
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
function filterPredmetyByRocnik() {
    var rocniky = document.querySelector(".rights-selector").value;
    var tr = document.querySelector(".table").getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        var rocnik = tr[i].getElementsByTagName("td")[1].textContent;
        if (rocniky == "All" || rocnik == rocniky) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function copyCheckBox(typ) {
     let checkbox = document.getElementById('copyFromLastYear');
        let elementsToHide = [
            document.getElementById('zoznamPredmetovSelect'),
            document.querySelector('label[for="ZadanyVyucujuci"]'),
            document.getElementById('ZadanyVyucujuci'),
            document.querySelector('label[for="ZadanaUcebna"]'),
            document.getElementById('ZadanaUcebna'),
            document.querySelector('label[for="ZadanyAsistent"]'),
            document.getElementById('ZadanyAsistent'),
            document.getElementById('rocnik')
        ];
    if (typ === 'add') {
        checkbox.onchange = function () {
            if (checkbox.checked) {
                elementsToHide.forEach(function(element) {
                    element.style.display = 'none';
                });
            } else {
                elementsToHide.forEach(function(element) {
                    element.style.display = '';
                });
            }
        };
    } else {
        checkbox.checked = false;
        elementsToHide.forEach(function(element) {
            element.style.display = '';
        });
    }
}

function vyberVyucujuceho_UcebnuFilter() {
    let input, filter, table, tr, i;
    input = document.getElementById("vyberVyucujuceho_Ucebnufiler");
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

function addVyucujuci(VyucujuciSelectedIds){
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
            tbody.removeEventListener('click', (tBodyListener));
        };
        tbody.innerHTML = '';
        sendRequest('/Predmety/getUcitelia', 'GET', null, (data) => {
            data.forEach((osoba) => {
                let [id, meno, role] = osoba;
                let rowHTML = `<tr>
                       <td><input type="checkbox" value="${id}"></td>
                       <td>${id}</td>
                       <td>${meno}</td>
                       <td>${role}</td>
                   </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
            tBodyListener = tBody(tbody);
            tbody.addEventListener('click', (tBodyListener));
        });
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let VyucujuciSelectedNames = [];
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    VyucujuciSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    VyucujuciSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (VyucujuciSelectedNames.length > 0) {
                document.getElementById('ZadanyVyucujuci').value = VyucujuciSelectedNames.join(', ');
            }else {
                document.getElementById('ZadanyVyucujuci').value = "None";
            }
            tbody.removeEventListener('click', (tBodyListener));
            modal.style.display = 'none';
        };
    };
}

function addAsistent(AsistenSelectedIds) {
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
        };
        tbody.innerHTML = '';
        sendRequest('/Predmety/getUcitelia', 'GET', null, (data) => {
            data.forEach((osoba) => {
                let [id, meno, role] = osoba;
                let rowHTML = `<tr>
                       <td><input type="checkbox" value="${id}"></td>
                       <td>${id}</td>
                       <td>${meno}</td>
                       <td>${role}</td>
                   </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let AsistentSelectedNames = [];
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    AsistenSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    AsistentSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (AsistentSelectedNames.length > 0) {
                document.getElementById('ZadanyAsistent').value = AsistentSelectedNames.join(', ');
            }else {
                document.getElementById('ZadanyAsistent').value = "None";
            }
            modal.style.display = 'none';
        };
    };
}

function addUcebna(UcebnaSelectedIds) {
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        document.getElementById("vyucujuciSelector").style.display = "none";
        document.getElementById("prava").textContent = "Skratka";
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
            document.getElementById("prava").textContent = "Práva";
            document.getElementById("vyucujuciSelector").style.display = "block";
            document.getElementById("prava").style.display = "block";
            tbody.removeEventListener('click', (tBodyListener));
        };
        tbody.innerHTML = '';
        sendRequest('/Predmety/getUcebne', 'GET', null, (data) => {
            data.forEach((ucebna) => {
                let [id, meno, role] = ucebna;
                let rowHTML = `<tr>
                       <td><input type="checkbox" value="${id}"></td>
                       <td>${id}</td>
                       <td>${meno}</td>
                       <td>${role}</td>
                   </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
        tBodyListener = tBody(tbody);
        tbody.addEventListener('click', (tBodyListener));
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let UcebnaSelectedNames = [];
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    UcebnaSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    UcebnaSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (UcebnaSelectedNames.length > 0) {
                document.getElementById('ZadanaUcebna').value = UcebnaSelectedNames.join(', ');
            }else {
                document.getElementById('ZadanaUcebna').value = "None";
            }
            document.getElementById("prava").textContent = "Práva";
            document.getElementById("vyucujuciSelector").style.display = "block";
            tbody.removeEventListener('click', (tBodyListener));
            modal.style.display = 'none';
        };
    };
}

function addZiaci(ZiaciSelectedIds) {
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        document.getElementById("prava").style.display = "none";
        document.getElementById("vyucujuciSelector").style.display = "none";
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
            document.getElementById("vyucujuciSelector").style.display = "block";
            document.getElementById("prava").style.display = "block";
        };
        let rocnik =  document.querySelector(".rights-selector.add").value;
        tbody.innerHTML = '';
        sendRequest('/Predmety/getZiaciRocnik', 'POST',(rocnik), (data) => {
            data.forEach((ziak) => {
                let [id, meno] = ziak;
                let rowHTML = `<tr>
                       <td><input type="checkbox" value="${id}"></td>
                       <td>${id}</td>
                       <td>${meno}</td>
                   </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let ZiaciSelectedNames = [];
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    ZiaciSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    ZiaciSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (ZiaciSelectedNames.length > 0) {
                document.getElementById('zadanyZiaci').value = ZiaciSelectedNames.join(', ');
            }else {
                document.getElementById('zadanyZiaci').value = "None";
            }
            document.getElementById("prava").style.display = "block";
            document.getElementById("vyucujuciSelector").style.display = "block";
            modal.style.display = 'none';
        };
    };
}

function editVyucujuci(VyucujuciSelectedIds, result) {
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
            tbody.removeEventListener('click', (tBodyListener));
        };
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        tbody.innerHTML = '';
        sendRequest('/Predmety/getUcitelia', 'GET', null, (data) => {
            data.forEach((osoba) => {
                let [id, meno, role] = osoba;
                let checkedAttribute = ''
                for (let item of result['vyucujuci']) {
                    if (id === item[0]){
                        checkedAttribute = "checked";
                    }
                }
                let rowHTML = `<tr>
                              <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                              <td>${id}</td>
                              <td>${meno}</td>
                              <td>${role}</td>
                          </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
        tBodyListener = tBody(tbody);
        tbody.addEventListener('click', (tBodyListener));
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let VyucujuciSelectedNames = [];
            VyucujuciSelectedIds.length = 0;
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    VyucujuciSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    VyucujuciSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (VyucujuciSelectedNames.length > 0) {
                document.getElementById('ZadanyVyucujuci').value = VyucujuciSelectedNames.join(', ');
            }else {
                document.getElementById('ZadanyVyucujuci').value = "None";
            }
            tbody.removeEventListener('click', (tBodyListener));
            modal.style.display = 'none';
        };
    };
}

function editAsistent(AsistenSelectedIds, result) {
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
        };
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        tbody.innerHTML = '';
        sendRequest('/Predmety/getAssistenti', 'GET', null, (data) => {
            data.forEach((osoba) => {
                let [id, meno, role] = osoba;
                let checkedAttribute = ''
                for (let item of result['asistent']) {
                    if (id === item[0]){
                        checkedAttribute = "checked";
                    }
                }
                let rowHTML = `<tr>
                              <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                              <td>${id}</td>
                              <td>${meno}</td>
                              <td>${role}</td>
                          </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let AsistentSelectedNames = [];
            AsistenSelectedIds.length = 0;
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    AsistenSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    AsistentSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (AsistentSelectedNames.length > 0) {
                document.getElementById('ZadanyAsistent').value = AsistentSelectedNames.join(', ');
            }else {
                document.getElementById('ZadanyAsistent').value = "None";
            }
            modal.style.display = 'none';
        };
    };
}
function editUcebna(UcebnaSelectedIds, ucebne) {
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
            tbody.removeEventListener('click', (tBodyListener));
        };
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        tbody.innerHTML = '';
        sendRequest('/Predmety/getUcebne', 'GET', null, (data) => {
            data.forEach((ucebna) => {
                let [id, meno, role] = ucebna;
                let checkedAttribute = '';
                for(let item of ucebne) {
                    if (role === item){
                        checkedAttribute = "checked";
                    }
                }
                let rowHTML = `<tr>
                              <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                              <td>${id}</td>
                              <td>${meno}</td>
                              <td>${role}</td>
                          </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
        tBodyListener = tBody(tbody);
        tbody.addEventListener('click', (tBodyListener));
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let UcebnaSelectedNames = [];
            UcebnaSelectedIds.length = 0;
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    UcebnaSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    UcebnaSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (UcebnaSelectedNames.length > 0) {
                document.getElementById('ZadanaUcebna').value = UcebnaSelectedNames.join(', ');
            }else {
                document.getElementById('ZadanaUcebna').value = "None";
            }
            tbody.removeEventListener('click', (tBodyListener));
            modal.style.display = 'none';
        };
    };
}

function editZiaci(ZiaciSelectedIds, result) {
    return function () {
        let modal = document.getElementById('vyberVyucujuceho_Ucebnu');
        modal.style.display = 'block';
        document.getElementById('vyberVyucujuceho_Ucebnufiler').value = '';
        document.getElementById("prava").style.display = "none";
        document.getElementById("vyucujuciSelector").style.display = "none";
        document.getElementsByClassName('vyberVyucujuceho_Ucebnuclose')[0].onclick = function() {
            modal.style.display = 'none';
            document.getElementById("vyucujuciSelector").style.display = "block";
            document.getElementById("prava").style.display = "block";
        };
        let tbody = document.querySelector('#vyberVyucujuceho_Ucebnu .modal-table tbody');
        let rocnik =  document.querySelector(".rights-selector.add").value;
        sendRequest('/Predmety/getZiaciRocnik', 'POST', (rocnik), (data) => {
            tbody.innerHTML = '';
            data.forEach((ziak) => {
                let [id, meno] = ziak;
                let checkedAttribute = ''
                for (let item of result['ziaci']) {
                    if (id === item[0]){
                        checkedAttribute = "checked";
                    }
                }
                let rowHTML = `<tr>
                              <td><input type="checkbox" value="${id}" ${checkedAttribute}></td>
                              <td>${id}</td>
                              <td>${meno}</td>
                          </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
        document.getElementById('vyberVyucujuceho_UcebnuSaveButton').onclick = function () {
            let checkboxes = document.querySelectorAll('#vyberVyucujuceho_Ucebnu .modal-table tbody input[type="checkbox"]');
            let ZiaciSelectedNames = [];
            ZiaciSelectedIds.length = 0;
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    ZiaciSelectedIds.push(checkbox.value);
                    let nameCell = checkbox.closest('tr').getElementsByTagName('td')[2];
                    ZiaciSelectedNames.push(nameCell.textContent.trim());
                }
            });
            if (ZiaciSelectedNames.length > 0) {
                document.getElementById('zadanyZiaci').value = ZiaciSelectedNames.join(', ');
            }else {
                document.getElementById('zadanyZiaci').value = "None";
            }
            document.getElementById("prava").style.display = "block";
            document.getElementById("vyucujuciSelector").style.display = "block";
            modal.style.display = 'none';
        };
    };
}
if (document.getElementById('addPredmetButton')) {
    document.getElementById('addPredmetButton').onclick = function () {
        document.getElementById('ZadanaUcebna').value = "None";
        document.getElementById('ZadanyVyucujuci').value = "None";
        document.getElementById('zadanyZiaci').value = 'none';
        document.getElementById('ZadanyAsistent').value = 'none';
        document.querySelector(".rights-selector.add").value = 'None';
        document.getElementById('ziaci').style.display = 'none';
        document.getElementById('copyFromLastYearContainer').style.display = 'block';
        copyCheckBox('add');
        let modal = document.getElementById('addPredmet');
        modal.style.display = 'block';
        document.getElementsByClassName('addPredmetclose')[0].onclick = function () {
            modal.style.display = 'none';
            document.getElementById('ZadanyVyucujuci').removeEventListener('click', addZadanyVyucujuciListener);
            document.getElementById('ZadanaUcebna').removeEventListener('click', addZadanaUcebnaListener);
            document.getElementById('zadanyZiaci').removeEventListener('click', addZiaciListener);
            document.getElementById('ZadanyAsistent').removeEventListener('click', addZadanyAsistentListener);
        };
        let UcebnaSelectedIds = [];
        let VyucujuciSelectedIds = [];
        let ZiaciSelectedIds = [];
        let AsistenSelectedIds = [];
        sendRequest('/Predmety/getPredmety', 'GET', null, (data) => {
            let zoznamPredmetovSelect = document.getElementById('zoznamPredmetovSelect');
            zoznamPredmetovSelect.innerHTML = '';
            data.forEach((predmet) => {
                let option = document.createElement('option');
                option.value = predmet[0];
                option.textContent = `${predmet[1]} (${predmet[2]})`;
                zoznamPredmetovSelect.appendChild(option);
            });
        });
        addZadanyVyucujuciListener = addVyucujuci(VyucujuciSelectedIds);
        addZadanaUcebnaListener = addUcebna(UcebnaSelectedIds);
        addZiaciListener = addZiaci(ZiaciSelectedIds);
        addZadanyAsistentListener = addAsistent(AsistenSelectedIds);
        document.getElementById('ZadanyVyucujuci').addEventListener('click', addZadanyVyucujuciListener);
        document.getElementById('ZadanyAsistent').addEventListener('click', addZadanyAsistentListener);
        document.getElementById('ZadanaUcebna').addEventListener('click', addZadanaUcebnaListener);
        document.getElementById('zadanyZiaci').addEventListener('click', addZiaciListener);
        document.querySelector(".rights-selector.add").onchange = function () {
            if (document.querySelector(".rights-selector.add").value === 'None') {
                document.getElementById('ziaci').style.display = 'none';
            } else {
                document.getElementById('ziaci').style.display = 'block';
            }
        }
        document.getElementById('addPredmetSave').onclick = function () {
            if (document.getElementById('copyFromLastYear').checked) {
                sendRequest('/Predmety/copyFromLastYear', 'GET', null, (data) => {
                    if (!data) {
                        alert("Neexistujú údaje o predchádzajúcom Roku");
                    } else {
                        window.location.reload()
                    }
                });
            } else {
                let predmet = document.getElementById('zoznamPredmetovSelect').value;
                let rocnik = document.querySelector(".rights-selector.add").value;
                sendRequest('/Predmety/ulozitPredmetKroku', 'POST', ({
                    predmet: predmet,
                    vyucujuci: VyucujuciSelectedIds,
                    asistent: AsistenSelectedIds,
                    ucebne: UcebnaSelectedIds,
                    rocnik: rocnik,
                    ziaci: ZiaciSelectedIds
                }), (data) => {
                    if (data) {
                        window.location.reload();
                    } else {
                        alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                    }
                });
            }
        }
    };
}

const delPredmet = document.getElementsByClassName("delPredmet")
for (let i = 0; i < delPredmet.length; i++) {
    delPredmet[i].addEventListener("click", function() {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        sendRequest('/Predmety/delPredmetKroku', 'POST', (idCell), (data)=> {
            if (data){
                window.location.reload();
            } else {
                alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
            }
        });
    });
}

const editPredmet = document.getElementsByClassName("editPredmet")
for (let i = 0; i < editPredmet.length; i++) {
    editPredmet[i].addEventListener("click", function() {
        document.getElementById('copyFromLastYearContainer').style.display = 'none';
        copyCheckBox('edit');
        let UcebnaSelectedIds = [];
        let VyucujuciSelectedIds = [];
        let AsistenSelectedIds = [];
        let ZiaciSelectedIds = [];
        let ucebne = [];
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        sendRequest('/Predmety/getInfo', 'POST', (idCell), (result)=> {
            let modal = document.getElementById('addPredmet');
            let permission = result['user_permissions'];
            if (result['rocnik'].length > 0) {
                document.querySelector(".rights-selector.add").value = result['rocnik'];
                document.getElementById('ziaci').style.display = 'block';
            } else {
                document.querySelector(".rights-selector.add").value = 'None';
                document.getElementById('ziaci').style.display = 'none';
            }
            for (let item of result['ucebne']) {
                UcebnaSelectedIds.push(item[0]);
                ucebne.push(item[1]);
            }
            for (let item of result['vyucujuci']) {
                VyucujuciSelectedIds.push(item[0]);
            }
            for (let item of result['asistent']) {
                AsistenSelectedIds.push(item[0]);
            }
            for (let item of result['ziaci']) {
                ZiaciSelectedIds.push(item[0]);
            }
            modal.style.display = 'block';
            document.getElementsByClassName('addPredmetclose')[0].onclick = function() {
                modal.style.display = 'none';
                document.getElementById('ZadanyVyucujuci').removeEventListener('click', editZadanyVyucujuciListener);
                document.getElementById('ZadanyAsistent').removeEventListener('click', editZadanyAsistentListener);
                document.getElementById('ZadanaUcebna').removeEventListener('click', editZadanaUcebnaListener);
                document.getElementById('zadanyZiaci').removeEventListener('click', editZiaciListener);
            };
            let zoznamPredmetovSelect = document.getElementById('zoznamPredmetovSelect');
            zoznamPredmetovSelect.innerHTML = '';
            let predmet = result['nazov']
            let option = document.createElement('option');
            option.value = predmet[0];
            option.textContent = `${predmet[1]}`;
            zoznamPredmetovSelect.appendChild(option);
            if (result['vyucujuci'].length > 0) {
                let zoznam = [];
                for (let item of result['vyucujuci']) {
                    zoznam.push(item[1]);
                }
                document.getElementById('ZadanyVyucujuci').value = zoznam.join(', ');
                }else {
                    document.getElementById('ZadanyVyucujuci').value = "None";
            }
            if (result['asistent'].length > 0) {
                let zoznam = [];
                for (let item of result['asistent']) {
                    zoznam.push(item[1]);
                }
                document.getElementById('ZadanyAsistent').value = zoznam.join(', ');
                }else {
                    document.getElementById('ZadanyAsistent').value = "None";
            }
            if (result['ziaci'].length > 0) {
                let zoznam = [];
                for (let item of result['ziaci']) {
                    zoznam.push(item[1]);
                }
                document.getElementById('zadanyZiaci').value = zoznam.join(', ');
                }else {
                    document.getElementById('zadanyZiaci').value = "None";
            }
            document.querySelector(".rights-selector.add").onchange = function () {
                if (document.querySelector(".rights-selector.add").value === 'None') {
                    document.getElementById('ziaci').style.display = 'none';
                } else {
                    document.getElementById('ziaci').style.display = 'block';
                }
                let rocnik = '';
                if (result['rocnik'].length > 0) {
                    rocnik = result['rocnik'][0][0];
                }
                if (document.querySelector(".rights-selector.add").value === rocnik) {
                    if (result['ziaci'].length > 0) {
                        let zoznam = [];
                        ZiaciSelectedIds.length = 0;
                        for (let item of result['ziaci']) {
                            zoznam.push(item[1]);
                            ZiaciSelectedIds.push(item[0]);
                        }
                        document.getElementById('zadanyZiaci').value = zoznam.join(', ');
                        } else {
                        document.getElementById('zadanyZiaci').value = "None";
                    }
                } else {
                    ZiaciSelectedIds.length = 0;
                    document.getElementById('zadanyZiaci').value = "None";
                }
            };
            if (ucebne.length > 0) {
                document.getElementById('ZadanaUcebna').value = ucebne.join(', ');
                }else {
                    document.getElementById('ZadanaUcebna').value = "None";
            }
            editZadanyVyucujuciListener = editVyucujuci(VyucujuciSelectedIds, result);
            editZadanyAsistentListener = editAsistent(AsistenSelectedIds, result);
            editZadanaUcebnaListener = editUcebna(UcebnaSelectedIds, ucebne);
            editZiaciListener = editZiaci(ZiaciSelectedIds, result);
            if (permission.includes(28)) {
                document.getElementById('ZadanyVyucujuci').addEventListener('click', editZadanyVyucujuciListener);
            }
            if (permission.includes(25)) {
                document.getElementById('ZadanyAsistent').addEventListener('click', editZadanyAsistentListener);
            }
            if (permission.includes(29)) {
                document.getElementById('ZadanaUcebna').addEventListener('click', editZadanaUcebnaListener);
            }
            if (permission.includes(27)) {
                document.getElementById('zadanyZiaci').addEventListener('click', editZiaciListener);
            }
            document.getElementsByClassName('rights-selector add')[0].disabled = !permission.includes(26);

            document.getElementById('addPredmetSave').onclick = function () {
                let predmet = document.getElementById('zoznamPredmetovSelect').value;
                let rocnik = document.querySelector(".rights-selector.add").value;
                if (VyucujuciSelectedIds.length > 0) {
                    if (AsistenSelectedIds.includes(VyucujuciSelectedIds[0].toString())) {
                        alert("Zadaný asistent sa zhoduje s vyučujúcim");
                        return;
                    }
                }
                sendRequest('/Predmety/updatePredmet', 'POST', ({
                    predmet: predmet,
                    vyucujuci: VyucujuciSelectedIds,
                    asistent: AsistenSelectedIds,
                    ucebne: UcebnaSelectedIds,
                    rocnik: rocnik,
                    ziaci: ZiaciSelectedIds
                }), (data) => {
                    if (data) {
                        window.location.reload();
                    } else {
                        alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                    }
                });
            };
        });
    });
}