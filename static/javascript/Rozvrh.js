document.addEventListener('DOMContentLoaded', function() {
    setTrieda();
});

function setTrieda() {
    let idTriedy = document.getElementById('triedy').value;
    let polRok = document.getElementById('PolRokSet').value;
    if (idTriedy !== "") {
        sendRequest('/Rozvrh/getRozvrhTriedy', 'POST', ({idTriedy: idTriedy, polRok: polRok}), (data) => {
            console.log(data)
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
                            if (block[9] == null) {
                                vyucujuci2 = block[4];
                            } else {
                                vyucujuci2 = block[8] + '/' + block[9]
                            }
                            let rowHTML = `<td class="predmetDuo">
                          <div id="${den}/${pozicia}/1" class="predmet-kontajner">
                            <p class="nazov">${block[2]}</p>
                            <p class="dolny-pravy-roh">${vyucujuci1}</p>
                            <p class="horny-pravy-roh">${block[3]}</p>
                          </div>
                          <div id="${den}/${pozicia}/2" class="predmet-kontajner">
                            <p class="nazov">${block[6]}</p>
                            <p class="dolny-pravy-roh">${vyucujuci2}</p>
                            <p class="horny-pravy-roh">${block[7]}</p>
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
                            if (block[9] == null) {
                                vyucujuci2 = block[4];
                            } else {
                                vyucujuci2 = block[8] + '/' + block[9]
                            }
                            if (block[13] == null) {
                                vyucujuci3 = block[12];
                            } else {
                                vyucujuci3 = block[12] + '/' + block[13]
                            }
                            let rowHTML = `<td class="predmetTriple">
                          <div id="${den}/${pozicia}/1" class="predmet-kontajner">
                            <p class="nazov">${block[2]}</p>
                            <p class="horny-pravy-roh">${vyucujuci1}</p>
                            <p class="horny-lavy-roh">${block[3]}</p>
                          </div>
                          <div id="${den}/${pozicia}/2" class="predmet-kontajner">
                            <p class="nazov">${block[6]}</p>
                            <p class="horny-pravy-roh">${vyucujuci2}</p>
                            <p class="horny-lavy-roh">${block[7]}</p>
                          </div>
                          <div id="${den}/${pozicia}/3" class="predmet-kontajner">
                            <p class="nazov">${block[10]}</p>
                            <p class="horny-pravy-roh">${vyucujuci3}</p>
                            <p class="horny-lavy-roh">${block[11]}</p>
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
}
function handleBlockClick() {
    var idDenBlock = this.id.split('/');
    var den = idDenBlock[0];
    var block = idDenBlock[1];
    var predmet = this.innerText;
    let idTriedy = document.getElementById('triedy').value;
    let modal = document.getElementById('EditRozvrh')
    modal.style.display = 'block';
    document.getElementsByClassName('EditRozvrhclose')[0].onclick = function() {
        modal.style.display = 'none';
    };
    sendRequest('/Edit_Rozvrh/getInfoBloku', 'POST', ({id:idTriedy, den:den, block:block}), (data) => {
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
                sendRequest('/Edit_Rozvrh/saveBlock', 'POST', ({id:idTriedy, den:den, block:block, zoznam:zoznam}), (item)=> {
                    if(item) {
                        modal.style.display = 'none';
                        setTrieda();
                        //window.location.reload();
                    }
                });
            }
        };
    });
}