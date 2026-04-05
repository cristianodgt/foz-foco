$ErrorActionPreference = 'Stop'
$dir = 'C:/Users/crist/foz-foco-real/.planning/research/stitch'
$urls = @{
  'desktop.html'  = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U2Nzc3ZWUxMDYzODRjMDhiYzBhNzRiZjk4MzEyNmIwEgsSBxCH8OTHphcYAZIBIwoKcHJvamVjdF9pZBIVQhM4MTQwNzYwODY0NzQ1OTU3OTQ2&filename=&opi=96797242'
  'mobile-a.html' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzljM2MwYzdlYWZjMTQyMzZhMmViNDNjMjliMjBkNWQzEgsSBxCH8OTHphcYAZIBIwoKcHJvamVjdF9pZBIVQhM4MTQwNzYwODY0NzQ1OTU3OTQ2&filename=&opi=96797242'
  'mobile-b.html' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZlOTIzMDRiODJkNDQyOWQ5Yzk2MzU3MGFhM2Y1M2NlEgsSBxCH8OTHphcYAZIBIwoKcHJvamVjdF9pZBIVQhM4MTQwNzYwODY0NzQ1OTU3OTQ2&filename=&opi=96797242'
  'mobile-c.html' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2VjOWJmM2QzMzMyNDQ4ZGVhODIyN2VhYjk5Zjc0MWI4EgsSBxCH8OTHphcYAZIBIwoKcHJvamVjdF9pZBIVQhM4MTQwNzYwODY0NzQ1OTU3OTQ2&filename=&opi=96797242'
}
foreach ($k in $urls.Keys) {
  $out = Join-Path $dir $k
  Invoke-WebRequest -Uri $urls[$k] -OutFile $out -UseBasicParsing
  $size = (Get-Item $out).Length
  Write-Host "$k -> $size bytes"
}
