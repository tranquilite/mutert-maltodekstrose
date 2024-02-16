import express, { Express, NextFunction, Request, Response } from "express";
const path = require("path");

const app: Express = express();  // http://expressjs.com/en/5x/api.html#app.use
app.use(express.json());  // http://expressjs.com/en/api.html#express.json
app.use(express.static(path.join(__dirname))); // http://expressjs.com/en/5x/api.html#express.static

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST");
    inResponse.header("Access-Control-Allow-Headers",
                      "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
  });

function Trainwreck(err: any) { console.log(err); }  // fml


/* =========================================================================
    Men jeg må få en oblig som er server-basert, som holder rede på 4 spillere,
    gir dem 13 kort hver og lar dem telle opp poengene.
    Om de teller dem riktig eller feil spiller ingen rolle -
    det er ikke det essensielle her.

    Forsøk å få til at den kan dele kort, telle poeng og la spillerne
    melde én melding og få ett svar (fra sin "makker")
   ========================================================================= */ 


function generer_kortstokk() {
    let kort: string[] = [];
    let farger: string[] = ["Spar", "Hjerter", "Ruter", "Kløver"];
    let valor: string[] = ["2", "3", "4", "5", "6", "7", "8", "9",
                           "10", "J","D", "K", "A"]
    for (let farge of farger) {  // Hvis lat, overkompliser.
        for (let verdi of valor) {
            kort.push(farge + " " + verdi);
        }
    }

    // Stokk om. ..tror jeg. tbh husker jeg dette knapt
    for (let i = kort.length - 1; i > 0; i--) {
        const base: number = Math.floor(Math.random() * (i + 1));
        [kort[i], kort[base]] = [kort[base], kort[i]];
    }

    return kort;
}

interface Spillerhand {
    [spiller: string]: string[]
}


// Start et spill.
// Ta et array med fire navn og returner et objekt med navn og 13 kort/spiller
app.post("/bridge/start",  // "copypaste fra boka" See one, do one
    (req: Request, resp: Response) => {
        try {
            const spillforesporsel: any = req.body["spillere"];
            const kortstokk = generer_kortstokk();
            let spillebord: Spillerhand = {}

            for (let i = 1; i <= 4; i++) {
                spillebord[spillforesporsel[i-1]] =
                    kortstokk.slice( (13*(i-1)), (13*i) );
            }
            resp.send(spillebord);
        } catch (inError) {
            Trainwreck(inError);
        }
});






// Håndter rooooot
app.get("/",
    async(req: Request, resp: Response) => {
        try {
            //resp.status(418);
            //resp.send({"feil": "Endepunkt ikke definert. Jeg er en tepotte."});
            resp.sendFile(path.join(__dirname, 'runde2.htm'));
        } catch (inError) { Trainwreck(inError); }
    });

// Fyr løs
app.listen(80, () => console.log("Kjører..") );