import { world } from "@minecraft/server";
import {
  http,
  HttpHeader,
  HttpRequest,
  HttpRequestMethod,
} from "@minecraft/server-net";
import config from "./config.js";

export const apiRequest = {
  serverInfo: `${config.base_url}/server/${config.server_key}/info`,
  playerJoin: `${config.base_url}/server/${config.server_key}/player/join`,
  voteCheck: `${config.base_url}/server/${config.server_key}/player/vote/check`,
  voteClaim: `${config.base_url}/server/${config.server_key}/player/vote/claim`,
  marketCheck: `${config.base_url}/server/${config.server_key}/player/market/check`,
  marketClaim: `${config.base_url}/server/${config.server_key}/player/market/claim`,
};

export let serverInfo;

http
  .get(apiRequest.serverInfo)
  .then(async (response) => {
    serverInfo = JSON.parse(response.body);
    console.log(`[MCBES] OK: Success getting server information.`);

    if (await serverInfo.services.includes("vote")) {
      import("./modules/vote.js");
    }

    if (await serverInfo.services.includes("market")) {
      import("./modules/market.js");
    }
  })
  .catch(() => {
    console.warn(`[MCBES] Bad Request: error getting server information.`);
  });

world.afterEvents.playerJoin.subscribe((event) => {
  const playerJoin = new HttpRequest(apiRequest.playerJoin)
    .setMethod(HttpRequestMethod.Post)
    .setHeaders([new HttpHeader("Content-Type", "application/json")])
    .setBody(
      JSON.stringify({
        player: event.playerName,
      })
    );
  http.request(playerJoin).then((response) => {
    response.body;
  });
});
