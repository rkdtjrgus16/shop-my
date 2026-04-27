# GitHub Classic PAT로 push하는 스크립트
# 실행: PowerShell 이 폴더에서
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\push-to-github.ps1

$git    = "C:\Users\Administrator\.cache\PortableGit-2.54\cmd\git.exe"
$proj   = "c:\Users\Administrator\Desktop\바이브코딩 (기초반)\내가 만들"
$user   = "rkdtjrgus16"
$repo   = "https://github.com/rkdtjrgus16/shop-my.git"

# 토큰 입력(화면에 표시되지 않음)
$token = Read-Host "GitHub Classic PAT를 붙여넣으세요" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

# 토큰을 URL에 포함해 push (Git Credential Manager 없이도 인증 가능)
$remoteWithCred = "https://$user`:$plain@github.com/rkdtjrgus16/shop-my.git"

Set-Location $proj

# 원격 URL을 임시로 교체 → push → 원래 URL로 복원
& $git remote set-url origin $remoteWithCred
& $git push -u origin main
& $git remote set-url origin $repo   # 토큰을 URL에서 제거

Write-Host ""
Write-Host "완료! https://github.com/rkdtjrgus16/shop-my 에서 확인하세요." -ForegroundColor Green
