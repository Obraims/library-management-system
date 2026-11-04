# PowerShell script to stage and push Borrow Tracking & Booking assignment code
[CmdletBinding()]
param(
    [string]$CommitMessage = "feat: implement borrow tracking, space booking, and admin routes",
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$username = "DELMUS1M"
$email = "ogoradelmus1@gmail.com"
$repoUrl = "https://github.com/DELMUS1M/library-management-system.git"

Write-Host "`n[1/4] Setting Git identity..." -ForegroundColor Cyan
git config user.name $username
git config user.email $email

Write-Host "`n[2/4] Setting remote origin..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) { git init }
git branch -M $Branch
$remotes = git remote
if ($remotes -contains "origin") {
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}

Write-Host "`n[3/4] Staging files..." -ForegroundColor Cyan
git add -f README.md api/ push_to_github.ps1
git commit -m $CommitMessage

Write-Host "`n[4/4] Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin $Branch

Write-Host "`n[SUCCESS] Code pushed successfully to $repoUrl" -ForegroundColor Green
