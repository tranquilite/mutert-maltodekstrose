import express, { Express, NextFunction, Request, Response } from "express";
const path = require("path");

const app: Express = express();  // http://expressjs.com/en/5x/api.html#app.use
app.use(express.json());  // http://expressjs.com/en/api.html#express.json
app.use(express.static(path.join(__dirname))); // http://expressjs.com/en/5x/api.html#express.static

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
  });

const sqlite = require("sqlite3");
const db_conn = new sqlite.Database("db.sqlite");

function Trainwreck(err: any) { console.log(err); }  // fml

function endepunkt_ugyldig_metode(req: Request, resp: Response) {
    resp.status(405);
    resp.send({"err": `Metode ikke gyldig på endepunkt ${req.path}`});
}

// Generer kort; Ta array med spillerid
function helper_generer_dekk(spillere: number[]): string[] {
    return [];
}

// Registrer spillere; Antar et json-objekt, med et array av spillernavn.
// { "spillere": ["Jon", "Petter", "Hat", "Misnøye"] }
// Returner et objekt med to array;
// { "1": ["Jon", "Petter"], "2": ["Hat", "Misnøye"], "spillid": "123" }
app.post("/bridge/registrer",  // "copypaste fra boka" See one, do one
    async(req: Request, resp: Response) => {  // Anonym dritt
    // hvorfor er det async call? Fordi http er asynkron?
        try {
            helper_generer_dekk([12, 24]);
            resp.send({
                "A": ["Jon", "Petter"],  // Nord, Syd
                "B": ["Hat", "Bleh"],  // Øst, Vest
                "spillid": "123" } );
        } catch (inError) {
            Trainwreck(inError);
        }
});

// Del ut kort 
// "Del av oppsettsflyten. Trenger denne være et eget endepunkt?"
// 52 / 4 = 13
app.all("/bridge/:spillid/hand/:spiller", (req: Request, resp: Response) => {
    const spillid: string = req.params.spillid;
    const spiller: string = req.params.spiller;
    try {
        if (req.method === "GET") {
            resp.send({
                [spiller]: ["ruter1", "kløver8"]
            });
        } else {
            // Tar av; Kaller egen prosedyre for å håndtere rotet.
            endepunkt_ugyldig_metode(req, resp);
        }
    } catch (inError) {
        Trainwreck(inError);
    }
});

// Jeg er en halvtime fra å gjøre dette generelt.
app.all("/bridge/:spillid/melding/:spiller", (req: Request, resp: Response) => {
    const spillid: string = req.params.spillid;
    const spiller: string = req.params.spiller;
    try {
        if (req.method === "POST") {
            // Drittlogikk
        } else {
            // Tar av; Kaller egen prosedyre for å håndtere rotet.
            endepunkt_ugyldig_metode(req, resp);
        }
    } catch (inError) {
        Trainwreck(inError);
    }
});



// Håndter rooooot
app.get("/",
    async(req: Request, resp: Response) => {
        try {
            //resp.status(418);
            //resp.send({"err": "Endepunkt ikke definert. Jeg er en tepotte."});
            resp.sendFile(path.join(__dirname, 'runde1.htm'));
        } catch (inError) { Trainwreck(inError); }
    });

// Fyr løs
app.listen(80, () => console.log("Misliker denne modellen, as") );
db_conn.close();  // TODO: Trenger bedre programflyt her.