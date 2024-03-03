import express, { Express, NextFunction, Request, Response } from "express";
import {Spilltilstand} from './models';
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
function kontroller_klartilstand(system: Spilltilstand) {
    return system.system_klar();
}

// Grensesnitt
app.post("/bridge/start",
    (req: Request, resp: Response) => {
        try
        {
            GSYSTEM.registrer()
            resp.send(kontroller_klartilstand(GSYSTEM))
        }
        catch (inError)
        {
            Trainwreck(inError);
        }
});

app.post("/bridge/registrer",
    (req: Request, resp: Response) => {
        try
        {

        }
        catch (inError)
        {
            Trainwreck(inError);
        }
});


// Håndter /
app.get("/", async(req: Request, resp: Response) => {
    try
    {
        resp.send(kontroller_klartilstand);
    }
    catch (inError)
    {
        Trainwreck(inError);
    }
});

// ..
var GSYSTEM = new Spilltilstand();  // NEI! Slem!
app.listen(80, () => console.log("Kjører..") );