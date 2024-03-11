function filterRights() {
    var prava = document.querySelector(".rights-selector").value;
    var tr = document.querySelector(".table").getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        var right = tr[i].getElementsByTagName("td")[6].textContent;
        if (prava == "All" || right == prava) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
function editfilterList() {
        let input, filter, ul, li, a, i;
        input = document.getElementById('editfilterInput');
        filter = input.value.toUpperCase();
        ul = document.getElementById('editselectList');
        li = ul.getElementsByTagName('li');
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
function searchFunction() {
    var filter, tr, tdName, tdId, i, txtValueName, txtValueId;
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

var delModal = document.getElementById("delModal");
var delsModal = document.getElementById("delsModal");
var editmodal = document.getElementById("editModal");
var editallmodal = document.getElementById("editallModal");

var delsbtn = document.getElementById("del");
var addUserModal = document.getElementById("addUserModal");
var addUserBtn = document.getElementById("addUserButton");

var spanDelClose = document.getElementsByClassName("delModalclose")[0];
var spanDelsClose = document.getElementsByClassName("delsModalclose")[0];
var spanAddClose = addUserModal.getElementsByClassName("addModalclose")[0];
var spanEditClose = document.getElementsByClassName("editModalclose")[0];
var spanEditallClose = document.getElementsByClassName("editallModalclose")[0];

spanEditClose.onclick = function () {
    editmodal.style.display = "none";
};

spanEditallClose.onclick = function () {
    editallmodal.style.display = "none";
};

/*Táto metóda odstráni užívateľa pri ktorom bolo stlačené tlačidlo Delete*/
const delbtn = document.getElementsByClassName("delButton")
        for (let i = 0; i < delbtn.length; i++) {
        delbtn[i].addEventListener("click", function() {
            delModal.style.display = "block";
            var idCell = this.closest('tr').getElementsByTagName('td')[1].textContent;
            document.getElementById('delButton').onclick = function () {
                sendRequest('/odstranUzivatelov', 'POST', ({uzivatelia: idCell}), (data) => {
                    if (data.result) {
                        window.location.href = '/uzivatelia';
                    }
                });
            }
    });
}
spanDelClose.onclick = function () {
    delModal.style.display = "none";
};

delsbtn.onclick = function () {
    delsModal.style.display = "block";
};

spanDelsClose.onclick = function () {
    delsModal.style.display = "none";
};
document.querySelectorAll('.editButton').forEach(button => {
    button.addEventListener('click', function() {
        var idCell = this.closest('tr').getElementsByTagName('td')[1].textContent;
        window.location.href = '/editUzivatelskyProfil/' + idCell;
    });
});

addUserBtn.onclick = function () {
    addUserModal.style.display = "block";
};

spanAddClose.onclick = function () {
    addUserModal.style.display = "none";
    document.getElementById("Meno").textContent = '';
    document.getElementById("Priezvisko").textContent = '';
    document.getElementById("RodCislo").textContent = '';
    document.getElementById("Adresa").textContent = '';
    document.getElementById("TelCislo").textContent = '';
    document.getElementById("Email").textContent = '';
};

/*Táto metóda odstráni všetkých užívateľ ktorý sú zaškrtnútý v checkboxách*/
document.getElementById("delsButton").onclick = function () {
    var tr, td, i;
    var uzivatelia = [];
    tr = document.querySelector(".table").getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td")[0].getElementsByClassName("box")[0].checked) {
            td = tr[i].getElementsByTagName("td")[1];
            uzivatelia.push(td.textContent)
        }
    }
    sendRequest('/odstranUzivatelov', 'POST', {uzivatelia}, (data) => {
        if (data.result) {
                window.location.href = '/uzivatelia';
            }
    });
};

document.getElementById("role").onclick = function () {
    editallmodal.style.display = "block";
    var list = document.getElementById("editallselectList");
    sendRequest('/getPozicie', 'GET', null, (data) => {
        list.textContent = "";
        data.forEach(item => {
            let listItemHTML = `<li>
                <a>${item[1]}</a>
                <label class="switch">
                    <input type="radio" name="role" value="${item[0]}">
                    <span class="slider round"></span>
                </label>
            </li>`;
            list.insertAdjacentHTML('beforeend', listItemHTML);
        });
    });
    document.querySelectorAll('input[type="radio"][name="role"]').forEach(radio => {
                radio.addEventListener('click', function() {
                    let alreadyChecked = radio.getAttribute('data-checked') === 'true';
                    document.querySelectorAll('input[type="radio"][name="role"]').forEach(otherRadio => {
                        otherRadio.checked = false;
                        otherRadio.removeAttribute('data-checked');
                    });

                    if (!alreadyChecked) {
                        radio.checked = true;
                        radio.setAttribute('data-checked', 'true');
                    }
                });
            });
    document.getElementById("editallsubmitButton").onclick = function () {
        var IdPrava = '';
                document.querySelectorAll('input[type="radio"][name="role"]').forEach(radio => {
                    if (radio.checked) {
                        IdPrava = radio.value
                    }
                })
        var tr, td, i;
        var data = [];
        tr = document.querySelector(".table").getElementsByTagName("tr");
        for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td")[0].getElementsByClassName("box")[0].checked) {
            var id = tr[i].getElementsByTagName("td")[1].textContent;
            data.push({ IdUzivatela: id, IdPrava: IdPrava });
        }
    }
        sendRequest('/saveRole', 'POST', {data}, (responseData) => {
        if (responseData.result) {
            window.location.href = '/uzivatelia';
        }
    });

    };
};
document.getElementById("addUserForm").onsubmit = function(event) {
    event.preventDefault();
    var list = {
        meno: document.getElementById("Meno").value,
        priezvisko: document.getElementById("Priezvisko").value,
        rodCislo: document.getElementById("RodCislo").value,
        pohlavie: document.getElementById("Pohlavie").value || null,
        adresa: document.getElementById("Adresa").value || null,
        telCislo: document.getElementById("TelCislo").value || null,
        email: document.getElementById("Email").value
    };
    var email = document.getElementById("Email").value;
    if (!email.match(/^\S+@\S+\.\S+$/)) {
        alert("Zadaný email nie je v správnom formáte.");
        return;
    }
    sendRequest('/pridatUzivatela', 'POST', list, (data) => {
        if (data.result) {
            window.location.href = '/uzivatelia';
        }
    });
};
document.querySelectorAll('.pravaButton').forEach(button => {
    button.addEventListener('click', function() {
        var idCell = this.closest('tr').getElementsByTagName('td')[1].textContent;
        var rola = this.closest('tr').getElementsByTagName('td')[6].textContent;
        editmodal.style.display = "block";
        sendRequest('/getPozicie', 'GET', null, (data) => {
            var list = document.getElementById("editselectList");
            list.textContent = "";
            data.forEach(item => {
                var isChecked = item[1] === rola ? "checked" : "";
                let listItemHTML = `<li>
                        <a>${item[1]}</a>
                        <label class="switch">
                        <input type="radio" name="role" value="${item[0]}" ${isChecked}>
                        <span class="slider round"></span>
                        </label>
                        </li>`;
                list.insertAdjacentHTML('beforeend', listItemHTML);
            });
            document.querySelectorAll('input[type="radio"][name="role"]').forEach(radio => {
                radio.addEventListener('click', function() {
                    let alreadyChecked = radio.getAttribute('data-checked') === 'true';
                    document.querySelectorAll('input[type="radio"][name="role"]').forEach(otherRadio => {
                        otherRadio.checked = false;
                        otherRadio.removeAttribute('data-checked');
                    });

                    if (!alreadyChecked) {
                        radio.checked = true;
                        radio.setAttribute('data-checked', 'true');
                    }
                });
            });
            document.getElementById('editsubmitButton').onclick = function () {
                var IdPrava = '';
                document.querySelectorAll('input[type="radio"][name="role"]').forEach(radio => {
                    if (radio.checked) {
                        IdPrava = radio.value
                    }
                })
                var data = [{IdUzivatela: idCell, IdPrava: IdPrava}];
                sendRequest('/saveRole', 'POST', {data}, (data) => {
                    if (data.result) {
                            window.location.href = '/uzivatelia';
                        }
                });
            };
        } );
    });
});

