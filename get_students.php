<?php
header('Content-Type: application/json; charset=utf-8');

function json_error($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

require "db_connection.php";
//toujours commencer par la table pivot pour le FROM...

$sql="SELECT s.stud_id,s.email, CONCAT(s.fname,' ',s.lname ) AS student_name,
c.name AS club_name FROM student s LEFT JOIN member m  ON s.stud_id = m.student_id
LEFT JOIN club c ON c.club_id = m.club_id GROUP BY s.stud_id, student_name,s.email, c.name";


$stmt = $conn->prepare($sql);
$stmt->execute();

$students = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON
header('Content-Type: application/json');
echo json_encode($students);
?>
