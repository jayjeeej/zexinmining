# 完整备份脚本
# 创建时间: 2025-03-22

# 生成时间戳
$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backupDir = 'backups'
$backupName = 'qiyuanweb_backup_' + $timestamp

# 创建备份目录
if (-not (Test-Path $backupDir)) {
    New-Item -Path $backupDir -ItemType Directory
}

# 创建本次备份目录
$backupPath = Join-Path $backupDir $backupName
New-Item -Path $backupPath -ItemType Directory

Write-Host "开始创建完整备份..."
Write-Host "备份时间: $timestamp"
Write-Host "备份位置: $backupPath"

# 要排除的目录
$excludeDirs = @('node_modules', '.next', '.git', 'backups')

# 复制项目文件到备份目录
Write-Host "正在复制所有项目文件..."
Get-ChildItem -Path . -Exclude $excludeDirs | Copy-Item -Destination $backupPath -Recurse -Force

# 创建备份压缩文件
$zipPath = $backupPath + '.zip'
Write-Host "正在创建压缩文件: $zipPath"
Compress-Archive -Path $backupPath -DestinationPath $zipPath -Force

# 创建备份详情文件
$backupDetailsPath = Join-Path $backupDir 'backup_details.txt'
$backupTimestampPath = Join-Path $backupDir 'backup_timestamp.txt'

$details = @"
备份日期: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
项目路径: $(Get-Location).Path
备份内容: 所有项目文件(排除node_modules和.next文件夹)
备份方式: 完整复制和压缩
备份版本: v2.0
"@

Set-Content -Path $backupDetailsPath -Value $details
Set-Content -Path $backupTimestampPath -Value $timestamp

Write-Host "备份完成!"
Write-Host "备份文件保存在: $zipPath"
Write-Host "备份详情保存在: $backupDetailsPath"

# 显示备份文件大小
$zipFileInfo = Get-Item $zipPath
$zipSizeMB = [math]::Round($zipFileInfo.Length / 1MB, 2)
Write-Host "备份文件大小: $zipSizeMB MB" 