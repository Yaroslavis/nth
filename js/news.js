// news.js - JavaScript для страницы новостей

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация фильтров новостей
    initNewsFilters();

    // Инициализация сортировки
    initNewsSorting();

    // Инициализация пагинации
    initNewsPagination();

    // Инициализация поиска
    initNewsSearch();

    // Инициализация подписок
    initNewsSubscriptions();

    // Инициализация модального окна
    initNewsModal();

    // Инициализация интерактивности героя
    initHeroInteractions();
});

// Функция инициализации фильтров новостей
function initNewsFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    const categoryLinks = document.querySelectorAll('.category-list a');
    const newsItems = document.querySelectorAll('.news-item');

    // Обработка кнопок фильтрации
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Фильтруем новости
            filterNewsByCategory(category);
        });
    });

    // Обработка ссылок в списке категорий
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');

            // Обновляем активную кнопку фильтра
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-category') === category) {
                    btn.classList.add('active');
                }
            });

            // Фильтруем новости
            filterNewsByCategory(category);

            // Прокручиваем к началу списка
            const newsList = document.getElementById('news-list');
            if (newsList) {
                newsList.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Функция фильтрации новостей по категории
    function filterNewsByCategory(category) {
        newsItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Обновляем счетчик найденных новостей
        updateNewsCount();
    }
}

// Функция инициализации сортировки
function initNewsSorting() {
    const sortSelect = document.getElementById('news-sort');

    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        sortNews(sortBy);
    });

    // Функция сортировки новостей
    function sortNews(sortBy) {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;

        const newsItems = Array.from(document.querySelectorAll('.news-item:not(.hidden)'));

        // Сохраняем главную новость отдельно
        const featuredNews = newsItems.find(item => item.classList.contains('news-item--featured'));
        const regularNews = newsItems.filter(item => !item.classList.contains('news-item--featured'));

        // Сортируем обычные новости
        regularNews.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                case 'oldest':
                    return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
                case 'popular':
                    return parseInt(b.getAttribute('data-views')) - parseInt(a.getAttribute('data-views'));
                default:
                    return 0;
            }
        });

        // Очищаем список
        newsList.innerHTML = '';

        // Добавляем главную новость (если есть)
        if (featuredNews) {
            newsList.appendChild(featuredNews);
        }

        // Добавляем отсортированные обычные новости
        regularNews.forEach(item => {
            newsList.appendChild(item);
        });
    }
}

