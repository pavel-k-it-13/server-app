<?php
header('Content-Type: application/json');

$targetDir = "share/";
$files = [];

if (file_exists($targetDir) && is_dir($targetDir)) {
    $items = scandir($targetDir);
    foreach ($items as $item) {
        if ($item !== '.' && $item !== '..' && !is_dir($targetDir . $item)) {
            $files[] = [
                'name' => $item,
                'size' => filesize($targetDir . $item),
                'date' => filemtime($targetDir . $item)
            ];
        }
    }
}

echo json_encode($files);
?>