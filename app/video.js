document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы Навигации/Сайдбара ---
    const navBar = document.querySelector("nav");
    const menuBtns = document.querySelectorAll(".menu-icon");
    const overlay = document.querySelector(".overlay");

    // --- Элементы Видео Плеера ---
    const galleryContainer = document.getElementById('videoGalleryContainer');
    const playerContainer = document.getElementById('videoPlayerExpanded');
    const expandedVideo = document.getElementById('expandedVideo');
    const closePlayerBtn = document.getElementById('closePlayerBtn');
    const body = document.body;

    // --- Элементы Поиска ---
    const searchInput = document.getElementById('searchInput');

    // --- Элементы Темной Теми ---
    const themeToggle = document.querySelector('.theme-toggle');

    // --- Инициализация Навигации/Сайдбара ---
    menuBtns.forEach((menuBtn) => {
        menuBtn.addEventListener("click", () => {
            navBar.classList.toggle("open");
        });
    });

    overlay.addEventListener("click", () => {
        navBar.classList.remove("open");
    });

    // --- Функция для инициализации обработчиков видео-блоков ---
    function initializeVideoBlocks() {
        const videoBlocks = galleryContainer ? galleryContainer.querySelectorAll('.video-block') : [];

        videoBlocks.forEach(block => {
            block.addEventListener('click', () => {
                const videoSrc = block.getAttribute('data-video-src');

                if (videoSrc) {
                    if (playerContainer) {
                        if (expandedVideo) {
                            // Очищаем предыдущие источники
                            while (expandedVideo.firstChild) {
                                expandedVideo.removeChild(expandedVideo.firstChild);
                            }
                            // Создаем и добавляем новый источник
                            const source = document.createElement('source');
                            source.setAttribute('src', videoSrc);
                            const extension = videoSrc.split('.').pop().toLowerCase();
                            if (extension === 'mp4') source.setAttribute('type', 'video/mp4');
                            else if (extension === 'webm') source.setAttribute('type', 'video/webm');
                            else if (extension === 'ogv') source.setAttribute('type', 'video/ogg');
                            expandedVideo.appendChild(source);

                            // Загружаем видео
                            expandedVideo.load();

                            // Отображаем плеер
                            playerContainer.style.display = 'flex';
                            playerContainer.style.opacity = '1';
                            playerContainer.style.visibility = 'visible';

                            // Добавляем класс к body для отключения прокрутки
                            body.classList.add('video-open');
                        } else {
                            console.error('Элемент expandedVideo не найден.');
                        }
                    } else {
                        console.error('Элемент playerContainer не найден.');
                    }
                } else {
                    console.error('Атрибут data-video-src не найден у видео-блока.');
                }
            });

            // Опционально: превью при наведении
            const previewVideo = block.querySelector('video');
            if (previewVideo) {
                block.addEventListener('mouseenter', () => {
                    previewVideo.play().catch(() => {});
                });
                block.addEventListener('mouseleave', () => {
                    previewVideo.pause();
                    previewVideo.currentTime = 0;
                });
            }
        });
    }

    // --- Функция закрытия плеера ---
    function closePlayer() {
        if (playerContainer && expandedVideo) {
            playerContainer.style.display = 'none';
            playerContainer.style.opacity = '0';
            playerContainer.style.visibility = 'hidden';
            expandedVideo.pause();
            expandedVideo.removeAttribute('src');
            while (expandedVideo.firstChild) {
                expandedVideo.removeChild(expandedVideo.firstChild);
            }
            body.classList.remove('video-open');
        }
    }

    // --- Инициализация плеера (кнопка закрытия, клик по фону, Esc) ---
    if (playerContainer && expandedVideo && closePlayerBtn) {
        closePlayerBtn.addEventListener('click', closePlayer);

        playerContainer.addEventListener('click', (event) => {
            if (event.target === playerContainer) {
                closePlayer();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && playerContainer.style.display === 'flex') {
                closePlayer();
            }
        });
    } else {
        console.error("Основные элементы плеера не найдены (#videoPlayerExpanded, #expandedVideo, #closePlayerBtn)");
    }

    // --- Функция инициализации поиска ---
    function initializeSearch() {
        if (searchInput && galleryContainer) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const videoBlocks = galleryContainer.querySelectorAll('.video-block');

                videoBlocks.forEach(block => {
                    const titleElement = block.querySelector('.video-title');
                    if (titleElement) {
                        const title = titleElement.textContent.toLowerCase();
                        if (title.includes(searchTerm)) {
                            block.style.display = 'block';
                        } else {
                            block.style.display = 'none';
                        }
                    }
                });
            });
        } else {
            console.error('Элемент поля поиска (searchInput) или контейнер галереи (galleryContainer) не найден для инициализации поиска.');
        }
    }

    // --- Функции для работы с темной темой ---
    function toggleTheme() {
        body.classList.toggle('dark-theme');
        themeToggle.classList.toggle('active');
        
        // Сохраняем состояние темы в localStorage
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDark);
        
        // Меняем иконку
        const icon = themeToggle.querySelector('.icon');
        if (body.classList.contains('dark-theme')) {
            icon.classList.replace('bx-moon', 'bx-sun');
            icon.classList.add('bx-spin');
            setTimeout(() => icon.classList.remove('bx-spin'), 1000);
        } else {
            icon.classList.replace('bx-sun', 'bx-moon');
        }
    }

    function initializeTheme() {
        const darkTheme = localStorage.getItem('darkTheme') === 'true';
        if (darkTheme) {
            body.classList.add('dark-theme');
            themeToggle.classList.add('active');
            const icon = themeToggle.querySelector('.icon');
            icon.classList.replace('bx-moon', 'bx-sun');
        }
    }

    // Инициализация темы
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
        initializeTheme();
    }

    // --- Загрузка видео-блоков из PHP и инициализация ---
    if (galleryContainer) {
        fetch('videos.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                galleryContainer.innerHTML = html;
                initializeVideoBlocks();
                initializeSearch();
            })
            .catch(error => {
                console.error('Ошибка при загрузке видео:', error);
                galleryContainer.innerHTML = `<p class="error-message">Не удалось загрузить список видео. Ошибка: ${error.message}</p>`;
            });
    } else {
        console.error("Контейнер галереи #videoGalleryContainer не найден.");
    }
    // Добавьте это в конец video.js, перед последней закрывающей скобкой

