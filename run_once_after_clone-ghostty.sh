#!/bin/bash
set -euo pipefail

dest="${HOME}/.config/ghostty"
if [[ -d "${dest}/.git" ]]; then
  exit 0
fi
if [[ -e "${dest}" ]]; then
  echo "ghostty exists at ${dest} but is not a git repo; skip clone" >&2
  exit 0
fi

git clone git@github.com:BubblePtr/ghostty.git "${dest}"

# Linux overlay: Super+S is Hyprland's scratchpad, not Ghostty quick terminal.
if [[ "$(uname -s)" == "Linux" && -f "${dest}/omarchy.conf" ]]; then
  ln -sfn omarchy.conf "${dest}/local.conf"
fi
