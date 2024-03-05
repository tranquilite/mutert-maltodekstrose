import express, { Express, NextFunction, Request, Response } from "express";
import {Spilltilstand, Spiller, Kort, Bud} from './models';
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
function Trainwreck(err: any, tree: string='NA') { console.log(err); }


/* =========================================================================
    Men jeg må få en oblig som er server-basert, som holder rede på 4 spillere,
    gir dem 13 kort hver og lar dem telle opp poengene.
    Om de teller dem riktig eller feil spiller ingen rolle -
    det er ikke det essensielle her.

    Forsøk å få til at den kan dele kort, telle poeng og la spillerne
    melde én melding og få ett svar (fra sin "makker")
   ========================================================================= */ 
function generer_kortstokk()
{
    let kortstokk: Kort[] = [];
    let farger: string[] = ["Spar", "Hjerter", "Ruter", "Kløver"];
    let valor: string[] = ["2", "3", "4", "5", "6", "7", "8", "9",
                           "10", "J","D", "K", "A"]

    for (let farge of farger) {  // Hvis lat, overkompliser.
        for (let verdi of valor) {
            kortstokk.push(new Kort(farge, verdi));
        }
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
            for (let i = 0; i < 4; i++)
            for (let i = 0; i < 4; i++) {
                const hand = kortstokk.slice( (13*i), (13*(i+1)) );
                spillere.push(new Spiller(spillforesporsel[i],
                                          i*4, // "TODO: ag skikkelige id-er"
                                          hand, i));
            }
            SPILL.set_game_state(spillere, {});
            resp.send(spillere);
        }
        catch (inError) {
            Trainwreck(inError);
        }
});

app.post("/bridge/bid/:player_id",
    (req: Request, resp: Response) => {
        try {
            if (parseInt(req.params.player_id) == SPILL.get_budgiver()) {
                let _bud: Bud = {
                    rank: parseInt(req.body["bid_rank"]),
                    bud: parseInt(req.body["bid_suit"])
                }
                SPILL._gi_bud(_bud);
            }
            else {
                resp.send( {"error": "Wrong turn"} );
            }
        }
        catch (inError) {
            Trainwreck(inError);
        }
});

app.get("/bridge/bid",
    (req: Request, resp: Response) => {
        
        resp.send( SPILL.get_bud() );
});


// Håndter rooooot
app.get("/", async(req: Request, resp: Response) => {
    try {
        resp.sendFile(path.join(__dirname, 'frontend.htm'));
    }
    catch (inError) {
        Trainwreck(inError);
    }
});

// Fyr løs
var SPILL = new Spilltilstand();  // NEI! Slem! Global var er ondskap
app.listen(80, () => console.log("Kjører..") );