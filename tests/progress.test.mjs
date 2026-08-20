import test from "node:test";import assert from "node:assert/strict";
function nextProgress(season,episode,episodeCount,nextSeason){if(episodeCount&&episode>=episodeCount&&nextSeason)return{season:nextSeason,episode:1};return{season,episode:episode+1}}
test("increments an episode",()=>assert.deepEqual(nextProgress(12,537),{season:12,episode:538}));
test("rolls into a known next season",()=>assert.deepEqual(nextProgress(1,12,12,2),{season:2,episode:1}));
