$headers = @{
    "X-Admin-Token" = "admin123"
}

Write-Host "Testing Admin Dashboard API..."
Write-Host "URL: http://localhost:8000/api/admin/dashboard"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/admin/dashboard" -Method GET -Headers $headers
    Write-Host "Success! Response:"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:"
        Write-Host $responseBody
    }
}
