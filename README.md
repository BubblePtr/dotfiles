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
| fcitx5 的 profile / 快捷键 | 整份 `~/.config` |
| AUR 包列表 | |

换显示器或换机器时，改 `~/.config/chezmoi/chezmoi.toml` 里的 `data.machine`，或编辑 `dot_config/hypr/monitors.lua.tmpl`。
