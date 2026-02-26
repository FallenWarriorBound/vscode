Param(
  [switch]$SkipDockerInstall,
  [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

function Write-Step($msg) {
  Write-Host "`n==> $msg" -ForegroundColor Cyan
}

function Ensure-DockerDesktop {
  param([bool]$SkipInstall)

  if ($SkipInstall) {
    Write-Host "Docker installation skipped by flag." -ForegroundColor Yellow
    return
  }

  $dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
  if (-not $dockerCmd) {
    Write-Step "Docker not found. Installing Docker Desktop with winget"
    winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
  }
}

function Start-And-WaitDocker {
  Write-Step "Starting Docker Desktop"

  $dockerExe = "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
  if (Test-Path $dockerExe) {
    Start-Process -FilePath $dockerExe | Out-Null
  }

  $maxAttempts = 60
  for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
      docker info | Out-Null
      Write-Host "Docker is ready." -ForegroundColor Green
      return
    }
    catch {
      Start-Sleep -Seconds 2
    }
  }

  throw "Docker Desktop did not become ready in time. Start Docker manually and run again."
}

function Ensure-EnvFile {
  if (-not (Test-Path ".env")) {
    Write-Step "Creating .env from .env.example"
    Copy-Item ".env.example" ".env"
  }
}

function Run-Compose {
  param([bool]$NoBuild)

  Write-Step "Starting services with Docker Compose"
  if ($NoBuild) {
    docker compose up -d
  }
  else {
    docker compose up -d --build
  }

  Write-Host "`nHemayatVam started successfully." -ForegroundColor Green
  Write-Host "Frontend: http://localhost" -ForegroundColor Green
  Write-Host "Backend health: http://localhost/health" -ForegroundColor Green
}

try {
  Set-Location (Resolve-Path "$PSScriptRoot\..\..")

  Write-Step "Starting automatic HemayatVam Windows installation"
  Ensure-DockerDesktop -SkipInstall:$SkipDockerInstall
  Start-And-WaitDocker
  Ensure-EnvFile
  Run-Compose -NoBuild:$NoBuild
}
catch {
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
