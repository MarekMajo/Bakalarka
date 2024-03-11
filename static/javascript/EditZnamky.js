document.getElementById('triedy').onchange = function () {
    let trieda_id = document.getElementById('triedy').value;
    let predmetSelect = document.getElementById('Predmety');
    if (trieda_id !== "") {
        sendRequest('/EditZnamky/GetPredmety', 'POST', (trieda_id), (predmety) => {
            predmetSelect.disabled = false;
            predmetSelect.innerHTML = '';
            let rowHTML = `<option value="">Vyberte Predmet</option>`;
                predmetSelect.insertAdjacentHTML('beforeend', rowHTML);
            predmety.forEach((predmet) => {
                let rowHTML = `<option value="${predmet[0]}">${predmet[1]}</option>`;
                predmetSelect.insertAdjacentHTML('beforeend', rowHTML);
            });
        });
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

    sendRequest('/EditZnamky/GetKategoriePredmetu', 'POST', (id), (kategorie) => {
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
                let vaha = 0;
                let max = document.getElementById('zadanie_maxBodov').value;
                if (document.getElementById('setVaha').value === "zadam") {
                    vaha = document.getElementById('zadanie_vahy').value;
                } else {
                    vaha = document.getElementById('setVaha').value;
                }
                if (document.getElementById('typ').value === 'Známka') {
                    max = null;
                }
                sendRequest('/EditZnamky/SaveKategoriu', 'POST', ({predmet_id:id,nazov:nazov, typ:typ, vaha:vaha, vyhodnotenie:vyhodnotenie, max:max}), (data)=> {
                    window.location.reload();
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