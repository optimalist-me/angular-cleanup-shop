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
search_tool=""

if command -v rg >/dev/null 2>&1; then
  search_tool="rg"
elif command -v grep >/dev/null 2>&1; then
  search_tool="grep"
  echo "Warning: rg (ripgrep) not found. Falling back to grep for CSS token guard checks." >&2
else
  echo "Error: neither rg nor grep is available. Cannot run CSS token guard." >&2
  exit 1
fi

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

run_search() {
  local pattern="$1"

  if [[ "$search_tool" == "rg" ]]; then
    rg -n -e "$pattern" "${css_globs[@]}" "${scan_paths[@]}"
    return
  fi

  grep -R -n -E \
    --include="*.css" \
    --include="*.scss" \
    "$pattern" \
    "${scan_paths[@]}"
}

check_pattern() {
  local description="$1"
  local pattern="$2"
  local header_printed=0
  local has_blocking_matches=0
  local all_matches
  local search_status

  set +e
  all_matches="$(run_search "$pattern" 2>&1)"
  search_status=$?
  set -e

  if [[ "$search_status" -eq 1 ]]; then
    return
  fi

  if [[ "$search_status" -ne 0 ]]; then
    echo "Error while checking for forbidden $description." >&2
    echo "$all_matches" >&2
    exit 1
  fi

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
