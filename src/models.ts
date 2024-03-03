export enum himmelretning { North, South, East, West }  // forenkling. Fordel: lag1, oddetall. lag2, partall.
export enum k_farge { Clubs, Diamonds, Hearts, Spades }  // Spades topp, Kløver bunnpoeng.
export enum bud_typer { Clubs, Diamonds, Hearts, Spades, NT } // Pass, Double, Redouble }

export type Bud = {
    rank: number;
    bud: bud_typer;
}

export class Kort {
    private farge: string;  // __slots__
    private verdi: string;  // Etterligne py er .. stress
    private __rank: number;

    constructor(farge: string, verdi: string) {
        if (["J", "D", "K", "A"].includes(verdi))
        {
            verdi = ["11", "12", "13", "14"][["J", "D", "K", "A"].indexOf(verdi)];
        }
        this.farge = farge;
        this.verdi = verdi;
        this.__rank = this._ranking_poeng();
    }

    _ranking_poeng(): number {
        const ranks: { [key: string]: number } = {'2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8, 'J': 9, 'Q': 10, 'K': 11, 'A': 12};
        const suits: { [key: string]: number } = {'Clubs': 0, 'Diamonds': 1, 'Hearts': 2, 'Spades': 3};
        return ranks[this.farge] + 13 * suits[this.verdi];
    }

    toString() {
        let verdi: string = "";
        if (["11", "12", "13", "14"].includes(this.verdi))
        {
            verdi = ["J", "D", "K", "A"][["11", "12", "13", "14"].indexOf(this.verdi)];
        }
        else
        {
            verdi = this.verdi;
        }
        return `${this.farge} ${this.verdi}`; }  // __str__

    __repr__() {
        return [this.farge, this.verdi];
    }
}


export class Spiller {
    public navn: string;
    public retning: himmelretning; 
    private hand: Kort[];

    constructor(navn: string, himmelretning: himmelretning) {
        this.navn = navn;
        this.retning = himmelretning;
        this.hand = [];
    }

    __repr__() {
        return [this.navn, this.retning];
    }

    // Los getters infernales
    get_hand() {
        return this.hand;
    }


    sett_hand(hand: Kort[]): void {
        this.hand = hand;
    }

}

export class Spilltilstand {
    private spillere: Spiller[];
    private kortstokk: Kort[];
    private status: boolean;

    constructor() {
        this.spillere = []
        this.kortstokk = this.generer_kortstokk();
        this.status = false;
    }

    generer_kortstokk(): Kort[] {
        let kortstokk: Kort[] = [];
        let farger: string[] = ["Clubs", "Diamonds", "Hearts", "Spades"];
        let valor: string[] = ["2", "3", "4", "5", "6", "7", "8", "9",
                               "10", "J","D", "K", "A"]
    
        for (let idx_farge of farger) 
        {  // Hvis lat, overkompliser.
            for (let idx_verdi of valor) 
            {
                kortstokk.push(new Kort(idx_farge, idx_verdi));
            }
        }
    
        // Stokk om. ..tror jeg. tbh husker jeg dette knapt
        for (let i = kortstokk.length - 1; i > 0; i--)
        {
            const base: number = Math.floor(Math.random() * (i + 1));
            [kortstokk[i], kortstokk[base]] = [kortstokk[base], kortstokk[i]];
        }
    
        return kortstokk;
    }

    dealer_deal(): void {  // Fordel kort
        for (let idx_spiller = 0; idx_spiller < this.spillere.length; idx_spiller++)
        {
            const stack = this.kortstokk.slice( ( 13* idx_spiller ), (13*idx_spiller + 1) );
            this.spillere[idx_spiller].sett_hand(stack);
        }
    }

    system_klar(): object {  // kontroll
        let reason: {[key: string]: string} = {}

        if (this.status === false) 
        {
            reason["status"]= "Ingen aktive spill"
            return reason;
        }

        if (this.spillere.length < 4)
        {
            reason["spillere"] = `Mangler ${4 - this.spillere.length} spillere`;
        }

        return reason;
    }
}