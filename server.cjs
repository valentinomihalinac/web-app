let express;
try {
    express = require("express");
} catch (greska) {
    express = require("/usr/lib/node_modules/express");
}

const os = require("os");
const path = require("path");
const zapisiCsv = require("./js/server/zapisiCsv.cjs");

function dajPort(korime) {
    const HOST = os.hostname();

    if (HOST != "spider.foi.hr") {
        return 12354;
    } else {
        const portovi = require("/var/www/OWT/2026/portovi.js");
        return portovi[korime];
    }
}

const server = express();
const port = dajPort("vmihalina23");

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/JSklijent", express.static(path.join(__dirname, "js", "klijent")));
server.use("/dizajn", express.static(path.join(__dirname, "css")));
server.use("/resursi", express.static(path.join(__dirname, "resursi")));

server.get("/", function (zahtjev, odgovor) {
    odgovor.redirect("/index");
});

server.get("/index", function (zahtjev, odgovor) {
    odgovor.sendFile(path.join(__dirname, "html", "index.html"));
});

server.get("/o_gradu", function (zahtjev, odgovor) {
    odgovor.sendFile(path.join(__dirname, "html", "o_gradu.html"));
});

server.get("/lokacije", function (zahtjev, odgovor) {
    odgovor.sendFile(path.join(__dirname, "html", "lokacije.html"));
});

server.get("/manifestacije", function (zahtjev, odgovor) {
    odgovor.sendFile(path.join(__dirname, "html", "manifestacije.html"));
});

server.get("/sport_i_rekreacija", function (zahtjev, odgovor) {
    odgovor.sendFile(path.join(__dirname, "html", "sport_i_rekreacija.html"));
});

server.get("/obrValidacija", function (zahtjev, odgovor) {
    odgovor.sendFile(path.join(__dirname, "html", "obrazac.html"));
});

server.get("/dokumentacija", function (zahtjev, odgovor) {
    odgovor.sendFile(path.join(__dirname, "html", "dokumentacija.html"));
});

server.get("/pregled", function (zahtjev, odgovor) {
    let pojam = zahtjev.query.pojam;
    let kategorija = zahtjev.query.kategorija;

    if (pojam == undefined) {
        pojam = "";
    }

    if (kategorija == undefined) {
        kategorija = "";
    }

    const zapisi = zapisiCsv.dohvatiSve(pojam, kategorija);

    let html = `
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>Pregled zapisa</title>
    <link rel="stylesheet" href="/dizajn/vmihalina23.css">
    <link rel="stylesheet" href="/dizajn/stranice.css">
</head>
<body>
    <header>
        <h1>Pregled zapisa</h1>
        <p><a href="/index">Povratak na početnu</a></p>
    </header>

    <main>
        <form method="GET" action="/pregled">
            <label for="pojam">Pojam:</label>
            <input type="text" id="pojam" name="pojam" value="${pojam}">

            <label for="kategorija">Kategorija:</label>
            <select id="kategorija" name="kategorija">
                <option value="">Sve</option>
                <option value="manifestacija">Manifestacija</option>
                <option value="lokacija">Lokacija</option>
                <option value="sport">Sport</option>
            </select>

            <input type="submit" value="Primijeni">
        </form>

        <table>
            <tr>
                <th>ID</th>
                <th>Naziv</th>
                <th>Opis</th>
                <th>Kategorija</th>
                <th>Datum unosa</th>
                <th>Prikaži</th>
                <th>Obriši</th>
            </tr>
`;

    for (let i = 0; i < zapisi.length; i++) {
        let zapis = zapisi[i];

        html += `
            <tr>
                <td>${zapis.id}</td>
                <td>${zapis.naziv}</td>
                <td>${zapis.opis}</td>
                <td>${zapis.kategorija}</td>
                <td>${zapis.datumUnosa}</td>
                <td><a href="/pregled/${zapis.id}">Prikaži</a></td>
                <td>
                    <form method="POST" action="/pregled/obrisi/${zapis.id}">
                        <input type="submit" value="Obriši">
                    </form>
                </td>
            </tr>
`;
    }

    html += `
        </table>
    </main>

    <footer>
        <p>&copy; Valentino Mihalinac</p>
    </footer>
</body>
</html>
`;

    odgovor.send(html);
});

