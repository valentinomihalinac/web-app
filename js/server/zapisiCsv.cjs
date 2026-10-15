const fs = require("fs");

class ZapisiCsv {
    constructor() {
        this.csvFilePath = "resursi/ostalo/zapisi.csv";
    }

    dohvatiSve(pojam, kategorija) {
        const data = fs.readFileSync(this.csvFilePath, "utf8");
        const redovi = data.trim().split("\n");
        const zapisi = [];

        if (pojam == undefined) {
            pojam = "";
        }

        if (kategorija == undefined) {
            kategorija = "";
        }

        for (let i = 0; i < redovi.length; i++) {
            const stupci = redovi[i].split("#");

            const zapis = {
                id: stupci[0].trim(),
                naziv: stupci[1].trim(),
                opis: stupci[2].trim(),
                kategorija: stupci[3].trim(),
                datumUnosa: stupci[4].trim()
            };

            let prikazi = true;
            let tekstZapisa = zapis.naziv + " " + zapis.opis;

            if (pojam != "" && !tekstZapisa.toLowerCase().includes(pojam.toLowerCase())) {
                prikazi = false;
            }

            if (kategorija != "" && zapis.kategorija != kategorija) {
                prikazi = false;
            }

            if (prikazi) {
                zapisi.push(zapis);
            }
        }

        return zapisi;
    }

    dohvatiPoIdentifikatoru(id) {
        const zapisi = this.dohvatiSve("", "");

        for (let i = 0; i < zapisi.length; i++) {
            if (zapisi[i].id == id) {
                return zapisi[i];
            }
        }

        return null;
    }

    dodajNovi(zapis) {
        if (!zapis.naziv || !zapis.opis || !zapis.kategorija || !zapis.datumUnosa) {
            return null;
        }

        const zapisi = this.dohvatiSve("", "");
        let najveciId = 0;

        for (let i = 0; i < zapisi.length; i++) {
            if (Number(zapisi[i].id) > najveciId) {
                najveciId = Number(zapisi[i].id);
            }
        }

        const noviZapis = {
            id: String(najveciId + 1),
            naziv: zapis.naziv,
            opis: zapis.opis,
            kategorija: zapis.kategorija,
            datumUnosa: zapis.datumUnosa
        };

        const noviRed = noviZapis.id + "#" +
            noviZapis.naziv + "#" +
            noviZapis.opis + "#" +
            noviZapis.kategorija + "#" +
            noviZapis.datumUnosa + "\n";

        fs.appendFileSync(this.csvFilePath, noviRed, "utf8");

        return noviZapis;
    }

    azurirajPostojeci(id, noviPodaci) {
        if (!noviPodaci.naziv || !noviPodaci.opis || !noviPodaci.kategorija || !noviPodaci.datumUnosa) {
            return null;
        }

        const zapisi = this.dohvatiSve("", "");
        let pronaden = false;
        let azuriraniZapis = null;
        let noviSadrzaj = "";

        for (let i = 0; i < zapisi.length; i++) {
            if (zapisi[i].id == id) {
                zapisi[i].naziv = noviPodaci.naziv;
                zapisi[i].opis = noviPodaci.opis;
                zapisi[i].kategorija = noviPodaci.kategorija;
                zapisi[i].datumUnosa = noviPodaci.datumUnosa;

                pronaden = true;
                azuriraniZapis = zapisi[i];
            }

            noviSadrzaj += zapisi[i].id + "#" +
                zapisi[i].naziv + "#" +
                zapisi[i].opis + "#" +
                zapisi[i].kategorija + "#" +
                zapisi[i].datumUnosa + "\n";
        }

        if (!pronaden) {
            return false;
        }

        fs.writeFileSync(this.csvFilePath, noviSadrzaj, "utf8");

        return azuriraniZapis;
    }

    ukloniPoIdentifikatoru(id) {
        const zapisi = this.dohvatiSve("", "");
        let noviSadrzaj = "";
        let pronaden = false;

        for (let i = 0; i < zapisi.length; i++) {
            if (zapisi[i].id != id) {
                noviSadrzaj += zapisi[i].id + "#" +
                    zapisi[i].naziv + "#" +
                    zapisi[i].opis + "#" +
                    zapisi[i].kategorija + "#" +
                    zapisi[i].datumUnosa + "\n";
            } else {
                pronaden = true;
            }
        }

        if (!pronaden) {
            return false;
        }

        fs.writeFileSync(this.csvFilePath, noviSadrzaj, "utf8");

        return true;
    }
}

module.exports = new ZapisiCsv();