import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  world,
} from "@minecraft/server";
import {
  http,
  HttpHeader,
  HttpRequest,
  HttpRequestMethod,
} from "@minecraft/server-net";
import config from "../config.js";
import { apiRequest } from "../index.js";
import { serverInfo } from "../index.js";

console.info(`[MCBES] OK: Success loaded Vote Module.`);

system.beforeEvents.startup.subscribe((event) => {
  event.customCommandRegistry.registerEnum("mcbes:vote", ["info", "claim"]);
  event.customCommandRegistry.registerCommand(
    {
      name: "mcbes:vote",
      description:
        "Vote this server with MC Bedrock Ecosystem Server integration.",
      permissionLevel: CommandPermissionLevel.Any,
      mandatoryParameters: [
        {
          type: CustomCommandParamType.Enum,
          name: "mcbes:vote",
        },
      ],
    },
    (origin, args) => {
      const player = origin.sourceEntity;
      switch (args) {
        case "info":
          player.sendMessage(
            `§6[MCBES] §7Please vote server §b${serverInfo.name} §7via §bhttps://mcbedrock-server.com/server/${serverInfo.slug}`
          );
          break;
        case "claim":
          const voteCheck = new HttpRequest(apiRequest.voteCheck)
            .setMethod(HttpRequestMethod.Get)
            .setHeaders([new HttpHeader("Content-Type", "application/json")])
            .setBody(
              JSON.stringify({
                player: player.name,
              })
            );
          http.request(voteCheck).then((res) => {
            const dataCheck = JSON.parse(res.body);

            if (dataCheck.error) {
              return player.sendMessage(
                `§6[MCBES] §cYou haven't voted, please do so to get the reward.`
              );
            }

            if (dataCheck.claimed) {
              player.sendMessage(
                `§6[MCBES] §cYou have already claimed your vote reward.`
              );
            } else {
              const voteClaim = new HttpRequest(apiRequest.voteClaim)
                .setMethod(HttpRequestMethod.Put)
                .setHeaders([
                  new HttpHeader("Content-Type", "application/json"),
                ])
                .setBody(
                  JSON.stringify({
                    player: player.name,
                  })
                );
              http.request(voteClaim).then((res) => {
                const dataClaim = JSON.parse(res.body);

                if (dataClaim.error) {
                  return player.sendMessage(`§6[MCBES] §c${dataClaim.error}`);
                } else {
                  world.sendMessage(
                    `§6[MCBES] §b${dataCheck.name} §ahas voted for this server.`
                  );
                  player.sendMessage(
                    `§6[MCBES] §aYou have successfully received your vote reward.`
                  );
                  config.modules.vote.reward.forEach((reward) => {
                    player.runCommand(reward);
                  });
                }
              });
            }
          });
          break;
        default:
          return {
            status: CustomCommandStatus.Failed,
          };
      }
    }
  );
});
