import { describe, it, expect } from "vitest";
import { sanitizeUsername, formatCommandTemplate } from "../services/fulfillmentService.js";

describe("Minecraft Username & Command Sanitization", () => {
  it("should accept valid Minecraft usernames (3-16 chars)", () => {
    expect(sanitizeUsername("mastermen1")).toBe("mastermen1");
    expect(sanitizeUsername("Steve_123")).toBe("Steve_123");
    expect(sanitizeUsername("   notch   ")).toBe("notch");
  });

  it("should strip spaces and dangerous shell characters", () => {
    expect(sanitizeUsername("user; rm -rf /")).toBe("userrmrf");
    expect(sanitizeUsername("player$(whoami)")).toBe("playerwhoami");
  });

  it("should throw error on invalid short/long usernames after sanitization", () => {
    expect(() => sanitizeUsername("a!")).toThrow("Invalid Minecraft username format");
    expect(() => sanitizeUsername("verylongusernameover16characters")).toThrow("Invalid Minecraft username format");
  });

  it("should replace command templates safely", () => {
    const template = "lp user {username} parent set {group}";
    const formatted = formatCommandTemplate(template, {
      username: "mastermen1",
      group: "legend",
    });
    expect(formatted).toBe("lp user mastermen1 parent set legend");
  });
});
