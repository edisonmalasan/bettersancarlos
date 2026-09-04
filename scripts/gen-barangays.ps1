# Generate barangays.json and barangay-officials.json from research captains data
# Source: research/barangays/26-09-barangay-directory.md (official LGU list archived 2024-06-03)
$data = @(
    @('Abanon','Juan C. Paningbatan','09465815209'),
    @('Agdao','Ana Marie Arguell','09282087902'),
    @('Anando','Ranny Francisco','09751420351'),
    @('Ano','Marciano Sales','09517344046'),
    @('Antipangol','Lito C. De Guzman','09086730582'),
    @('Aponit','Renan D. Dela Cruz','09090957205'),
    @('Bacnar','Antonio R. Mislang','09066057819'),
    @('Balaya','Paterno Resuello','09262724463'),
    @('Balayong','Andres G. Reyes','09196160249'),
    @('Baldog','Francisco C. Franza Jr.','09317417199'),
    @('Balite Sur','Leonardo B. De Vera','09369633538'),
    @('Balococ','Gabriel P. Rosario','09186875696'),
    @('Bani','Roberto C. Dela Cruz','09186289933'),
    @('Bega','Oscar C. Arellano','09473664750'),
    @('Bocboc','Fernando Erguiza','09465889759'),
    @('Bogaoan','Boyet P. Perez','09674355930'),
    @('Bolingit','Jherwin R. Lumanlan','09457961359'),
    @('Bolosan','Dionel B. Perez','09511289017'),
    @('Bonifacio','Alex Martinez','09297061518'),
    @('Buenglat','Jerry M. Rosario','09705053795'),
    @('Bugallon-Posadas St.','Jonas S. Pamintuan','09075178350'),
    @('Burgos-Padlan','Loreto DV. Baguio','09124693478'),
    @('Cacaritan','Jose R. Soriano','09614857488'),
    @('Caingal','Jaime A. Apostol','09924258763'),
    @('Calobaoan','Bienvenido Q. Arce Jr.','09158741072'),
    @('Calomboyan','Ronaldo R. Zacarias','09305481815'),
    @('Caoayan-Kiling','Arnold Berma','09067380372'),
    @('Capataan','Edilberto F. Pamintuan','09397594096'),
    @('Cobol','Dionisio D. Caldona','09059001315'),
    @('Coliling','Jose Christopher Gallego','09178910108'),
    @('Cruz','Leonardo Bandong','09556629766'),
    @('Doyong','Danilo Palagana','09464969107'),
    @('Gamata','Rodolfo De Guzman','09478789450'),
    @('Guelew','Joe NG. Lazaga','09287278101'),
    @('Ilang','Reynaldo DV. Caranto','09998221247'),
    @('Inerangan','Roger A. Carlos','09810316155'),
    @('Isla','Noel Cruz','09533722009'),
    @('Libas','Joel M. Paronable','09675945618'),
    @('Lilimasan','Jonand Rey Estabillo','09393546144'),
    @('Longos','Anthony Magallanes','09179307541'),
    @('Lucban','Romeo Gille','09706551250'),
    @('Mabalbalino','Nestor B. Alcantara','09058140597'),
    @('Mabini','Marieto B. Meneses','09499354143'),
    @('Magtaking','Rolando Versosa','09469973251'),
    @('Malaca\u00f1ang','Ryan Pagsolingan','09264443247'),
    @('Maliwara','Mar C. Posadas','09958929079'),
    @('Mamarlao','Ronnie Dauz','09751405828'),
    @('Manzon','Ernesto S. Garcia','09095968114'),
    @('Matagdem','Thelma B. Taroma','09951441045'),
    @('Mestizo Norte','Cesario M. Prada','09914177914'),
    @('M. Soriano St.','Marianito Quintas','09687761408'),
    @('Naguilayan','Vergil Reyes','09518662593'),
    @('Nelintap','Jovito Rosario','09398916134'),
    @('Padilla-Gomez','Eduardo M. Magalong','09977929933'),
    @('Pagal','Marissa S. De Guzman','09178507591'),
    @('Paitan-Panoypoy','Genaro Diadid Jr.','09293864947'),
    @('Palaming','Kevin George Calugay','09918003142'),
    @('Palaris','Martinez G. Vincent','09916916242'),
    @('Palospos','Orlando DC. Bacani','09759888159'),
    @('Pangalangan','Jose D. Dela Cruz','09430551988'),
    @('Pangoloan','Ricardo Cayabyab','09491650218'),
    @('Pangpang','Eduardo R. Aquino Sr.','09327389054'),
    @('Parayao','Alexander Magat','09391054564'),
    @('Payapa','Zaldy T. Ferrer','09186301950'),
    @('Payar','Reynaldo Paragas','09471601313'),
    @('Perez Boulevard','Lance Soriano','09158800347'),
    @('PNR Station Site','Loreto Leocandio','09507928824'),
    @('Polo','Roberto D. Aquino','09282087902'),
    @('Quezon Boulevard','Myrna S. Estabillo','09183786633'),
    @('Quintong','Luis M. Jutie Jr.','09464304842'),
    @('Rizal Avenue','Hilario C. Cruz Jr.','09688567313'),
    @('Roxas Boulevard','Edberto C. Millora','09667280238'),
    @('Salinap','Rodrigo C. Tandoc','09322678063'),
    @('San Juan','Joseph Vedana','09083708940'),
    @('San Pedro-Taloy','Juanito Aquino','09474513556'),
    @('Sapinit','Eduardo C. Tamondong','09994219969'),
    @('Supo','Arsenio C. Camacho','09272380850'),
    @('Talang','Jaime P. Posadas Jr.','09338189562'),
    @('Tamayo','Angel DC. De Leon','09262730652'),
    @('Tandang Sora','Josephine C. Co','09685652873'),
    @('Tandoc','Ramil Macalanda','09635168301'),
    @('Tarece','Gerardo C. Mercado','09172014984'),
    @('Tarectec','Roberto C. Valdez','09388205015'),
    @('Tayambani','Rogelio C. Daroy','09666470526'),
    @('Tebag','Raymundo P. Dulay','09196496772'),
    @('Turac','Samuel C. Cayabyab','09464969107')
)

# Build barangays.json (names + captains)
$barangays = $data | ForEach-Object {
    [PSCustomObject]@{ name = $_[0]; captain = $_[1] }
}
$barangaysJson = [PSCustomObject]@{ barangays = $barangays }
$barangaysJson | ConvertTo-Json -Depth 4 | Out-File -Encoding utf8 'src/data/barangays.json'
Write-Host "barangays.json written: $($data.Count) barangays"

# Build barangay-officials.json (schema compatible with [slug]/page.tsx)
$positionOfficials = $data | ForEach-Object {
    [PSCustomObject]@{
        barangay = $_[0]
        total_officials = 1
        tel = $_[2]
        positions = @(
            [PSCustomObject]@{ position = 'Punong Barangay'; count = 1; officials = @($_[1]) }
        )
    }
}
$boJson = [PSCustomObject]@{
    province = 'PANGASINAN'
    municipality = 'SAN CARLOS'
    region = 'REGION I'
    term = '2023-2026'
    source = 'City Government of San Carlos — Barangay Officials (official LGU site, archived 2024-06-03); research/barangays/26-09-barangay-directory.md'
    barangay_count = $data.Count
    total_officials = $data.Count
    barangays = $positionOfficials
}
$boJson | ConvertTo-Json -Depth 6 | Out-File -Encoding utf8 'src/data/barangay-officials.json'
Write-Host "barangay-officials.json written: $($data.Count) barangays"