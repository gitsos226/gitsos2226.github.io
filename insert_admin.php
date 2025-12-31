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

$adminEmail=isset($_POST['adminEmail']) ? trim($_POST['adminEmail']) : '';
$adminPassword=isset($_POST['password']) ? trim($_POST['password']) : '';
$adminRole= isset($_POST['role']) ? trim($_POST['role']) : '';
$adminClub= isset($_POST['adminClub']) ? trim($_POST['adminClub']) : '';

if($adminEmail === '') $errors[] = 'Email is required.';
if(!filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email format.';
if($adminPassword === '') $errors[] = 'Password is required.';
if($adminRole === '') $errors[] = 'Role is required.';
if($adminClub === '') $errors[] = 'Club is required.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

require "db_connection.php";

try{
 $sqlClub= 'SELECT club_id FROM club WHERE name = :clubName';
$stmtClub= $conn->prepare($sqlClub);  
$stmtClub->bindValue(':clubName', $adminClub);
$stmtClub->execute();
$club_id = $stmtClub->fetchColumn(); 
if (!$club_id) {
    json_error('Club not found: ' . $adminClub, 404);
}
$sql= 'INSERT INTO admin (email,password,role,club_id) VALUES (:email, :password, :role, :club_id)';
$stmt= $conn->prepare($sql);
$stmt->bindValue(':email', $adminEmail);
$stmt->bindValue(':password', $adminPassword);
$stmt->bindValue(':role', $adminRole);
$stmt->bindValue(':club_id', $club_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Admin inserted successfully']);
} else {
    json_error('Failed to insert admin.');
}
} catch (PDOException $e) {
    json_error('Database error: ' . $e->getMessage(), 500);
}

?>