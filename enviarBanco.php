<?php
include('includes/banco.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$myConn) {
    die("Falha na conexão " . mysqli_connect_error());
}

if (isset($data['cativo']) && is_array($data['cativo'])) {

    $errors = [];
    $sql = "INSERT INTO pedidosaenviar (nrpedido) VALUES (?) ";
    $stmt = mysqli_prepare($myConn, $sql);

    if (!$stmt) {
        die("Erro ao preparar a query: " . mysqli_error($myConn));
    }

    foreach ($data['cativo'] as $row) {
        $nrpedido = preg_replace("/[^A-z0-9 ]/", "", $row);

        try {
            mysqli_stmt_bind_param($stmt, 's', $nrpedido);
            mysqli_stmt_execute($stmt);
        } catch (Exception $e) {
            $errors[] = [
                'Error' => $e = mysqli_stmt_error($stmt)
            ];
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($myConn);

    if (empty($errors)) {
        echo json_encode(['status' => 'Success']);
    } else {
        echo json_encode($error, JSON_PRETTY_PRINT);
    }
}

