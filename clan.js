const tag = new URLSearchParams(window.location.search).get("tag");

fetch("clans.json")
.then(r => r.json())
.then(clans => {

    const cleanTag = (tag || "").replace("#", "");

    const clan = clans.find(c =>
        c.tag &&
        c.tag.replace("#", "") === cleanTag
    );

    if (!clan) {
        document.getElementById("clanInfo").innerHTML =
        "<h1 style='text-align:center;color:red'>Clan Not Found</h1>";
        return;
    }

    const members = clan.membersData || [];

    const topDonator =
        [...members].sort((a,b)=>
            (b.donations || 0) -
            (a.donations || 0)
        )[0];

    const topPlayer =
        [...members].sort((a,b)=>
            (b.trophies || 0) -
            (a.trophies || 0)
        )[0];

    const topDonator24h =
        [...members].sort((a,b)=>
            (b.donations24h || 0) -
            (a.donations24h || 0)
        )[0];

    const championTag =
        topDonator24h?.tag || "";

    const clanDonations24h =
        members.reduce(
            (sum,m)=>
            sum + (m.donations24h || 0),
            0
        );

    function getBadge(player){

        if((player.donations24h || 0) >= 500)
            return "👑 Donation King";

        if((player.donations || 0) >= 10000)
            return "🎁 Mega Donator";

        if((player.trophies || 0) >= 6000)
            return "🏆 Trophy Master";

        if((player.expLevel || 0) >= 250)
            return "⚔ Veteran";

        return "🔥 Active Player";
    }

    let membersHTML = "";
    let membersCardsHTML = "";

    members
    .sort((a,b)=>
        (b.donations || 0) -
        (a.donations || 0)
    )
    .forEach((member,index)=>{

        membersHTML += `
<tr class="${member.tag===championTag?'champion-row':''}">
<td>${index+1}</td>

<td>
<a class="player-link"
href="player.html?tag=${member.tag.replace('#','')}">
${member.name}
</a>
</td>

<td>${member.role || '-'}</td>
<td>${member.townHall || '-'}</td>
<td>${member.trophies || 0}</td>
<td>${member.donations || 0}</td>
<td>${member.expLevel || 0}</td>
<td>${getBadge(member)}</td>
<td>${member.donations24h || 0}</td>

</tr>
`;

        membersCardsHTML += `
<div class="member-card">

<h3>${member.name}</h3>

<p>🏰 TH ${member.townHall || '-'}</p>
<p>🏆 ${member.trophies || 0}</p>
<p>🎁 ${member.donations || 0}</p>
<p>⭐ ${member.expLevel || 0}</p>
<p>${getBadge(member)}</p>

</div>
`;
    });

    document.getElementById("clanInfo").innerHTML = `

<div class="card">

<img src="${clan.logo}" class="big-logo">

<h1>${clan.name}</h1>

<div class="clan-description">
${clan.description || "No Description"}
</div>

<div class="info-grid">

<div class="info-card">
<span>TAG</span>
<h3>${clan.tag}</h3>
</div>

<div class="info-card">
<span>LEADER</span>
<h3>${clan.leader || "-"}</h3>
</div>

<div class="info-card">
<span>LEVEL</span>
<h3>${clan.level || 0}</h3>
</div>

<div class="info-card">
<span>MEMBERS</span>
<h3>${clan.members || 0}</h3>
</div>

<div class="info-card">
<span>POINTS</span>
<h3>${clan.points || 0}</h3>
</div>

<div class="info-card">
<span>WAR WINS</span>
<h3>${clan.warWins || 0}</h3>
</div>

<div class="info-card">
<span>DONATIONS</span>
<h3>${clan.donations || 0}</h3>
</div>

</div>

<div class="clan-buttons">

<a
href="https://link.clashofclans.com/en?action=OpenClanProfile&tag=${clan.tag.replace('#','%23')}"
target="_blank"
class="clan-game-btn">
🎮 OPEN CLAN
</a>

<button
class="clan-copy-btn"
onclick="copyTag('${clan.tag}')">
📋 COPY TAG
</button>

</div>

<h2>🏆 Top Donator</h2>
<p>${topDonator?.name || "-"}</p>

<h2>🏆 Top Trophy Player</h2>
<p>${topPlayer?.name || "-"}</p>

<div class="daily-champion-card">

<h2>👑 Daily Champion 👑</h2>

<h1>
${topDonator24h?.name || "No Champion"}
</h1>

<h3>
${topDonator24h?.donations24h || 0}
Donations
</h3>

</div>

<div class="clan-stats-box">

<div class="stat-card">
<div class="stat-title">TODAY</div>
<div class="stat-value">
${clanDonations24h}
</div>
</div>

<div class="stat-card">
<div class="stat-title">TOTAL</div>
<div class="stat-value">
${clan.donations || 0}
</div>
</div>

</div>

<h2>📋 Members</h2>

<table>

<thead>

<tr>
<th>Rank</th>
<th>Name</th>
<th>Role</th>
<th>TH</th>
<th>Trophies</th>
<th>Donations</th>
<th>Level</th>
<th>Badge</th>
<th>Today</th>
</tr>

</thead>

<tbody>
${membersHTML}
</tbody>

</table>

${membersCardsHTML}

</div>

<canvas id="clanChart"></canvas>
`;

    const chartCanvas =
    document.getElementById("clanChart");

    if(chartCanvas){

        new Chart(chartCanvas, {

            type:"bar",

            data:{
                labels:[
                    "Daily",
                    "Total",
                    "Points",
                    "War Wins",
                    "Members"
                ],

                datasets:[{
                    label:clan.name,
                    data:[
                        clanDonations24h,
                        clan.donations || 0,
                        clan.points || 0,
                        clan.warWins || 0,
                        clan.members || 0
                    ]
                }]
            }
        });
    }

});

function copyTag(tag){

    navigator.clipboard.writeText(tag);

    alert("Copied: " + tag);

}