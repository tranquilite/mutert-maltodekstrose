// endless shitfuckery
// "Brought to you by the australien government"
// At denne fila måtte hete jsx er bare stress med .gitignore. Alt gjørt vondt.
function start_spill() {
    spillarr = [];
    for (i = 1; i <= 4; i++) {  // smerte
        spillarr.push(document.getElementById("spiller"+i.toString()).value);
    }
const spiller_post = { "spillere": spillarr };

fetch("/bridge/start", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(spiller_post) } )
        .then(response => { return response.json(); })
        .then(data => {
            //document.getElementById("start_spill_c").innerHTML = 
            //    `<p></p><button id="btn_ss_call" onclick="document.getElementById("start_spill_c").textContent = JSON.stringify(data, null, 2);">Vis fullt rådata-svar</button>`;
            //document.getElementById("btn_ss_call").addEventListener("click", () => { document.getElementById("start_spill_c").textContent = JSON.stringify(data, null, 2); });
            populer_handtabell(data);
            populer_spiller_bid(data);
        });
}

function populer_spiller_bid(spillebord) {
    const player_turn = document.getElementById("p_action_bud_tag").textContent = "Spiller Øst";
    const player_turn_field1 = document.getElementById("bid_player");
    for (spiller in spillebord) {
        spiller = spillebord[spiller]; // fortsatt en stygg hack
        const sp_formoption = document.createElement("option");
        sp_formoption.value = spiller.id;
        sp_formoption.textContent = spiller.navn;
        player_turn_field1.appendChild(sp_formoption);

    }
}

function populer_handtabell(spillebord) {
    const spha_t = document.getElementById("spiller_hand");
    const tbody = spha_t.getElementsByTagName('tbody')[0];

    // I declare exterminatus
    while (tbody.firstChild) { tbody.removeChild(tbody.firstChild); }

    for (spiller in spillebord) {
        spiller = spillebord[spiller];  // ugly hack

        let neste_rad = tbody.insertRow();
        let spillernavn = neste_rad.insertCell(0);
        let spillerid = neste_rad.insertCell(1);
        let spillerhand = neste_rad.insertCell(2);

        spillernavn.textContent = spiller.navn;
        spillerid.textContent = spiller.id;
        spillerhand.textContent = JSON.stringify(spiller.hand, null, 2);
        spillerhand.classList.add("spiller-hand");

        document.getElementById("spiller_hand").querySelector("tbody").style.display = "table-row-group";
    }
}

function gi_bud() {
    let bid_rank = document.getElementById("bid_rank").value;
    let bid_suit = document.getElementById("bid_suit").value;
    let player_turn = document.getElementById("p_action_bud_tag").textContent = "";
    let bid_post = {"rank": bid_rank, "suit": bid_suit};

    fetch("/bridge/bid", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bid_post) } )
        .then(response => { return response.json(); })
        .then(data => {
            if ( data == {"error": "Bid already given in round"} ) { console.log(data); }})
}

// Oppstartsgreier.. Mer smerte :3
document.addEventListener("DOMContentLoaded", function() {
    const thead = document.getElementById("spiller_hand").querySelector("thead");
    const tbody = document.getElementById("spiller_hand").querySelector("tbody");

    thead.addEventListener("click", function() {
        tbody.style.display = (tbody.style.display === "none" || tbody.style.display === "") ? "table-row-group" : "none";
    });
});