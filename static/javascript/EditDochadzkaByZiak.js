let polrok;
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('vysvetlivkaBtn');
    let dropdown = document.createElement('div');
    dropdown.className = 'vysvetlivka-dropdown';
    dropdown.innerHTML = `
        <p>Prítomný: <img style="width: 30px; height: 30px" src="/static/images/pritomny.png" alt="pritomny.png"></p>
        <p>Neprítomný: <img style="width: 30px; height: 30px" src="/static/images/nepritomny.png" alt="nepritomny.png"></p>
        <p>Meškanie: <img style="width: 30px; height: 30px" src="/static/images/meskanie.png" alt="meskanie.png"></p>
        <p>Ospravedlnené: <img style="width: 30px; height: 30px" src="/static/images/akcept.png" alt="akcept.png"></p>
        <p>Neospravedlnené: <img style="width: 30px; height: 30px" src="/static/images/deny.png" alt="deny.png"></p>
        <p>Ospravedlnené Meškanie: <img style="width: 30px; height: 30px" src="/static/images/meskanie akcept.png" alt="meskanie akcept.png"></p>
        <p>Neospravedlnené Meškanie: <img style="width: 30px; height: 30px" src="/static/images/meskanie deny.png" alt="meskanie deny.png"></p>
    `;
    document.body.appendChild(dropdown);

    btn.onmouseover = function() {
        dropdown.style.display = 'block';
        let rect = btn.getBoundingClientRect();
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    };

    btn.onmouseout = function() {
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 0);
    };

    dropdown.onmouseover = function() {
        dropdown.style.display = 'block';
    };

    dropdown.onmouseout = function() {
        dropdown.style.display = 'none';
    };
    let datum = new Date();
    if (datum.getMonth() > 1 && datum.getMonth() < 9) {
        polrok = 1;
    } else {
        polrok = 0;
    }
    document.getElementById('PolRokSet').value = polrok;
    document.getElementById('ziaci').addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('ziakDochadzka')) {
            document.getElementById('dochadzkaModal').style.display = 'block';
            document.getElementsByClassName('dochadzkaModalclose')[0].onclick = function () {
                document.getElementById('dochadzkaModal').style.display = 'none';
            }
            sendRequest('/EditDochadzkaByDay/GetDochadzkaZiaka', 'POST', {polrok:polrok, ziakId:e.target.value}, (dochadzka)=> {
                let tbody = document.getElementById('Dochazdka');
                let celkovy = 0;
                let osp = 0;
                let neosp = 0;
                tbody.innerText = '';
                let icons = ['<img style="width: 20px; height: 20px" data-icon-index="0" onclick="pritomnostSelect(event)" src="/static/images/pritomny.png" alt="0">',
                    '<img style="width: 20px; height: 20px" data-icon-index="2" onclick="pritomnostSelect(event)" src="/static/images/nepritomny.png" alt="1">',
                    '<img style="width: 20px; height: 20px" data-icon-index="3" onclick="pritomnostSelect(event)" src="/static/images/meskanie.png" alt="2">',
                    '<img style="width: 20px; height: 20px" data-icon-index="4" onclick="pritomnostSelect(event)" src="/static/images/akcept.png" alt="3">',
                    '<img style="width: 20px; height: 20px" data-icon-index="5" onclick="pritomnostSelect(event)" src="/static/images/deny.png" alt="4">',
                    '<img style="width: 20px; height: 20px" data-icon-index="6" onclick="pritomnostSelect(event)" src="/static/images/meskanie%20akcept.png" alt="5">',
                    '<img style="width: 20px; height: 20px" data-icon-index="7" onclick="pritomnostSelect(event)" src="/static/images/meskanie%20deny.png" alt="6">'];
                dochadzka.forEach((den)=>{
                    let html = `<td>${den['den']}</td>`
                    for (let i = 1; i < 8; i++) {
                        let existuje = false;
                        den['data'].forEach((block) => {
                            if (block[0] === i && !existuje) {
                                celkovy +=1;
                                if (block[3] === 1){
                                    osp +=1;
                                    if (block[1] === 2){
                                        html += `<td value="${block[4]}" title="${block[2]}">${icons[5]}</td>`
                                    } else {
                                        html += `<td value="${block[4]}" >${icons[3]}</td>`
                                    }
                                }else if (block[3] === 2){
                                    neosp +=1;
                                    if (block[1] === 2){
                                        html += `<td value="${block[4]}" title="${block[2]}">${icons[6]}</td>`
                                    } else {
                                        html += `<td value="${block[4]}" >${icons[4]}</td>`
                                    }
                                } else {
                                    if (block[1] === 2){
                                        html += `<td value="${block[4]}" title="${block[2]}">${icons[block[1]]}</td>`;
                                    } else {
                                        html += `<td value="${block[4]}" >${icons[block[1]]}</td>`;
                                    }
                                }
                                existuje = true;
                            }
                        });
                        if (!existuje) {
                            html += `<td>${icons[0]}</td>`
                        }
                    }
                    html += `<td><button class="Ospravedlniť">Ospravedlniť</button> <button class="Neospravedlniť">Neospravedlniť</button></td>`;
                    tbody.insertAdjacentHTML('beforeend', html);
                });
                document.getElementById('pocet').textContent = celkovy;
                document.getElementById('osp').textContent = osp;
                document.getElementById('neosp').textContent = neosp;
                nastavitFarbuTlacidiel();
            });
            document.getElementById('save').onclick = function () {
                sendRequest('/EditDochadzkaByDay/SaveDochadzkaZiaka', 'POST', {polrok:polrok, ziakId:e.target.value, dochadzka:getDochadzka()}, (data)=>{
                    if(!data) {
                        alert('Nemožno upravovať z dôvodu uzatvoreného školského roka');
                    }
                })
            }
        }
    });
});

