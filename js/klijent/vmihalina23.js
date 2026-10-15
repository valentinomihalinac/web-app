window.addEventListener("load", function () {
    oznaciAktivnuPoveznicu();
    dodajGumbZaIzbornik();
    pripremiTablicuSporta();
});

function oznaciAktivnuPoveznicu() {
    var poveznice = document.querySelectorAll(".navigacija a");
    var trenutnaPutanja = window.location.pathname;

    if (trenutnaPutanja === "/") {
        trenutnaPutanja = "/index";
    }

    for (var i = 0; i < poveznice.length; i++) {
        var href = poveznice[i].getAttribute("href");

        if (href === trenutnaPutanja) {
            poveznice[i].classList.add("aktivna-poveznica");
        }
    }
}

function dodajGumbZaIzbornik() {
    var navigacija = document.querySelector(".navigacija");

    if (navigacija == null) {
        return;
    }

    var gumb = document.createElement("button");
    gumb.textContent = "Izbornik";
    gumb.id = "gumbIzbornik";
    gumb.type = "button";

    navigacija.insertAdjacentElement("beforebegin", gumb);

    gumb.addEventListener("click", function () {
        if (navigacija.style.display === "none") {
            navigacija.style.display = "";
        } else {
            navigacija.style.display = "none";
        }
    });
}

function pripremiTablicuSporta() {
    if (!window.location.pathname.includes("sport_i_rekreacija")) {
        return;
    }

    var tablica = document.querySelector("table");

    if (tablica == null) {
        return;
    }

    var naslov = document.createElement("h2");
    naslov.textContent = "Pretraživanje i filtriranje sportskih udruga";

    var pretraga = document.createElement("input");
    pretraga.type = "text";
    pretraga.id = "pretragaSporta";
    pretraga.placeholder = "Pretraži po nazivu, adresi ili osobi";

    var filter = document.createElement("select");
    filter.id = "filterSporta";

    dodajOpciju(filter, "", "Sve vrste sporta");
    dodajOpciju(filter, "Nogomet", "Nogomet");
    dodajOpciju(filter, "Rukomet", "Rukomet");
    dodajOpciju(filter, "Športski ribolov", "Športski ribolov");
    dodajOpciju(filter, "Ostali sportovi", "Ostali sportovi");

    tablica.parentNode.insertBefore(naslov, tablica);
    tablica.parentNode.insertBefore(pretraga, tablica);
    tablica.parentNode.insertBefore(filter, tablica);

    pretraga.addEventListener("keyup", function () {
        filtrirajTablicu();
    });

    filter.addEventListener("change", function () {
        filtrirajTablicu();
    });
}

function dodajOpciju(select, vrijednost, tekst) {
    var opcija = document.createElement("option");
    opcija.value = vrijednost;
    opcija.textContent = tekst;
    select.appendChild(opcija);
}

function filtrirajTablicu() {
    var pojam = document.getElementById("pretragaSporta").value.toLowerCase();
    var kategorija = document.getElementById("filterSporta").value;
    var redovi = document.querySelectorAll("table tbody tr");

    for (var i = 0; i < redovi.length; i++) {
        var celije = redovi[i].getElementsByTagName("td");

        if (celije.length === 0) {
            continue;
        }

        var vrstaSporta = celije[0].textContent;
        var tekstRetka = redovi[i].textContent.toLowerCase();

        var odgovaraPojmu = tekstRetka.indexOf(pojam) !== -1;
        var odgovaraKategoriji = kategorija === "" || vrstaSporta === kategorija;

        if (odgovaraPojmu && odgovaraKategoriji) {
            redovi[i].style.display = "";
        } else {
            redovi[i].style.display = "none";
        }
    }
}