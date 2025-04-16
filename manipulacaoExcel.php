<?php

ini_set('memory_limit', '2048M');
ini_set('max_execution_time', '300');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

// Carregar as planilhas enviadas
$spreadsheet1 = IOFactory::load($planilhaCativo);
$spreadsheet2 = IOFactory::load($planilhaPetronas);

// Obter a aba ativa das planilhas
$sheet1 = $spreadsheet1->getActiveSheet();
$sheet2 = $spreadsheet2->getActiveSheet();

// Definindo os títulos das planilhas para facilitar o acesso
$sheet1->setTitle('Planilha1');  // Título da primeira planilha
$sheet2->setTitle('Planilha2');  // Título da segunda planilha

// Insere novas colunas no arquivo 1
$sheet1->insertNewColumnBefore('E', 2); // Insere duas novas colunas antes da coluna E
$sheet1->insertNewColumnBefore('H', 1); // Insere uma novas colunas antes da coluna H

// Insere o nome das colunas no arquivo 1
$sheet1->setCellValue('E1', 'CHAVE');
$sheet1->setCellValue('F1', 'PETRONAS');
$sheet1->setCellValue('H1', 'DIFERENÇA');

// Define formato numérico para colunas E, F e H no arquivo 1
$sheet1->getStyle('E:E')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
$sheet1->getStyle('F:F')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
$sheet1->getStyle('G:G')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
$sheet1->getStyle('H:H')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);

// Adiciona fórmulas às colunas E, F e H no arquivo 1
$sheet1->setCellValue('E2', '=D2&A2');
$sheet1->setCellValue('H2', '=G2-F2');

// Obtém a última linha preenchida na planilha no arquivo 1
$highestRow = $sheet1->getHighestRow();

// Aplica a fórmula dinamicamente na coluna E no arquivo 1
for ($row = 2; $row <= $highestRow; $row++) {
    $sheet1->setCellValue("E$row", "=D$row&A$row"); // Concatena valores das colunas D e A na coluna E
}

// Aplica a fórmula dinamicamente na coluna H no arquivo 1
for ($row = 2; $row <= $highestRow; $row++) {
    $sheet1->setCellValue("H$row", "=G$row-F$row"); // Concatena valores das colunas D e A na coluna E
}

// Insere novas colunas no arquivo 2
$sheet2->insertNewColumnBefore('Y', 3); // Insere duas novas colunas antes da coluna Y
$sheet2->insertNewColumnBefore('AC', 1); // Insere uma novas colunas antes da coluna AB

// Insere o nome das colunas no arquivo 2
$sheet2->setCellValue('Y1', 'PEDIDO');
$sheet2->setCellValue('Z1', 'CHAVE');
$sheet2->setCellValue('AA1', 'CATIVO');
$sheet2->setCellValue('AC1', 'DIFERENÇA');

// Define formato numérico para colunas E, F e H no arquivo 2
$sheet2->getStyle('Y:Y')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
$sheet2->getStyle('Z:Z')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
$sheet2->getStyle('AA:AA')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
$sheet2->getStyle('AC:AC')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
$sheet2->getStyle('AB:AB')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);

// Adiciona fórmulas às colunas E, F e H no arquivo 2
$sheet2->setCellValue('Y2', '=SUBSTITUTE(UPPER(R2), "CATIVO-", "")');
$sheet2->setCellValue('AC2', '=AA2-AB2');

// Obtém a última linha preenchida na planilha no arquivo 2
$highestRow = $sheet2->getHighestRow();

// Aplica a fórmula dinamicamente na coluna E no arquivo 2
for ($row = 2; $row <= $highestRow; $row++) {
    $sheet2->setCellValue("Y$row", "=SUBSTITUTE(UPPER(R$row), \"CATIVO-\", \"\")");
    $sheet2->setCellValue("Z$row", "=Y$row&S$row"); // Concatena valores das colunas D e A na coluna E
}