// Функция инициализации пагинации
function initNewsPagination() {
    const pageNumbers = document.querySelectorAll('.pagination-number');
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');
    const newsItems = document.querySelectorAll('.news-item');
    const itemsPerPage = 5;
    let currentPage = 1;

    // Рассчитываем общее количество страниц
    const totalPages = Math.ceil(newsItems.length / itemsPerPage);

    // Обработка кликов по номерам страниц
    pageNumbers.forEach(number => {
        number.addEventListener('click', function() {
            const pageNum = parseInt(this.textContent);
            if (!isNaN(pageNum)) {
                goToPage(pageNum);
            }
        });
    });

    // Обработка кнопки "Назад"
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }

    // Обработка кнопки "Вперед"
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }

    // Функция перехода на страницу
    function goToPage(page) {
        currentPage = page;

        // Скрываем все новости
        newsItems.forEach((item, index) => {
            item.classList.add('hidden');
        });

        // Показываем новости для текущей страницы
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        for (let i = startIndex; i < Math.min(endIndex, newsItems.length); i++) {
            newsItems[i].classList.remove('hidden');
        }

        // Обновляем активную страницу в пагинации
        updatePagination();

        // Прокручиваем к началу списка
        const newsList = document.getElementById('news-list');
        if (newsList) {
            newsList.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    // Функция обновления пагинации
    function updatePagination() {
        // Обновляем активную страницу
        pageNumbers.forEach(number => {
            number.classList.remove('active');
            if (parseInt(number.textContent) === currentPage) {
                number.classList.add('active');
            }
        });

        // Обновляем состояние кнопок
        if (prevButton) {
            prevButton.disabled = currentPage === 1;
        }

        if (nextButton) {
            nextButton.disabled = currentPage === totalPages;
        }
    }

    // Инициализируем первую страницу
    goToPage(1);
}

// Функция инициализации поиска
function initNewsSearch() {
    const searchInput = document.getElementById('news-search-input');
    const searchForm = document.querySelector('.news-search-form');

    if (!searchForm) return;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });

    // Поиск при вводе (с задержкой)
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
    }

    // Функция выполнения поиска
    function performSearch() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const newsItems = document.querySelectorAll('.news-item');
        let foundCount = 0;

        if (!searchTerm) {
            // Показываем все новости если поиск пустой
            newsItems.forEach(item => {
                item.classList.remove('hidden');
            });
            updateNewsCount(newsItems.length);
            return;
        }

        // Ищем новости по заголовку, описанию и тегам
        newsItems.forEach(item => {
            const titleElement = item.querySelector('.news-title');
            const excerptElement = item.querySelector('.news-excerpt');
            const tagElements = item.querySelectorAll('.news-tag');

            if (!titleElement || !excerptElement) return;

            const title = titleElement.textContent.toLowerCase();
            const excerpt = excerptElement.textContent.toLowerCase();
            const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase());

            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
                item.classList.remove('hidden');
                foundCount++;

                // Подсвечиваем найденные слова
                highlightText(item, searchTerm);
            } else {
                item.classList.add('hidden');
                removeHighlights(item);
            }
        });

        updateNewsCount(foundCount);
    }

    // Функция подсветки текста
    function highlightText(element, searchTerm) {
        const elementsToHighlight = element.querySelectorAll('.news-title, .news-excerpt');

        elementsToHighlight.forEach(el => {
            const originalText = el.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlightedText = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');

            if (highlightedText !== originalText) {
                el.innerHTML = highlightedText;
            }
        });
    }

    // Функция удаления подсветки
    function removeHighlights(element) {
        const highlights = element.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            }
        });
    }
}

// Функция инициализации подписок
function initNewsSubscriptions() {
    const subscribeForm = document.querySelector('.subscribe-form');
    const newsletterForm = document.querySelector('.newsletter-signup');

    // Обработка формы подписки в сайдбаре
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput) return;

            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                subscribeToNewsletter(email, 'sidebar');
                emailInput.value = '';
            }
        });
    }

    // Обработка формы рассылки
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput) return;

            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                subscribeToNewsletter(email, 'newsletter');
                emailInput.value = '';
            }
        });
    }

    // Функция валидации email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Функция подписки на рассылку
    function subscribeToNewsletter(email, source) {
        // В реальном проекте здесь была бы отправка данных на сервер
        console.log(`Подписка на рассылку: ${email} (источник: ${source})`);

        // Показываем уведомление об успешной подписке
        showNotification('Вы успешно подписались на рассылку новостей!', 'success');
    }
}

