#!/usr/bin/env bash
set -euo pipefail

allowlist_file=".github/scripts/check-design-token-css.allowlist"

scan_paths=(
  "apps/shop/src"
  "libs"
)

css_globs=(
  "--glob"
  "*.css"
  "--glob"
  "*.scss"
)

has_violations=0

declare -a allowlist_rules=()

if [[ -f "$allowlist_file" ]]; then
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    allowlist_rules+=("$line")
  done <"$allowlist_file"
fi

is_allowlisted() {
  local match_line="$1"

  for rule in "${allowlist_rules[@]}"; do
    if [[ "$match_line" =~ $rule ]]; then
      return 0
    fi
  done

  return 1
}

check_pattern() {
  local description="$1"
  local pattern="$2"
  local header_printed=0
  local has_blocking_matches=0
  local all_matches

  all_matches="$(rg -n -e "$pattern" "${css_globs[@]}" "${scan_paths[@]}" || true)"

  [[ -z "$all_matches" ]] && return

  while IFS= read -r match_line; do
    [[ -z "$match_line" ]] && continue

    if is_allowlisted "$match_line"; then
      continue
    fi

    if [[ "$header_printed" -eq 0 ]]; then
      echo
      echo "Found forbidden $description in CSS/SCSS. Use design tokens instead."
      header_printed=1
    fi

    echo "$match_line"
    has_blocking_matches=1
  done <<<"$all_matches"

  if [[ "$has_blocking_matches" -eq 1 ]]; then
    has_violations=1
  fi
}

check_pattern "hex color literals" "#[0-9A-Fa-f]{3,8}\\b"
check_pattern "rgba color literals" "rgba\\("
check_pattern "quoted font stacks" "font-family:[[:space:]]*'"

if [[ "$has_violations" -ne 0 ]]; then
  echo
  echo "If an exception is required, add a targeted regex to $allowlist_file."
  exit 1
fi

echo "Design token CSS guard passed."
