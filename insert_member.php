<?php
header('Content-Type: application/json; charset=utf-8');

// Return a JSON error helper
function json_error($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Invalid request method. Use POST.', 405);
}
$lname= isset($_POST['student_lname']) ? trim($_POST['student_lname']) : '';
$fname = isset($_POST['student_fname']) ? trim($_POST['student_fname']) :
$email = isset($_POST['studentEmail']) ? trim($_POST['studentEmail']) : '';
$studentClub = isset($_POST['studentClub']) ? trim($_POST['studentClub']) : '';


$errors = [];   


// Basic validation
if ($fname === '') $errors[] = 'Le prénom est requis.';
if (strlen($fname) < 2) $errors[] = 'Le prénom doit contenir au moins 2 caractères.';
if ($lname === '') $errors[] = 'Le nom de famille est requis.';
if (strlen($lname) < 2) $errors[] = 'Le nom de famille doit contenir au moins 2 caractères.';
if ($email === '') $errors[] = 'L\'email est requis.';
if($studentClub === '') $errors[] = 'Le club est requis.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email invalide.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

require 'db_connection.php';

try {
    
    $sql= 'SELECT * FROM student WHERE email = :email';
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':email', $email);
    $stmt->execute();
    $existingStudent = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingStudent) {
        $student_id=$existingStudent['stud_id'];
    } else {
        $sql = 'INSERT INTO student (fname,lname,email) VALUES (:fname, :lname, :email)';
        $stmt= $conn->prepare($sql);
        $stmt->bindValue(':fname', $fname);
        $stmt->bindValue(':lname', $lname);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $student_id = $conn->lastInsertId();
    }
    $sql= 'SELECT * FROM club WHERE name = :studentClub';
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':studentClub', $studentClub);
    if( $studentClub !== '') {
        $stmt->execute();
        $existingClub = $stmt->fetch(PDO::FETCH_ASSOC);
        $club_id=$existingClub['club_id'];
        }
    
    

    $sql ='SELECT * FROM club_deparment WHERE club_id= :club_id';
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':club_id', $club_id);
    $stmt->execute();
    $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($departments as $department) {
        $dept_id=$department['dept_id'];
         $sql = 'INSERT INTO member (student_id, department_id, club_id) VALUES (:student_id, :department_id, :club_id)';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':student_id', $student_id);
        $stmt->bindValue(':department_id', $dept_id);
        $stmt->bindValue(':club_id', $club_id);
        $stmt->execute();
    }

    $insertedId = $conn->lastInsertId();
    echo json_encode(['success' => true, 'id' => $insertedId]);
    exit;
}
 catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    exit;
}

?>

 