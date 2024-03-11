const editUcebnu = document.getElementsByClassName("editUcebnu");
for (let i = 0; i < editUcebnu.length; i++) {
    editUcebnu[i].addEventListener("click", function () {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        let nazov = this.closest('tr').getElementsByTagName('td')[1].textContent;
        let skratka = this.closest('tr').getElementsByTagName('td')[2].textContent;
        document.getElementById('addUcebnu').style.display =  'block';
        document.getElementsByClassName('addUcebnuclose')[0].onclick = function() {
            document.getElementById('addUcebnu').style.display =  'none';
        };
        document.getElementById('Nazov').value = nazov;
        document.getElementById('Skratka').value = skratka;
        document.getElementById('addUcebnaSave').onclick = function () {
            let nazov = document.getElementById('Nazov').value;
            let skratka = document.getElementById('Skratka').value;
            if (!nazov || !skratka) {
                alert("Nezadali ste Názov alebo skratku");
                return
            }
            sendRequest('/Ucebne/updateUcebna', 'POST', ({id:idCell, nazov:nazov, skratka:skratka}), (data) => {
                if (data){
                    window.location.reload();
                } else {
                    alert("Zadaný názov alebo skratka už existuje");
                }
            });
        };
    });
}

document.getElementById('addUcebnuButton').onclick = function () {
    document.getElementById('addUcebnu').style.display =  'block';
    document.getElementsByClassName('addUcebnuclose')[0].onclick = function() {
        document.getElementById('addUcebnu').style.display =  'none';
    };
    document.getElementById('Nazov').value = "";
    document.getElementById('Skratka').value = "";
    document.getElementById('addUcebnaSave').onclick = function () {
        let nazov = document.getElementById('Nazov').value;
        let skratka = document.getElementById('Skratka').value;
        if (!nazov || !skratka) {
            alert("Nezadali ste Názov alebo skratku");
            return
        }
        sendRequest('/Ucebne/saveUcebna', 'POST', ({nazov:nazov, skratka:skratka}), (data) => {
            if (data){
                window.location.reload();
            } else {
                alert("Zadaný názov alebo skratka už existuje");
            }
        });
    };
};
const delUcebnu = document.getElementsByClassName("delUcebnu");
for (let i = 0; i < delUcebnu.length; i++) {
    delUcebnu[i].addEventListener("click", function () {
        let idCell = this.closest('tr').getElementsByTagName('td')[0].textContent;
        let nazov = this.closest('tr').getElementsByTagName('td')[1].textContent;
        let modal = document.getElementById('delUcebnu')
        modal.style.display = "block";
        document.getElementsByClassName('delUcebnuModalclose')[0].onclick = function () {
            modal.style.display = 'none';
        };
        document.getElementById('textdelUcebnu').textContent = "Vážne chcete odstrániť Učebňu s názvom: " + nazov;
        document.getElementById('savedelUcebnu').onclick = function () {
            sendRequest('/Ucebne/delUcebna', 'POST', (idCell), (data)=> {
                if (data){
                    window.location.reload();
                }
            });
        };
    });
}