export enum himmelretning { North, South, East, West }  // forenkling. Fordel: lag1, oddetall. lag2, partall.
export enum k_farge { Clubs, Diamonds, Hearts, Spades }  // Spades topp, Kløver bunnpoeng.
export enum bud_typer { NT, Clubs, Diamonds, Hearts, Spades, Pass, Double, Redouble }

export type Bud = {
    rank: number;
    bud: bud_typer;
}

export class Kort {
    public readonly farge: string;  // __slots__
    public readonly verdi: string;  // Etterligne py er .. stress
    private __ranking: number;

    constructor(farge: string, verdi: string)
    {
        /*if (["J", "D", "K", "A"].includes(verdi))
        {
            verdi = ["11", "12", "13", "14"][["J", "D", "K", "A"].indexOf(verdi)];
        }*/
        this.farge = farge;
        this.verdi = verdi;
        this.__ranking = this._ranking_poeng();
    }

    _ranking_poeng(): number  // Wonka's secret magic recipe
    {
        const verdier: { [key: string]: number } = {'2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8, 'J': 9, 'Q': 10, 'K': 11, 'A': 12};
        const farger: { [key: string]: number } = {'Clubs': 0, 'Diamonds': 1, 'Hearts': 2, 'Spades': 3};
        return verdier[this.verdi] + 13 * farger[this.farge];
    }

    toString()
    {
        let verdi: string = "";
        if (["11", "12", "13", "14"].includes(this.verdi)) {
            verdi = ["J", "D", "K", "A"][["11", "12", "13", "14"].indexOf(this.verdi)];
        }
        else {
            verdi = this.verdi;
        }
        return `${this.farge} ${this.verdi}`; }  // __str__

    __repr__()
    {
        return [this.farge, this.verdi];
    }
}

export class Spiller {
    public navn: string;
    public id: number;
    public retning: himmelretning; 
    private hand: Kort[];
    protected bids: Bud[];  // arr av Bud; Bud er 2 Clubs *eller* 1 Double; Siste er praktisk ugyldig, men gyldig i datamodellen.

    constructor(navn: string, id: number, hand: Kort[], himmelretning: himmelretning)
    {
        this.navn = navn;
        this.id = id;
        this.hand = hand;
        this.retning = himmelretning;
        this.bids = [];
    }

    toString()
    {
        return `${this.navn} ( ${this.retning})`;
    }

    // Los getters infernales
    get_hand() { return this.hand; }
    get_bud(idx: number | string = "None"): Bud | Bud[] { 
        if (typeof idx === "string") {
            return this.bids
        }
        else {
            return this.bids[ idx % (this.bids.length - 1) ];
        }
    }

    get_alle_bud(): Bud[]
    {
        return this.bids;
    }

    // Les setters
    sett_bud(bud: Bud)
    {
        this.bids.push(bud);
    }

    bygg_spillerprofil()  // ghetto __repr__
    {
        let _hand = [];
        for (let kort in this.hand) {
            _hand.push(this.hand[kort].__repr__());
        }
        return {"navn": this.navn, "id": this.hand, "retning": this.retning, "bud": this.bids, "hand": _hand};
    }
}

export class Spilltilstand {
    private spillere: Spiller[];
    private poeng: { [key: string]: number };
    private runde: number;
    private budgiver: number;  // INDEKS AV BUDGIVER; IKKE SPILLER-ID

    constructor()
    {
        this.spillere = []; this.poeng = {};  this.budgiver = 2; // Dummy
    }

    set_game_state(spillere: Spiller[], poeng: {[key: string]: number})
    {
        this.spillere = spillere;
        this.poeng = poeng;
        console.log(this.spillere, this.poeng);
    }

    _gi_bud(bud: Bud)
    {
        this.spillere[this.budgiver].sett_bud(bud);
        this.budgiver = (this.budgiver + 1 ) % (this.spillere.length - 1);
    }

    // generelle getters
    get_bud()
    {
        let foo: {[key: number]: Bud[]} = {};
        for (let i = 0; i < this.spillere.length; i++) {
            foo[i]= this.spillere[i].get_alle_bud();
        }
        return foo;
    }

    get_budgiver(): number
    {
        return this.budgiver;
    }

}