// Aplica a fórmula dinamicamente na coluna H no arquivo 2
for ($row = 2; $row <= $highestRow; $row++) {
    $sheet2->setCellValue("AC$row", "=AA$row-AB$row"); // Concatena valores das colunas D e A na coluna E
}


// Salvar as planilhas alteradas no arquivo 1 e 2
$writer1 = IOFactory::createWriter($spreadsheet1, 'Xlsx');
$writer1->save('planilha1_atualizada.xlsx');

$writer2 = IOFactory::createWriter($spreadsheet2, 'Xlsx');
$writer2->save('planilha2_atualizada.xlsx');

// Carregando os arquivos atualizados para a aplicação do PROCV
$file1 = 'planilha1_atualizada.xlsx'; // Planilha onde queremos inserir os resultados
$file2 = 'planilha2_atualizada.xlsx'; // Planilha de onde vamos buscar os valores

$spreadsheet1 = IOFactory::load($file1);
$spreadsheet2 = IOFactory::load($file2);

$sheet1 = $spreadsheet1->getActiveSheet(); // Obtém a única planilha
$sheet2 = $spreadsheet2->getActiveSheet(); // Obtém a única planilha

$highestRow1 = $sheet1->getHighestRow(); // Última linha da Planilha 1
$highestRow2 = $sheet2->getHighestRow(); // Última linha da Planilha 2

// Definir colunas onde as chaves e os valores estão localizados
$colunaChavePlanilha1 = 'E';  // Chave na Planilha1
$colunaChavePlanilha2 = 'Z';  // Chave na Planilha2
$colunaRetornoPlanilha2 = 'AB'; // Coluna do valor a ser retornado

// Criar um array associativo para acesso rápido (chave → valor)
$tabela_lookup = [];

for ($row2 = 2; $row2 <= $highestRow2; $row2++) {
    $chave = trim($sheet2->getCell($colunaChavePlanilha2 . $row2)->getCalculatedValue());
    $valor = $sheet2->getCell($colunaRetornoPlanilha2 . $row2)->getCalculatedValue();

    if (!empty($chave)) {
        $tabela_lookup[$chave] = $valor;
    }
}

// Aplicando PROC-V na Planilha 1

$pedidosCativo = [];
$litrosTotais = 0;


for ($row1 = 2; $row1 <= $highestRow1; $row1++) {
    $chave1 = trim($sheet1->getCell($colunaChavePlanilha1 . $row1)->getCalculatedValue());

    if (!empty($chave1)) {
        if (isset($tabela_lookup[$chave1])) {
            $valorEncontrado = $tabela_lookup[$chave1];
        } else {
            // printará o número do pedido relacionado cujo a diferença seja igual a "#N/D. ".
            $pedido = $sheet1->getCell("D$row1")->getCalculatedValue();

            // Somará todos os litros dos pedidos iguais à "#N/D. "
            $litro = $sheet1->getCell("G$row1")->getCalculatedValue();
            $litrosTotais += is_numeric($litro) ? $litro : 0;
            $pedidosCativo[] = "('$pedido')";
            // Define o erro #N/D real do Excel
            $valorEncontrado = '=NA()';
        }

        // 🔹 Insere o valor na coluna F
        $sheet1->setCellValue('F' . $row1, $valorEncontrado);

        // 🔹 Verifica se a coluna H já contém uma fórmula antes de sobrescrever
        $cellH = $sheet1->getCell('H' . $row1);
        if (!$cellH->isFormula()) {
            $sheet1->setCellValue('H' . $row1, $valorEncontrado);
        }
    }
}
$pedidosCativo = array_values(array_unique($pedidosCativo, SORT_REGULAR));
$pedidos[] = [
    "cativo" => $pedidosCativo,
    "litrosTotaisCativo" => $litrosTotais,
];


// Definir colunas onde as chaves e os valores estão localizados
$colunaChavePlanilha2 = 'Z';  // Chave na Planilha2
$colunaChavePlanilha1 = 'E';  // Chave na Planilha1
$colunaRetornoPlanilha2 = 'G'; // Coluna do valor a ser retornado

