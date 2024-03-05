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

/* =========================================================================
    Prosedyrehjelpere
   ========================================================================= */
// Bygger ut litt feilhåndtering
function Trainwreck(err: any, resp_obj: Response, tree: string='NA')
{
    // Viser seg at feilhåndtering er _litt_ komplekst i stackmaskiner.
    resp_obj.send(err);
    console.error(err);
}   

function generer_kortstokk()
{
    let kortstokk: Kort[] = [];
    /*let farger: string[] = ["Clubs", "Diamonds", "Hearts", "Spades"];
    let valor: string[] = ["2", "3", "4", "5", "6", "7", "8", "9",
                           "10", "J","D", "K", "A"]

    for (let farge of farger) {  // Hvis lat, overkompliser.
        for (let verdi of valor) {
            kortstokk.push(new Kort(farge, verdi));
        }
    }*/

    for (let num = 0; num <= 51; num++) {
        kortstokk.push(new Kort(num))
    }

    // Stokk om. ..tror jeg. tbh husker jeg dette knapt
    for (let i = kortstokk.length - 1; i > 0; i--) {
        const base: number = Math.floor(Math.random() * (i + 1));
        [kortstokk[i], kortstokk[base]] = [kortstokk[base], kortstokk[i]];
    }

    return kortstokk;
}

/* =========================================================================
    Men jeg må få en oblig som er server-basert, som holder rede på 4 spillere,
    gir dem 13 kort hver og lar dem telle opp poengene.
    Om de teller dem riktig eller feil spiller ingen rolle -
    det er ikke det essensielle her.

    Forsøk å få til at den kan dele kort, telle poeng og la spillerne
    melde én melding og få ett svar (fra sin "makker")
   ========================================================================= */


// registrer endpoints
app.get("/", endpoint_root);  // Rudimentært frontend
app.post("/bridge/start", endpoint_bridge_start);  // Initialiseringspunkt
app.get("/bridge/bid", endpoint_bridge_bid);  // Oversikt bud
app.post("/bridge/bid/:player_id", endpoint_bridge_bid_pid);  // Gi bud


// Initialiseringshandler
// Ta et array med fire navn og posisjoner, og returner et array Spiller-objekt
async function endpoint_bridge_start(req: Request, resp: Response) 
{
        let spillere: Spiller[] = [];
        const kortstokk = generer_kortstokk();
        const _map_retning: { [key: string] : number } =  {"nord": 0, "sor": 1, "ost": 2, "vest": 3};

        try {
            if (!("spillere" in req.body)) {
                throw new Error(JSON.stringify({"cause": "Scope missing", "meta": req.body}));
            }
            const spillforesporsel = req.body["spillere"];
            const _retning: string[] = Object.keys(spillforesporsel);
            // for (let i = 0; i < Object.keys(spillforesporsel); i++) {
            for (let i = 0; i < 4; i++) {
                const hand = kortstokk.slice( (13*i), (13*(i+1)) );
                console.log(spillforesporsel);
                spillere.push(new Spiller(spillforesporsel[_retning[i]],
                                          i*4, // "TODO: ag skikkelige id-er"
                                          hand,
                                          _map_retning[_retning[i]]
                                         ));
            }
            SPILL.set_game_state(spillere, {});
            resp.send(spillere);
        }
        catch (inError) {
            Trainwreck(inError, resp);
        }
}


async function endpoint_bridge_bid_pid(req: Request, resp: Response)
{
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
            Trainwreck(inError, resp);
        }
}



async function endpoint_bridge_bid(req: Request, resp: Response)
{
    resp.send( SPILL.get_bud() );
}


// Rothåndtering
async function endpoint_root(req: Request, resp: Response)
{
    try {
        resp.sendFile(path.join(__dirname, 'frontend.htm'));
    }
    catch (inError) {
        Trainwreck(inError, resp);
    }
}


// Fyr løs
const SPILL = new Spilltilstand();  // NEI! Slem! Global var er ondskap
app.listen(80, () => console.log("Kjører..") );