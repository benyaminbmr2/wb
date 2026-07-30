let clans = [];

fetch("clans.json")
.then(r => r.json())
.then(data => {

    clans = data;

    const clan1 =
    document.getElementById("clan1");

    const clan2 =
    document.getElementById("clan2");

 data.forEach(clan => {

    clan1.innerHTML += `
    <option value="${clan.tag}">
        👑 ${clan.name} | Lv.${clan.level}
    </option>
    `;

    clan2.innerHTML += `
    <option value="${clan.tag}">
        👑 ${clan.name} | Lv.${clan.level}
    </option>
    `;
});

});

function compareClans(){

    const tag1 =
    document.getElementById("clan1").value;

    const tag2 =
    document.getElementById("clan2").value;

    const clan1 =
    clans.find(c => c.tag === tag1);

    const clan2 =
    clans.find(c => c.tag === tag2);
    const result =
document.getElementById("compareResult");

result.innerHTML = `

<div class="vs-header">

    <div class="clan-side">
        <img src="${clan1.logo}">
        <h2>${clan1.name}</h2>
    </div>

    <div class="vs-text">
        ⚔️ VS ⚔️
    </div>

    <div class="clan-side">
        <img src="${clan2.logo}">
        <h2>${clan2.name}</h2>
    </div>

</div>

<table class="compare-table">

<tr>
<th>Stat</th>
<th>${clan1.name}</th>
<th>${clan2.name}</th>
</tr>

<tr>
<td>Members</td>
<td>${clan1.members}</td>
<td>${clan2.members}</td>
</tr>

<tr>
<td>Points</td>
<td>${clan1.points}</td>
<td>${clan2.points}</td>
</tr>

<tr>
<td>War Wins</td>
<td>${clan1.warWins}</td>
<td>${clan2.warWins}</td>
</tr>

<tr>
<td>Donations</td>
<td>${clan1.donations}</td>
<td>${clan2.donations}</td>
</tr>

</table>

<div class="winner-box">
🏆 Winner:
${
(clan1.points+clan1.warWins+clan1.donations)
>
(clan2.points+clan2.warWins+clan2.donations)
? clan1.name
: clan2.name
}
</div>

<div class="chart-container">
    <canvas id="compareChart"></canvas>
</div>

`;
const ctx = document.getElementById("compareChart");

new Chart(ctx,{

    type:"bar",

    data:{

        labels:[
            "Members",
            "Points",
            "War Wins",
            "Donations"
        ],

        datasets:[

            {
                label:clan1.name,

                data:[
                    clan1.members,
                    clan1.points,
                    clan1.warWins,
                    clan1.donations
                ]
            },

            {
                label:clan2.name,

                data:[
                    clan2.members,
                    clan2.points,
                    clan2.warWins,
                    clan2.donations
                ]
            }

        ]

    },

    options:{

        responsive:true,

        plugins:{
            legend:{
                labels:{
                    color:"white"
                }
            }
        },

        scales:{

            x:{
                ticks:{
                    color:"white"
                }
            },

            y:{
                ticks:{
                    color:"white"
                }
            }

        }

    }

});

}