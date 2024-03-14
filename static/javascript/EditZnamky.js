document.getElementById('triedy').onchange = function () {
    let trieda_id = document.getElementById('triedy').value;
    let predmetSelect = document.getElementById('Predmety');
    let theadZnamky = document.querySelector('#hlavnaTabulka .table thead');
    theadZnamky.innerHTML = '';
    let tbodyZnamky = document.querySelector('#hlavnaTabulka .table tbody');
    tbodyZnamky.innerHTML = '';
    if (trieda_id !== "") {
        SetPredmetySelect(trieda_id, predmetSelect);
    }else {
        predmetSelect.disabled = true;
        predmetSelect.innerHTML = '';
        let rowHTML = `<option value="">Vyberte Predmet</option>`;
        predmetSelect.insertAdjacentHTML('beforeend', rowHTML);
    }
};

document.getElementById('Predmety').onchange = function () {
    let nastavenie = document.getElementById('Nastavenie');
    if (document.getElementById('Predmety').value !== "") {
        nastavenie.disabled = false;
        setTable(document.getElementById('Predmety').value);
    } else {
        nastavenie.disabled = true;
    }
};

document.getElementById('Nastavenie').onclick = function () {
    let modalSetting = document.getElementById('EditKategorie');
    modalSetting.style.display = 'block';
    document.getElementsByClassName('EditKategorieclose')[0].onclick = function () {
        modalSetting.style.display = 'none';
    };
    let id = document.getElementById('Predmety').value;
    let trieda_id = document.getElementById('triedy').value;
    sendRequest('/EditZnamky/GetKategoriePredmetu', 'POST', ({id:id, trieda_id:trieda_id}), (kategorie) => {
        let tbodyZnamky = document.querySelector('#EditKategorie .modal-table tbody');
        tbodyZnamky.innerHTML = '';
        kategorie.forEach((kategoria) => {
            let rowHTML = `<tr>
                  <td>${kategoria[0]}</td>
                  <td>${kategoria[2]}</td>
                  <td>${kategoria[3]}</td>
                  <td>${kategoria[4]}</td>
                  <td>${kategoria[5]}</td>
                </tr>`;
            tbodyZnamky.insertAdjacentHTML('beforeend', rowHTML);
        });
    });

    document.getElementById('addKategoriubtn').onclick = function () {
        let vyhodnotenie = [];
        document.getElementById('kategoriaName').value = '';
        let modaladd = document.getElementById('AddKategoriu');
        document.getElementById('zadanie_maxBodov').value = 20;
        modaladd.style.display = 'block';
        document.getElementsByClassName('AddKategoriuclose')[0].onclick = function () {
            modaladd.style.display = 'none';
            document.getElementById('setVaha').value = 1;
            document.getElementById('typ').value = 'znamka';
            document.getElementById('zadanie_maxBodov').value = 20;
            vyhodnotenie.length = 0;
            document.getElementById('zadanie_maxBodov_label').style.display = "none";
            document.getElementById('setVyhodnoteniabtn').style.display = "none";
        };
        document.getElementById('setVaha').onchange = function () {
            if (document.getElementById('setVaha').value === "zadam") {
                document.getElementById('zadanie_vahy_label').style.display = "block";
            } else {
                document.getElementById('zadanie_vahy_label').style.display = "none";
            }
        };
        document.getElementById('typ').onchange = function () {
            if (document.getElementById('typ').value === "body") {
                document.getElementById('zadanie_maxBodov_label').style.display = "block";
                vyhodnotenie = vypocetRozmedzi(20);
                document.getElementById('setVyhodnoteniabtn').style.display = "block";
            } else if (document.getElementById('typ').value === "percenta") {
                document.getElementById('setVyhodnoteniabtn').style.display = "block";
                vyhodnotenie = vypocetRozmedzi(100);
                document.getElementById('zadanie_maxBodov_label').style.display = "none";
            } else {
                vyhodnotenie.length = 0;
                document.getElementById('zadanie_maxBodov_label').style.display = "none";
                document.getElementById('setVyhodnoteniabtn').style.display = "none";
            }
        };
        document.getElementById('zadanie_maxBodov').onchange = function () {
            let maxBodov = Number(document.getElementById('zadanie_maxBodov').value);
            if (!isNaN(maxBodov) && maxBodov >= 5 ) {
                vyhodnotenie = vypocetRozmedzi(maxBodov);
            } else {
                alert("Zle zadaná hodnota Max bodov");
            }
        };
        document.getElementById('setVyhodnoteniabtn').onclick = function () {
            let modalVyhodnotenie = document.getElementById('setVyhodnotenia');
            modalVyhodnotenie.style.display = "block";
            document.getElementsByClassName('SetVyhodnoteniaclose')[0].onclick = function () {
                modalVyhodnotenie.style.display = 'none';
            };
            let tbody = document.querySelector('#setVyhodnotenia .modal-table tbody');
            tbody.innerHTML = '';
            let rozmedzia = []
            if (document.getElementById('typ').value === "percenta") {
                rozmedzia = vypocetRozmedzi(100);
            } else {
                let maxBodov = Number(document.getElementById('zadanie_maxBodov').value);
                if (!isNaN(maxBodov) && maxBodov >= 5 ) {
                    rozmedzia = vypocetRozmedzi(maxBodov);
                } else {
                    alert("Zle zadaná hodnota Max bodov");
                    modalVyhodnotenie.style.display = 'none';
                    return;
                }
            }
            rozmedzia.forEach((item, index) => {
              let rowHTML = `<tr>
                    <td>${item.znamka}</td>
                    <td><input style="width: 40%" type="number" class="input-od" value="${item.dolnaHranica}" data-index="${index}"/></td>
                    <td><input style="width: 40%" type="number" class="input-do" value="${item.hornaHranica}" data-index="${index}"/></td>
                 </tr>`;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });

            document.getElementById('SaveSetVyhodnotenia').onclick = function () {
                let aktualizovaneRozmedzia = [];
                let inputsOd = document.querySelectorAll('.input-od');
                let inputsDo = document.querySelectorAll('.input-do');
                let validne = true;
                for (let i = 0; i < inputsOd.length; i++) {
                    let od = parseInt(inputsOd[i].value, 10);
                    let do_ = parseInt(inputsDo[i].value, 10);
                    if (do_ <= od && od !== do_) {
                        alert('Rozmedzie musí byť logicky usporiadané tak, aby "Do" bolo väčšie než "Od".');
                        validne = false;
                        break;
                    }
                    if (i > 0 && od !== aktualizovaneRozmedzia[i - 1].hornaHranica + 1) {
                        alert('Rozmedzia musia na seba naväzovať bez medzier.');
                        validne = false;
                        break;
                    }
                    aktualizovaneRozmedzia.push({dolnaHranica: od, hornaHranica: do_, znamka: 5 - i});
                }
                if (validne) {
                    vyhodnotenie = aktualizovaneRozmedzia;
                    modalVyhodnotenie.style.display = 'none';
                }
            };

        };
        document.getElementById('SaveAddKategoriu').onclick = function ()  {
            let nazov = document.getElementById('kategoriaName').value;
            if (nazov) {
                let typ = document.getElementById('typ').value;
                let trieda_id = document.getElementById('triedy').value;
                let vaha = 0;
                let max = document.getElementById('zadanie_maxBodov').value;
                if (document.getElementById('setVaha').value === "zadam") {
                    vaha = document.getElementById('zadanie_vahy').value;
                } else {
                    vaha = document.getElementById('setVaha').value;
                }
                if (typ === 'znamka') {
                    max = null;
                } else if (typ === 'percenta') {
                    max = 100;
                }
                sendRequest('/EditZnamky/SaveKategoriu', 'POST', ({predmet_id:id,nazov:nazov, typ:typ, vaha:vaha, vyhodnotenie:vyhodnotenie, max:max, trieda_id:trieda_id}), (data)=> {
                    if (data) {
                        Reload();
                    } else {
                        alert("Zadaný názov kategórie už existuje")
                    }
                });
            } else {
                alert("Nezadali ste názov pre kategóriu");
            }
        };
    };

};
function vypocetRozmedzi(maxBodov) {
    let pocetZnamek = 5;
    let rozmedzia = [];
    const rozsah = maxBodov / pocetZnamek;

    for (let i = 0; i < pocetZnamek; i++) {
      let dolnaHranica = Math.floor(i * rozsah);
      let hornaHranica = i === pocetZnamek - 1 ? maxBodov : Math.floor((i + 1) * rozsah) - 1;
      rozmedzia.push({ dolnaHranica, hornaHranica, znamka: 5 - i });
    }

    return rozmedzia;
}

