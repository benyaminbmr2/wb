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

            cards.innerHTML += `
            
            <div class="clan-card" onclick="openClan('${clan.tag}')">

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