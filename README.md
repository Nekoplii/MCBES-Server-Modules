# Minecraft Bedrock Ecosystem Server
Connects Bedrock's Minecraft game servers with the web, allowing players to manage their servers more easily. Key features include a server information page, a voting system to increase popularity, and a marketplace where players can purchase products offered by server owners.

## Installation
1. Register your server to MCBES first and don't forget to enable service modules you want, e.g: Vote and Market.

2. Download this addons and upload to your Minecraft Server in folder ``worlds/Bedrock level/behavior_packs`` or your Minecraft World sepecific folder.

3. After that, open file ``world_behavior_pack_history.json`` in folder ``worlds/Bedrock level`` or if not exist you can create first and add this code.
```json
{
  "packs": [
    {
      "can_be_redownloaded": false,
      "name": "[MCBES] Server Module",
      "uuid": "5c6f4e54-2951-4bb5-a072-c0de5adeb20f",
      "version": [1, 0, 0]
    }
  ]
}
```

4. Now, you need open file ``world_behavior_packs.json`` in folder ``worlds/Bedrock level`` or if not exist you can create first and add this code.
```json
[
  {
    "pack_id": "5c6f4e54-2951-4bb5-a072-c0de5adeb20f",
    "version": [1, 0, 0]
  }
]
```

5. Then, open file ``permissions.json`` in folder ``config/default`` and make sure this module exists, if not please copy and paste it.
```json
{
  "allowed_modules": [
    "@minecraft/server",
    "@minecraft/server-net",
  ]
}
```

6. Restart your server and Done!

## Other Tips
1. Edit file ``config.js`` in this addons to configure the modules.
```js
const config = {
  base_url: "https://mcbes.test/api", // Base URL for the API.
  server_key: "", // Paste your server key from MC Bedrock Ecosystem Server.
  modules: {
    vote: {
      reward: [
        // Reward if player successfully to vote your server.
        "give @s emerald 2",
        "give @s diamond 4",
        "give @s iron_ingot 8",
        "give @s bread 16",
        "scoreboard players add @s money 1000",
        // Add other commands here...
      ],
    },
  },
};
```
