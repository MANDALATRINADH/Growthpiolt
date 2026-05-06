# test-api.ps1
$baseUrl = "https://growthpiolt.onrender.com"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🚀 Testing GrowthPilot API" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "[1] Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/health" -UseBasicParsing
    Write-Host "✅ Health OK - Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Register
Write-Host "[2] Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    name = "TestUser"
    email = "testuser@example.com"
    password = "123456"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "   Message: $($register.message)" -ForegroundColor Gray
    Write-Host "   User: $($register.user.name) ($($register.user.email))" -ForegroundColor Gray
} catch {
    $errorMsg = $_.Exception.Message
    if ($errorMsg -like "*already exists*") {
        Write-Host "⚠️  User already exists (this is fine)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Registration failed: $errorMsg" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Login
Write-Host "[3] Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "testuser@example.com"
    password = "123456"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Message: $($login.message)" -ForegroundColor Gray
    Write-Host "   User: $($login.user.name) ($($login.user.email))" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Google Login
Write-Host "[4] Testing Google Login..." -ForegroundColor Yellow
$googleBody = @{
    name = "Google User"
    email = "googleuser@gmail.com"
} | ConvertTo-Json

try {
    $google = Invoke-RestMethod -Uri "$baseUrl/api/auth/google" -Method Post -Body $googleBody -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Google login successful!" -ForegroundColor Green
    Write-Host "   Message: $($google.message)" -ForegroundColor Gray
    Write-Host "   User: $($google.user.name) ($($google.user.email))" -ForegroundColor Gray
} catch {
    Write-Host "❌ Google login failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✨ API Testing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your API is live at: $baseUrl" -ForegroundColor Yellow
Write-Host ""