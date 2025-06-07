<?php
$targetDir = "share/";
$filename = isset($_GET['file']) ? basename($_GET['file']) : '';

if (empty($filename) || !file_exists($targetDir . $filename)) {
    die('Файл не найден');
}

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($targetDir . $filename));
readfile($targetDir . $filename);
exit;
?>