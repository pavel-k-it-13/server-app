document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы Навигации/Сайдбара ---
    const nav = document.querySelector("nav");
    const menuIcon = nav ? nav.querySelector(".menu-icon") : null;
    const sidebar = nav ? nav.querySelector(".sidebar") : null;
    const overlay = document.querySelector(".overlay");

    // --- Контейнер для статей ---
    const articlesContainer = document.getElementById('articlesContainer');

    // --- Инициализация Навигации/Сайдбара ---
    if (nav && menuIcon && sidebar && overlay) {
        menuIcon.addEventListener("click", () => {
            nav.classList.toggle("open");
        });

        overlay.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    } else {
        console.warn("Элементы навигации/сайдбара не найдены.");
    }

    // --- Функция для загрузки и отображения статей ---
    function loadArticles() {
        fetch('load_articles.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(articles => {
                articlesContainer.innerHTML = ''; // Очищаем сообщение о загрузке

                if (articles.length > 0) {
                    articles.forEach(article => {
                        const articleCard = document.createElement('div');
                        articleCard.classList.add('article-card');
                        articleCard.addEventListener('click', () => {
                            window.location.href = article.path; // Переход к статье при клике
                        });

                        const previewImage = document.createElement('img');
                        previewImage.classList.add('article-preview');
                        previewImage.src = article.preview;
                        previewImage.alt = article.title;

                        const titleElement = document.createElement('h2');
                        titleElement.classList.add('article-title');
                        titleElement.textContent = article.title;

                        articleCard.appendChild(previewImage);
                        articleCard.appendChild(titleElement);
                        articlesContainer.appendChild(articleCard);
                    });
                } else {
                    articlesContainer.innerHTML = '<p>Нет доступных статей.</p>';
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке статей:', error);
                articlesContainer.innerHTML = `<p class="error-message">Не удалось загрузить статьи. Ошибка: ${error.message}</p>`;
            });
    }

    // --- Загрузка статей при загрузке страницы ---
    loadArticles();
});