export enum himmelretning { North, South, East, West }  // forenkling. Fordel: lag1, oddetall. lag2, partall.
export enum k_farge { Clubs, Diamonds, Hearts, Spades }  // Spades topp, Kløver bunnpoeng.
export enum bud_typer { NT, Clubs, Diamonds, Hearts, Spades, Pass, Double, Redouble }

export type Bud = {
    rank: number;
    bud: bud_typer;
}

export class Kort {
    private __ranking: number;

    constructor(idx: number)
    {
        this.__ranking = idx;
    }

    toJSON()
    {
        return {
            "farge": this.kalkyle_farge(),
            "verdi": this.kalkyle_verdi(),
            "__ranking": this.__ranking
        };
    }

    kalkyle_farge(): string
    {
        const f_map: { [key: number]: string } = {0: "Clubs", 1: "Diamonds", 2: "Hearts", 3: "Spades"};
        const idx_farge: number = (Math.floor(this.__ranking / 13));
        return f_map[idx_farge];
    }

    kalkyle_verdi(): string
    {
        const key_verdi: string = (this.__ranking % 13 + 2).toString();
        let verdi: string = "";
        if (["11", "12", "13", "14"].includes(key_verdi)) {
            verdi = ["J", "Q", "K", "A"][["11", "12", "13", "14"].indexOf(key_verdi)];
        }
        else {
            verdi = key_verdi;
        }
        return verdi
    }

    __repr__()
    {
        const verdi: number = this.__ranking % 13;
        const farge:number = Math.floor(this.__ranking / 13) + 2;
        return [this.kalkyle_farge(), this.kalkyle_verdi()];
    }
}

export class Spiller {
    public navn: string;
    public id: number;
    public retning: himmelretning; 
    private hand: Kort[];
    protected bids: Bud[];

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
    private budgiver: number;  // INDEKS AV BUDGIVER; IKKE SPILLER-ID

    constructor()
    {
        this.spillere = []; this.poeng = {};  this.budgiver = 2; // Dummy
    }

    metavalidering()
    {
        if (!(this.spillere.length === 4)) {
            let _reason = `${4 - this.spillere.length} spillere mangler`;
            throw new Error(JSON.stringify({"cause": _reason}));
        }
    }

    set_game_state(spillere: Spiller[], poeng: {[key: string]: number})
    {
        if (spillere.length > 4) {
            throw new Error(JSON.stringify({"cause": "For mange spillere"}));
        }
        this.spillere = spillere;
        this.poeng = poeng;
        console.log(this.spillere, this.poeng);
    }

    _gi_bud(bud: Bud)
    {
        this.metavalidering();
        this.spillere[this.budgiver].sett_bud(bud);
        this.budgiver = (this.budgiver + 1 ) % (this.spillere.length - 1);
    }

    // generelle getters
    get_bud()
    {
        this.metavalidering();
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