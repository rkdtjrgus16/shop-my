# =====================================================
# [1회만 실행] Git PATH 등록 + 토큰 영구 저장 스크립트
# 실행: PowerShell에서
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\setup-git-once.ps1
# =====================================================

$git     = "C:\Users\Administrator\.cache\PortableGit-2.54\cmd\git.exe"
$gitPath = "C:\Users\Administrator\.cache\PortableGit-2.54\cmd"
$proj    = "c:\Users\Administrator\Desktop\바이브코딩 (기초반)\내가 만들"
$user    = "rkdtjrgus16"
$remote  = "https://github.com/rkdtjrgus16/shop-my.git"

# 1) Portable Git을 사용자 PATH에 영구 등록
$curPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($curPath -notlike "*PortableGit*") {
    [Environment]::SetEnvironmentVariable("Path", "$curPath;$gitPath", "User")
    Write-Host "[완료] Portable Git PATH 등록. 이후 새 터미널에서 'git' 그냥 사용 가능." -ForegroundColor Green
} else {
    Write-Host "[확인] Portable Git PATH 이미 등록됨." -ForegroundColor Cyan
}

# 2) credential.helper = store 설정 (토큰을 파일에 저장)
& $git config --global credential.helper store
Write-Host "[완료] credential.helper = store 설정." -ForegroundColor Green

# 3) 토큰 입력 → ~/.git-credentials 에 저장
$token = Read-Host "GitHub Classic PAT를 붙여넣으세요 (ghp_...)" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

$credFile = "$env:USERPROFILE\.git-credentials"
$credLine = "https://$user`:$plain@github.com"

# 기존 github.com 항목 제거 후 새로 저장
$lines = if (Test-Path $credFile) { Get-Content $credFile | Where-Object { $_ -notmatch "github\.com" } } else { @() }
$lines += $credLine
$lines | Set-Content $credFile -Encoding ascii
Write-Host "[완료] 토큰이 $credFile 에 저장됨." -ForegroundColor Green

# 4) 원격 URL을 plain HTTPS로 복원 (토큰 없는 깨끗한 URL)
Set-Location $proj
& $git remote set-url origin $remote
Write-Host "[완료] 원격 URL 정리 완료." -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Yellow
Write-Host " 초기 설정 완료! 이제 commit-push.ps1" -ForegroundColor Yellow
Write-Host " 로 커밋+푸시를 자유롭게 하세요.    " -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow
