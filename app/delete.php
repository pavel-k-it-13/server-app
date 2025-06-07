<?php
header('Content-Type: application/json');

$targetDir = "share/";
$filename = isset($_POST['file']) ? basename($_POST['file']) : '';

$response = ['success' => false, 'error' => ''];

try {
    if (empty($filename)) {
        throw new Exception('Имя файла не указано');
    }

    if (!file_exists($targetDir . $filename)) {
        throw new Exception('Файл не найден');
    }

    if (!unlink($targetDir . $filename)) {
        throw new Exception('Ошибка при удалении файла');
    }

    $response['success'] = true;
    $response['message'] = 'Файл успешно удален';
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

// Убедимся, что вывод только JSON и нет лишних символов
ob_clean();
echo json_encode($response);
exit;
?>