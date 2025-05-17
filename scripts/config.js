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

export default config;
