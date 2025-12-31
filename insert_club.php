
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

$clubName    = isset($_POST['clubName']) ? trim($_POST['clubName']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$slug        = isset($_POST['clubSlug']) ? trim($_POST['clubSlug']) : '';

$photo = isset($_FILES['photo']) ? $_FILES['photo'] : null;
$logo  = isset($_FILES['logo']) ? $_FILES['logo'] : null;

$errors = [];   


// Basic validation
if ($clubName === '') $errors[] = 'Le nom du club est requis.';
if (strlen($clubName) < 3) $errors[] = 'Le nom du club doit contenir au moins 3 caractères.';
if ($description === '') $errors[] = 'La description est requise.';
if (strlen($description) < 10) $errors[] = 'La description doit contenir au moins 10 caractères.';

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

function validateImageFile($file, $name, &$errors, $allowedTypes) {
    if (!$file || $file['error'] === UPLOAD_ERR_NO_FILE) {
        $errors[] = "Le fichier $name est requis.";
        return false;
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = "Erreur lors du téléversement de $name (code: {$file['error']}).";
        return false;
    }
    if (!in_array($file['type'], $allowedTypes)) {
        $errors[] = "Type de fichier invalide pour $name ({$file['type']}).";
        return false;
    }
    if ($file['size'] > 2 * 1024 * 1024) {
        $errors[] = "$name doit être inférieur à 2MB.";
        return false;
    }
    return true;
}

validateImageFile($logo, 'logo', $errors, $allowedTypes);
validateImageFile($photo, 'photo', $errors, $allowedTypes);

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Upload files
function uploadImageFile($file, $folder) {
    @mkdir($folder, 0777, true);
    if (!is_dir($folder)) {
        return [false, "Impossible de créer le dossier $folder"];
    }
    $safeName = uniqid('img_') . '_' . basename($file['name']);
    $target = rtrim($folder, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $safeName;
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        return [false, "Impossible d'enregistrer le fichier {$file['name']}"];
    }
    return [true, $target];
}

list($okLogo, $logoPath) = uploadImageFile($logo, __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'clubs' . DIRECTORY_SEPARATOR . 'logos');
if (!$okLogo) json_error($logoPath);

list($okPhoto, $photoPath) = uploadImageFile($photo, __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'clubs' . DIRECTORY_SEPARATOR . 'photos');
if (!$okPhoto) json_error($photoPath);

// Use existing DB connection if available, otherwise create one
$conn = null;
if (file_exists(__DIR__ . DIRECTORY_SEPARATOR . 'db_connection.php')) {
    require_once __DIR__ . DIRECTORY_SEPARATOR . 'db_connection.php';
    // db_connection.php should define $conn (PDO)
}

try {
    if (!isset($conn) || !$conn instanceof PDO) {
        // fallback connection (adjust credentials if needed)
        $conn = new PDO("mysql:host=localhost;dbname=ClubManagementSystem;charset=utf8mb4", 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    }

    $sql = 'INSERT INTO club (name, description, slogan, logo, photo) VALUES (:name, :description, :slogan, :logo, :photo)';
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':name', $clubName);
    $stmt->bindValue(':description', $description);
    $stmt->bindValue(':slogan', $slug);
    $stmt->bindValue(':logo', $logoPath);
    $stmt->bindValue(':photo', $photoPath);
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