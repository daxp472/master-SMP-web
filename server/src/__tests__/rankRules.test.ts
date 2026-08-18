import { describe, it, expect } from "vitest";
import { isDowngrade, getRankLevel, calculateUpgradePrice } from "../services/rankService.js";

describe("Rank Hierarchy & Downgrade Prevention Rules", () => {
  it("should return correct rank levels", () => {
    expect(getRankLevel("Member")).toBe(0);
    expect(getRankLevel("Knight")).toBe(1);
    expect(getRankLevel("Elite")).toBe(2);
    expect(getRankLevel("Pro")).toBe(3);
    expect(getRankLevel("Hero")).toBe(4);
    expect(getRankLevel("Legend")).toBe(5);
  });

  it("should correctly identify rank downgrades", () => {
    // Legend user trying to buy Elite -> Downgrade!
    expect(isDowngrade("Legend", "Elite")).toBe(true);
    // Legend user trying to buy Legend -> Same rank
    expect(isDowngrade("Legend", "Legend")).toBe(true);
    // Elite user buying Pro -> Upgrade (Not downgrade)
    expect(isDowngrade("Elite", "Pro")).toBe(false);
    // Member user buying Knight -> Upgrade
    expect(isDowngrade("Member", "Knight")).toBe(false);
  });

  it("should calculate rank upgrade price correctly", () => {
    // Knight ($1.49) -> Elite ($3.99) -> Difference = $2.50
    expect(calculateUpgradePrice(1.49, 3.99)).toBe(2.50);
    // Hero ($13.99) -> Legend ($19.99) -> Difference = $6.00
    expect(calculateUpgradePrice(13.99, 19.99)).toBe(6.00);
  });
});
