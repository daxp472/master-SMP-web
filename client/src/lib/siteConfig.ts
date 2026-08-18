// Single source of truth for public brand/site configuration.
// Change server IP, name, and links here once — they propagate everywhere.
export const siteConfig = {
  name: "Master SMP",
  shortName: "Master SMP",
  tagline: "Your SMP. Your Story.",
  websiteUrl: "https://master-smp.netlify.app",
  serverIp: "aurax.play.hosting",
  serverPort: 24295,
  bedrockPort: 24295,
  isCrossplay: true,
  maxPlayers: 100,
  discordUrl: "https://discord.gg/mastersmp",
  supportEmail: "support@master-smp.net",
  currency: "USD",
  currencySymbol: "$",
  notAffiliated: "Master SMP is not affiliated with Mojang or Microsoft.",
  // Public ranks in display order. Member is default/free and never sold.
  ranks: [
    "Member",
    "Knight",
    "Elite",
    "Pro",
    "Hero",
    "Legend",
  ] as const,
  crateKeyCount: 4,
};

export type RankName = (typeof siteConfig.ranks)[number];
