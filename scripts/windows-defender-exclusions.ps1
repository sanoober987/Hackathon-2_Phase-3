# Run in PowerShell as Administrator
# Adds Defender exclusions that eliminate file-locking and errno -4094 in Next.js dev

$projectRoot = "D:\Hackathon-2"
$npmGlobal   = "$env:APPDATA\npm"
$wslPkgs     = "$env:LOCALAPPDATA\Packages"
$wslVhd      = (Get-ChildItem $wslPkgs -Filter "*Ubuntu*" -ErrorAction SilentlyContinue |
                Select-Object -First 1 -ExpandProperty FullName) + "\LocalState"

Write-Host "=== Adding Windows Defender exclusions ==="

Add-MpPreference -ExclusionPath $projectRoot
Write-Host "  + Project root: $projectRoot"

Add-MpPreference -ExclusionPath $npmGlobal
Write-Host "  + npm global:   $npmGlobal"

if (Test-Path $wslVhd) {
    Add-MpPreference -ExclusionPath $wslVhd
    Write-Host "  + WSL disk:     $wslVhd"
}

Add-MpPreference -ExclusionProcess "node.exe"
Add-MpPreference -ExclusionProcess "npm.cmd"
Write-Host "  + Processes:    node.exe, npm.cmd"

Write-Host ""
Write-Host "=== Done. Restart WSL: wsl --shutdown then reopen terminal ==="
