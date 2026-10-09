const axios = require("axios");
const fs = require("fs");
const token = JSON.parse(fs.readFileSync("token.json", "utf8")).token;
const headers = { Authorization: `Bearer ${token}` };

async function test(name, url) {
  try {
    const r = await axios.get(url, { headers, timeout: 20000 });
    console.log(`[OK] ${name} -> ${r.status} | clan: ${r.data.name} | members: ${r.data.members}`);
  } catch (e) {
    console.log(`[FAIL] ${name} -> ${e.response?.status || e.code} ${e.response?.data?.reason || e.message}`);
  }
}

(async () => {
  await test("direct api.clashofclans.com", "https://api.clashofclans.com/v1/clans/%232LJ9P0GJL");
  await test("proxy cocproxy.royaleapi.dev", "https://cocproxy.royaleapi.dev/v1/clans/%232LJ9P0GJL");
})();