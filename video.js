document.addEventListener('DOMContentLoaded', () => {

    // --- Элементы Навигации/Сайдбара ---
    const navBar = document.querySelector("nav");
    const menuBtns = document.querySelectorAll(".menu-icon");
    const overlay = document.querySelector(".overlay");

    // --- Элементы Видео Плеера ---
    const galleryContainer = document.getElementById('videoGalleryContainer');
    const playerContainer = document.getElementById('videoPlayerExpanded');
    console.log('playerContainer при инициализации:', playerContainer);
    const expandedVideo = document.getElementById('expandedVideo');
    const closePlayerBtn = document.getElementById('closePlayerBtn');
    const body = document.body;

    // --- Элементы Поиска ---
    const searchInput = document.getElementById('searchInput');

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
        console.log('Вызвана функция initializeVideoBlocks()');
        const videoBlocks = galleryContainer ? galleryContainer.querySelectorAll('.video-block') : [];
        console.log('Найденные videoBlocks:', videoBlocks);

        videoBlocks.forEach(block => {
            block.addEventListener('click', () => {
                console.log('Клик по видео-блоку:', block);
                const videoSrc = block.getAttribute('data-video-src');
                console.log('Источник видео:', videoSrc);
                console.log('playerContainer:', playerContainer);
                console.log('expandedVideo:', expandedVideo);

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
                            console.log('display плеера установлено на:', playerContainer.style.display);
                            console.log('opacity плеера установлено на:', playerContainer.style.opacity);
                            console.log('visibility плеера установлено на:', playerContainer.style.visibility);

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

    // --- Загрузка видео-блоков из PHP и инициализация поиска ---
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
                console.log('Перед вызовом initializeVideoBlocks()');
                initializeVideoBlocks();
                initializeSearch(); // Инициализация поиска после загрузки видео
            })
            .catch(error => {
                console.error('Ошибка при загрузке видео:', error);
                galleryContainer.innerHTML = `<p class="error-message">Не удалось загрузить список видео. Ошибка: ${error.message}</p>`;
            });
    } else {
        console.error("Контейнер галереи #videoGalleryContainer не найден.");
    }

});