function setTable(predmet) {
    let trieda_id = document.getElementById('triedy').value;
    sendRequest('/EditZnamky/GetKategoriePredmetu', 'POST', ({id:predmet, trieda_id:trieda_id}), (kategorie) => {
        let theadZnamky = document.querySelector('#hlavnaTabulka .table thead');
        theadZnamky.innerHTML = '';
        let rowHTML = `
            <tr>
                <th class="box"></th>
                <th class="id-column">#</th>
                <th>Meno a priezvisko</th>`;
        kategorie.forEach((kategoria) => {
            if (kategoria[4] === 'body') {
                rowHTML += `<th>${kategoria[3]} <span style="font-size: xx-small; color: grey;">(${kategoria[4]}) (${kategoria[5]}) MaxBodov:(${kategoria[6]})</span></th>`;
            } else {
                rowHTML += `<th>${kategoria[3]} <span style="font-size: xx-small; color: grey;">(${kategoria[4]}) (${kategoria[5]})</span></th>`;
            }
        });
        rowHTML += `<th style="width: 5%">Priemer</th></tr>`;
        theadZnamky.innerHTML = rowHTML;
        setZiaci(predmet);
    });
}

function SetPredmetySelect(trieda_id, predmetSelect, zvPredmet) {
    sendRequest('/EditZnamky/GetPredmety', 'POST', (trieda_id), (predmety) => {
        predmetSelect.disabled = false;
        predmetSelect.innerHTML = '';
        let rowHTML = `<option value="">Vyberte Predmet</option>`;
        predmetSelect.insertAdjacentHTML('beforeend', rowHTML);
        predmety.forEach((predmet) => {
            if (predmet[0] === zvPredmet) {
                rowHTML = `<option value="${predmet[0]}" selected>${predmet[1]}</option>`;
            }else {
                rowHTML = `<option value="${predmet[0]}">${predmet[1]}</option>`;
            }
            predmetSelect.insertAdjacentHTML('beforeend', rowHTML);
        });
        if (zvPredmet) {
            setTable(zvPredmet);
        }
    });
}