document.getElementById('PolRokSet').onchange = function () {
    polrok = document.getElementById('PolRokSet').value;
}

document.getElementById('triedy').onchange = function () {
    document.getElementById('PolRokSet').disabled = document.getElementById('triedy').value === '';
    setTable();
}

function setTable() {
    let tbody = document.getElementById('ziaci');
    tbody.innerText = '';
    let idTriedy = document.getElementById('triedy').value;
    sendRequest('/EditDochadzkaByZiak/GetZiaciTriedy', 'POST', (idTriedy), (trieda) => {
        trieda.forEach((ziak) => {
            let html = `
                <td>${ziak[0]}</td>
                <td>${ziak[1]}</td>
                <td><button value="${ziak[0]}" class="ziakDochadzka">Dochádzka</button></td>
            `
            tbody.insertAdjacentHTML('beforeend', html);
        });
    })
}
function pritomnostSelect(event) {
    event.stopPropagation();

    let exPritomnostDropdown = document.querySelector('.icon-dropdown');
    if (exPritomnostDropdown) {
        exPritomnostDropdown.remove();
    }
    let PritomnostDropdown = document.createElement('div');
    PritomnostDropdown.className = 'icon-dropdown';
    PritomnostDropdown.style.position = 'absolute';
    PritomnostDropdown.style.zIndex = '2';
    PritomnostDropdown.style.left = `${event.pageX}px`;
    PritomnostDropdown.style.top = `${event.pageY}px`;
    PritomnostDropdown.style.backgroundColor = '#fff';
    PritomnostDropdown.style.border = '1px solid #ccc';
    document.body.appendChild(PritomnostDropdown);

    let icons = ['pritomny.png', 'nepritomny.png', 'meskanie.png', 'akcept.png', 'deny.png', 'meskanie akcept.png', 'meskanie deny.png'];
    icons.forEach((icon, index) => {
        let img = document.createElement('img');
        img.src = `/static/images/${icon}`;
        img.style.width = '20px';
        img.style.height = '20px';
        img.style.margin = '5px';
        img.setAttribute('data-icon-index', index);
        img.onclick = function() {
            changeIcon(event.target, index);
            PritomnostDropdown.remove();
        };
        PritomnostDropdown.appendChild(img);
    });
    function handleClickOutside(event) {
        if (!PritomnostDropdown.contains(event.target)) {
            PritomnostDropdown.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    }
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 0);
}

