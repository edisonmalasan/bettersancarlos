# Generator: news.json (verified events from research)
$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)
function Write-Json($obj, $path) {
    $json = $obj | ConvertTo-Json -Depth 8
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), $json, $enc)
    Write-Host "wrote $path"
}
$news = @(
    [PSCustomObject]@{
        id = 'fire-old-public-market-2024'
        title = 'Fire razes old public market in San Carlos City'
        date = '2024-08-22'
        category = 'Advisory'
        badge = 'danger'
        summary = 'A structure fire razed the old public market in San Carlos City, Pangasinan. Vendors were relocated while the city assesses rebuilding plans (Philippine News Agency).'
        url = 'https://www.pna.gov.ph/articles/1231749'
    },
    [PSCustomObject]@{
        id = 'resuello-re-elected-2025'
        title = 'Resuello, Resuello re-elected in 2025 local elections'
        date = '2025-05-12'
        category = 'Election'
        badge = 'info'
        summary = 'Mayor Julier "Ayoy" Resuello and Vice Mayor Joseres "Bogs" Resuello were re-elected in the May 12, 2025 national and local elections along with 10 city councilors (Comelec media server via Rappler).'
        url = 'https://ph.rappler.com/elections/2025/local-race/pangasinan/san-carlos-city'
    },
    [PSCustomObject]@{
        id = 'sglg-award'
        title = 'San Carlos City secures Seal of Good Local Governance'
        date = '2025-12-07'
        category = 'Award'
        badge = 'success'
        summary = 'The city government announced securing the Seal of Good Local Governance (SGLG), citing excellence in governance standards (official LGU announcement, archived).'
        url = 'https://web.archive.org/web/20251207010329/https://www.sancarlospangasinan.gov.ph/san-carlos-city-pangasinan-a-beacon-of-excellence-in-governance-securing-the-seal-of-good-local-governance-sglg-award'
    },
    [PSCustomObject]@{
        id = 'cenpelco-mass-disconnection-2024'
        title = 'CENPELCO announces mass disconnection drive'
        date = '2024-01-15'
        category = 'Advisory'
        badge = 'warning'
        summary = 'The Central Pangasinan Electric Cooperative (CENPELCO) implemented a mass disconnection of delinquent accounts in San Carlos starting January 2024, citing the Magna Carta for Electricity Consumers (official LGU announcement, archived).'
        url = 'https://web.archive.org/web/20251207004003/https://www.sancarlospangasinan.gov.ph/cenpelcos-implementation-of-mass-disconnection-in-san-carlos-pangasinan'
    },
    [PSCustomObject]@{
        id = 'drug-cleared-barangays-2025'
        title = '2 more barangays declared drug-cleared'
        date = '2025-07-08'
        category = 'Public Safety'
        badge = 'success'
        summary = 'The city announced two additional drug-cleared barangays as part of its anti-illegal drugs program (official LGU announcement, archived).'
        url = 'https://web.archive.org/web/20250708072406/https://www.sancarlospangasinan.gov.ph/2-drug-cleared-barangays-in-the-city'
    }
)
$newsJson = [PSCustomObject]@{
    '_status' = 'verified'
    '_source' = 'research/news/26-09-news-current-events.md (PNA, Rappler/Comelec, official LGU announcements)'
    news = $news
}
Write-Json $newsJson 'data/news.json'