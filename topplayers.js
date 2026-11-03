
document.addEventListener("DOMContentLoaded", loadTopPlayers);

async function loadTopPlayers() {

    const tbody = document.getElementById("playersBody");

    try {

        const response = await fetch("players.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Players file not found");
        }

        const players = await response.json();

        if (!Array.isArray(players)) {
            throw new Error("Invalid players data");
        }

        const sortedPlayers = players
            .filter(p => p && p.name && Number.isFinite(Number(p.trophies)))
            .sort((a, b) => Number(b.trophies) - Number(a.trophies));

        tbody.innerHTML = "";

        sortedPlayers.forEach((player, index) => {

            const rank = index + 1;

            const row = document.createElement("tr");

            // RANK

            const rankCell = document.createElement("td");

            const rankBadge = document.createElement("span");

            rankBadge.className = "rank-badge";

            if (rank <= 3) {
                rankBadge.classList.add(`rank-${rank}`);
            }

            rankBadge.textContent =
                rank === 1 ? "🥇" :
                rank === 2 ? "🥈" :
                rank === 3 ? "🥉" :
                `#${rank}`;

            rankCell.appendChild(rankBadge);

            // PLAYER

            const nameCell = document.createElement("td");

            const playerLink = document.createElement("a");

            playerLink.className = "player-link";

            playerLink.textContent = player.name;

            if (player.tag) {

                playerLink.href =
                    `player.html?tag=${encodeURIComponent(player.tag)}`;

            } else {

                playerLink.textContent += " (No Tag)";
                playerLink.removeAttribute("href");

            }

            nameCell.appendChild(playerLink);

            // TOWN HALL

            const thCell = document.createElement("td");

            if (player.townHall) {

                const thImage = document.createElement("img");

                thImage.className = "townhall-icon";

                thImage.src =
                    `images/townhall/th${player.townHall}.png`;

                thImage.alt = `Town Hall ${player.townHall}`;

                thImage.title = `Town Hall ${player.townHall}`;

                thImage.onerror = function() {
                    this.replaceWith(
                        document.createTextNode(`TH${player.townHall}`)
                    );
                };

                thCell.appendChild(thImage);

            } else {

                thCell.textContent = "-";

            }

            // TROPHIES

            const trophyCell = document.createElement("td");

            const trophy = document.createElement("span");

            trophy.className = "trophy-value";

            trophy.textContent =
                `🏆 ${Number(player.trophies).toLocaleString()}`;

            trophyCell.appendChild(trophy);

            // CLAN

            const clanCell = document.createElement("td");

            const clan = document.createElement("span");

            clan.className = "clan-badge";

            clan.textContent = player.clanName || "No Clan";

            clanCell.appendChild(clan);

            row.append(
                rankCell,
                nameCell,
                thCell,
                trophyCell,
                clanCell
            );

            tbody.appendChild(row);

        });

        updateTopThree(sortedPlayers);

        if (sortedPlayers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">No Players Found</td>
                </tr>
            `;
        }

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load players.
                </td>
            </tr>
        `;

    }

}

function updateTopThree(players) {

    const cards = [
        ".first .player-name",
        ".second .player-name",
        ".third .player-name"
    ];

    cards.forEach((selector, index) => {

        const element = document.querySelector(selector);

        if (element) {

            element.textContent =
                players[index]?.name || "No Player";

        }

    });

}

