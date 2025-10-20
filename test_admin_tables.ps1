# Test Admin Tables API
Write-Host "Testing Django Admin Tables API..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/admin/tables" `
        -Method GET `
        -Headers @{"X-Admin-Token"="admin123"} `
        -ErrorAction Stop
    
    Write-Host "SUCCESS! Got response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    
    Write-Host "`nNumber of tables: $($response.Count)" -ForegroundColor Cyan
    
    foreach ($table in $response) {
        Write-Host "  - Table $($table.table_number): $($table.name) (Token: $($table.table_token))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
