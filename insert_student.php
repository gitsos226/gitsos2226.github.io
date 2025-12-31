
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

$fname = isset($_POST['student_fname']) ? trim($_POST['student_fname']) : '';
$lname = isset($_POST['student_lname']) ? trim($_POST['student_lname']) : '';
$email = isset($_POST['studentEmail']) ? trim($_POST['studentEmail']) : '';


$errors = [];   


// Basic validation
if ($fname === '') $errors[] = 'Le prénom est requis.';
if (strlen($fname) < 2) $errors[] = 'Le prénom doit contenir au moins 2 caractères.';
if ($lname === '') $errors[] = 'Le nom de famille est requis.';
if (strlen($lname) < 2) $errors[] = 'Le nom de famille doit contenir au moins 2 caractères.';
if ($email === '') $errors[] = 'L\'email est requis.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email invalide.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}


if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

require 'db_connection.php';

try {
    

    $sql = 'INSERT INTO student (fname,lname,email) VALUES (:fname, :lname, :email)';
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':fname', $fname);
    $stmt->bindValue(':lname', $lname);
    $stmt->bindValue(':email', $email);
    $stmt->execute();

    $insertedId = $conn->lastInsertId();
    echo json_encode(['success' => true, 'id' => $insertedId]);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    exit;
}

?>
