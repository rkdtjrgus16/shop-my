@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

rem 이 배치 파일이 있는 폴더 = 저장소 루트 (CMD에서 한글 경로를 직접 치지 않아도 됨)
cd /d "%~dp0"

set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"
if not exist "%GIT_EXE%" set "GIT_EXE=C:\Program Files\Git\bin\git.exe"
if not exist "%GIT_EXE%" set "GIT_EXE=%USERPROFILE%\.cache\PortableGit-2.54\cmd\git.exe"
if not exist "%GIT_EXE%" set "GIT_EXE=git"

"%GIT_EXE%" add -A
if errorlevel 1 exit /b 1

"%GIT_EXE%" diff --cached --quiet
if errorlevel 1 goto COMMIT
echo 스테이징할 변경이 없습니다. 푸시만 시도합니다.
goto PUSH

:COMMIT
if "%~1"=="" (
  "%GIT_EXE%" commit -m "Update"
) else (
  "%GIT_EXE%" commit -m "%*"
)
if errorlevel 1 exit /b 1

:PUSH
"%GIT_EXE%" push origin main
exit /b %errorlevel%
