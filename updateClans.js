const axios = require("axios");
const fs = require("fs");
const dailyFile = "dailyDonations.json";
const championsFile = "champions.json";
const historyFile = "donationHistory.json";
let dailyData = {
  lastReset: Date.now(),
  players: {}
};

if(fs.existsSync(dailyFile)){
  dailyData = JSON.parse(
    fs.readFileSync(dailyFile,"utf8")
  );
}
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImJiNWQ0NDFiLWQ0ZjgtNDc1YS05ZDcwLTNmYmI1ZGJjNjZkZSIsImlhdCI6MTc4ODg4NjQ0OCwic3ViIjoiZGV2ZWxvcGVyL2ZmNGIzZGQ1LWM3MjUtNGMwYS1hYmZlLWQ1YjlkMjJjMjNhNSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjUuMTIxLjQxLjEzNyJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VrTqX9ogcq5hZAGqGQEtPvXrV1uPAwTo-X4vdqDSsX7CiwHZNiKKIy3Ve4TseCsQuvle4wc3tTNnteqiCifTnA";

const clanTags = [
"2LJ9P0GJL",
"2RV9R8PU2",
"2PUJVQ898",
"828CQLV",
"RYPR0RC8",
"P98QRCYL",
"2R8YR9R0Q",
"C09PYRPQ",
"PVCLGR82",
"PCP0CQJG",
"G0Q80CR9",
"YGUCR8GG",
"P92V2CQV",
"9PR2L8C",
"8P2QG08P",
"2LLJPCUJ2",
"CVPU820Y",
"29L20PJVU",
"YGR9P89",
"2JU0LJVUP",
"2L90VC9L0",
"2LUP9VJU9",
"P9LJC89Y",
"2VRJ02Y9",
"29LJ8PG8G",
"V2Y8YVLC",
"2YQV2UGU0",
"RYPU0G2C",
"20UYV9GCR",
"JVVRLG0",
"2GVLJYRUY",
"98UY220C",
"2RCPLPLCP",
"2QQL0YLGV",
"QJQY0GUR",
"2C0ULJRJV",
"2QPY28QLY",
"G2VCVGJL",
"VG0VUVYP",
"2GP8Y8229",
"2YL2L988Y",
"YJ9JCQVC",
"2Q2GLGVY2",
"YRPJ280Y",
"2QQYJCV0L",
"2QYPU299U",
"2YL8YPG8L",
"2CVPQRL9",
"2QGYYJPC2",
"2CQCVCVCV",
"2QRUOYPPC",
]

async function updateClans() {
  try {

    const clans = [];

    for (const tag of clanTags) {

      console.log("Loading clan:", tag);

      const response = await axios.get(
        `https://api.clashofclans.com/v1/clans/%23${tag}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );

      let totalDonations = 0;
      let membersData = [];

      for (const member of response.data.memberList) {

        const playerTag = member.tag.replace("#", "");

        try {

          const playerResponse = await axios.get(
            `https://api.clashofclans.com/v1/players/%23${playerTag}`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`
              }
            }
          );
          const currentDonations =
playerResponse.data.donations || 0;

const playerTagFull =
playerResponse.data.tag;
console.log("Saving player:", playerResponse.data.name);
if(!dailyData.players[playerTagFull]){

  dailyData.players[playerTagFull] = {
    name: playerResponse.data.name,
    startDonations: currentDonations,
    currentDonations: currentDonations,
    donations24h: 0
  };

}else{

  dailyData.players[playerTagFull].currentDonations =
  currentDonations;

  dailyData.players[playerTagFull].donations24h =
  currentDonations -
  dailyData.players[playerTagFull].startDonations;

}

          totalDonations += playerResponse.data.donations || 0;
          membersData.push({
  name: playerResponse.data.name,
  tag: playerResponse.data.tag,
  clanName: clan.name,
clanLogo: clan.logo,
  donations24h:
dailyData.players[playerTagFull]
?.donations24h || 0,
  
  role: member.role,
  townHall: playerResponse.data.townHallLevel,
  trophies: playerResponse.data.trophies,
  donations: playerResponse.data.donations || 0,
  expLevel: playerResponse.data.expLevel,

  heroes: playerResponse.data.heroes || [],
  troops: playerResponse.data.troops || [],
  spells: playerResponse.data.spells || [],
  heroEquipment: playerResponse.data.heroEquipment || []
});


          await new Promise(resolve => setTimeout(resolve, 300));

        } catch (err) {

          console.log("Player not found:", playerTag);

        }

      }

      const leader = response.data.memberList.find(
        member => member.role === "leader"
      );
      const clanDonations24h =
