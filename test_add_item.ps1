$body = @{
    itemId = 14
    qty = 1
    options = @{}
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/public/tables/2/bill/items" -Method POST -Body $body -ContentType "application/json"

Write-Host "Response:"
$response | ConvertTo-Json -Depth 10