// Функция инициализации модального окна
function initNewsModal() {
    const newsModal = document.getElementById('news-modal');
    if (!newsModal) return;

    const modalOverlay = newsModal.querySelector('.modal__overlay');
    const modalCloseBtn = newsModal.querySelector('.modal__close');
    const newsLinks = document.querySelectorAll('.news-read-more');

    // Обработка кликов по ссылкам "Читать полностью"
    newsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const newsItem = this.closest('.news-item');
            loadNewsContent(newsItem);
            showNewsModal();
        });
    });

    // Функция загрузки контента новости
    function loadNewsContent(newsItem) {
        const modalContent = document.getElementById('news-modal-content');
        if (!modalContent) return;

        // Получаем данные из карточки новости
        const titleElement = newsItem.querySelector('.news-title');
        const categoryElement = newsItem.querySelector('.news-category');
        const dateElement = newsItem.querySelector('.news-date');
        const viewsElement = newsItem.querySelector('.news-views');
        const excerptElement = newsItem.querySelector('.news-excerpt');
        const imageElement = newsItem.querySelector('.news-item__image img');

        if (!titleElement || !categoryElement || !dateElement || !viewsElement || !excerptElement || !imageElement) return;

        const title = titleElement.textContent;
        const category = categoryElement.textContent;
        const categoryClass = categoryElement.className;
        const date = dateElement.textContent.replace('<i class="far fa-calendar"></i> ', '');
        const views = viewsElement.textContent.replace('<i class="far fa-eye"></i> ', '');
        const excerpt = excerptElement.textContent;
        const imageSrc = imageElement.src;
        const imageAlt = imageElement.alt;

        // Генерируем полный контент новости
        const fullContent = `
            <div class="news-modal">
                <div class="news-modal__image">
                    <img src="${imageSrc}" alt="${imageAlt}">
                </div>
                <div class="news-modal__header">
                    <span class="news-modal__category ${categoryClass}">${category}</span>
                    <div class="news-modal__meta">
                        <span class="news-modal__date"><i class="far fa-calendar"></i> ${date}</span>
                        <span class="news-modal__views"><i class="far fa-eye"></i> ${views}</span>
                    </div>
                </div>
                <h2 class="news-modal__title">${title}</h2>
                <div class="news-modal__content">
                    <p>${excerpt}</p>
                    <p>Полный текст новости будет загружен здесь. В реальном проекте это будет контент из базы данных или файла.</p>
                    <h3>Детали новости</h3>
                    <p>Эта новость была опубликована ${date} и уже набрала ${views} просмотров. Она относится к категории "${category}".</p>
                    <h3>Дополнительная информация</h3>
                    <p>Для получения более подробной информации по данной теме вы можете связаться с нашими специалистами или посетить соответствующий раздел сайта.</p>
                </div>
                <div class="news-modal__share">
                    <h4>Поделиться новостью:</h4>
                    <div class="share-buttons">
                        <button class="share-btn" data-share="vk"><i class="fab fa-vk"></i></button>
                        <button class="share-btn" data-share="telegram"><i class="fab fa-telegram"></i></button>
                        <button class="share-btn" data-share="twitter"><i class="fab fa-twitter"></i></button>
                        <button class="share-btn" data-share="linkedin"><i class="fab fa-linkedin"></i></button>
                    </div>
                </div>
            </div>
        `;

        modalContent.innerHTML = fullContent;

        // Инициализируем кнопки "Поделиться"
        initShareButtons();
    }

    // Функция показа модального окна
    function showNewsModal() {
        newsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Функция скрытия модального окна
    function hideNewsModal() {
        newsModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Обработчики закрытия модального окна
    if (modalOverlay) {
        modalOverlay.addEventListener('click', hideNewsModal);
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideNewsModal);
    }

    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && newsModal.classList.contains('active')) {
            hideNewsModal();
        }
    });

    // Инициализация кнопок "Поделиться"
    function initShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');

        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.getAttribute('data-share');
                const url = window.location.href;
                const titleElement = document.querySelector('.news-modal__title');
                const title = titleElement ? titleElement.textContent : '';

                shareNews(platform, url, title);
            });
        });
    }

    // Функция для шаринга
    function shareNews(platform, url, title) {
        let shareUrl = '';

        switch (platform) {
            case 'vk':
                shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }
}

// Функция инициализации интерактивности героя
function initHeroInteractions() {
    // Обработка кликов по тегам поиска
    const searchTags = document.querySelectorAll('.search-tag');
    const searchInput = document.getElementById('news-search-input');

    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.replace('#', '');
            if (searchInput) {
                searchInput.value = tagText;
                searchInput.focus();

                // Имитируем поиск
                setTimeout(() => {
                    const event = new Event('input', { bubbles: true });
                    searchInput.dispatchEvent(event);
                }, 100);
            }
        });
    });

    // Обработка клика по главной карточке новости
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
        heroCard.addEventListener('click', function() {
            const modalContent = document.getElementById('news-modal-content');
            if (modalContent) {
                // Загружаем контент для главной новости
                loadMainNewsContent();
                showNewsModal();
            }
        });
    }
}