membersData.reduce(
  (sum, player) =>
  sum + (player.donations24h || 0),
  0
);

      clans.push({
        name: response.data.name,
        tag: response.data.tag,
        description: response.data.description,
        level: response.data.clanLevel,
        members: response.data.members,
        points: response.data.clanPoints,
        warWins: response.data.warWins,
        logo: response.data.badgeUrls.large,
        donations: totalDonations,
        leader: leader ? leader.name : "Unknown",
        membersData: membersData,
        donations24h: clanDonations24h,
        
      });

    }
    

    clans.sort((a, b) => b.donations - a.donations);

if(
  Date.now() - dailyData.lastReset
  >= 24 * 60 * 60 * 1000
){
let champion = null;

Object.values(
    dailyData.players
).forEach(player=>{

    if(
        !champion ||
        player.donations24h >
        champion.donations24h
    ){
        champion = player;
    }

});
let champions = [];

if(fs.existsSync(championsFile)){

    champions = JSON.parse(
        fs.readFileSync(
            championsFile,
            "utf8"
        )
    );

}

champions.unshift({

    date:
    new Date()
    .toISOString()
    .split("T")[0],

    name:
    champion?.name || "Unknown",

    donations:
    champion?.donations24h || 0

});

champions = champions.slice(0,30);

fs.writeFileSync(
    championsFile,
    JSON.stringify(
        champions,
        null,
        2
    )
);
  dailyData.lastReset = Date.now();

  Object.keys(dailyData.players)
  .forEach(tag=>{
dailyData.players[tag].startDonations =
dailyData.players[tag].currentDonations;
    dailyData.players[tag].donations24h = 0;

  });
  let allPlayers = [];

clans.forEach(clan => {

    clan.membersData.forEach(player => {

        allPlayers.push({

            name: player.name,
            tag: player.tag,

            townHall: player.townHall,

            trophies: player.trophies,

            donations: player.donations,

            clanName: clan.name,

            clanTag: clan.tag,

            clanLogo: clan.logo

        });

    });

});

allPlayers.sort(
(a,b) => b.trophies - a.trophies
);

fs.writeFileSync(
    "players.json",
    JSON.stringify(
        allPlayers,
        null,
        2
    )
);

}

fs.writeFileSync(
  "clans.json",
  JSON.stringify(clans, null, 2)
);

fs.writeFileSync(
  dailyFile,
  JSON.stringify(dailyData, null, 2)
);
let history = {};

if(fs.existsSync(historyFile)){
    history = JSON.parse(
        fs.readFileSync(historyFile,"utf8")
    );
}

const today =
new Date().toISOString().split("T")[0];

clans.forEach(clan=>{

    if(!history[clan.tag]){
        history[clan.tag] = [];
    }

    history[clan.tag].push({
        date: today,
        donations: clan.donations
    });

    history[clan.tag] =
    history[clan.tag].slice(-30);

});

fs.writeFileSync(
    historyFile,
    JSON.stringify(history,null,2)
);
console.log("clans.json updated successfully");

  } catch (error) {

    console.log("Status:", error.response?.status);
    console.log("URL:", error.config?.url);
    console.log(error.message);

  }
}

updateClans();