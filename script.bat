@echo off
title Servidor PHP Local
cls

:: Defina o caminho do PHP se necessário
set PHP_PATH=C:\php\php.exe

:: Defina o diretório do seu aplicativo (onde está o index.php)
set APP_DIR=C:\Users\lcardoso\Desktop\conferePedidos\index.php

:: Defina a porta do servidor (altere se necessário)
set PORT=8000

:: Defina o IP do servidor para permitir acesso na rede
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do set IP=%%a
set IP=%IP:~1%

:: Muda para o diretório do aplicativo
cd /d %APP_DIR%

:: Inicia o servidor PHP
echo Iniciando servidor PHP em http://%IP%:%PORT%/
"%PHP_PATH%" -S 0.0.0.0:%PORT%

pause