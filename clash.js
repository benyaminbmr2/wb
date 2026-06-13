console.log("clash.js loaded");

async function loadClans() {
    try {

        const response = await fetch("http://localhost:3000/clans");
        const clans = await response.json();

        const table = document.getElementById("clansTable");
        const cards = document.getElementById("clanCards");

        table.innerHTML = "";
        cards.innerHTML = "";

        clans.forEach((clan, index) => {

            table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${clan.name}</td>
                <td>${clan.level}</td>
                <td>${clan.members}</td>
                <td>${clan.points}</td>
                <td>${clan.warWins}</td>
                <td>${clan.donations}</td>
                
            </tr>
            `;

            cards.innerHTML += `
            <div class="clan-card">

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
loadClans();

setInterval(loadClans, 30000);

loadClans();