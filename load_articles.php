<?php
header('Content-Type: application/json; charset=utf-8');

$articlesDir = 'pirlist/'; // Папка со статьями
$previewDir = 'pirlist/'; // Папка с превью (в данном случае та же)
$allowedExtensions = ['html'];
$previewExtension = 'jpg';
$articlesData = [];

if (is_dir($articlesDir)) {
    $files = scandir($articlesDir);
    if ($files !== false) {
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $filePath = $articlesDir . $file;
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

            if (is_file($filePath) && in_array($extension, $allowedExtensions)) {
                $articleNameWithoutExt = pathinfo($file, PATHINFO_FILENAME);
                $previewPath = $previewDir . $articleNameWithoutExt . '.' . $previewExtension;

                // Читаем первую строку для получения названия статьи
                $handle = fopen($filePath, "r");
                if ($handle) {
                    $firstLine = fgets($handle);
                    fclose($handle);
                    $titleMatch = [];
                    if (preg_match('/\/\*\s*(.*?)\s*\*\//', $firstLine, $titleMatch)) {
                        $articleTitle = trim($titleMatch[1]);
                        $articlesData[] = [
                            'title' => htmlspecialchars($articleTitle, ENT_QUOTES, 'UTF-8'),
                            'preview' => htmlspecialchars($previewPath, ENT_QUOTES, 'UTF-8'),
                            'path' => htmlspecialchars($filePath, ENT_QUOTES, 'UTF-8'),
                        ];
                    }
                }
            }
        }
    }
}

echo json_encode($articlesData, JSON_UNESCAPED_UNICODE);
?>