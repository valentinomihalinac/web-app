window.addEventListener("load", function () {
    var obrazac = document.getElementById("obrazacPrijave");

    if (obrazac != null) {
        obrazac.addEventListener("submit", function (event) {
            var ispravno = provjeriObrazac();

            if (!ispravno) {
                event.preventDefault();
            }
        });
    }
});

function provjeriObrazac() {
    obrisiPorukeGresaka();

    var ispravno = true;

    var naziv = document.getElementById("naziv");
    var ime = document.getElementById("ime");
    var adresa = document.getElementById("adresa");
    var email = document.getElementById("email");
    var telefon = document.getElementById("telefon");
    var datum = document.getElementById("datum");
    var dani = document.getElementById("dani");
    var napomena = document.getElementById("napomena");

    var hrana = document.getElementById("hrana");
    var pice = document.getElementById("pice");
    var slastice = document.getElementById("slastice");

    var stand = document.getElementById("stand");
    var kucica = document.getElementById("kucica");

    if (naziv.value.trim().length < 3) {
        prikaziGresku(naziv, "Naziv obrta ili tvrtke mora imati barem 3 znaka.");
        ispravno = false;
    }

    if (!imaImeIPrezime(ime.value)) {
        prikaziGresku(ime, "Unesite ime i prezime odgovorne osobe.");
        ispravno = false;
    }

    if (adresa.value.trim().length < 5) {
        prikaziGresku(adresa, "Adresa mora imati barem 5 znakova.");
        ispravno = false;
    }

    if (!provjeriEmail(email.value)) {
        prikaziGresku(email, "Unesite ispravnu email adresu.");
        ispravno = false;
    }

    if (!provjeriTelefon(telefon.value)) {
        prikaziGresku(telefon, "Kontakt telefon mora imati barem 9 znamenki. Dozvoljeni su brojevi, razmaci, +, / i -.");
        ispravno = false;
    }

    if (!hrana.checked && !pice.checked && !slastice.checked) {
        prikaziGresku(slastice, "Odaberite barem jednu vrstu ugostiteljske ponude.");
        ispravno = false;
    }

    if (!stand.checked && !kucica.checked) {
        prikaziGresku(kucica, "Odaberite način posluživanja.");
        ispravno = false;
    }

    if (datum.value === "") {
        prikaziGresku(datum, "Unesite datum dolaska.");
        ispravno = false;
    }

    if (dani.value === "" || Number(dani.value) < 1 || Number(dani.value) > 5) {
        prikaziGresku(dani, "Broj dana sudjelovanja mora biti između 1 i 5.");
        ispravno = false;
    }

    if (kucica.checked && Number(dani.value) < 2) {
        prikaziGresku(dani, "Za posluživanje u kućici broj dana sudjelovanja mora biti najmanje 2.");
        ispravno = false;
    }

    if (hrana.checked && pice.checked && napomena.value.trim().length < 10) {
        prikaziGresku(napomena, "Ako nudite hranu i piće, u dodatnoj napomeni opišite ponudu s barem 10 znakova.");
        ispravno = false;
    }

    return ispravno;
}

function prikaziGresku(element, poruka) {
    if (element.type !== "checkbox" && element.type !== "radio") {
        element.classList.add("polje-greska");
    }

    var greska = document.createElement("span");
    greska.className = "greska";
    greska.textContent = poruka;

    var labela = document.querySelector("label[for='" + element.id + "']");

    if ((element.type === "checkbox" || element.type === "radio") && labela != null) {
        labela.insertAdjacentElement("afterend", greska);
    } else {
        element.insertAdjacentElement("afterend", greska);
    }
}

function obrisiPorukeGresaka() {
    var greske = document.getElementsByClassName("greska");

    while (greske.length > 0) {
        greske[0].parentNode.removeChild(greske[0]);
    }

    var polja = document.getElementsByTagName("input");

    for (var i = 0; i < polja.length; i++) {
        polja[i].classList.remove("polje-greska");
    }

    var tekstovi = document.getElementsByTagName("textarea");

    for (var j = 0; j < tekstovi.length; j++) {
        tekstovi[j].classList.remove("polje-greska");
    }
}

function imaImeIPrezime(vrijednost) {
    var izraz = /^[A-Za-zČĆŽŠĐčćžšđ]+ [A-Za-zČĆŽŠĐčćžšđ]+$/;
    return izraz.test(vrijednost.trim());
}

function provjeriEmail(vrijednost) {
    var izraz = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    return izraz.test(vrijednost.trim());
}

function provjeriTelefon(vrijednost) {
    var izraz = /^[0-9+\/\-\s]{9,20}$/;
    return izraz.test(vrijednost.trim());
}