<?php
header('Content-Type: application/json; charset=utf-8');

function json_error($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Invalid request method. Use POST.', 405);
}
$id=isset($_POST['id'])? trim($_POST['id']):'';
if ($id === '' || !is_numeric($id)) {
    json_error('Invalid or missing ID.');
}
require "db_connection.php";
try{

$sql="DELETE FROM admin WHERE admin_id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$id]);
if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => true]);
} else {
    json_error('the admin is not found or already deleted.');
}
} catch (PDOException $e) {
    json_error('Database error: ' . $e->getMessage());

}