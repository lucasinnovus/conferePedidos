<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

if (!isset($enviados) || !is_array($enviados)) {
    die("Erro: Arquivos não foram corretamente enviados.");
}

$arquivo1 = $upload_dir . $enviados[0];
$arquivo2 = $upload_dir . $enviados[1];

if (!file_exists($arquivo1) || !file_exists($arquivo2)) {
    echo 'Erro:"Um ou ambos arquivos não existem no diretório';
}

try {
    $spreadsheet1 = IOFactory::load($arquivo1);
    $spreadsheet2 = IOFactory::load($arquivo2);
} catch (Exception $e) {
    die('Erro ao carregar os arquivos: ' . $e->getMessage());
}

$activeSheet1 = $spreadsheet1->getActiveSheet();
$activeSheet2 = $spreadsheet2->getActiveSheet();

//Pega o título da aba ativa
$sheetName1 = ($activeSheet1->getTitle());
$sheetName2 = ($activeSheet2->getTitle());

//Verifica se o título bate com o padrão, a fim de identificar qual arquivo é qual
if ($sheetName1 === 'Petronas_Cativo') {
    $planilhaCativo = $arquivo1;
} elseif ($sheetName2 === 'Petronas_Cativo') {
    $planilhaCativo = $arquivo2;
}

if ($sheetName1 === 'Export') {
    $planilhaPetronas = $arquivo1;
} elseif ($sheetName2 === 'Export') {
    $planilhaPetronas = $arquivo2;
}

if ($planilhaCativo != '' && $planilhaPetronas != '') {
    require('manipulacao_excel.php');
} else {
    echo 'erro';
}