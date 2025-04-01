@echo off
title Servidor PHP Local (HTTPS)
cls

:: Defina o caminho do PHP
set PHP_PATH=C:\php\php.exe

:: Defina o diretório do seu aplicativo (onde está o index.php)
set APP_DIR=C:\Users\lcardoso\Desktop\conferePedidos

:: Defina a porta do servidor (alterar se necessário)
set PORT=8000

:: Caminho para o certificado SSL
set SSL_CERT=C:\Users\lcardoso\Desktop\conferePedidos\server.crt
set SSL_KEY=C:\Users\lcardoso\Desktop\conferePedidos\server.key

:: Defina o IP do servidor para permitir acesso na rede
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do set IP=%%a
set IP=%IP:~1%

:: Muda para o diretório do aplicativo
cd /d %APP_DIR%

:: Inicia o servidor PHP com HTTPS usando OpenSSL
echo Iniciando servidor PHP em https://%IP%:%PORT%/
"%PHP_PATH%" -S 0.0.0.0:%PORT% -t %APP_DIR% -d openssl.cafile=%SSL_CERT% -d openssl.local_cert=%SSL_CERT% -d openssl.local_key=%SSL_KEY%

pause
