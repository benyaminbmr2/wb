const axios = require("axios");
const fs = require("fs");

const TOKEN = "process.env.CLASH_API_TOKEN;";

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

          totalDonations += playerResponse.data.donations || 0;
          membersData.push({
  name: playerResponse.data.name,
  tag: playerResponse.data.tag,
  role: member.role,
  townHall: playerResponse.data.townHallLevel,
  trophies: playerResponse.data.trophies,
  donations: playerResponse.data.donations || 0,
  expLevel: playerResponse.data.expLevel
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

    fs.writeFileSync(
      "clans.json",
      JSON.stringify(clans, null, 2)
    );

    console.log("clans.json updated successfully");

  } catch (error) {

    console.log("Status:", error.response?.status);
    console.log("URL:", error.config?.url);
    console.log(error.message);

  }
}

updateClans();