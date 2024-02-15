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

// Bygger ut litt feilhåndtering
function Trainwreck(err: any, tree: string='NA') { console.log(err); }  // fml


/* =========================================================================
    Men jeg må få en oblig som er server-basert, som holder rede på 4 spillere,
    gir dem 13 kort hver og lar dem telle opp poengene.
    Om de teller dem riktig eller feil spiller ingen rolle -
    det er ikke det essensielle her.

    Forsøk å få til at den kan dele kort, telle poeng og la spillerne
    melde én melding og få ett svar (fra sin "makker")
   ========================================================================= */ 

enum himmelretning { North, South, East, West }  // forenkling. Fordel: lag1, oddetall. lag2, partall.
enum k_farge { Clubs, Diamonds, Hearts, Spades }  // Spades topp, Kløver bunnpoeng.
enum bud_typer { NT, Clubs, Diamonds, Hearts, Spades, Pass, Double, Redouble }

class Kort {
    private farge: string;  // __slots__
    private verdi: string;  // Etterligne py er .. stress

    constructor(farge: string, verdi: string) {
        if (["J", "D", "K", "A"].includes(verdi)) {
            verdi = ["11", "12", "13", "14"][["J", "D", "K", "A"].indexOf(verdi)];
        }
        this.farge = farge;
        this.verdi = verdi;
    }

    toString() {
        let verdi: string = "";
        if (["11", "12", "13", "14"].includes(this.verdi)) {
            verdi = ["J", "D", "K", "A"][["11", "12", "13", "14"].indexOf(this.verdi)];
        } else { verdi = this.verdi; }
        return `${this.farge} ${this.verdi}`; }  // __str__
}

type Bud = {
    rank: number;
    bud: bud_typer;
}

class Spiller {
    public navn: string;
    public id: number;
    public retning: himmelretning; 
    private hand: Kort[];
    protected bids: Bud[];  // arr av Bud; Bud er 2 Clubs *eller* 1 Double; Siste er praktisk ugyldig, men gyldig i datamodellen.

    constructor(navn: string, id: number, hand: Kort[], himmelretning: himmelretning) {
        this.navn = navn;
        this.id = id;
        this.hand = hand;
        this.retning = himmelretning;
        this.bids = [];
    }

    toString() { return `${this.navn} ( ${this.retning})`; }

    // Los getters infernales
    get_hand() { return this.hand; }
}

// PSYKE! Dette funker jo
class Spilltilstand {
    // Logikkdritt
    private spillere: Spiller[];
    private poeng: { [key: string]: number };
    private runde: number;

    constructor() {
        this.spillere = []; this.poeng = {};  // Dummy
        this.runde = 1;  // Ny runde gir selvfølgelig omstart på 1. runde
    }

    set_game_state(spillere: Spiller[], poeng: {[key: string]: number}) {
        this.spillere = spillere;
        this.poeng = poeng;
    }

}

function generer_kortstokk() {
    let kortstokk: Kort[] = [];
    let farger: string[] = ["Spar", "Hjerter", "Ruter", "Kløver"];
    let valor: string[] = ["2", "3", "4", "5", "6", "7", "8", "9",
                           "10", "J","D", "K", "A"]

    for (let farge of farger) {  // Hvis lat, overkompliser.
        for (let verdi of valor) { kortstokk.push(new Kort(farge, verdi)); }
    }

    // Stokk om. ..tror jeg. tbh husker jeg dette knapt
    for (let i = kortstokk.length - 1; i > 0; i--) {
        const base: number = Math.floor(Math.random() * (i + 1));
        [kortstokk[i], kortstokk[base]] = [kortstokk[base], kortstokk[i]];
    }

    return kortstokk;
}


// Start et spill.
// Ta et array med fire navn og returner et array Spiller-objekt
app.post("/bridge/start",
    (req: Request, resp: Response) => {
        let spillere: Spiller[] = [];
        const kortstokk = generer_kortstokk();

        try {
            const spillforesporsel = req.body["spillere"];
            for (let i = 0; i < 4; i++) {
                const hand = kortstokk.slice( (13*i), (13*(i+1)) );
                spillere.push(new Spiller(spillforesporsel[i],
                                          i*4, // "TODO: ag skikkelige id-er"
                                          hand, i));
            }
            SPILL.set_game_state(spillere, {});
            resp.send(spillere);
        } catch (inError) {
            Trainwreck(inError);
        }
});

app.post("/bridge/bid/:player_id",
    (req: Request, resp: Response) => {
        try {

            resp.send( {"1": "1NT"});
        } catch (inError) {
            Trainwreck(inError);
        }
});

app.get("/bridge/bid",
    (req: Request, resp: Response) => {
        // ...
});


// Håndter rooooot
app.get("/", async(req: Request, resp: Response) => {
    try { resp.sendFile(path.join(__dirname, 'runde3.htm')); }
    catch (inError) { Trainwreck(inError); }
});

// Fyr løs
var SPILL = new Spilltilstand();  // NEI! Slem! Global var er ondskap
app.listen(80, () => console.log("Kjører..") );