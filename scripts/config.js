const config = {
  base_url: "https://web.mcbes.viidev.com/api", // Base URL for the API.
  server_key: "66ef4e655011c07978f99d6ab81a3a0e", // Get your server key from MC Bedrock Ecosystem Server.
  modules: {
    vote: {
      enable: true, // Enable or disable the vote module.
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
    market: {
      enable: true, // Enable or disable the market module.
    },
  },
};

export default config;
