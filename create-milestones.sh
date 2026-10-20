#!/usr/bin/env bash
set -euo pipefail

REPO="AhmedHassan-Ahmed/school-management"

command -v gh >/dev/null || { echo "GitHub CLI (gh) is required."; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

create_or_get_milestone() {
  local title="$1"
  local description="$2"
  local number

  number=$(gh api "repos/$REPO/milestones?state=all&per_page=100" \
    --jq ".[] | select(.title == \"$title\") | .number" | head -n 1 || true)

  if [[ -z "$number" ]]; then
    echo "Creating milestone: $title" >&2
    number=$(gh api "repos/$REPO/milestones" \
      --method POST \
      -f title="$title" \
      -f description="$description" \
      --jq '.number')
  else
    echo "Milestone already exists: $title (#$number)" >&2
  fi

  printf '%s' "$number"
}

assign_issue_by_title() {
  local milestone_number="$1"
  local issue_title="$2"
  local issue_number

  issue_number=$(gh issue list --repo "$REPO" --state all --limit 1000 \
    --json number,title \
    --jq ".[] | select(.title == \"$issue_title\") | .number" | head -n 1 || true)

  if [[ -z "$issue_number" ]]; then
    echo "WARNING: Issue not found: $issue_title" >&2
    return
  fi

  echo "Assigning #$issue_number — $issue_title"
  gh api "repos/$REPO/issues/$issue_number" \
    --method PATCH \
    -F milestone="$milestone_number" \
    --silent
}

foundation=$(create_or_get_milestone \
  "Project Foundation" \
  "Project setup, database connection, centralized error handling, and request validation.")
echo
core=$(create_or_get_milestone \
  "Core School Modules" \
  "CRUD APIs for classes, subjects, teachers, and students, plus search, pagination, and relationship integrity.")
echo
timetable=$(create_or_get_milestone \
  "Timetable" \
  "Timetable CRUD and prevention of teacher/class scheduling conflicts.")
echo
release=$(create_or_get_milestone \
  "Authentication & Release" \
  "Admin JWT authentication, protected routes, automated tests, and API documentation.")
echo

echo "Assigning issues to milestones..."
assign_issue_by_title "$foundation" "Set up project configuration and environment"
assign_issue_by_title "$foundation" "Verify MongoDB connection and server startup"
assign_issue_by_title "$foundation" "Add centralized error handling"
assign_issue_by_title "$foundation" "Add request validation with Zod"

assign_issue_by_title "$core" "Implement Classes CRUD API"
assign_issue_by_title "$core" "Implement Subjects CRUD API"
assign_issue_by_title "$core" "Implement Teachers CRUD API"
assign_issue_by_title "$core" "Implement Students CRUD API"
assign_issue_by_title "$core" "Add search and pagination to list endpoints"
assign_issue_by_title "$core" "Validate model references and deletion behavior"

assign_issue_by_title "$timetable" "Implement Timetable CRUD API"
assign_issue_by_title "$timetable" "Prevent timetable overlaps for teachers and classes"

assign_issue_by_title "$release" "Implement admin authentication with JWT"
assign_issue_by_title "$release" "Protect management endpoints with admin authentication"
assign_issue_by_title "$release" "Add automated tests for API behavior"
assign_issue_by_title "$release" "Document API endpoints and prepare the V1 release"

echo
echo "Done. View milestones at: https://github.com/$REPO/milestones"
