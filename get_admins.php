<?php
header('Content-Type: application/json; charset=utf-8');

function json_error($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

require 'db_connection.php';
try{
$sql= 'SELECT a.admin_id as id, a.email as email, a.role as role, c.name as club_name  from club c JOIN admin a ON a.club_id=c.club_id';
$stmt = $conn->prepare($sql);
$stmt->execute();
$admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($admins);
} catch (PDOException $e) {
    json_error('Database error: ' . $e->getMessage(), 500);
}