function Reload() {
    let trieda = document.getElementById('triedy').value;
    let predmet = document.getElementById('Predmety').value;
    window.location.href = `/EditZnamky?trieda=${trieda}&predmet=${predmet}`;
}

document.addEventListener('DOMContentLoaded', function() {
    let urlParams = new URLSearchParams(window.location.search);
    let trieda = urlParams.get('trieda');
    let predmet = parseInt(urlParams.get('predmet'));
    let predmetSelect = document.getElementById('Predmety');
    if (trieda && predmet) {
        document.getElementById('Nastavenie').disabled = false;
        SetPredmetySelect(trieda, predmetSelect, predmet);
    }
});

function setZiaci(predmet) {
    if (!predmet){
        predmet = 'None';
    }
    let trieda = document.getElementById('triedy').value;
    sendRequest('/EditZnamky/GetZiakovPredmetu', 'POST', {predmet:predmet, trieda_id:trieda}, (data) => {
        let tbodyZnamky = document.querySelector('#hlavnaTabulka .table tbody');
        tbodyZnamky.innerHTML = '';
        data.forEach((ziak) => {
            let rowHTML = `<tr>
                <td class="box"><input type="checkbox" name="selected"></td>
                <td class="id-column">${ziak.osoba_id}</td>
                <td>${ziak.meno_priezvisko}</td>`;
            let headers = document.querySelectorAll('#hlavnaTabulka .table thead th');
            let kategorie = Array.from(headers).slice(3, -1);
            kategorie.forEach((th) => {
                let kategoriaText = th.textContent.trim().split(" (")[0];
                if (ziak.kategorie && ziak.kategorie[kategoriaText]) {
                    let kategoriaData = ziak.kategorie[kategoriaText];
                    let znamkyHTML = "";
                    let i = 0;
                    Object.entries(kategoriaData).forEach(([key, value]) => {
                        i++;
                        const isLastItem = i === Object.keys(kategoriaData).length;
                        znamkyHTML += `<a value="${key}">${value}</a>`;
                        znamkyHTML += `<a style="display: none">${isLastItem ? '' : '  ,  '}</a> `;
                    });
                    rowHTML += `<td>${znamkyHTML}</td>`;
                } else {
                    rowHTML += `<td></td>`;
                }
            });
            rowHTML += `<td></td></tr>`;
            tbodyZnamky.innerHTML += rowHTML;
        });
        enableGradeEditing();
    });
}

