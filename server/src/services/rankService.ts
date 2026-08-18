export const RANK_HIERARCHY: Record<string, number> = {
  Member: 0,
  Knight: 1,
  Elite: 2,
  Pro: 3,
  Hero: 4,
  Legend: 5,
};

export const PUBLIC_RANKS = ["Member", "Knight", "Elite", "Pro", "Hero", "Legend"] as const;

export function getRankLevel(rankName: string): number {
  const normalized = rankName.trim();
  const matchedKey = Object.keys(RANK_HIERARCHY).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );
  return matchedKey !== undefined ? RANK_HIERARCHY[matchedKey] : 0;
}

export function isDowngrade(currentRank: string, targetRank: string): boolean {
  const currentLevel = getRankLevel(currentRank);
  const targetLevel = getRankLevel(targetRank);
  return targetLevel <= currentLevel;
}

export function calculateUpgradePrice(
  currentRankPrice: number,
  targetRankPrice: number
): number {
  const diff = targetRankPrice - currentRankPrice;
  return Math.max(0.99, Number(diff.toFixed(2)));
}
