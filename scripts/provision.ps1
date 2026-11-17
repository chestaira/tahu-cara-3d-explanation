param([Parameter(Mandatory=$true)][string]$ProjectPath)
$ErrorActionPreference = 'Stop'
$assetRoot = Join-Path (Split-Path $PSScriptRoot -Parent) 'assets'
$mapping = @{'logo.png'='public/logo.png';'sfx/whoosh.mp3'='public/sfx/whoosh.mp3';'sfx/ui popup.mp3'='public/sfx/ui popup.mp3';'sfx/click.mp3'='public/sfx/click.mp3';'sfx/bgm.mp3'='public/sfx/bgm.mp3';'core/CoreEnvironment.tsx'='src/components/core/CoreEnvironment.tsx';'core/KaraokeSubtitle.tsx'='src/components/core/KaraokeSubtitle.tsx';'core/CalloutPointer.tsx'='src/components/core/CalloutPointer.tsx';'core/BrandOutro.tsx'='src/components/core/BrandOutro.tsx'}
$mapping['core/TopDataCard.tsx']='src/components/core/TopDataCard.tsx'
$referenceRoot=Join-Path $assetRoot 'reference'
if(!(Test-Path -LiteralPath $referenceRoot)){throw "Missing Golden Reference Blueprint: $referenceRoot"}
foreach($file in Get-ChildItem -LiteralPath $referenceRoot -File -Recurse){
  $relative=$file.FullName.Substring($referenceRoot.Length+1).Replace('\','/')
  $mapping["reference/$relative"]="reference/explanation-3d/$relative"
}
# Preflight every source and collision before copying. Never overwrite project edits.
foreach($item in $mapping.GetEnumerator()){
  $source=Join-Path $assetRoot $item.Key; $target=Join-Path $ProjectPath $item.Value
  if(!(Test-Path -LiteralPath $source)){throw "Missing skill asset: $source"}
  if((Test-Path -LiteralPath $target) -and ((Get-FileHash -LiteralPath $source).Hash -ne (Get-FileHash -LiteralPath $target).Hash)){throw "Project file differs: $target"}
}
foreach($item in $mapping.GetEnumerator()){
  $source=Join-Path $assetRoot $item.Key; $target=Join-Path $ProjectPath $item.Value
  New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
  if(!(Test-Path -LiteralPath $target)){Copy-Item -LiteralPath $source -Destination $target}
}
Write-Output "Provisioned logo, 4 audio assets, 5 core components, and Golden Reference Blueprint ($($mapping.Count) files): $ProjectPath"
