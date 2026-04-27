# =====================================================
# [매번 사용] 커밋 + 푸시 스크립트
# 실행: PowerShell에서
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\commit-push.ps1
# 또는 메시지를 직접 넣어서:
#   .\commit-push.ps1 "수정 내용 메시지"
# =====================================================

param(
    [string]$Message = ""
)

$git  = "C:\Users\Administrator\.cache\PortableGit-2.54\cmd\git.exe"
$proj = "c:\Users\Administrator\Desktop\바이브코딩 (기초반)\내가 만들"

Set-Location $proj

# 변경사항 확인
$status = & $git status --porcelain
if (-not $status) {
    Write-Host "변경된 파일이 없습니다. 커밋할 내용이 없어요." -ForegroundColor Yellow
    exit 0
}

Write-Host "--- 변경된 파일 ---" -ForegroundColor Cyan
& $git status -s

# 커밋 메시지
if (-not $Message) {
    $Message = Read-Host "`n커밋 메시지를 입력하세요"
}
if (-not $Message) { $Message = "update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }

# 스테이징 → 커밋 → 푸시
& $git add -A
& $git commit -m $Message
& $git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "푸시 완료! https://github.com/rkdtjrgus16/shop-my" -ForegroundColor Green
} else {
    Write-Host "푸시 실패. 토큰이 만료됐다면 setup-git-once.ps1 을 다시 실행하세요." -ForegroundColor Red
}
