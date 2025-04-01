<?php
$currentDirectory = getcwd();
$upload_dir = $currentDirectory . '/uploads/';
$enviado = false;

if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$errors = [];
$fileExtensionAllowed = ['xlsx', 'xls'];

foreach ($_FILES['files']['name'] as $key => $fileName) {
    $fileSize = $_FILES['files']['size'][$key];
    $fileTmpName = $_FILES['files']['tmp_name'][$key];
    $fileType = $_FILES['files']['type'][$key];
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $enviados[] = $fileName;
    if (!in_array($fileExtension, $fileExtensionAllowed)) {
        $errors[] = "Extensão do arquivo não permitida, por favor use: " . implode(' ou ', $fileExtensionAllowed) . ".";
    }
    if ($fileSize > 1000000) {
        $errors[] = "Tamanho do arquivo acima do permitido!";
    }
    if (empty($errors)) {
        if (move_uploaded_file($fileTmpName, $upload_dir . $fileName)) {
//              echo "Arquivo '$fileName' enviado com sucesso!<br>";
            $enviado = true;
        } else {
            $enviado = false;
            echo "Erro ao enviar o arquivo '$fileName'!<br>";
        }
    }
}
foreach ($errors as $error) {
    echo "<p>$error</p>";
}
if ($enviado) {
    require('verificarPlanilha.php');
}

//if(isset($_POST['submit'])) {
//    if(! in_array($fileExtension, $fileExtensionAllowed)) {
//        $errors[] = 'Extensão de arquivo não permitida, por favor use: ' . implode(', ', $fileExtensionAllowed) . '';
//    }
//    if($fileSize > 1000000) {
//        $errors[] = 'Tamanho do arquivo acima do permitido!';
//    }
//    if(empty($errors)) {
//        move_uploaded_file($fileTmpName, $upload_dir . $fileName);
//        echo 'Arquivo enviado com sucesso!';
//    }else{
//        echo 'Erro ao enviar arquivo!';
//    }
//    foreach ($errors as $error) {
//        echo $error . '<br>';
//    }
//}

