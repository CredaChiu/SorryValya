@echo off
chcp 65001 >nul
echo ========================================
echo   部署到 GitHub Pages - 完整步驟
echo ========================================
echo.

echo [步驟 1] 安裝圖片壓縮工具...
cd /d "%~dp0"
call npm init -y
call npm install sharp
echo.

echo [步驟 2] 壓縮圖片...
call node compress.js
echo.

echo [步驟 3] 替換圖片資料夾...
if exist images_original (
    echo images_original 已存在，跳過備份
) else (
    rename images images_original
    rename images_compressed images
    echo 圖片已替換！
)
echo.

echo [步驟 4] 處理大影片...
echo 檢查超過 50MB 的影片檔案...
for %%F in (images\*.MOV images\*.MP4 images\*.mov images\*.mp4) do (
    echo   %%F - %%~zF bytes
)
echo.
echo ⚠️  如果影片超過 100MB，GitHub 無法上傳。
echo    建議：上傳影片到 YouTube，然後用 iframe 嵌入。
echo.

echo [步驟 5] 初始化 Git 並推送...
echo.
echo 請先在 GitHub 網站上建立一個新倉庫（repository）：
echo   1. 打開 https://github.com/new
echo   2. Repository name 填: SorryValya
echo   3. 選 Public
echo   4. 不要勾選 Add README
echo   5. 點 Create repository
echo.
echo 建立完成後，複製倉庫的 URL，例如：
echo   https://github.com/你的帳號/SorryValya.git
echo.
set /p REPO_URL=請貼上你的倉庫 URL:

git init
git add .gitignore index.html style.css script.js images/
git commit -m "birthday website for valya"
git branch -M main
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo [步驟 6] 開啟 GitHub Pages...
echo   1. 打開你的倉庫頁面
echo   2. 點 Settings → Pages
echo   3. Source 選 "Deploy from a branch"
echo   4. Branch 選 "main"，資料夾選 "/ (root)"
echo   5. 點 Save
echo.
echo 等幾分鐘後，你的網站就會在：
echo   https://你的帳號.github.io/SorryValya/
echo.
echo ========================================
echo   完成！🎉
echo ========================================
pause