// --- Функционал загрузки файлов ---
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');
const filesContainer = document.getElementById('filesContainer');

// Инициализация файлового менеджера
function initFileManager() {
  if (!uploadBtn || !filesContainer) return;
  
  // Обработчик клика по кнопке загрузки
  uploadBtn.addEventListener('click', () => fileInput.click());
  
  // Обработчик выбора файлов
  fileInput.addEventListener('change', handleFileUpload);
  
  // Загружаем список файлов
  refreshFileList();
}

// Загрузка файлов на сервер
function handleFileUpload() {
  const files = fileInput.files;
  if (files.length === 0) return;
  
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }
  
  progressContainer.style.display = 'block';
  
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'upload.php', true);
  
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = percent + '%';
      progressText.textContent = percent + '%';
    }
  };
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      progressBar.style.width = '100%';
      progressText.textContent = '100%';
      setTimeout(() => {
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
      }, 1000);
      
      refreshFileList();
      fileInput.value = '';
    } else {
      alert('Ошибка при загрузке файла: ' + xhr.responseText);
    }
  };
  
  xhr.send(formData);
}

// Обновление списка файлов
function refreshFileList() {
  fetch('get_files.php')
    .then(response => response.json())
    .then(files => {
      if (files.length === 0) {
        filesContainer.innerHTML = '<div class="empty-message">Нет загруженных файлов</div>';
        return;
      }
      
      let html = '';
      files.forEach(file => {
        html += `
          <div class="file-item">
            <span class="file-name">${file.name}</span>
            <div class="file-actions">
              <button class="download-btn" data-file="${file.name}">Скачать</button>
              <button class="delete-btn" data-file="${file.name}">Удалить</button>
            </div>
          </div>
        `;
      });
      
      filesContainer.innerHTML = html;
      
      // Добавляем обработчики для кнопок
      document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          downloadFile(e.target.getAttribute('data-file'));
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          deleteFile(e.target.getAttribute('data-file'));
        });
      });
    })
    .catch(error => {
      filesContainer.innerHTML = `<div class="error-message">Ошибка загрузки списка файлов: ${error.message}</div>`;
    });
}

// Скачивание файла
function downloadFile(filename) {
  window.open(`download.php?file=${encodeURIComponent(filename)}`, '_blank');
}

// Удаление файла
function deleteFile(filename) {
    if (!confirm(`Вы уверены, что хотите удалить файл "${filename}"?`)) return;
    
    fetch('delete.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `file=${encodeURIComponent(filename)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            refreshFileList();
        } else {
            alert('Ошибка при удалении файла: ' + (data.error || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Ошибка при удалении файла: ' + error.message);
    });
}

// Инициализация файлового менеджера
initFileManager();
});