function enableGradeEditing() {
    let predmet = document.getElementById('Predmety').value;
    sendRequest('/EditZnamky/CanEditZnamky', 'POST', (predmet), (data) => {
        if (data) {
            const table = document.querySelector('#hlavnaTabulka .table tbody');
    table.addEventListener('click', function(event) {
        let target = event.target;
        let parentTd = target.tagName === 'A' ? target.closest('td') : (target.tagName === 'TD' ? target : null);

        if (parentTd && !parentTd.querySelector('input')) {
            let originalContent = target.tagName === 'A' ? target.textContent.trim() : "";
            let originalValue = target.getAttribute('value') || originalContent;

            let input = document.createElement('input');
            input.type = 'text';
            input.value = originalContent;
            input.className = 'grade-edit';
            input.style.width = '10%';

            if (target.tagName === 'A') {
                target.style.display = 'none';
            }

            parentTd.appendChild(input);
            input.focus();

            let columnType = 'znamka';
            let maxPoints = 0;
            let headerText = document.querySelector(`#hlavnaTabulka .table thead tr th:nth-child(${parentTd.cellIndex + 1})`).textContent;
            if (headerText.includes('(body)')) {
                columnType = 'body';
                maxPoints = parseInt(headerText.match(/MaxBodov:\((\d+)\)/)?.[1], 10);
            } else if (headerText.includes('(percenta)')) {
                columnType = 'percenta';
            }

            input.addEventListener('blur', function () {
                let newValue = input.value.trim();

                if (!isValidValue(columnType, newValue, maxPoints)) {
                    alert(`Neplatná hodnota pre typ "${columnType}".`);
                    parentTd.removeChild(input);
                    if (target.tagName === 'A') {
                        target.style.display = '';
                    }
                    return;
                }

                if (newValue === originalContent && target.tagName === 'A') {
                    target.style.display = '';
                } else if (newValue) {
                    if (target.tagName === 'A') {
                        target.textContent = newValue;
                        target.style.display = '';
                        if (originalValue.includes('+edit') || originalValue === 'new') {
                            target.setAttribute('value', originalValue);
                        } else {
                            target.style.border = '1px solid blue';
                            target.setAttribute('value', originalValue + '+edit');
                        }
                    } else {
                        let newAnchor = document.createElement('a');
                        newAnchor.textContent = newValue;
                        newAnchor.setAttribute('value', 'new');
                        newAnchor.style.border = '1px solid blue';
                        parentTd.appendChild(newAnchor);
                        let spacer = document.createElement('a');
                        spacer.textContent = '  ';
                        parentTd.appendChild(spacer);
                    }
                } else if (!newValue && target.tagName === 'A') {
                    let newAnchor = document.createElement('a');
                    parentTd.removeChild(target);
                    newAnchor.setAttribute('value', originalValue + '+delete');
                    parentTd.appendChild(newAnchor);
                }
                parentTd.removeChild(input);
            });
        }
    });
        }
    });
}

function isValidValue(type, value, maxPoints = null) {
    if (value === '' || value === '-'){
        return true;
    }
    if (type === 'znamka') {
        return ['1', '2', '3', '4', '5'].includes(value);
    } else if (type === 'body') {
        let numValue = parseInt(value, 10);
        return !isNaN(numValue) && numValue >= 0 && numValue <= maxPoints;
    } else if (type === 'percenta') {
        let numValue = parseInt(value, 10);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
    }
    return false;
}

function getGradeChanges() {
    const rows = document.querySelectorAll('#hlavnaTabulka .table tbody tr');
    const deleteList = [];
    const editDict = {};
    const addList = [];

    rows.forEach(row => {
        const idOsoby = row.querySelector('.id-column').textContent.trim();
        row.querySelectorAll('td').forEach((cell, index) => {
            if (index > 0) {
                const kategoria = document.querySelector(`#hlavnaTabulka .table thead tr th:nth-child(${index + 1})`).textContent.trim();
                cell.querySelectorAll('a').forEach(anchor => {
                    const value = anchor.getAttribute('value');
                    const textContent = anchor.textContent.trim();
                    if (value) {
                        if (value.endsWith('+delete')) {
                            deleteList.push(value);
                        } else if (value.endsWith('+edit')) {
                            editDict[value.replace('+edit', '')] = textContent;
                        } else if (value === 'new') {
                            addList.push({idOsoby, kategoria, znamka: textContent});
                        }
                    }
                });
            }
        });
    });

    return {
        delete: deleteList,
        edit: editDict,
        add: addList
    };
}

