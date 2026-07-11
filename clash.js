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
    <div class="achievement">
    ${getClanAchievement(clan)}
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
function getClanAchievement(clan){

    if(clan.donations >= 50000){
        return "👑 Donation Empire";
    }

    if(clan.warWins >= 1000){
        return "⚔️ War Machine";
    }

    if(clan.points >= 50000){
        return "🏆 Trophy Legends";
    }

    if(clan.level >= 25){
        return "💎 Elite Clan";
    }

    return "🔥 Rising Clan";
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

async function loadTopClansToday(){

    const response =
    await fetch("clans.json");

    const clans =
    await response.json();

    clans.sort(
        (a,b)=>
        (b.donations24h||0) -
        (a.donations24h||0)
    );

    const top10 =
    clans.slice(0,10);

    let html = `
    <div class="top-clans-today">

        <h2>
            ⚡ Top Clans Today
        </h2>
    `;

    top10.forEach((clan,index)=>{

        const medal =
            index===0?"🥇":
            index===1?"🥈":
            index===2?"🥉":"🏅";

        html += `
        <div class="clan-rank">

            <span>
                ${medal}
                ${clan.name}
            </span>

            <span>
                +${clan.donations24h || 0}
            </span>

        </div>
        `;
    });

    html += "</div>";

    document.getElementById(
        "globalTopClans"
    ).innerHTML = html;
}

loadTopClansToday();

async function loadDonationChart(){

    const response =
    await fetch("clans.json");

    const clans =
    await response.json();

    clans.sort(
        (a,b)=>
        (b.donations24h||0) -
        (a.donations24h||0)
    );

    const top5 =
    clans.slice(0,5);

    const labels =
    top5.map(c=>c.name);

    const values =
    top5.map(c=>c.donations24h||0);

    new Chart(

        document.getElementById(
            "donationChart"
        ),

        {
            type:"bar",

            data:{
                labels:labels,

                datasets:[{
                    label:"Today Donations",

                    data:values
                }]
            },

            options:{
                responsive:true
            }
        }
    );
}

loadDonationChart();

async function loadHallOfFame(){

    const clansResponse =
    await fetch("clans.json");

    const clans =
    await clansResponse.json();

    const dailyResponse =
    await fetch("dailyDonations.json");

    const dailyData =
    await dailyResponse.json();

    const players =
    Object.values(dailyData.players);

    players.sort(
        (a,b)=>
        b.donations24h - a.donations24h
    );

    const bestPlayer =
    players[0];

    const bestClan =
    [...clans]
    .sort(
        (a,b)=>
        (b.donations24h||0) -
        (a.donations24h||0)
    )[0];

    const strongestClan =
    [...clans]
    .sort(
        (a,b)=>
        b.points - a.points
    )[0];

    document.getElementById(
        "hallOfFame"
    ).innerHTML = `

    <div class="hall-of-fame">

        <div class="fame-card">

            <h3>👑 Best Donator</h3>

            <p>
                ${bestPlayer?.name || "Unknown"}
            </p>

        </div>

        <div class="fame-card">

            <h3>🏆 Best Clan Today</h3>

            <p>
                ${bestClan?.name || "Unknown"}
            </p>

        </div>

        <div class="fame-card">

            <h3>⚔️ Strongest Clan</h3>

            <p>
                ${strongestClan?.name || "Unknown"}
            </p>

        </div>

    </div>
    `;
}

loadHallOfFame();

async function loadActivityFeed(){

    const response =
    await fetch("clans.json");

    const clans =
    await response.json();

    let activities = [];

    clans.forEach(clan=>{

        if((clan.donations24h || 0) > 0){

            activities.push(
                `🔥 ${clan.name} donated ${clan.donations24h} troops today`
            );

        }

        if(clan.points > 50000){

            activities.push(
                `🏆 ${clan.name} is among elite clans`
            );

        }

    });

    activities = activities.slice(0,10);

    let html = `
    <div class="activity-feed">

        <h2>🚀 Live Activity Feed</h2>
    `;

    activities.forEach(item=>{

        html += `
        <div class="feed-item">

            ${item}

        </div>
        `;
    });

    html += "</div>";

    document.getElementById(
        "activityFeed"
    ).innerHTML = html;
}

loadActivityFeed();