document.addEventListener('DOMContentLoaded', function() {
    load();
});

function load(typ){
    let triedySelect = document.getElementById('triedy');
    let ucitelSelect = document.getElementById('ucitel');
    let ucebneSelect = document.getElementById('ucebne');
    let polRokSelect = document.getElementById('PolRokSet');
    if (typ === 'load'){
        let typ = '';
            let id = '';
            if (triedySelect.value !== '') {
                typ = 'trieda_id';
                id = triedySelect.value;
            } else if (ucitelSelect.value !== '') {
                typ = 'ucitel_id';
                id = ucitelSelect.value;
            } else if (ucebneSelect.value !== '') {
                typ = 'u.ucebna_id';
                id = ucebneSelect.value;
            }
            if (typ && id) {
                setTrieda(typ, id);
            }
    }else {
        function resetovat(activeSelect) {
            if (ucitelSelect && ucebneSelect) {
                if (activeSelect !== ucitelSelect) ucitelSelect.value = "";
                if (activeSelect !== ucebneSelect) ucebneSelect.value = "";
            }
            if (activeSelect !== triedySelect) triedySelect.value = "";
        }

        triedySelect.addEventListener('change', function () {
            resetovat(triedySelect);
            setTrieda('trieda_id', triedySelect.value);
        });
        if (ucitelSelect && ucebneSelect) {
            ucitelSelect.addEventListener('change', function () {
                resetovat(ucitelSelect);
                setTrieda('ucitel_id', ucitelSelect.value);
            });

            ucebneSelect.addEventListener('change', function () {
                resetovat(ucebneSelect);
                setTrieda('u.ucebna_id', ucebneSelect.value);
            });
        }
        polRokSelect.addEventListener('change', function () {
            let typ = '';
            let id = '';
            if (triedySelect.value !== '') {
                typ = 'trieda_id';
                id = triedySelect.value;
            } else if (ucitelSelect.value !== '') {
                typ = 'ucitel_id';
                id = ucitelSelect.value;
            } else if (ucebneSelect.value !== '') {
                typ = 'u.ucebna_id';
                id = ucebneSelect.value;
            }
            if (typ && id) {
                setTrieda(typ, id);
            }
        });
    }
}

