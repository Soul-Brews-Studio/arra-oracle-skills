import { describe, it, expect } from "bun:test";
import { profiles, features, resolveProfile, resolveProfileWithFeatures } from "../src/profiles";

const ALL_SKILLS = [
  'forward', 'retrospective', 'recap', 'standup', 'go', 'about-oracle',
  'trace', 'learn', 'talk-to', 'oracle-family-scan',
  'awaken', 'philosophy', 'who-are-you',
  'oracle-soul-sync-update',
  'schedule', 'project',
  'where-we-are', 'auto-retrospective',
];

describe("profiles", () => {
  it("minimal has 8 skills", () => {
    const result = resolveProfile("minimal", ALL_SKILLS);
    expect(result).toEqual(['forward', 'retrospective', 'recap', 'standup', 'go', 'about-oracle', 'oracle-family-scan', 'oracle-soul-sync-update']);
    expect(result?.length).toBe(8);
  });

  it("seed is alias for minimal", () => {
    const seed = resolveProfile("seed", ALL_SKILLS);
    const minimal = resolveProfile("minimal", ALL_SKILLS);
    expect(seed).toEqual(minimal);
  });

  it("standard has 12 skills", () => {
    const result = resolveProfile("standard", ALL_SKILLS);
    expect(result?.length).toBe(12);
    expect(result).toContain('forward');
    expect(result).toContain('retrospective');
    expect(result).toContain('recap');
    expect(result).toContain('trace');
    expect(result).toContain('learn');
    expect(result).toContain('talk-to');
    expect(result).toContain('awaken');
  });

  it("full returns null (no filtering)", () => {
    const result = resolveProfile("full", ALL_SKILLS);
    expect(result).toBeNull();
  });

  it("unknown profile returns null", () => {
    const result = resolveProfile("nonexistent", ALL_SKILLS);
    expect(result).toBeNull();
  });
});

describe("features", () => {
  it("soul has 4 skills", () => {
    expect(features.soul.length).toBe(4);
    expect(features.soul).toContain('awaken');
    expect(features.soul).toContain('philosophy');
    expect(features.soul).toContain('who-are-you');
    expect(features.soul).toContain('about-oracle');
  });

  it("network has 3 comms skills", () => {
    expect(features.network.length).toBe(3);
    expect(features.network).toContain('talk-to');
  });

  it("workspace has 2 skills", () => {
    expect(features.workspace.length).toBe(2);
    expect(features.workspace).toContain('schedule');
    expect(features.workspace).toContain('project');
  });
});

describe("resolveProfileWithFeatures", () => {
  it("minimal + soul = 11 skills", () => {
    const result = resolveProfileWithFeatures("minimal", ["soul"], ALL_SKILLS);
    // 8 minimal + 4 soul - 1 overlap (about-oracle) = 11
    expect(result.length).toBe(11);
    expect(result).toContain('forward');
    expect(result).toContain('awaken');
    expect(result).toContain('philosophy');
  });

  it("standard + network deduplicates", () => {
    const result = resolveProfileWithFeatures("standard", ["network"], ALL_SKILLS);
    // standard(12) + network(3) - 3 overlap = 12
    expect(result.length).toBe(12);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  it("minimal + workspace = 10 skills", () => {
    const result = resolveProfileWithFeatures("minimal", ["workspace"], ALL_SKILLS);
    // 8 + 2 = 10
    expect(result.length).toBe(10);
    expect(result).toContain('schedule');
    expect(result).toContain('project');
  });

  it("full + any feature = all skills", () => {
    const result = resolveProfileWithFeatures("full", ["soul", "network"], ALL_SKILLS);
    expect(result.length).toBe(ALL_SKILLS.length);
  });

  it("multiple features stack", () => {
    const result = resolveProfileWithFeatures("minimal", ["soul", "workspace"], ALL_SKILLS);
    // 8 + 4 + 2 - 1 (about-oracle overlap) = 13
    expect(result.length).toBe(13);
    expect(result).toContain('awaken');
    expect(result).toContain('schedule');
  });

  it("empty features = just profile", () => {
    const result = resolveProfileWithFeatures("minimal", [], ALL_SKILLS);
    expect(result.length).toBe(8);
  });
});
