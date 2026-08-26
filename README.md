# dotfiles

Omarchy / Linux 增量配置，用 [chezmoi](https://www.chezmoi.io/) 管理。
**不接管** Omarchy 库存文件（`hyprland.lua`、主题、nvim、zshrc 等）。

Ghostty 仍是独立仓库：<https://github.com/BubblePtr/ghostty>

## 新机器

1. 装 [Omarchy](https://omarchy.org/)
2. 配好 SSH key（不要放进这个仓库）
3. 应用：

```bash
# 已有 omarchy 时
omarchy pkg add chezmoi   # 或: sh -c "$(curl -fsLS get.chezmoi.io)" -- -b "$HOME/.local/bin"

chezmoi init --apply git@github.com:BubblePtr/dotfiles.git
```

第一次会问 **machine role**：这台台式机选 `desktop`（4K@160 `DP-1`、缩放 1.6）。笔记本或别的机器选 `laptop` / `other`，显示器走 Omarchy 默认。

`apply` 还会：

- 装 AUR 字体（Ioskeley / Sarasa）和 Chrome
- clone Ghostty，并在 Linux 上把 `local.conf` 链到 `omarchy.conf`
- 把 `statusLine` 一段合并进 `~/.claude/settings.json`（需要 `jq`，以及 `bun` 或 `node` 之一；其余 key 原样保留）

## 只同步一部分

`apply` / `diff` / `status` 都接受目标路径，只处理点名的那部分，其余条目原样不动：

```bash
chezmoi diff  ~/.claude      # 先看
chezmoi apply ~/.claude      # 只应用 Claude Code 状态栏
```

目录级 apply 会连带执行该目录内的 `run_` 脚本（`dot_claude/run_onchange_after_wire-statusline.sh.tmpl`），但不会碰 `clone-ghostty` / `linux-aur-packages` 这些根目录脚本。

`.chezmoiignore` 已内置 OS 守卫（模板会被求值）：

```
{{ if ne .chezmoi.os "linux" }}
.config/**
clone-ghostty.sh
linux-aur-packages.sh
{{ end }}
```

也就是**非 Linux 机器上只管 `~/.claude`**，`.config/**` 和 `clone-ghostty` / `linux-aur-packages` 两个根脚本一律忽略。所以在 macOS 上直接 `chezmoi update` / `chezmoi apply` 是安全的，不会把 Hyprland / fcitx5 那套写进 `~/.config`。

Linux 上守卫不生效（条件为假），全量 apply 行为不变；想在某台机器上再收窄，继续往 `.chezmoiignore` 里加条件即可。

然后按需：

```bash
omarchy display text size
omarchy theme set gruvbox
```

## 日常

改完真实配置后收回仓库：

```bash
chezmoi add ~/.config/hypr/input.lua
chezmoi git add -A
chezmoi git commit -- -m "flat mouse accel"
chezmoi git push
```

被 `omarchy refresh` 冲掉时：

```bash
chezmoi apply -v
```

拉别人（或另一台机）的更新：

```bash
chezmoi update -v
```

看即将写入的差异：

```bash
chezmoi diff
```

## 管什么 / 不管什么

| 收进仓库 | 不收 |
|---|---|
| `hypr/input.lua`（flat 加速） | 库存 Hyprland / nvim / zshrc |
| `hypr/monitors.lua`（按 machine 模板） | `shell.json`（Omarchy 自己会写） |
| `fontconfig/fonts.conf` | 浏览器 profile、`pulse/` |
| `git/config`（名字邮箱） | SSH 私钥、`~/.grok/auth.json` |
| `omarchy/shell.toml`、`defaults/agent` | 16MB 壁纸 |
| `mise/config.toml` | Rime 词库 |
| `starship.toml`（plain-text-symbols + `command_timeout`） | Codex 专用 `starship-codex.toml` |
| `.claude/statusline.mjs`（Claude Code 状态栏） | 整份 `~/.claude/settings.json`（只合并 `statusLine` 一个 key） |
| fcitx5 的 profile / 快捷键 | 整份 `~/.config` |
| AUR 包列表 | |

换显示器或换机器时，改 `~/.config/chezmoi/chezmoi.toml` 里的 `data.machine`，或编辑 `dot_config/hypr/monitors.lua.tmpl`。
