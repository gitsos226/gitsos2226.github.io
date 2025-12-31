<?php
require "db_connection.php";

$sql = "SELECT club_id, name, description, slogan FROM club";
$stmt = $conn->prepare($sql);
$stmt->execute();

$clubs = $stmt->fetchAll(PDO::FETCH_ASSOC);

// renvoie du JSON
header('Content-Type: application/json');
echo json_encode($clubs);
?>