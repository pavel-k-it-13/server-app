<?php
// Установка заголовка, чтобы браузер понимал, что это HTML (не обязательно, но хорошая практика)
// header('Content-Type: text/html; charset=utf-8');

$videoDir = 'video/'; // Путь к папке с видео
$allowedExtensions = ['mp4', 'webm', 'ogv']; // Разрешенные расширения видео
$outputHtml = ''; // Переменная для хранения сгенерированного HTML

// Проверяем, существует ли папка
if (is_dir($videoDir)) {
    // Сканируем папку
    $files = scandir($videoDir);

    if ($files !== false) {
        $foundVideos = false; // Флаг для проверки, найдены ли видео
        foreach ($files as $file) {
            // Пропускаем '.' и '..'
            if ($file === '.' || $file === '..') {
                continue;
            }

            $filePath = $videoDir . $file;
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

            // Проверяем, является ли файл видео с разрешенным расширением
            if (is_file($filePath) && in_array($extension, $allowedExtensions)) {
                $foundVideos = true; // Видео найдено
                // Получаем имя файла без расширения для подписи
                $videoName = htmlspecialchars(pathinfo($file, PATHINFO_FILENAME));
                // Экранируем путь для использования в HTML атрибутах
                $videoPath = htmlspecialchars($filePath, ENT_QUOTES, 'UTF-8');

                // Добавляем HTML блока к строке вывода
                $outputHtml .= '<div class="video-block" data-video-src="' . $videoPath . '">';
                $outputHtml .= '<video preload="metadata" muted loop>'; // preload="metadata" важно для получения размеров/длительности быстро
                   $outputHtml .= '<source src="' . $videoPath . '" type="video/' . $extension . '">';
                   $outputHtml .= 'Ваш браузер не поддерживает тег video.';
                $outputHtml .= '</video>';
                $outputHtml .= '<p class="video-title">' . $videoName . '</p>';
                $outputHtml .= '</div>';
            }
        }
        // Если видео не найдены после сканирования
        if (!$foundVideos) {
             $outputHtml = '<p>В папке video нет поддерживаемых видеофайлов (.mp4, .webm, .ogv).</p>';
        }

    } else {
        $outputHtml = '<p>Не удалось прочитать содержимое папки video.</p>';
    }
} else {
    $outputHtml = '<p>Папка video не найдена. Создайте ее и поместите туда видеофайлы.</p>';
}

// Выводим сгенерированный HTML
echo $outputHtml;

?>