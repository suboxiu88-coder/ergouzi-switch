# Ergouzi Switch 群友版

这是基于cc-switch 定制的群友版桌面工具。默认 API 地址已经固定到 Ergouzi：

- Claude / Claude Desktop / Gemini: `https://ergouzi.life`
- Codex / OpenAI-compatible / Hermes: `https://ergouzi.life/v1`

## 下载安装

打开本仓库右侧的 **Releases**，下载最新版本安装包：

- Windows: 下载 `x64-setup.exe` 或 `.msi`
- Apple Silicon Mac (M1/M2/M3/M4): 下载 `aarch64.dmg`
- Intel Mac: 下载 `x64.dmg`

macOS 如果提示“无法验证开发者”，可以在 Finder 里右键应用，选择“打开”。这是因为群友版默认没有 Apple Developer 签名。

## 给维护者发新版

推荐用 GitHub Actions 自动打包：

```bash
git tag v3.15.0-ergouzi.8
git push origin v3.15.0-ergouzi.8
```

推送 tag 后，GitHub 会自动构建 Windows、Apple Silicon Mac 和 Intel Mac 安装包，并挂到 Releases。版本号里的最后一位每次发新版递增即可。

## 本地开发

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test:unit
pnpm tauri build
```

完整桌面打包需要本机安装 Rust、Node.js 和 pnpm。Windows 包建议在 Windows 上打，macOS 包建议在 macOS 上打。

## 自动更新说明

群友版已经关闭原版 cc-switch 的自动更新源，避免安装后被更新回原版。后续更新请从本仓库 Releases 手动下载新版安装包。

## License

基于原项目 MIT License 继续分发，详见 [LICENSE](LICENSE)。
