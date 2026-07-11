const axios = require("axios");
const fs = require("fs");
const dailyFile = "dailyDonations.json";

let dailyData = {
  lastReset: Date.now(),
  players: {}
};

if(fs.existsSync(dailyFile)){
  dailyData = JSON.parse(
    fs.readFileSync(dailyFile,"utf8")
  );
}
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdlYzI1MjIxLTRlNWYtNDBlOC1iYmU5LWE0ODc0ODMwZjk5NCIsImlhdCI6MTc4Mzc1OTQ0MCwic3ViIjoiZGV2ZWxvcGVyL2ZmNGIzZGQ1LWM3MjUtNGMwYS1hYmZlLWQ1YjlkMjJjMjNhNSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjUuMTIyLjIzNy4xNDciXSwidHlwZSI6ImNsaWVudCJ9XX0.JS-bh3v3O2CRXAX_mgiFHL3JKgDA4_CLeFVGqDPB7CgAxpKSFk2iR0O8dUtHn7r08mBLozAk8oGqOLQFQ9O65A";

const clanTags = [
"2PG9CY2UR",
  "2PUJVQ898",
  "G0Q80CR9",
  "2LJ9P0GJL",
  "L0UJG2J9",
  "828CQLV",
  "9V98P0UJ",
  "YGOYOYQQ",
  "2LLJPCUJ2",
  "VG0VUVYP",
  "2G2VVUJRP",
  "JVVRLG0",
  "2QQL0YLGV",
  "2VRJ02Y9",
  "RYPU0G2C",
  "29LJ8PG8G",
  "2YUV0JJJ9",
  "JRLPQQ0C",
  "P9LJC89Y",
  "V2Y8YVLC",
  "2LU02J8QU",
  "2GVLJYRUY",
  "8P2QG08P",
  "2JU0LJVUP",
  "9PR2L8C",
  "YGUCR8GG",
  "2RV9R8PU2",
  "29L20PJVU",
  "PCP0CQJG",
  "C09PYRPQ",
  "RYPR0RC8",
  "899VUPLL",
  "QJQY0GUR",
  "2G82CPJRY",
  "YJRCGJ9Y",
  "2QYPU299U",
  "CVPU820Y",
  "2YL2L988Y",
  "2CVPQRL9",
  "UL8R2Q",
  "YRPJ280Y",
  "20UYV9GCR",
  "98UY220C",
  "2PYP9R202",
  "Q09VJJR8",
  "2QGYYJPC2",
  "2RR82CLPR",
  "LJPLG08J",
  "2CQCVCVCV"
  
];

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

      clans.push({
        name: response.data.name,
        tag: response.data.tag,
        level: response.data.clanLevel,
        members: response.data.members,
        points: response.data.clanPoints,
        warWins: response.data.warWins,
        logo: response.data.badgeUrls.large,
        donations: totalDonations,
        leader: leader ? leader.name : "Unknown",
        membersData: membersData
      });

    }

    clans.sort((a, b) => b.donations - a.donations);

if(
  Date.now() - dailyData.lastReset
  >= 24 * 60 * 60 * 1000
){

  dailyData.lastReset = Date.now();

  Object.keys(dailyData.players)
  .forEach(tag=>{
dailyData.players[tag].startDonations =
dailyData.players[tag].currentDonations;
    dailyData.players[tag].donations24h = 0;

  });

}

fs.writeFileSync(
  "clans.json",
  JSON.stringify(clans, null, 2)
);

fs.writeFileSync(
  dailyFile,
  JSON.stringify(dailyData, null, 2)
);

console.log("clans.json updated successfully");

  } catch (error) {

    console.log("Status:", error.response?.status);
    console.log("URL:", error.config?.url);
    console.log(error.message);

  }
}

updateClans();