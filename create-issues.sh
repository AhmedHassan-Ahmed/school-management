
#!/usr/bin/env bash
set -euo pipefail

command -v gh >/dev/null || {
  echo "Install GitHub CLI first."
  exit 1
}

gh auth status >/dev/null 2>&1 || {
  echo "Run: gh auth login"
  exit 1
}

shopt -s nullglob
files=(issues/*.md)

if [ ${#files[@]} -eq 0 ]; then
  echo "No issue files found in issues/"
  exit 1
fi

# Create labels if they don't exist
for file in "${files[@]}"; do
  labels=$(sed -n 's/^labels: "\(.*\)"$/\1/p' "$file" | head -n 1)

  IFS=',' read -ra label_list <<< "$labels"

  for label in "${label_list[@]}"; do
    label=$(echo "$label" | xargs)

    if [ -n "$label" ]; then
      gh label create "$label" \
        --description "School Management System project label" \
        --force 2>/dev/null || true
    fi
  done
done

# Create issues
for file in "${files[@]}"; do
  title=$(sed -n 's/^title: "\(.*\)"$/\1/p' "$file" | head -n 1)
  labels=$(sed -n 's/^labels: "\(.*\)"$/\1/p' "$file" | head -n 1)
  body=$(mktemp)

  awk 'BEGIN { n=0; front=0 }
    /^---$/ {
      n++
      if (n==1) { front=1; next }
      if (n==2) { front=0; next }
    }
    !front { print }
  ' "$file" > "$body"

  echo "Creating: $title"

  if [ -n "$labels" ]; then
    IFS=',' read -ra label_list <<< "$labels"
    args=()
    for label in "${label_list[@]}"; do
      args+=(--label "$(echo "$label" | xargs)")
    done

    gh issue create \
      --title "$title" \
      --body-file "$body" \
      "${args[@]}"
  else
    gh issue create --title "$title" --body-file "$body"
  fi

  rm -f "$body"
done
