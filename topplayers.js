fetch("players.json")

.then(r => r.json())

.then(players => {

players.sort(
(a,b)=>
b.trophies-a.trophies
);

let html = `
<table class="compare-table">

<tr>
<th>#</th>
<th>Player</th>
<th>TH</th>
<th>Trophies</th>
<th>Clan</th>
</tr>
`;

players.forEach((p,index)=>{

html += `
<tr>

<td>${index+1}</td>

<td>${p.name}</td>

<td>${p.townHall}</td>

<td>${p.trophies}</td>

<td>${p.clanName}</td>

</tr>
`;

});

html += "</table>";

document.getElementById(
"playersTable"
).innerHTML = html;

});
fetch("players.json")

.then(r => r.json())

.then(players => {

players.sort(
(a,b) => b.trophies - a.trophies
);

const tbody =
document.getElementById(
"playersBody"
);

tbody.innerHTML = "";

players.forEach((player,index)=>{

tbody.innerHTML += `

<tr>

<td>#${index+1}</td>

<td>
<a href="player.html?tag=${encodeURIComponent(player.tag)}"
class="player-link">

${player.name}

</a>
</td>

<td>TH${player.townHall}</td>

<td>${player.trophies}</td>

<td>${player.clanName}</td>

</tr>

`;

});

if(players.length >= 3){

document.querySelector(
".first .player-name"
).innerText =
players[0].name;

document.querySelector(
".second .player-name"
).innerText =
players[1].name;

document.querySelector(
".third .player-name"
).innerText =
players[2].name;

}

});