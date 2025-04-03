@echo off
echo 正在尝试推送到GitHub...
git push origin main
if %errorlevel% equ 0 (
  echo 推送成功！
) else (
  echo 推送失败，请检查网络连接并再次尝试
)
pause 