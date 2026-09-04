# Generator: demographics.json (PSA 2020 CPH via PhilAtlas)
$ErrorActionPreference = 'Stop'
$enc = New-Object System.Text.UTF8Encoding($false)
function Write-Json($obj, $path) {
    $json = $obj | ConvertTo-Json -Depth 8
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), $json, $enc)
    Write-Host "wrote $path"
}
$brgyPops = @(
    @('Abanon',1974,1877),@('Agdao',3983,3776),@('Anando',1106,1048),@('Ano',2799,2758),
    @('Antipangol',1802,1889),@('Aponit',2580,2128),@('Bacnar',5717,5145),@('Balaya',1938,1906),
    @('Balayong',2166,1883),@('Baldog',2152,2001),@('Balite Sur',4110,3346),@('Balococ',2170,1736),
    @('Bani',690,723),@('Bega',2446,2013),@('Bocboc',991,1122),@('Bogaoan',2613,2692),
    @('Bolingit',3679,3285),@('Bolosan',1979,1109),@('Bonifacio',521,618),@('Buenglat',1993,1552),
    @('Bugallon-Posadas St.',801,513),@('Burgos-Padlan',1194,1240),@('Cacaritan',2869,2220),
    @('Caingal',1553,1435),@('Calobaoan',3992,3608),@('Calomboyan',3887,3514),@('Caoayan-Kiling',4478,4261),
    @('Capataan',2626,2221),@('Cobol',3959,3640),@('Coliling',5173,4541),@('Cruz',2104,2027),
    @('Doyong',2312,2175),@('Gamata',1799,2161),@('Guelew',4093,4116),@('Ilang',1381,1226),
    @('Inerangan',1678,1504),@('Isla',2901,2520),@('Libas',3981,4030),@('Lilimasan',2738,2488),
    @('Longos',1203,1205),@('Lucban',985,1070),@('Mabalbalino',1936,1173),@('Mabini',425,678),
    @('Magtaking',3016,2926),@('Malaca\u00f1ang',3837,3882),@('Maliwara',817,822),@('Mamarlao',3122,2679),
    @('Manzon',2191,1779),@('Matagdem',3406,3216),@('Mestizo Norte',1783,1592),@('M. Soriano St.',745,932),
    @('Naguilayan',1784,1626),@('Nelintap',1632,1417),@('Padilla-Gomez',2029,2096),@('Pagal',4714,4121),
    @('Paitan-Panoypoy',1791,1656),@('Palaming',3141,2823),@('Palaris',514,616),@('Palospos',1621,1480),
    @('Pangalangan',3474,3112),@('Pangoloan',1539,1523),@('Pangpang',3579,3140),@('Parayao',1189,934),
    @('Payapa',1428,1295),@('Payar',1814,1667),@('Perez Boulevard',677,694),@('PNR Station Site',1063,890),
    @('Polo',1783,1654),@('Quezon Boulevard',1891,1599),@('Quintong',3964,3709),@('Rizal Avenue',2713,2579),
    @('Roxas Boulevard',1385,1503),@('Salinap',2670,2471),@('San Juan',3468,2900),@('San Pedro-Taloy',2408,2551),
    @('Sapinit',1661,1360),@('Supo',1607,1480),@('Talang',1637,1611),@('Tamayo',3547,3059),
    @('Tandang Sora',582,585),@('Tandoc',3801,3758),@('Tarece',4474,4666),@('Tarectec',1674,1525),
    @('Tayambani',1491,1540),@('Tebag',1366,1228),@('Turac',6919,5702)
)
$brgyArr = $brgyPops | ForEach-Object {
    [PSCustomObject]@{ name = $_[0]; population_2020 = $_[1]; population_2015 = $_[2] }
}
$censusHistory = @(
    [PSCustomObject]@{ year = 1903; population = 27166 },
    [PSCustomObject]@{ year = 1918; population = 35780 },
    [PSCustomObject]@{ year = 1939; population = 47334 },
    [PSCustomObject]@{ year = 1948; population = 61671 },
    [PSCustomObject]@{ year = 1960; population = 73900 },
    [PSCustomObject]@{ year = 1970; population = 84333 },
    [PSCustomObject]@{ year = 1975; population = 90882 },
    [PSCustomObject]@{ year = 1980; population = 101243 },
    [PSCustomObject]@{ year = 1990; population = 124529 },
    [PSCustomObject]@{ year = 1995; population = 134039 },
    [PSCustomObject]@{ year = 2000; population = 154264 },
    [PSCustomObject]@{ year = 2007; population = 161884 },
    [PSCustomObject]@{ year = 2010; population = 175103 },
    [PSCustomObject]@{ year = 2015; population = 188571 },
    [PSCustomObject]@{ year = 2020; population = 205424 }
)
$demographics = [PSCustomObject]@{
    '_schema_version' = '1.1'
    '_status' = 'verified'
    '_source' = 'Philippine Statistics Authority - 2020 Census of Population and Housing (via PhilAtlas); City Government of San Carlos official pages (archived 2024-06-03)'
    '_note' = 'San Carlos City, Pangasinan. PSA 2020 CPH figures are the most recent published census.'
    'municipality' = 'San Carlos City'
    'province' = 'Pangasinan'
    'region' = 'Region I - Ilocos Region'
    'population' = [PSCustomObject]@{ total = 205424; year = 2020; source = 'PSA 2020 Census of Population and Housing' }
    'land_area_km2' = 169.03
    'barangay_count' = 86
    'income_class' = '3rd'
    'coordinates' = [PSCustomObject]@{ lat = 15.928056; lng = 120.348889 }
    'census_history' = $censusHistory
    'households' = [PSCustomObject]@{ count = 42049; year = 2015; average_size = 4.48 }
    'barangays' = $brgyArr
}
Write-Json $demographics 'data/demographics.json'