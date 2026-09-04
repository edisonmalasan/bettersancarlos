# Generator: ordinances.json + resolutions.json + dpwh-projects.json
$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)
function Write-Json($obj, $path) {
    $json = $obj | ConvertTo-Json -Depth 8
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), $json, $enc)
    Write-Host "wrote $path"
}
$ordinances = @(
    [PSCustomObject]@{ ordinanceNo = '2025-05-11'; title = 'An Ordinance Creating the Film Development Council of the City of San Carlos, Pangasinan, Providing for Its Powers and Functions, and for Other Purposes'; sessionDate = '2025-04-21' },
    [PSCustomObject]@{ ordinanceNo = '2025-04-11'; title = 'An Ordinance Prohibiting the Entry of Nuisance Contraband Inside the San Carlos District Jail in the City of San Carlos, Pangasinan, and Providing Penalties for Violation Thereof'; sessionDate = '2025-04-21' },
    [PSCustomObject]@{ ordinanceNo = '2025-03-11'; title = 'An Ordinance Creating the San Carlos Municipal Housing Board, Defining Its Powers and Functions, and for Other Purposes'; sessionDate = '2025-03-03' },
    [PSCustomObject]@{ ordinanceNo = '2025-02-11'; title = 'An Ordinance Requiring All Households in the City of San Carlos, Pangasinan to Comply with Zero Open Defecation (ZOD), Providing for Its Guidelines and Penalties for Violation and Appropriating Funds Therefor'; sessionDate = '2025-02-25' },
    [PSCustomObject]@{ ordinanceNo = '2025-01-11'; title = 'An Ordinance Revising the Gender and Development Code of the City of San Carlos, Pangasinan and for Other Purposes, Subject to All Laws and Existing Rules and Regulations'; sessionDate = '2025-02-25' }
)
$ordinancesJson = [PSCustomObject]@{
    '_status' = 'unverified'
    '_note' = 'Entries reference the City of San Carlos, Pangasinan but could not be verified against the Sangguniang Panlungsod archive during research (SP subdomain unreachable, 2026-09-04). See research/legislation/26-09-legislation-archive.md.'
    ordinances = $ordinances
}
Write-Json $ordinancesJson 'data/ordinances.json'

$resolutionsJson = [PSCustomObject]@{
    '_status' = 'unverified'
    '_note' = 'No Sangguniang Panlungsod resolutions for San Carlos City, Pangasinan could be verified during research (2026-09-04); the previous contents referenced a different San Carlos municipality (Nueva Vizcaya) and have been removed. See research/legislation/26-09-legislation-archive.md.'
    resolutions = @()
}
Write-Json $resolutionsJson 'data/resolutions.json'

$dpwhJson = [PSCustomObject]@{
    '_status' = 'unverified'
    '_note' = 'No verified DPWH infrastructure project list for San Carlos City, Pangasinan was available during research (2026-09-04); the previous contents referenced barangays of a different San Carlos (Nueva Vizcaya) and have been removed. Pull official data from the DPWH Transparency Portal.'
    summary = [PSCustomObject]@{
        totalProjects = 0
        totalCost = 0
        completedProjects = 0
        ongoingProjects = 0
        implementingAgency = 'DPWH Pangasinan District Engineering Office (pending verification)'
    }
    projects = @()
}
Write-Json $dpwhJson 'data/dpwh-projects.json'