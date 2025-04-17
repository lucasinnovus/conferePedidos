<?php
include('includes/banco.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if (!$myConn) {
    die("Falha na conexão " . mysqli_connect_error());
}

$tipo = (isset($data['cativo']) && is_array($data['cativo'])) ? 'cativo' : 'petronas';
if ($tipo === 'cativo' || 'petronas') {
    $errors = [];
    $sql = $tipo === 'cativo' ? "INSERT INTO pedidosAEnviar (nrpedido) VALUES (?)" : "INSERT INTO pedidosACancelar (nrpedido) VALUES (?) ";
    $stmt = mysqli_prepare($myConn, $sql);
    if (!$stmt) {
        die("Erro ao preparar a query: " . mysqli_error($myConn));
    }
    mysqli_stmt_bind_param($stmt, 's', $nrpedido);
    foreach ($data[$tipo] as $row) {
        try {
            $nrpedido = preg_replace("/[^A-z0-9 ]/", "", $row);
            mysqli_stmt_execute($stmt);
        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() === 1062) {
                $errors[] = [
                    'status' => 'Error',
                    'message' => $e->getMessage(),
                    'pedido' => $nrpedido
                ];
            }
        }
    }
    mysqli_stmt_close($stmt);
    mysqli_close($myConn);

    if (empty($errors)) {
        echo json_encode(['status' => 'Success']);
    } else {
        echo json_encode($errors, JSON_PRETTY_PRINT);
    }
}

