import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
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
import { ERGOUZI_CODEX_CONFIG } from "@/config/ergouziDefaults";
import { HERMES_DEFAULT_CONFIG } from "@/components/providers/forms/hooks/useHermesFormState";

const ERGOUZI_ROOT_URL = "https://ergouzi.life";
const ERGOUZI_V1_URL = "https://ergouzi.life/v1";
const LEGACY_BRAND = ["CC", " Switch"].join("");
const LEGACY_SLUG = ["cc", "switch"].join("-");
const LEGACY_DEEPLINK_SCHEME = ["cc", "switch"].join("");
const LEGACY_UPSTREAM_REPO = ["farion1231", "/", LEGACY_SLUG].join("");

const parseJson = <T>(value: string): T => JSON.parse(value) as T;
const readText = (...segments: string[]) =>
  readFileSync(resolve(...segments), "utf8");
const sha256 = (...segments: string[]) =>
  createHash("sha256")
    .update(readFileSync(resolve(...segments)))
    .digest("hex");

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

  it("does not point update checks at the upstream original releases", () => {
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
    const trayText = readFileSync(resolve("src-tauri", "src", "tray.rs"), "utf8");
    const cargoManifestText = readFileSync(
      resolve("src-tauri", "Cargo.toml"),
      "utf8",
    );

    expect(tauriConfigText).not.toContain(LEGACY_UPSTREAM_REPO);
    expect(miscCommandText).not.toContain(LEGACY_UPSTREAM_REPO);
    expect(aboutSectionText).not.toContain(LEGACY_UPSTREAM_REPO);
    expect(trayText).not.toContain(`${LEGACY_DEEPLINK_SCHEME}.io`);
    expect(cargoManifestText).not.toContain(LEGACY_UPSTREAM_REPO);
  });

  it("uses Ergouzi as the routable default frontend provider", () => {
    const claudeDefault = providerPresets[0];
    const claudeDesktopDefault = claudeDesktopProviderPresets[0];
    const codexDefault = codexProviderPresets[0];
    const geminiDefault = geminiProviderPresets[0];

    expect(claudeDefault).toMatchObject({
      name: "Ergouzi",
      websiteUrl: "https://ergouzi.life/",
      category: "aggregator",
    });
    expect(claudeDefault.isOfficial).toBeUndefined();
    expect(claudeDesktopDefault).toMatchObject({
      name: "Ergouzi",
      websiteUrl: "https://ergouzi.life/",
      category: "aggregator",
    });
    expect(codexDefault).toMatchObject({
      name: "Ergouzi",
      websiteUrl: "https://ergouzi.life/",
      category: "aggregator",
    });
    expect(codexDefault.isOfficial).toBeUndefined();
    expect(geminiDefault).toMatchObject({
      name: "Ergouzi",
      websiteUrl: "https://ergouzi.life/",
      category: "aggregator",
    });

    expect((claudeDefault.settingsConfig as any).env.ANTHROPIC_BASE_URL).toBe(
      ERGOUZI_ROOT_URL,
    );
    expect(claudeDesktopDefault.baseUrl).toBe(ERGOUZI_ROOT_URL);
    expect(codexDefault.config).toContain(`base_url = "${ERGOUZI_V1_URL}"`);
    expect(
      (geminiDefault.settingsConfig as any).env.GOOGLE_GEMINI_BASE_URL,
    ).toBe(ERGOUZI_ROOT_URL);
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
    expect(
      parseJson<any>(GEMINI_DEFAULT_CONFIG).env.GOOGLE_GEMINI_BASE_URL,
    ).toBe(ERGOUZI_ROOT_URL);
    expect(parseJson<any>(OPENCODE_DEFAULT_CONFIG).options.baseURL).toBe(
      ERGOUZI_V1_URL,
    );
    expect(parseJson<any>(OPENCLAW_DEFAULT_CONFIG).baseUrl).toBe(
      ERGOUZI_V1_URL,
    );
    expect(parseJson<any>(HERMES_DEFAULT_CONFIG).base_url).toBe(ERGOUZI_V1_URL);
  });

  it("keeps Ergouzi Codex defaults free of local machine preferences", () => {
    const codexDefault = codexProviderPresets[0];
    const configTexts = [
      ERGOUZI_CODEX_CONFIG,
      parseJson<any>(CODEX_DEFAULT_CONFIG).config,
      codexDefault.config,
    ];

    for (const configText of configTexts) {
      expect(configText).not.toContain("model_reasoning_effort");
      expect(configText).not.toContain("disable_response_storage");
      expect(configText).not.toContain("personality");
      expect(configText).not.toContain("model_context_window");
      expect(configText).not.toContain("model_auto_compact_token_limit");
      expect(configText).not.toContain("los_sux");
      expect(configText).not.toContain("OneDrive");
      expect(configText).not.toContain("AppData");
    }
  });

  it("uses Ergouzi security policy wording and links", () => {
    const securityPolicy = readFileSync(resolve("SECURITY.md"), "utf8");

    expect(securityPolicy).toContain("Ergouzi Switch");
    expect(securityPolicy).toContain(
      "https://github.com/suboxiu88-coder/ergouzi-switch",
    );
    expect(securityPolicy).not.toContain(LEGACY_UPSTREAM_REPO);
    expect(securityPolicy).not.toContain(
      `${LEGACY_BRAND} receives security updates`,
    );
  });

  it("uses clean-install first-run messaging across bundled locales", () => {
    for (const locale of ["zh", "en", "ja"]) {
      const messages = JSON.parse(
        readText("src", "i18n", "locales", `${locale}.json`),
      ) as any;
      const serializedMessages = JSON.stringify(messages);

      expect(messages.app.title).toBe("Ergouzi Switch");
      expect(messages.firstRunNotice.title).toContain("Ergouzi Switch");
      expect(serializedMessages).not.toContain(LEGACY_BRAND);
      expect(serializedMessages).not.toContain(LEGACY_SLUG);
      expect(messages.firstRunNotice.bodyDefault).not.toContain(
        "saved your existing setup",
      );
      expect(messages.firstRunNotice.bodyDefault).not.toContain("自動的に保存");
      expect(messages.firstRunNotice.bodyDefault).not.toContain("自动保存");
    }
  });

  it("keeps app-local state in a clean Ergouzi data directory", () => {
    const productionPathText = [
      readText("src-tauri", "src", "config.rs"),
      readText("src-tauri", "src", "settings.rs"),
      readText("src-tauri", "src", "panic_hook.rs"),
      readText("src-tauri", "src", "services", "env_manager.rs"),
      readText("src", "hooks", "useDirectorySettings.ts"),
      readText("src", "main.tsx"),
    ].join("\n");
    const configText = readText("src-tauri", "src", "config.rs");

    expect(productionPathText).toContain(".ergouzi-switch");
    expect(productionPathText).not.toContain(`join(".${LEGACY_SLUG}")`);
    expect(productionPathText).not.toContain(`~/.${LEGACY_SLUG}/config.json`);
    expect(configText).not.toContain("legacy_dir");
    expect(configText).not.toContain(`HOME/.${LEGACY_SLUG}`);
  });

  it("does not auto-import local machine configs on startup", () => {
    const libText = readText("src-tauri", "src", "lib.rs");

    expect(libText).toContain(
      "const AUTO_IMPORT_LOCAL_CONFIG_ON_STARTUP: bool = false;",
    );
    expect(libText).toContain(
      "startup imports from local app configs are disabled",
    );
  });

  it("uses Ergouzi names for built-in sync roots", () => {
    const settingsText = readText("src-tauri", "src", "settings.rs");
    const webdavSettingsText = readText(
      "src",
      "components",
      "settings",
      "WebdavSyncSection.tsx",
    );

    expect(settingsText).toContain('"ergouzi-switch-sync"');
    expect(webdavSettingsText).toContain('"ergouzi-switch-sync"');
    expect(webdavSettingsText).not.toContain(`"${LEGACY_SLUG}-sync"`);
  });

  it("uses the uploaded Ergouzi logo in the app chrome", () => {
    const appText = readText("src", "App.tsx");

    expect(sha256("src", "assets", "icons", "ergouzi-logo.png")).toBe(
      sha256("logo_180x180.png"),
    );
    expect(appText).toContain("@/assets/icons/ergouzi-logo.png");
    expect(appText).toContain('alt="Ergouzi Switch"');
  });

  it("uses Ergouzi names for user-facing shell integration labels", () => {
    const tauriConfig = JSON.parse(
      readText("src-tauri", "tauri.conf.json"),
    ) as any;
    const indexHtmlText = readText("src", "index.html");
    const libText = readText("src-tauri", "src", "lib.rs");
    const autoLaunchText = readText("src-tauri", "src", "auto_launch.rs");
    const infoPlistText = readText("src-tauri", "Info.plist");

    expect(tauriConfig.app.windows[0].title).toBe("Ergouzi Switch");
    expect(indexHtmlText).toContain("<title>Ergouzi Switch</title>");
    expect(libText).toContain('.tooltip("Ergouzi Switch")');
    expect(libText).not.toContain(`.tooltip("${LEGACY_BRAND}")`);
    expect(autoLaunchText).toContain('let app_name = "Ergouzi Switch";');
    expect(autoLaunchText).not.toContain(`let app_name = "${LEGACY_BRAND}";`);
    expect(infoPlistText).toContain("Ergouzi Switch Deep Link");
    expect(infoPlistText).not.toContain(`${LEGACY_BRAND} Deep Link`);
    expect(tauriConfig.plugins["deep-link"].desktop.schemes).toEqual([
      "ergouziswitch",
    ]);
    expect(infoPlistText).toContain("ergouziswitch");
    expect(infoPlistText).not.toContain(LEGACY_DEEPLINK_SCHEME);
  });

  it("builds Windows installers with Chinese UI language", () => {
    const tauriConfig = JSON.parse(
      readText("src-tauri", "tauri.conf.json"),
    ) as any;
    const windowsConfig = tauriConfig.bundle.windows;

    expect(windowsConfig.nsis.languages).toEqual(["SimpChinese"]);
    expect(windowsConfig.nsis.displayLanguageSelector).toBe(false);
    expect(windowsConfig.wix.language).toBe("zh-CN");
  });

  it("seeds Ergouzi as the default provider identity in the local database", () => {
    const seedText = readText(
      "src-tauri",
      "src",
      "database",
      "dao",
      "providers_seed.rs",
    );
    const providerDaoText = readText(
      "src-tauri",
      "src",
      "database",
      "dao",
      "providers.rs",
    );

    for (const legacyName of [
      "Claude Official",
      "Claude Desktop Official",
      "OpenAI Official",
      "Google Official",
    ]) {
      expect(seedText).not.toContain(`name: "${legacyName}"`);
      expect(providerDaoText).not.toContain(`provider.name, "${legacyName}"`);
    }
    expect(seedText.match(/name: "Ergouzi"/g)).toHaveLength(4);
    expect(seedText).toContain('category: "aggregator"');
    expect(providerDaoText).toContain("provider.category = Some(seed.category.to_string())");
  });

  it("uses Ergouzi Switch in visible local app surfaces", () => {
    const visibleTexts = [
      readText("src-tauri", "src", "database", "backup.rs"),
      readText("src-tauri", "src", "claude_desktop_config.rs"),
      readText(
        "src",
        "components",
        "providers",
        "forms",
        "ClaudeDesktopProviderForm.tsx",
      ),
      readText("src", "hooks", "useImportExport.ts"),
      readText("src-tauri", "src", "commands", "codex_oauth.rs"),
      readText("src-tauri", "src", "commands", "misc.rs"),
      readText("src-tauri", "src", "tray.rs"),
      readText("src-tauri", "src", "panic_hook.rs"),
      readText("src", "components", "UsageScriptModal.tsx"),
    ].join("\n");

    expect(visibleTexts).not.toContain(LEGACY_BRAND);
    expect(visibleTexts).not.toContain(`[${LEGACY_SLUG}]`);
    expect(visibleTexts).not.toContain(`${LEGACY_SLUG}-export`);
    expect(visibleTexts).not.toContain(`via ${LEGACY_SLUG}`);
    expect(visibleTexts).not.toContain(`${LEGACY_DEEPLINK_SCHEME}.io`);
    expect(visibleTexts).toContain("Ergouzi Switch");
    expect(visibleTexts).toContain("https://ergouzi.life/");
    expect(visibleTexts).toContain("ergouzi-switch-export");
    expect(visibleTexts).toContain("[ergouzi-switch]");
  });
});
