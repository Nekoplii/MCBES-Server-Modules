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
import { apiRequest } from "../index.js";
import { serverInfo } from "../index.js";

console.info(`[MCBES] OK: Success loaded Market Module.`);

system.beforeEvents.startup.subscribe((event) => {
  event.customCommandRegistry.registerEnum("mcbes:market", ["info", "claim"]);
  event.customCommandRegistry.registerCommand(
    {
      name: "mcbes:market",
      description:
        "Market server with MC Bedrock Ecosystem Server integration.",
      permissionLevel: CommandPermissionLevel.Any,
      mandatoryParameters: [
        {
          type: CustomCommandParamType.Enum,
          name: "mcbes:market",
        },
      ],
      optionalParameters: [
        {
          type: CustomCommandParamType.Integer,
          name: "invoiceNumber",
        },
      ],
    },
    (origin, ...args) => {
      const player = origin.sourceEntity;
      switch (args[0]) {
        case "info":
          player.sendMessage(
            `§6[MCBES] §7See the various server §b${serverInfo.name} §7products we offer at §bhttps://mcbedrock-server.com/server/${serverInfo.slug}`
          );
          break;
        case "claim":
          const marketCheck = new HttpRequest(apiRequest.marketCheck)
            .setMethod(HttpRequestMethod.Get)
            .setHeaders([new HttpHeader("Content-Type", "application/json")])
            .setBody(
              JSON.stringify({
                player: player.name,
                invoice_number: args[1],
              })
            );
          http.request(marketCheck).then((res) => {
            const dataCheck = JSON.parse(res.body);
            if (dataCheck.error) {
              return player.sendMessage(
                `§6[MCBES] §cInvoice not found, or you haven't made a purchase.`
              );
            }

            if (dataCheck.invoice.status == "unpaid") {
              return player.sendMessage(
                `§6[MCBES] §cYour invoice is still unpaid, please pay before you claim it.`
              );
            } else if (dataCheck.invoice.status == "expired") {
              return player.sendMessage(
                `§6[MCBES] §cYour invoice has expired, please create a new invoice.`
              );
            }

            if (dataCheck.invoice.claimed) {
              player.sendMessage(
                `§6[MCBES] §cYou have already claimed Invoice Number: §b${dataCheck.invoice.number}.`
              );
            } else {
              const marketClaim = new HttpRequest(apiRequest.marketClaim)
                .setMethod(HttpRequestMethod.Put)
                .setHeaders([
                  new HttpHeader("Content-Type", "application/json"),
                ])
                .setBody(
                  JSON.stringify({
                    player: player.name,
                    invoice: args[1],
                  })
                );
              http.request(marketClaim).then((res) => {
                const dataClaim = JSON.parse(res.body);

                if (dataClaim.error) {
                  return player.sendMessage(`§6[MCBES] §c${dataClaim.error}.`);
                }

                dataCheck.product.data.forEach((item) => {
                  if (item.type === "score") {
                    player.runCommand(
                      `scoreboard players add @s ${item.key} ${item.value}`
                    );
                  } else if (item.type === "tag") {
                    player.runCommand(`tag @s add ${item.value}`);
                  }
                });
                player.sendMessage(
                  `§6[MCBES] §aYou have successfully received: §b${dataCheck.product.name}.`
                );
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
