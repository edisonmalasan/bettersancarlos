# Generator: fiscal_transparency.json + competitive-index.json
$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)
function Write-Json($obj, $path) {
    $json = $obj | ConvertTo-Json -Depth 8
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), $json, $enc)
    Write-Host "wrote $path"
}
$fiscal = @(
    [PSCustomObject]@{ year = 2009; annual_regular_income = 381525864.87 },
    [PSCustomObject]@{ year = 2010; annual_regular_income = 416990053.15; change_pct = 9.30 },
    [PSCustomObject]@{ year = 2011; annual_regular_income = 450082316.84; change_pct = 7.94 },
    [PSCustomObject]@{ year = 2012; annual_regular_income = 405855329.44; change_pct = -9.83 },
    [PSCustomObject]@{ year = 2013; annual_regular_income = 437343132.12; change_pct = 7.76 },
    [PSCustomObject]@{ year = 2014; annual_regular_income = 488728759.18; change_pct = 11.75 },
    [PSCustomObject]@{ year = 2015; annual_regular_income = 556986655.39; change_pct = 13.97 },
    [PSCustomObject]@{ year = 2016; annual_regular_income = 606804968.75; change_pct = 8.94 }
)
$fiscalJson = [PSCustomObject]@{
    '_schema_version' = '1.1'
    '_status' = 'verified'
    '_source' = 'Bureau of Local Government Finance (BLGF) via PhilAtlas - Annual Regular Income (locally sourced revenue + IRA + other national tax shares)'
    '_note' = 'Most recent verified series ends FY2016. Newer fiscal years (2017-2025) require BLGF/COA extraction - see research/transparency/26-09-budget.md.'
    'municipality' = 'San Carlos City'
    'province' = 'Pangasinan'
    'fiscal_years' = $fiscal
}
Write-Json $fiscalJson 'data/fiscal_transparency.json'

$competitive = [PSCustomObject]@{
    title = 'San Carlos City Competitive Index'
    description = 'Annual competitiveness indicators measuring local economic performance'
    source = 'Cities and Municipalities Competitiveness Index (CMCI) - Department of Trade and Industry'
    '_status' = 'unverified'
    '_note' = 'CMCI pillar scores for San Carlos City, Pangasinan could not be verified during research (2026-09-04); previous placeholder values have been removed. Retrieve official scores from cmci.dti.gov.ph.'
    years = @()
    pillars = @()
}
Write-Json $competitive 'data/competitive-index.json'