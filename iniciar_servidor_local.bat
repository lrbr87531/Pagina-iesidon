@echo off
title Servidor Local - Institucion Etnoeducativa de Sidon
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_local.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Ocurrio un inconveniente al ejecutar el servidor local.
    pause
)
