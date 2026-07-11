console.log("clash.js loaded");

async function loadClans() {
    try {

        const response = await fetch("clans.json");
        const clans = await response.json();

        const table = document.getElementById("clansTable");
        const cards = document.getElementById("clanCards");

        table.innerHTML = "";
        cards.innerHTML = "";

        clans.forEach((clan, index) => {

            table.innerHTML += `
            <tr onclick="openClan('${clan.tag}')" class="clickable-row">
                <td>${index + 1}</td>
                <td>${clan.name}</td>
                <td>${clan.level}</td>
                <td>${clan.members}</td>
                <td>${clan.points}</td>
                <td>${clan.warWins}</td>
                <td>${clan.donations}</td>
                <td>
<button class="open-btn" onclick="openClan('${clan.tag}')">
    🚀 Open Clan
</button>
            </tr>
            `;
            let rankClass = "rank-other";
let rankHTML = `#${index + 1}`;

if(index === 0){
    rankClass = "rank-1";
    rankHTML = "🥇";
}
else if(index === 1){
    rankClass = "rank-2";
    rankHTML = "🥈";
}
else if(index === 2){
    rankClass = "rank-3";
    rankHTML = "🥉";
}

    cards.innerHTML += `

<div class="clan-card" onclick="openClan('${clan.tag}')">

    <div class="rank-badge ${rankClass}">
        ${rankHTML}
    </div>

    <img
    src="${clan.logo}"
    class="clan-logo"
    alt="${clan.name}">

    <div>
        <h2>${clan.name}</h2>
        <p>${clan.tag}</p>
    </div>

    <div class="stat">
        Level: ${clan.level}
    </div>

    <div class="stat">
        Members: ${clan.members}
    </div>

    <div class="stat">
        Points: ${clan.points}
    </div>

    <div class="stat">
        War Wins: ${clan.warWins}
    </div>

    <div class="stat">
        🎁Donations: ${clan.donations}
    </div>

    <div class="stat">
        Leader: ${clan.leader}
    </div>

</div>
`;
        });

    } catch (err) {
        console.error(err);
    }
}
function openClan(tag) {
    window.location.href =
        `clan.html?tag=${encodeURIComponent(tag)}`;
}
loadClans();

async function searchClan() {

    const tag = document
        .getElementById("search")
        .value
        .trim()
        .replace("#", "");

    if (!tag) return;

    const response = await fetch("clans.json");
    const clans = await response.json();

    const clan = clans.find(
        c => c.tag.replace("#", "") === tag
    );

    if (clan) {
        openClan(clan.tag);
    } else {
        alert("Clan not found");
    }
}

document
.getElementById("search")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        searchClan();
    }

});

setInterval(loadClans, 60000);

function goToTopClans() {
    document
        .getElementById("topClans")
        .scrollIntoView({
            behavior: "smooth"
        });
}
async function loadRealTimer() {

    const response =
    await fetch("dailyDonations.json");

    const data =
    await response.json();

    setInterval(() => {

        const passed =
        Date.now() - data.lastReset;

        let seconds =
        86400 - Math.floor(passed / 1000);

        if(seconds < 0){
            seconds = 0;
        }

        let h = Math.floor(seconds / 3600);
        let m = Math.floor((seconds % 3600) / 60);
        let s = seconds % 60;

        document.getElementById("countdown").innerText =
        `${String(h).padStart(2,"0")}:` +
        `${String(m).padStart(2,"0")}:` +
        `${String(s).padStart(2,"0")}`;

    },1000);

}

loadRealTimer();

async function loadDailyChampion() {

    const response =
    await fetch("dailyDonations.json");

    const data =
    await response.json();

    const players =
    Object.values(data.players);

    if(players.length === 0) return;

    players.sort(
        (a,b)=>
        b.donations24h - a.donations24h
    );

    const champion = players[0];

    document.getElementById(
        "dailyChampion"
    ).innerHTML = `

    👑 Daily Champion

    <br><br>

    ${champion.name}

    <br>

    🎁 ${champion.donations24h}

    Donations

    `;
}

loadDailyChampion();

async function loadGlobalTopDonators() {

    const response =
    await fetch("dailyDonations.json");

    const data =
    await response.json();

    const players =
    Object.values(data.players);

    players.sort(
        (a,b)=>
        b.donations24h - a.donations24h
    );

    const top5 =
    players.slice(0,5);

    let html = `
    🌍 Global Top Donators 24H
    <br><br>
    `;

    top5.forEach((player,index)=>{

        const medal =
            index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            index === 2 ? "🥉" :
            "🏅";

        html += `
        ${medal}
        ${player.name}
        - ${player.donations24h}
        <br>
        `;
    });

    document.getElementById(
        "globalTopDonators"
    ).innerHTML = html;
}

loadGlobalTopDonators();