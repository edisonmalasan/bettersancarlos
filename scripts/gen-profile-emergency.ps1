# RETIRED (civic-data-pipeline phases 2+5): data/emergency-hotlines.json and
# data/city-profile.json are now generated from canonical civic records via
# `bun run data:generate` (see docs/data-pipeline.md). All facts below moved
# to data/civic/records.json. This script throws instead of writing so it can
# never fork either file again.
throw 'scripts/gen-profile-emergency.ps1 is retired; run `bun run data:generate` instead (see docs/data-pipeline.md).'
# Generator: city-profile.json (emergency-hotlines.json retired - see below)
$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)
function Write-Json($obj, $path) {
    $json = $obj | ConvertTo-Json -Depth 8
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), $json, $enc)
    Write-Host "wrote $path"
}
# RETIRED (civic-data-pipeline phase 2): data/emergency-hotlines.json is now
# generated from canonical civic records via `bun run data:generate`
# (see docs/data-pipeline.md). Do not re-add hardcoded facts here.

$cityProfile = [PSCustomObject]@{
    '_schema_version' = '1.0'
    '_status' = 'verified'
    '_updated' = '2026-09-04'
    '_source' = 'research/city-profile/26-09-city-profile.md (PSA 2020 CPH via PhilAtlas; Province of Pangasinan; official LGU site)'
    official_name = 'City of San Carlos'
    local_names = [PSCustomObject]@{
        pangasinan = 'Siyudad na San Carlos'
        ilocano = 'Siudad ti San Carlos'
        filipino = 'Lungsod ng San Carlos'
    }
    type = 'Component city'
    income_class = '3rd class city'
    province = 'Pangasinan'
    region = 'Ilocos Region (Region I)'
    legislative_district = 'Pangasinan 3rd District'
    coordinates = [PSCustomObject]@{ lat = 15.928056; lng = 120.348889 }
    elevation_m = 10.8
    land_area_km2 = 169.03
    barangays = 86
    population = [PSCustomObject]@{ total = 205424; year = 2020; source = 'PSA 2020 Census of Population and Housing' }
    postal_code = '2420'
    area_code = '075'
    founded = '1578 (Wikipedia) / 1587 (LGU history) - conflicting, see research'
    cityhood = 'RA No. 4487 signed 19 June 1965; effective 1 January 1966'
    nicknames = @('Heart of Pangasinan', 'Mango and Bamboo Capital of the Philippines')
    mayor = 'Hon. Julier "Ayoy" C. Resuello'
    vice_mayor = 'Hon. Joseres "Bogs" S. Resuello'
    contact = [PSCustomObject]@{
        address = 'City Hall Building, Palaris Street, San Carlos City, Pangasinan 2420'
        phone = '(075) 600-1432'
        email = 'CIO@sancarlospangasinan.com'
        website = 'https://sancarlospangasinan.gov.ph'
        facebook = 'https://www.facebook.com/sccp.cio'
    }
    vision = 'San Carlos City is envisioned to be an environment-friendly Agro-Industrial, Education and Tourism Center of Pangasinan with upbeat and robust commercial activities structured on efficient services, harmonious relationship and peace towards sustainable development and improved quality of life of its people.'
    mission = 'To make San Carlos City the economic tiger of the North through highly disciplined and committed work force and improved agro-industrial, commercial, educational and tourism initiatives thus enhancing the quality of life of its people.'
}
Write-Json $cityProfile 'data/city-profile.json'