// Criar um array associativo para acesso rápido (chave → valor)
$tabela_lookup2 = [];

for ($row1 = 2; $row1 <= $highestRow1; $row1++) {
    $chave = trim($sheet1->getCell($colunaChavePlanilha1 . $row1)->getCalculatedValue());
    $valor = $sheet1->getCell($colunaRetornoPlanilha2 . $row1)->getCalculatedValue();

    if (!empty($chave)) {
        $tabela_lookup2[$chave] = $valor;
    }
}

// Aplicando PROC-V na Planilha 2

$pedidosPetronas = [];
$LitrosTotaisPetronas = 0;

for ($row2 = 2; $row2 <= $highestRow2; $row2++) {
    $chave2 = trim($sheet2->getCell($colunaChavePlanilha2 . $row2)->getCalculatedValue());

    if (!empty($chave2) && !preg_match("/GRAXA/", $chave2)) {
        if (isset($tabela_lookup2[$chave2])) {
            $valorEncontrado = $tabela_lookup2[$chave2];
        } else {

            // pegara o número do pedido relacionado cujo a diferença seja igual a "#N/D. ".
            $pedidos2 = $sheet2->getCell("Y$row2")->getCalculatedValue();

            // Somará todos os litros dos pedidos iguais à "#N/D. "
            $litro2 = $sheet2->getCell("AB$row2")->getCalculatedValue();

            $LitrosTotaisPetronas += is_numeric($litro2) ? $litro2 : 0;
            $pedidosPetronas[] = "('$pedidos2')";

            // Define o erro #N/D real do Excel
            $valorEncontrado = '=NA()';
        }

        // Insere o valor na coluna AA
        $sheet2->setCellValue('AA' . $row2, $valorEncontrado);

        // Verifica se a coluna AC já contém uma fórmula antes de sobrescrever
        $cellAC = $sheet2->getCell('AC' . $row2);
        if (!$cellAC->isFormula()) {
            $sheet2->setCellValue('AC' . $row2, $valorEncontrado);
        }
    }
}


$arraySemDuplicatas = array_keys(array_flip($pedidosPetronas));
$pedidos[] = [
    "petronas" => $arraySemDuplicatas,
    "litrosTotaisPetronas" => $LitrosTotaisPetronas,
    "planilhaCat" => $planilhaCativo,
    "planilhaPetr" => $planilhaCativo
];

$jsonPedidos = json_encode($pedidos, true | JSON_PRETTY_PRINT);
echo $jsonPedidos;
$diretorioDestino = 'planilhas/';

// Garante que a pasta de destino existe
if (!is_dir($diretorioDestino)) {
    mkdir($diretorioDestino, 0777, true);
}

$datetime = new DateTime('now', new DateTimeZone('America/Sao_Paulo'));
$timestamp = $datetime->format('Y-m-d_H-i-s');

// Salvar a primeira planilha
$writer1 = IOFactory::createWriter($spreadsheet1, 'Xlsx');
$writer1->save($diretorioDestino . "Confere Cativo $timestamp.xlsx");

// Agora salvar a segunda planilha
$writer2 = IOFactory::createWriter($spreadsheet2, 'Xlsx');
$writer2->save($diretorioDestino . "Confere Petronas $timestamp.xlsx");

if (file_exists($planilhaCativo)) {
    rename($planilhaCativo, 'uploads/' . 'Confere Cativo ' . date('Y-m-d_H-i-s',strtotime("-1 days")) . '.xlsx');

}
if (file_exists($planilhaPetronas)) {
    rename($planilhaPetronas, 'uploads/' . 'Confere Petronas ' . date('Y-m-d_H-i-s',strtotime("-1 days")) . '.xlsx');
}
if (file_exists('planilha1_atualizada.xlsx')) {
    unlink('planilha1_atualizada.xlsx');
}
if (file_exists('planilha2_atualizada.xlsx')) {
    unlink('planilha2_atualizada.xlsx');
}