// Функция загрузки контента главной новости
function loadMainNewsContent() {
    const modalContent = document.getElementById('news-modal-content');
    if (!modalContent) return;

    const content = `
        <div class="news-modal">
            <div class="news-modal__image">
                <img src="https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="EUV литография">
            </div>
            <div class="news-modal__header">
                <span class="news-modal__category" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 6px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">ТЕХНОЛОГИИ</span>
                <div class="news-modal__meta">
                    <span class="news-modal__date"><i class="far fa-calendar"></i> 15 марта 2024</span>
                    <span class="news-modal__views"><i class="far fa-eye"></i> 2,500 просмотров</span>
                </div>
            </div>
            <h2 class="news-modal__title">EUV-литография: революция в производстве чипов 3 нм</h2>
            <div class="news-modal__content">
                <p><strong>Ведущие производители полупроводников объявили о начале массового производства чипов по 3 нм техпроцессу с использованием экстремального ультрафиолетового излучения (EUV).</strong></p>
                
                <p>Эта технология позволяет создавать транзисторы с размерами всего 3 нанометра, что примерно в 30 000 раз меньше диаметра человеческого волоса. Новый техпроцесс обеспечивает увеличение производительности на 15% и снижение энергопотребления на 30% по сравнению с предыдущим поколением.</p>
                
                <h3>Ключевые преимущества EUV-литографии:</h3>
                <ul>
                    <li>Высокая точность формирования структур</li>
                    <li>Возможность создания более сложных архитектур</li>
                    <li>Улучшенная энергоэффективность</li>
                    <li>Высокая плотность транзисторов</li>
                </ul>
                
                <h3>Практическое применение:</h3>
                <p>Новые процессоры найдут применение в:</p>
                <ul>
                    <li>Искусственном интеллекте и машинном обучении</li>
                    <li>Высокопроизводительных вычислениях</li>
                    <li>Мобильных устройствах следующего поколения</li>
                    <li>Автомобильной электронике</li>
                </ul>
                
                <div class="news-modal__stats">
                    <div class="stat-card">
                        <div class="stat-value">3 нм</div>
                        <div class="stat-label">Размер транзистора</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">+15%</div>
                        <div class="stat-label">Производительность</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">-30%</div>
                        <div class="stat-label">Энергопотребление</div>
                    </div>
                </div>
            </div>
            <div class="news-modal__share">
                <h4>Поделиться новостью:</h4>
                <div class="share-buttons">
                    <button class="share-btn" data-share="vk"><i class="fab fa-vk"></i></button>
                    <button class="share-btn" data-share="telegram"><i class="fab fa-telegram"></i></button>
                    <button class="share-btn" data-share="twitter"><i class="fab fa-twitter"></i></button>
                    <button class="share-btn" data-share="linkedin"><i class="fab fa-linkedin"></i></button>
                </div>
            </div>
        </div>
    `;

    modalContent.innerHTML = content;
}

// Вспомогательные функции

// Функция обновления счетчика новостей
function updateNewsCount(count = null) {
    const newsItems = document.querySelectorAll('.news-item:not(.hidden)');
    const actualCount = count !== null ? count : newsItems.length;

    // Можно добавить отображение счетчика в интерфейсе
    console.log(`Найдено новостей: ${actualCount}`);
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Добавляем стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Добавляем в DOM
    document.body.appendChild(notification);

    // Обработчик закрытия уведомления
    const closeBtn = notification.querySelector('.notification__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Добавляем стили для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification__close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        opacity: 0.8;
        transition: opacity 0.3s;
    }
    
    .notification__close:hover {
        opacity: 1;
    }
    
    .search-highlight {
        background-color: var(--accent-yellow);
        color: #000;
        padding: 2px 4px;
        border-radius: 4px;
    }
`;

// Проверяем, не добавлен ли уже стиль
if (!document.querySelector('style[data-news-notifications]')) {
    style.setAttribute('data-news-notifications', 'true');
    document.head.appendChild(style);
}