function setTrieda(typ, idTriedy) {
    let polRok = document.getElementById('PolRokSet').value;
    sendRequest('/Rozvrh/getRozvrhTriedy', 'POST', ({typ:typ, idTriedy: idTriedy, polRok: polRok}), (data) => {
        let raz = data['raz']
        let dvakrat = data['dvakrat']
        let triKrat = data['triKrat']
        let dni = ['', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok']
        for (let den = 1; den <= 5; den++) {
            let tbody = document.getElementById(`den=${den}`).parentNode
            tbody.innerHTML = '';
            let rowHTML = `<th id="den=${den}">${dni[den]}</th></tr>`;
            tbody.insertAdjacentHTML('beforeend', rowHTML);
            for (let pozicia = 1; pozicia <= 7; pozicia++) {
                let contentAdded = false;
                raz.forEach((block) => {
                    if (block[0] === den && block[1] === pozicia) {
                        let vyucujuci1;
                        if (block[5] == null) {
                            vyucujuci1 = block[4];
                        } else {
                            vyucujuci1 = block[4] + '/' + block[5]
                        }
                        let rowHTML = `<td id="${den}/${pozicia}" class="predmetSolo">
                           <p class="nazov">${block[2]}</p>
                           <p class="dolny-pravy-roh">${vyucujuci1}</p>
                           <p class="horny-pravy-roh">${block[3]}</p>
                           </td>`;
                        tbody.insertAdjacentHTML('beforeend', rowHTML);
                        contentAdded = true;
                    }
                });
                if (contentAdded) continue;
                dvakrat.forEach((block) => {
                    if (block[0] === den && block[1] === pozicia) {
                        let vyucujuci1;
                        let vyucujuci2;
                        if (block[5] == null) {
                            vyucujuci1 = block[4];
                        } else {
                            vyucujuci1 = block[4] + '/' + block[5]
                        }
                        if (block[10] == null) {
                            vyucujuci2 = block[9];
                        } else {
                            vyucujuci2 = block[9] + '/' + block[10]
                        }
                        let rowHTML = `<td class="predmetDuo">
                         <div id="${den}/${pozicia}/1" class="predmet-kontajner">
                           <p class="nazov">${block[2]}</p>
                           <p class="dolny-pravy-roh">${vyucujuci1}</p>
                           <p class="horny-pravy-roh">${block[3]}</p>
                         </div>
                         <div id="${den}/${pozicia}/2" class="predmet-kontajner">
                           <p class="nazov">${block[7]}</p>
                           <p class="dolny-pravy-roh">${vyucujuci2}</p>
                           <p class="horny-pravy-roh">${block[8]}</p>
                         </div>
                       </td>`;
                        tbody.insertAdjacentHTML('beforeend', rowHTML);
                        contentAdded = true;
                    }
                });
                if (contentAdded) continue;
                triKrat.forEach((block) => {
                    if (block[0] === den && block[1] === pozicia) {
                        let vyucujuci1;
                        let vyucujuci2;
                        let vyucujuci3;
                        if (block[5] == null) {
                            vyucujuci1 = block[4];
                        } else {
                            vyucujuci1 = block[4] + '/' + block[5]
                        }
                        if (block[10] == null) {
                            vyucujuci2 = block[9];
                        } else {
                            vyucujuci2 = block[9] + '/' + block[10]
                        }
                        if (block[15] == null) {
                            vyucujuci3 = block[14];
                        } else {
                            vyucujuci3 = block[14] + '/' + block[15]
                        }
                        let rowHTML = `<td class="predmetTriple">
                         <div id="${den}/${pozicia}/1" class="predmet-kontajner">
                           <p class="nazov">${block[2]}</p>
                           <p class="horny-pravy-roh">${vyucujuci1}</p>
                           <p class="horny-lavy-roh">${block[3]}</p>
                         </div>
                         <div id="${den}/${pozicia}/2" class="predmet-kontajner">
                           <p class="nazov">${block[7]}</p>
                           <p class="horny-pravy-roh">${vyucujuci2}</p>
                           <p class="horny-lavy-roh">${block[8]}</p>
                         </div>
                         <div id="${den}/${pozicia}/3" class="predmet-kontajner">
                           <p class="nazov">${block[12]}</p>
                           <p class="horny-pravy-roh">${vyucujuci3}</p>
                           <p class="horny-lavy-roh">${block[13]}</p>
                         </div>
                       </td>`;
                        tbody.insertAdjacentHTML('beforeend', rowHTML);
                        contentAdded = true;
                    }
                });
                if (!contentAdded) {
                    let rowHTML = `<td id="${den}/${pozicia}/1" class="predmet"></td>`;
                    tbody.insertAdjacentHTML('beforeend', rowHTML);
                }
            }
        }
        var blocks = document.querySelectorAll('.predmetSolo, .predmet-kontajner, .predmet');
        blocks.forEach(function (block, index) {
            block.removeEventListener('click', handleBlockClick);
            block.addEventListener('click', handleBlockClick);
        });
    });
}
function handleBlockClick() {
    var idDenBlock = this.id.split('/');
    var den = idDenBlock[0];
    var block = idDenBlock[1];
    var predmet = this.innerText;
    let idTriedy = document.getElementById('triedy').value;
    let polrok = document.getElementById('PolRokSet').value;
    let modal = document.getElementById('EditRozvrh')
    document.getElementsByClassName('EditRozvrhclose')[0].onclick = function() {
        modal.style.display = 'none';
    };
    sendRequest('/Edit_Rozvrh/getInfoBloku', 'POST', ({id:idTriedy, den:den, block:block, polrok:polrok}), (data) => {
        if (data['uzatvoreny']){
            alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
            load('load');
            return;
        }
        modal.style.display = 'block';
        let predmety  = data['predmety'];
        let vybrane = data ['vybrane'];
        let tbody = document.querySelector('#EditRozvrh .modal-table tbody');
        tbody.innerHTML = '';
        predmety.forEach((predmet) => {
            let [id, rocnik, nazov, skratka, vyucujuci, asistent, ucebna, pocet] = predmet;
            let checkedAttribute = '';
            if (vybrane.includes(id)) {
                checkedAttribute = "checked";
            }
            let rowHTML = `<tr>
                      <td><input type="checkbox" id="checkbox-${id}" value="${id}" ${checkedAttribute}></td>
                      <td><label for="checkbox-${id}">${rocnik}</label></td>
                      <td><label for="checkbox-${id}">${nazov}</label></td>
                      <td><label for="checkbox-${id}">${skratka}</label></td>
                      <td><label for="checkbox-${id}">${vyucujuci}</label></td>
                      <td><label for="checkbox-${id}">${asistent}</label></td>
                      <td><label for="checkbox-${id}">${ucebna}</label></td>
                  </tr>`;
            tbody.insertAdjacentHTML('beforeend', rowHTML);
        });
        document.getElementById('SaveEditRozvrh').onclick = function () {
            let checkboxes = document.querySelectorAll('#EditRozvrh .modal-table tbody input[type="checkbox"]');
            let zoznam = []
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    zoznam.push(parseInt(checkbox.value));
                }
            });
            if (zoznam.length >3) {
                alert("Maximálny počet predmetov pre blok sú 3")
            } else {
                sendRequest('/Edit_Rozvrh/saveBlock', 'POST', ({id:idTriedy, den:den, block:block, zoznam:zoznam, polrok:polrok}), (item)=> {
                    if(item) {
                        modal.style.display = 'none';
                        load('load');
                    } else {
                        alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                        load('load');
                    }
                });
            }
        };
    });
}