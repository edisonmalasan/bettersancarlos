# Generator: emergency-hotlines.json + city-profile.json (new data packs from research)
$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)
function Write-Json($obj, $path) {
    $json = $obj | ConvertTo-Json -Depth 8
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), $json, $enc)
    Write-Host "wrote $path"
}
$national = @(
    [PSCustomObject]@{ service = 'National Emergency Hotline'; number = '911'; status = 'verified'; source = 'https://911.gov.ph/' },
    [PSCustomObject]@{ service = 'PNP Emergency Hotline'; number = '117'; status = 'verified'; source = 'https://pnp.gov.ph/' },
    [PSCustomObject]@{ service = 'Philippine Red Cross'; number = '143'; status = 'verified'; source = 'https://redcross.org.ph/' },
    [PSCustomObject]@{ service = 'Citizens Complaint Hotline (Office of the President)'; number = '8888'; status = 'verified'; source = 'https://8888.gov.ph/' }
)
$cityLines = @(
    [PSCustomObject]@{ service = 'City Hall (general trunk line)'; number = '(075) 600-1432'; status = 'verified'; source = 'https://sancarlospangasinan.gov.ph/' },
    [PSCustomObject]@{ service = 'CDRRMO (Disaster Risk Reduction and Management Office)'; number = '(075) 955-5911'; status = 'historical - re-verify'; source = 'old official site (archived 2017-03-22)' },
    [PSCustomObject]@{ service = 'Police Station (PNP San Carlos)'; number = '(075) 532-9896'; status = 'historical - re-verify'; source = 'old official site (archived 2017-03-22)' },
    [PSCustomObject]@{ service = 'Fire Station (BFP San Carlos)'; number = '(075) 544-2887'; status = 'historical - re-verify'; source = 'old official site (archived 2017-03-22)' }
)
$emergency = [PSCustomObject]@{
    '_schema_version' = '1.0'
    '_status' = 'partially-verified'
    '_updated' = '2026-09-04'
    '_source' = 'research/emergency/26-09-emergency-hotlines.md'
    '_note' = 'National numbers are widely published. City-level numbers marked historical come from the decommissioned official website (2017) and must be re-dialed and verified before being treated as current.'
    'city' = 'San Carlos City'
    'province' = 'Pangasinan'
    national = $national
    city_hotlines = $cityLines
}
Write-Json $emergency 'data/emergency-hotlines.json'

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