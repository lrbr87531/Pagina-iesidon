# Servidor Web Local para la Institución Etnoeducativa de Sidón
# Compatible con Windows PowerShell 5.1 y PowerShell 7+ sin dependencias externas

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Servidor Web - Institución Etnoeducativa de Sidón"

$root = $PSScriptRoot
if ([string]::IsNullOrEmpty($root)) {
    $root = (Get-Location).Path
}

# Buscar un puerto disponible empezando en 8080
$port = 8080
$maxPort = 8090
$listener = $null
$started = $false

while (-not $started -and $port -le $maxPort) {
    try {
        $candidate = New-Object System.Net.HttpListener
        $candidate.Prefixes.Add("http://localhost:$port/")
        $candidate.Start()
        $listener = $candidate
        $started = $true
    } catch {
        $port++
    }
}

if (-not $started) {
    Write-Host "======================================================================" -ForegroundColor Red
    Write-Host " Error: No se pudo iniciar el servidor en los puertos 8080 a $maxPort." -ForegroundColor Red
    Write-Host " Verifique si tiene otro programa usando estos puertos." -ForegroundColor Yellow
    Write-Host "======================================================================" -ForegroundColor Red
    Write-Host "Presione cualquier tecla para salir..."
    [void][System.Console]::ReadKey($true)
    exit 1
}

$url = "http://localhost:$port/"

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "       INSTITUCIÓN ETNOEDUCATIVA DE SIDÓN - CUMBITARA, NARIÑO         " -ForegroundColor Yellow
Write-Host "                  SERVIDOR WEB LOCAL ACTIVO                           " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  > Dirección URL:   " -NoNewline
Write-Host $url -ForegroundColor Green
Write-Host "  > Directorio raíz: " -NoNewline
Write-Host $root -ForegroundColor White
Write-Host ""
Write-Host "  * Abriendo el navegador en $url ..." -ForegroundColor Gray
Write-Host "  * Para detener el servidor, cierre esta ventana o presione Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Registro de peticiones:" -ForegroundColor DarkGray

# Abrir el navegador automáticamente
Start-Process $url

# Tipos MIME comunes
$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.webp' = 'image/webp'
    '.pdf'  = 'application/pdf'
    '.mp4'  = 'video/mp4'
    '.webm' = 'video/webm'
    '.docx' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    '.woff2'= 'font/woff2'
    '.woff' = 'font/woff'
    '.ttf'  = 'font/ttf'
    '.xml'  = 'application/xml; charset=utf-8'
    '.txt'  = 'text/plain; charset=utf-8'
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($rawPath)) {
            $rawPath = "index.html"
        }
        $rawPath = [System.Uri]::UnescapeDataString($rawPath)
        $filePath = [System.IO.Path]::Combine($root, $rawPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = 'application/octet-stream'
            if ($mimeTypes.ContainsKey($ext)) {
                $mime = $mimeTypes[$ext]
            }

            $response.ContentType = $mime
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.StatusCode = 200

            # Streaming de archivo para alta eficiencia
            try {
                $fileStream = [System.IO.File]::OpenRead($filePath)
                $response.ContentLength64 = $fileStream.Length
                $fileStream.CopyTo($response.OutputStream)
                $fileStream.Close()
                Write-Host " [200 OK]  $rawPath" -ForegroundColor DarkGreen
            } catch {
                # Conexión cerrada por el cliente antes de terminar
            }
        } else {
            $response.StatusCode = 404
            $response.ContentType = 'text/html; charset=utf-8'
            $notFoundPath = [System.IO.Path]::Combine($root, "404.html")
            if ([System.IO.File]::Exists($notFoundPath)) {
                $bytes = [System.IO.File]::ReadAllBytes($notFoundPath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Archivo no encontrado</h1>")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            Write-Host " [404 NO]  $rawPath" -ForegroundColor Red
        }

        try {
            $response.Close()
        } catch {}
    }
} finally {
    if ($listener -ne $null -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
