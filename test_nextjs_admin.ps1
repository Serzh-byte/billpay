$headers = @{
    "X-Admin-Token" = "admin123"
    "Content-Type" = "application/json"
}

Write-Host "Testing Next.js Admin Dashboard API..."
Write-Host "URL: http://localhost:3000/api/admin/dashboard"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/dashboard" -Method GET -Headers $headers
    Write-Host "Success! Response:"
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "openChecks: $($response.openChecks)"
    Write-Host "todayRevenue: $($response.todayRevenue)"
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
