<?php
header('Content-Type: application/json');

$targetDir = "share/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$response = [];
$uploadedFiles = [];

foreach ($_FILES['files']['name'] as $key => $name) {
    $targetFile = $targetDir . basename($name);
    $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    
    // Проверка на ошибки загрузки
    if ($_FILES['files']['error'][$key] !== UPLOAD_ERR_OK) {
        $response['errors'][] = "Ошибка при загрузке файла $name";
        continue;
    }
    
    // Проверка на существующий файл
    if (file_exists($targetFile)) {
        $response['errors'][] = "Файл $name уже существует";
        continue;
    }
    
    // Проверка размера файла (макс. 50MB)
    if ($_FILES['files']['size'][$key] > 50 * 1024 * 1024) {
        $response['errors'][] = "Файл $name слишком большой (макс. 50MB)";
        continue;
    }
    
    // Разрешенные типы файлов
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', 'mp3', 'mp4'];
    if (!in_array($fileType, $allowedTypes)) {
        $response['errors'][] = "Тип файла $name не разрешен";
        continue;
    }
    
    // Пытаемся загрузить файл
    if (move_uploaded_file($_FILES['files']['tmp_name'][$key], $targetFile)) {
        $uploadedFiles[] = $name;
    } else {
        $response['errors'][] = "Ошибка при загрузке файла $name";
    }
}

if (!empty($uploadedFiles)) {
    $response['success'] = true;
    $response['message'] = "Файлы успешно загружены: " . implode(', ', $uploadedFiles);
} else {
    $response['success'] = false;
}

echo json_encode($response);
?>