# Git 설치: https://git-scm.com/download/win
# 설치 후 터미널을 다시 열고 이 스크립트를 실행하세요.
# 사용법: PowerShell에서 이 폴더로 이동한 뒤
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\init-and-connect-github.ps1
# GitHub(HTTPS): New repository(빈 저장소) 생성 후, 아래 $RemoteUrl에 HTTPS URL을 넣고 주석을 해제하세요.
# Personal Access Token: GitHub > Settings > Developer settings > Personal access tokens
#   - Classic: repo 권한 체크(비공개 저장소 포함)
#   - Fine-grained: 대상 저장소만 선택, Contents: Read and write, Metadata: Read
# push 시 "Password" 칸에는 GitHub 비밀번호가 아니라 "토큰 전체"를 붙여 넣기.
# 토큰을 .git, 스크립트, 코드에 넣지 말 것. Git Credential Manager에 저장되면 재입력이 줄어듦.

$ErrorActionPreference = "Stop"
$ScriptDir = $PSScriptRoot
Set-Location $ScriptDir

# PATH에 흔한 Git 경로 보강
$gitCandidates = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files\Git\bin\git.exe"
)
$git = $null
foreach ($c in $gitCandidates) {
    if (Test-Path $c) { $git = $c; break }
}
if (-not $git) {
    $g = Get-Command git -ErrorAction SilentlyContinue
    if ($g) { $git = $g.Source }
}
if (-not $git) {
    Write-Host "Git이 이 PC에 없습니다. 먼저 설치하세요: https://git-scm.com/download/win" -ForegroundColor Red
    Write-Host "설치 후 터미널을 다시 열고 이 스크립트를 다시 실행하세요."
    exit 1
}

& $git --version

if (-not (Test-Path (Join-Path $ScriptDir ".git"))) {
    & $git -C $ScriptDir init
    & $git -C $ScriptDir branch -M main
}

# 사용자 정보가 없으면 한 번만 설정(원하면 수정)
$authorName = & $git -C $ScriptDir config user.name 2>$null
$authorEmail = & $git -C $ScriptDir config user.email 2>$null
if (-not $authorName) {
    & $git -C $ScriptDir config user.name "Administrator"
    Write-Host "user.name이 없어 임시로 설정했습니다. 다음으로 바꾸는 것이 좋습니다: git config --global user.name ""이름"""
}
if (-not $authorEmail) {
    & $git -C $ScriptDir config user.email "you@example.com"
    Write-Host "user.email이 없어 임시로 설정했습니다. 반드시 바꾸세요: git config --global user.email ""이메일"""
}

& $git -C $ScriptDir add -A
$status = & $git -C $ScriptDir status --porcelain
if (-not $status) {
    Write-Host "커밋할 변경이 없습니다(이미 최신). 원격만 연결하려면 아래만 진행하세요."
} else {
    & $git -C $ScriptDir commit -m "Initial commit: 내가 만들 페이지"
}

# === GitHub에 만든 저장소 URL을 아래에 넣고, 주석을 제거하세요 (예: https://github.com/아이디/저장소명.git) ===
# $RemoteUrl = "https://github.com/여기에/저장소.git"
# & $git -C $ScriptDir remote remove origin 2>$null
# & $git -C $ScriptDir remote add origin $RemoteUrl
# & $git -C $ScriptDir push -u origin main

Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "1. https://github.com/new 에서 새 저장소를 만듭니다(README 없이 비우는 것이 첫 push에 편합니다)."
Write-Host "2. init-and-connect-github.ps1 하단의 remote URL을 채우고, 해당 줄들의 # 주석을 제거한 뒤 이 스크립트를 다시 실행하세요."
Write-Host "   또는 수동: git remote add origin <URL>  그다음: git push -u origin main"
Write-Host "3. HTTPS + PAT: https://github.com/settings/tokens — 푸시 시 비밀번호 자리에 토큰을 입력(클래식은 repo, 세밀 권한은 Contents 쓰기)."
Write-Host "   자격 증명 저장: git config --global credential.helper manager( Windows Git에 보통 포함됨 )."