server.get("/pregled/:id", function (zahtjev, odgovor) {
    const zapis = zapisiCsv.dohvatiPoIdentifikatoru(zahtjev.params.id);

    if (zapis == null) {
        odgovor.status(404);
        odgovor.send("<h1>Traženi zapis nije pronađen!</h1><p><a href='/pregled'>Povratak na pregled</a></p>");
        return;
    }

    let html = `
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>${zapis.naziv}</title>
    <link rel="stylesheet" href="/dizajn/vmihalina23.css">
    <link rel="stylesheet" href="/dizajn/stranice.css">
</head>
<body>
    <main>
        <h1>${zapis.naziv}</h1>
        <p><strong>ID:</strong> ${zapis.id}</p>
        <p><strong>Opis:</strong> ${zapis.opis}</p>
        <p><strong>Kategorija:</strong> ${zapis.kategorija}</p>
        <p><strong>Datum unosa:</strong> ${zapis.datumUnosa}</p>

        <p><a href="/pregled">Povratak na pregled</a></p>
    </main>
</body>
</html>
`;

    odgovor.send(html);
});

server.post("/pregled/obrisi/:id", function (zahtjev, odgovor) {
    zapisiCsv.ukloniPoIdentifikatoru(zahtjev.params.id);
    odgovor.redirect("/pregled");
});

server.get("/api/zapisi", function (zahtjev, odgovor) {
    let pojam = zahtjev.query.pojam;
    let kategorija = zahtjev.query.kategorija;

    if (pojam == undefined) {
        pojam = "";
    }

    if (kategorija == undefined) {
        kategorija = "";
    }

    const zapisi = zapisiCsv.dohvatiSve(pojam, kategorija);

    odgovor.status(200);
    odgovor.type("json");
    odgovor.send(JSON.stringify(zapisi));
});

server.post("/api/zapisi", function (zahtjev, odgovor) {
    const dodaniZapis = zapisiCsv.dodajNovi(zahtjev.body);

    odgovor.type("json");

    if (dodaniZapis == null) {
        odgovor.status(400);
        odgovor.send(JSON.stringify({ greska: "Neispravni ili nepotpuni podaci za zapis." }));
    } else {
        odgovor.status(201);
        odgovor.send(JSON.stringify(dodaniZapis));
    }
});

server.put("/api/zapisi", function (zahtjev, odgovor) {
    odgovor.status(405);
    odgovor.type("json");
    odgovor.send(JSON.stringify({ greska: "Metoda nije dopuštena za kolekciju zapisa." }));
});

server.delete("/api/zapisi", function (zahtjev, odgovor) {
    odgovor.status(405);
    odgovor.type("json");
    odgovor.send(JSON.stringify({ greska: "Metoda nije dopuštena za kolekciju zapisa." }));
});

server.get("/api/zapisi/:id", function (zahtjev, odgovor) {
    const zapis = zapisiCsv.dohvatiPoIdentifikatoru(zahtjev.params.id);

    odgovor.type("json");

    if (zapis == null) {
        odgovor.status(404);
        odgovor.send(JSON.stringify({ greska: "Zapis s traženim identifikatorom nije pronađen." }));
    } else {
        odgovor.status(200);
        odgovor.send(JSON.stringify(zapis));
    }
});

server.post("/api/zapisi/:id", function (zahtjev, odgovor) {
    odgovor.status(405);
    odgovor.type("json");
    odgovor.send(JSON.stringify({ greska: "Metoda nije dopuštena za pojedinačni zapis." }));
});

server.put("/api/zapisi/:id", function (zahtjev, odgovor) {
    const zapisPostoji = zapisiCsv.dohvatiPoIdentifikatoru(zahtjev.params.id);

    odgovor.type("json");

    if (zapisPostoji == null) {
        odgovor.status(404);
        odgovor.send(JSON.stringify({ greska: "Zapis s traženim id-im nije pronađen za ažuriranje." }));
        return;
    }

    const azuriraniZapis = zapisiCsv.azurirajPostojeci(zahtjev.params.id, zahtjev.body);

    if (azuriraniZapis == null) {
        odgovor.status(400);
        odgovor.send(JSON.stringify({ greska: "Neispravni podaci za ažuriranje." }));
    } else {
        odgovor.status(200);
        odgovor.send(JSON.stringify(azuriraniZapis));
    }
});

server.delete("/api/zapisi/:id", function (zahtjev, odgovor) {
    const uspjeh = zapisiCsv.ukloniPoIdentifikatoru(zahtjev.params.id);

    odgovor.type("json");

    if (!uspjeh) {
        odgovor.status(404);
        odgovor.send(JSON.stringify({ greska: "Zapis s traženim identifikatorom nije pronađen za brisanje." }));
    } else {
        odgovor.status(200);
        odgovor.send(JSON.stringify({ poruka: "Zapis je uspješno obrisan." }));
    }
});

server.use(function (zahtjev, odgovor) {
    odgovor.status(404);
    odgovor.send('<h1>Stranica ne postoji!</h1><p>Tražena stranica ne postoji.</p><a href="/index">Povratak na početnu stranicu</a>');
});

server.listen(port, function () {
    console.log("Server pokrenut na portu: " + port);
});