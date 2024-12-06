Write-Host 🎯 Building NewXesFrontend... -ForegroundColor Blue
$buildProc = Start-Process npx -ArgumentList "webpack --progress " -NoNewWindow -Wait -PassThru
if ($buildProc.ExitCode -ne 0) {
    Write-Host ❌ Error Building NewXesFrontend. -ForegroundColor Red
    exit 1
}

Write-Host 📁 Copying Public Files... -ForegroundColor Blue
Copy-Item -Path public\* -Destination dist

Write-Host 🚩 Build successful. -ForegroundColor Green
exit 0