function changeIcon(target, newIndex) {
    let icons = ['/static/images/pritomny.png', '/static/images/nepritomny.png', '/static/images/meskanie.png', '/static/images/akcept.png', '/static/images/deny.png', '/static/images/meskanie akcept.png', '/static/images/meskanie deny.png'];
    target.src = icons[newIndex];
    target.alt = newIndex;
    target.setAttribute('data-icon-index', newIndex);
    let parentTd = target.closest('td');
    parentTd.setAttribute('value', newIndex);

    let existingInput = parentTd.querySelector('input[type="number"]');
    if (existingInput) {
        existingInput.remove();
    }
    let zoznam = [2,5,6]
    if (zoznam.includes(newIndex)) {
        let input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 45;
        input.style.width = '20px';
        input.value = '0';
        parentTd.appendChild(input);
    }
}

function nastavitFarbuTlacidiel() {
    const existujuceTlacitka = document.querySelectorAll('.Ospravedlniť, .Neospravedlniť');
    existujuceTlacitka.forEach(tlacitko => {
        tlacitko.removeEventListener('click', zmenFarbu);
    });
    const tlacitkaOspravedlnit = document.querySelectorAll('.Ospravedlniť');
    const tlacitkaNeospravedlnit = document.querySelectorAll('.Neospravedlniť');

    tlacitkaOspravedlnit.forEach(tlacitko => {
        tlacitko.addEventListener('click', zmenFarbu);
    });

    tlacitkaNeospravedlnit.forEach(tlacitko => {
        tlacitko.addEventListener('click', zmenFarbu);
    });

    function zmenFarbu(event) {
        const tlacitko = event.target;
        const riadok = tlacitko.closest('tr');
        const tlacitkoOspravedlnit = riadok.querySelector('.Ospravedlniť');
        const tlacitkoNeospravedlnit = riadok.querySelector('.Neospravedlniť');
        if (tlacitko.style.backgroundColor) {
            tlacitko.style.backgroundColor = '';
        } else {
            if (tlacitko.classList.contains('Ospravedlniť')) {
                tlacitkoOspravedlnit.style.backgroundColor = 'green';
                tlacitkoNeospravedlnit.style.backgroundColor = '';
            } else if (tlacitko.classList.contains('Neospravedlniť')) {
                tlacitkoOspravedlnit.style.backgroundColor = '';
                tlacitkoNeospravedlnit.style.backgroundColor = 'red';
            }
        }
    }
}
function getDochadzka() {
    const riadky = document.querySelectorAll('#Dochazdka tr');
    const zoznamDochadzky = [];

    riadky.forEach((riadok) => {
        const den = riadok.querySelector('td').textContent;
        const tdElements = riadok.querySelectorAll('td:not(:first-child)');
        const informacie = [];

        tdElements.forEach((td) => {
            const obrazok = td.querySelector('img');
            if (obrazok) {
                let informacia = parseInt(obrazok.alt);
                if (informacia !== 0 ) {
                    const input = td.querySelector('input[type="number"]');
                    if (input) {
                        informacia += '(' + parseInt(input.value) + ')';
                    } else {
                        const title = td.getAttribute('title');
                        if (title) {
                            informacia += '(' + parseInt(title) + ')';
                        }
                    }
                }
                informacie.push(informacia);
            }
        });

        const tlacitkoOspravedlnit = riadok.querySelector('.Ospravedlniť').style.backgroundColor === 'green';
        const tlacitkoNeospravedlnit = riadok.querySelector('.Neospravedlniť').style.backgroundColor === 'red';

        let akcia = '';
        if (tlacitkoOspravedlnit) akcia = 1;
        if (tlacitkoNeospravedlnit) akcia = 2;

        zoznamDochadzky.push({
            den: den,
            data: informacie,
            akcia: akcia
        });
    });

    return zoznamDochadzky;
}
