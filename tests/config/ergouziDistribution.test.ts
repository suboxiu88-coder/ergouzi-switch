import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { claudeDesktopProviderPresets } from "@/config/claudeDesktopProviderPresets";
import { providerPresets } from "@/config/claudeProviderPresets";
import { codexProviderPresets } from "@/config/codexProviderPresets";
import { geminiProviderPresets } from "@/config/geminiProviderPresets";
import {
  CLAUDE_DEFAULT_CONFIG,
  CLAUDE_DESKTOP_DEFAULT_CONFIG,
  CODEX_DEFAULT_CONFIG,
  GEMINI_DEFAULT_CONFIG,
  OPENCODE_DEFAULT_CONFIG,
  OPENCLAW_DEFAULT_CONFIG,
} from "@/components/providers/forms/helpers/opencodeFormUtils";
import { HERMES_DEFAULT_CONFIG } from "@/components/providers/forms/hooks/useHermesFormState";

const ERGOUZI_ROOT_URL = "https://ergouzi.life";
const ERGOUZI_V1_URL = "https://ergouzi.life/v1";

const parseJson = <T>(value: string): T => JSON.parse(value) as T;

describe("Ergouzi distribution defaults", () => {
  it("brands the npm package and Tauri product as Ergouzi Switch", () => {
    const pkg = JSON.parse(
      readFileSync(resolve("package.json"), "utf8"),
    ) as Record<string, unknown>;
    const tauriConfig = JSON.parse(
      readFileSync(resolve("src-tauri", "tauri.conf.json"), "utf8"),
    ) as Record<string, unknown>;

    expect(pkg.name).toBe("ergouzi-switch");
    expect(tauriConfig.productName).toBe("Ergouzi Switch");
    expect(tauriConfig.identifier).toBe("life.ergouzi.switch");
  });

  it("does not point update checks at the upstream cc-switch releases", () => {
    const tauriConfigText = readFileSync(
      resolve("src-tauri", "tauri.conf.json"),
      "utf8",
    );
    const miscCommandText = readFileSync(
      resolve("src-tauri", "src", "commands", "misc.rs"),
      "utf8",
    );
    const aboutSectionText = readFileSync(
      resolve("src", "components", "settings", "AboutSection.tsx"),
      "utf8",
    );
    const cargoManifestText = readFileSync(
      resolve("src-tauri", "Cargo.toml"),
      "utf8",
    );

    expect(tauriConfigText).not.toContain("farion1231/cc-switch");
    expect(miscCommandText).not.toContain("farion1231/cc-switch");
    expect(aboutSectionText).not.toContain("farion1231/cc-switch");
    expect(cargoManifestText).not.toContain("farion1231/cc-switch");
  });

  it("uses Ergouzi endpoints for official frontend presets", () => {
    const claudeOfficial = providerPresets.find(
      (preset) => preset.name === "Claude Official",
    );
    const claudeDesktopOfficial = claudeDesktopProviderPresets.find(
      (preset) => preset.name === "Claude Desktop Official",
    );
    const codexOfficial = codexProviderPresets.find(
      (preset) => preset.name === "OpenAI Official",
    );
    const geminiOfficial = geminiProviderPresets.find(
      (preset) => preset.name === "Google Official",
    );

    expect((claudeOfficial?.settingsConfig as any).env.ANTHROPIC_BASE_URL).toBe(
      ERGOUZI_ROOT_URL,
    );
    expect(claudeDesktopOfficial?.baseUrl).toBe(ERGOUZI_ROOT_URL);
    expect(codexOfficial?.config).toContain(
      `base_url = "${ERGOUZI_V1_URL}"`,
    );
    expect((geminiOfficial?.settingsConfig as any).env.GOOGLE_GEMINI_BASE_URL)
      .toBe(ERGOUZI_ROOT_URL);
  });

  it("uses Ergouzi endpoints for new provider form defaults", () => {
    expect(parseJson<any>(CLAUDE_DEFAULT_CONFIG).env.ANTHROPIC_BASE_URL).toBe(
      ERGOUZI_ROOT_URL,
    );
    expect(
      parseJson<any>(CLAUDE_DESKTOP_DEFAULT_CONFIG).env.ANTHROPIC_BASE_URL,
    ).toBe(ERGOUZI_ROOT_URL);
    expect(parseJson<any>(CODEX_DEFAULT_CONFIG).config).toContain(
      `base_url = "${ERGOUZI_V1_URL}"`,
    );
    expect(parseJson<any>(GEMINI_DEFAULT_CONFIG).env.GOOGLE_GEMINI_BASE_URL)
      .toBe(ERGOUZI_ROOT_URL);
    expect(parseJson<any>(OPENCODE_DEFAULT_CONFIG).options.baseURL).toBe(
      ERGOUZI_V1_URL,
    );
    expect(parseJson<any>(OPENCLAW_DEFAULT_CONFIG).baseUrl).toBe(
      ERGOUZI_V1_URL,
    );
    expect(parseJson<any>(HERMES_DEFAULT_CONFIG).base_url).toBe(
      ERGOUZI_V1_URL,
    );
  });
});
