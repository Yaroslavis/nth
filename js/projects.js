// projects.js - JavaScript для страницы проектов и отзывов (исправленная версия)

// Конфигурация
const CONFIG = {
    ITEMS_PER_LOAD: 3,
    INITIAL_VISIBLE_ITEMS: 6,
    SWIPER_CONFIG: {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            }
        }
    }
};

// Состояние приложения
const AppState = {
    visibleProjectsCount: CONFIG.INITIAL_VISIBLE_ITEMS,
    currentRating: 0,
    activeCategory: 'all'
};

// Основная инициализация
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    try {
        // Инициализация фильтров проектов
        initProjectsFilters();

        // Инициализация слайдера отзывов
        initTestimonialsSlider();

        // Инициализация формы отзыва
        initTestimonialForm();

        // Инициализация кнопок "Подробнее"
        initProjectDetails();

        // Инициализация кнопки "Показать еще"
        initLoadMoreProjects();

        // Инициализация модальных окон
        initModals();

        // Добавление CSS стилей
        addCustomStyles();

        console.log('Приложение успешно инициализировано');
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
    }
}

// Функция инициализации фильтров проектов
function initProjectsFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    const periodSelect = document.getElementById('projects-period');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));

    if (filterButtons.length === 0 || projectCards.length === 0) {
        console.warn('Элементы фильтрации не найдены');
        return;
    }

    // Активируем первую кнопку фильтра, если нет активной
    if (!document.querySelector('.category-filter.active') && filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
        AppState.activeCategory = filterButtons[0].getAttribute('data-category') || 'all';
    }

    // Обработка кнопок фильтрации по категориям
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Обновляем состояние
            AppState.activeCategory = category;

            // Применяем фильтры
            applyProjectsFilters(projectCards, periodSelect);
        });
    });

    // Обработка выбора периода
    if (periodSelect) {
        periodSelect.addEventListener('change', () => {
            applyProjectsFilters(projectCards, periodSelect);
        });
    }

    // Применяем начальные фильтры
    applyProjectsFilters(projectCards, periodSelect);
}

// Функция применения фильтров
function applyProjectsFilters(projectCards, periodSelect) {
    try {
        const selectedPeriod = periodSelect ? periodSelect.value : 'all';
        let visibleCount = 0;

        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardYear = card.getAttribute('data-year');

            const categoryMatch = AppState.activeCategory === 'all' || cardCategory === AppState.activeCategory;
            const periodMatch = selectedPeriod === 'all' || cardYear === selectedPeriod;

            const shouldShow = categoryMatch && periodMatch;

            // Анимируем изменение состояния
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });

        // Обновляем статистику
        updateProjectsCount(visibleCount);

        // Показываем/скрываем сообщение об отсутствии проектов
        toggleNoProjectsMessage(visibleCount === 0);

    } catch (error) {
        console.error('Ошибка при фильтрации проектов:', error);
    }
}

// Функция инициализации слайдера отзывов
function initTestimonialsSlider() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');

    if (!testimonialsSlider) {
        console.warn('Слайдер отзывов не найден');
        return;
    }

    // Проверяем наличие Swiper
    if (typeof Swiper === 'undefined') {
        console.error('Библиотека Swiper не загружена');
        return;
    }

    try {
        new Swiper(testimonialsSlider, CONFIG.SWIPER_CONFIG);
    } catch (error) {
        console.error('Ошибка при инициализации слайдера:', error);
    }
}

// Функция инициализации формы отзыва
function initTestimonialForm() {
    const testimonialForm = document.getElementById('testimonial-form');

    if (!testimonialForm) {
        console.warn('Форма отзыва не найдена');
        return;
    }

    const ratingStars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('testimonial-rating');

    // Инициализация рейтинга
    initRatingSystem(ratingStars, ratingInput);

    // Обработка отправки формы
    testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateTestimonialForm()) {
            submitTestimonialForm(testimonialForm, ratingStars, ratingInput);
        }
    });
}

// Функция инициализации системы рейтинга
function initRatingSystem(ratingStars, ratingInput) {
    if (!ratingStars.length || !ratingInput) return;

    ratingStars.forEach((star, index) => {
        const ratingValue = index + 1;

        // Клик по звезде
        star.addEventListener('click', () => {
            setRating(ratingValue, ratingStars, ratingInput);
        });

        // Эффект при наведении
        star.addEventListener('mouseenter', () => {
            highlightStars(ratingValue, ratingStars, false);
        });

        // Сброс при уходе мыши
        star.addEventListener('mouseleave', () => {
            highlightStars(AppState.currentRating, ratingStars, true);
        });
    });
}

// Установка рейтинга
function setRating(rating, stars, input) {
    AppState.currentRating = rating;
    input.value = rating;
    highlightStars(rating, stars, true);
}

// Подсветка звезд (ИСПРАВЛЕНО)
function highlightStars(rating, stars, isPermanent = false) {
    stars.forEach((star, index) => {
        const starIndex = index + 1;

        if (starIndex <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
            if (isPermanent) {
                star.classList.add('active');
            }
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
            if (isPermanent) {
                star.classList.remove('active');
            }
        }
    });
}

// Валидация формы отзыва
function validateTestimonialForm() {
    const fields = [
        { id: 'client-name', message: 'Пожалуйста, введите ваше имя' },
        { id: 'client-company', message: 'Пожалуйста, введите название компании' },
        { id: 'testimonial-rating', message: 'Пожалуйста, поставьте оценку' },
        { id: 'testimonial-text', message: 'Пожалуйста, напишите текст отзыва' }
    ];

    let isValid = true;

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            showError(element, field.message);
            isValid = false;
        } else {
            clearError(element);
        }
    });

    return isValid;
}

// Функция отправки формы отзыва (ИСПРАВЛЕНО)
function submitTestimonialForm(form, ratingStars, ratingInput) {
    const formData = {
        name: document.getElementById('client-name') ? value ||
            position : document.getElementById('client-position') ? value ||
            company : document.getElementById('client-company') ? value ||
            project : document.getElementById('client-project') ? value ||
            rating : ratingInput ? value ||
            text : document.getElementById('testimonial-text') ? value ||
            date : new Date().toISOString()
    };

    // В реальном проекте здесь была бы отправка данных на сервер
    // Например: await sendFormData(formData);
    console.log('Данные отзыва:', formData);

    // Показ модального окна успеха
    showSuccessModal();

    // Сброс формы
    resetForm(form, ratingStars, ratingInput);
}

// Сброс формы
function resetForm(form, ratingStars, ratingInput) {
    form.reset();
    AppState.currentRating = 0;
    ratingInput.value = '';

    ratingStars.forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
    });
}

// Функция инициализации кнопок "Подробнее"
function initProjectDetails() {
    // Используем делегирование событий для динамически добавляемых элементов
    document.addEventListener('click', (e) => {
        const detailsBtn = e.target.closest('.project-details-btn');

        if (detailsBtn) {
            const projectId = detailsBtn.getAttribute('data-project');
            if (projectId) {
                loadProjectDetails(projectId);
                showProjectModal();
            }
        }
    });
}

// Функция загрузки деталей проекта
function loadProjectDetails(projectId) {
    const modalContent = document.getElementById('project-modal-content');

    if (!modalContent) {
        console.error('Контейнер для модального окна не найден');
        return;
    }

    const project = getProjectData(projectId);
    const html = generateProjectModalHTML(project);

    modalContent.innerHTML = html;
}

// Получение данных проекта
function getProjectData(projectId) {
    // В реальном проекте здесь был бы запрос к серверу
    const projectsData = {
        '1': {
            title: 'Линия фотолитографии 0.35 мкм',
            category: 'production',
            categoryText: 'ПРОИЗВОДСТВО',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            date: 'Январь 2024',
            client: 'АО "Микрон"',
            description: 'Проектирование и запуск линии проекционной литографии для производства микросхем с разрешением 0.35 мкм.',
            details: 'Проект включал полный цикл работ: от разработки технического задания до запуска в промышленную эксплуатацию. Было установлено оборудование ASML PAS 5500, системы очистки пластин, контрольное оборудование KLA Tencor.',
            results: [
                { value: '0.35 мкм', label: 'Разрешение литографии' },
                { value: '60 вф/ч', label: 'Производительность' },
                { value: '200 мм', label: 'Диаметр пластин' },
                { value: '±0.1 мкм', label: 'Точность выравнивания' },
                { value: 'ISO 5', label: 'Класс чистоты' },
                { value: '98.5%', label: 'Выход годных' }
            ],
            clientInfo: {
                name: 'Иванов Сергей Петрович',
                position: 'Технический директор',
                company: 'АО "Микрон"',
                avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
                testimonial: 'Компания RB-BW.RU выполнила проект в рекордные сроки. Профессионализм команды и качество работ превзошли наши ожидания. Особенно хочется отметить техническую поддержку и обучение персонала.'
            }
        },
        '2': {
            title: 'Центр нанотехнологий МГУ',
            category: 'research',
            categoryText: 'ИССЛЕДОВАНИЯ',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            date: 'Сентябрь 2023',
            client: 'МГУ им. Ломоносова',
            description: 'Оснащение исследовательского центра оборудованием для нанотехнологий и подготовки кадров.',
            details: 'Проект включал создание 12 специализированных лабораторий с оборудованием для электронно-лучевой литографии, атомно-силовой микроскопии, плазмохимического осаждения и других нанотехнологических процессов.',
            results: [
                { value: '10 нм', label: 'Точность E-Beam' },
                { value: '12', label: 'Лабораторий' },
                { value: 'ISO 5', label: 'Класс чистоты' },
                { value: '50+', label: 'Исследователей' },
                { value: '3', label: 'Образовательные программы' },
                { value: '24/7', label: 'Режим работы' }
            ],
            clientInfo: {
                name: 'Петрова Анна Владимировна',
                position: 'Директор Центра нанотехнологий',
                company: 'МГУ им. Ломоносова',
                avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
                testimonial: 'Оснащение нашего исследовательского центра оборудованием от RB-BW.RU позволило вывести научные исследования на новый уровень. Оборудование работает стабильно, а техническая поддержка всегда оперативна и профессиональна.'
            }
        }
    };

    return projectsData[projectId] || projectsData['1'];
}

// Генерация HTML для модального окна
function generateProjectModalHTML(project) {
    const categoryStyles = getCategoryStyles(project.category);

    return `
        <div class="project-modal">
            <div class="project-modal__image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-modal__header">
                <span class="project-modal__category" style="${categoryStyles}">
                    ${project.categoryText}
                </span>
                <div class="project-modal__meta">
                    <span><i class="far fa-calendar"></i> ${project.date}</span>
                    <span><i class="fas fa-industry"></i> ${project.client}</span>
                </div>
            </div>
            <h2 class="project-modal__title">${project.title}</h2>
            <div class="project-modal__content">
                <p><strong>${project.description}</strong></p>
                <p>${project.details}</p>
                
                <h3>Результаты проекта</h3>
                <div class="project-modal__results">
                    ${project.results.map(result => `
                        <div class="result-item">
                            <div class="result-value">${result.value}</div>
                            <div class="result-label">${result.label}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="project-modal__client">
                    <div class="client-header">
                        <div class="client-avatar">
                            <img src="${project.clientInfo.avatar}" alt="${project.clientInfo.name}" loading="lazy">
                        </div>
                        <div class="client-info">
                            <h4>${project.clientInfo.name}</h4>
                            <p>${project.clientInfo.position}<br>${project.clientInfo.company}</p>
                        </div>
                    </div>
                    <div class="client-testimonial">
                        <p>${project.clientInfo.testimonial}</p>
                    </div>
                </div>
                
                <h3>Технологии и оборудование</h3>
                <p>В проекте использовалось современное оборудование и технологии:</p>
                <ul>
                    <li>Проекционные степперы ASML, Canon</li>
                    <li>Системы контроля KLA Tencor</li>
                    <li>Оборудование для чистых комнат</li>
                    <li>Системы автоматизации и контроля</li>
                    <li>Специализированное программное обеспечение</li>
                </ul>
            </div>
        </div>
    `;
}

// Получение стилей для категории
function getCategoryStyles(category) {
    const styles = {
        production: {
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#3b82f6'
        },
        research: {
            background: 'rgba(168, 85, 247, 0.1)',
            color: '#a855f7'
        },
        automation: {
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#22c55e'
        },
        default: {
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b'
        }
    };
    
    const style = styles[category] || styles.default;
    return `
        background: ${style.background};
        color: ${style.color};
        padding: 8px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 600;
        display: inline-block;
    `;
}

// Функция инициализации кнопки "Показать еще"
function initLoadMoreProjects() {
    const loadMoreBtn = document.getElementById('load-more-projects');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    
    if (!loadMoreBtn) return;
    
    // Скрываем кнопку, если проектов мало
    if (projectCards.length <= CONFIG.INITIAL_VISIBLE_ITEMS) {
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    // Скрываем проекты, которые не должны показываться изначально
    projectCards.forEach((card, index) => {
        if (index >= CONFIG.INITIAL_VISIBLE_ITEMS) {
            card.classList.add('hidden');
        }
    });
    
    loadMoreBtn.addEventListener('click', () => {
        const currentVisible = AppState.visibleProjectsCount;
        const nextVisible = currentVisible + CONFIG.ITEMS_PER_LOAD;
        
        // Показываем следующие проекты
        for (let i = currentVisible; i < Math.min(nextVisible, projectCards.length); i++) {
            if (projectCards[i]) {
                projectCards[i].classList.remove('hidden');
                projectCards[i].style.animation = 'fadeInUp 0.6s ease forwards';
            }
        }
        
        // Обновляем состояние
        AppState.visibleProjectsCount = nextVisible;
        
        // Скрываем кнопку, если показали все проекты
        if (AppState.visibleProjectsCount >= projectCards.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// Функция инициализации модальных окон
function initModals() {
    const modalManager = new ModalManager();
    modalManager.init();
}

// Класс для управления модальными окнами
class ModalManager {
    constructor() {
        this.modals = new Map();
    }
    
    init() {
        this.registerModal('project');
        this.registerModal('success');
        this.setupGlobalListeners();
        this.setupSuccessModalClose(); // ДОБАВЛЕНО
    }
    
    registerModal(name) {
        const modal = document.getElementById(`${name}-modal`);
        if (!modal) return;
        
        const overlay = modal.querySelector('.modal__overlay');
        const closeBtn = modal.querySelector('.modal__close');
        
        const handlers = {
            show: () => this.showModal(name),
            hide: () => this.hideModal(name)
        };
        
        if (overlay) overlay.addEventListener('click', handlers.hide);
        if (closeBtn) closeBtn.addEventListener('click', handlers.hide);
        
        this.modals.set(name, { modal, handlers });
        
        // Экспортируем функцию показа модального окна
        if (name === 'project') {
            window.showProjectModal = handlers.show;
        }
        if (name === 'success') {
            window.showSuccessModal = handlers.show;
        }
    }
    
    // ДОБАВЛЕНО: Обработчик для кнопки закрытия success modal
    setupSuccessModalClose() {
        const closeButton = document.getElementById('close-success-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideModal('success');
            });
        }
    }
    
    setupGlobalListeners() {
        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.modals.forEach(({ modal, handlers }) => {
                    if (modal.classList.contains('active')) {
                        handlers.hide();
                    }
                });
            }
        });
    }
    
    showModal(name) {
        const modalData = this.modals.get(name);
        if (!modalData) return;
        
        modalData.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    hideModal(name) {
        const modalData = this.modals.get(name);
        if (!modalData) return;
        
        modalData.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Вспомогательные функции

// Функция обновления счетчика проектов
function updateProjectsCount(count) {
    const counterElement = document.getElementById('projects-counter');
    
    if (counterElement) {
        counterElement.textContent = count;
    } else {
        // Создаем элемент для счетчика, если его нет
        const container = document.querySelector('.projects-header');
        if (container) {
            const counter = document.createElement('div');
            counter.id = 'projects-counter';
            counter.className = 'projects-counter';
            counter.textContent = `Найдено: ${count}`;
            container.appendChild(counter);
        }
    }
}

// Показ/скрытие сообщения "Проекты не найдены"
function toggleNoProjectsMessage(show) {
    const messageId = 'no-projects-message';
    let message = document.getElementById(messageId);
    
    if (show && !message) {
        message = createNoProjectsMessage();
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.appendChild(message);
        }
    } else if (!show && message) {
        message.remove();
    }
}

// Создание сообщения "Проекты не найдены"
function createNoProjectsMessage() {
    const message = document.createElement('div');
    message.id = 'no-projects-message';
    message.className = 'no-projects-message';
    
    message.innerHTML = `
        <div class="no-projects-content">
            <i class="fas fa-search" aria-hidden="true"></i>
            <h3>Проекты не найдены</h3>
            <p>Попробуйте изменить параметры фильтрации</p>
        </div>
    `;
    
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    
    return message;
}

// Показать ошибку
function showError(input, message) {
    if (!input) return;
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Очищаем предыдущие ошибки
    clearError(input);
    
    // Добавляем класс ошибки
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    
    // Создаем сообщение об ошибке
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'assertive');
    
    formGroup.appendChild(errorElement);
}

// Очистить ошибку
function clearError(input) {
    if (!input) return;
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Добавление пользовательских стилей
function addCustomStyles() {
    const styleId = 'projects-styles';
    
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    
    style.textContent = `
        .error {
            border-color: #ef4444 !important;
        }
        
        .error:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
        }
        
        .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 5px;
            display: block;
        }
        
        .no-projects-message {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            background: #f8fafc;
            border-radius: 20px;
            margin: 30px 0;
        }
        
        .no-projects-content {
            max-width: 400px;
            margin: 0 auto;
        }
        
        .no-projects-content i {
            font-size: 3rem;
            color: #cbd5e1;
            margin-bottom: 20px;
        }
        
        .no-projects-content h3 {
            font-size: 1.5rem;
            color: #64748b;
            margin-bottom: 10px;
        }
        
        .no-projects-content p {
            color: #94a3b8;
        }
        
        .rating-stars i {
            cursor: pointer;
            transition: color 0.2s ease;
        }
        
        .rating-stars i.active {
            color: #fbbf24;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
        }
        
        .modal.active {
            display: block;
        }
        
        .modal__overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .modal__content {
            position: relative;
            z-index: 1001;
            background: white;
            max-width: 800px;
            margin: 50px auto;
            border-radius: 12px;
            overflow: hidden;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal__close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1002;
            transition: all 0.3s ease;
        }
        
        .modal__close:hover {
            background: white;
            transform: rotate(90deg);
        }
        
        .project-modal__results {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .result-item {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .result-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 5px;
        }
        
        .result-label {
            font-size: 0.875rem;
            color: #64748b;
        }
        
        .success-message {
            text-align: center;
            padding: 40px;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #22c55e;
            margin-bottom: 20px;
        }
    `;
    
    document.head.appendChild(style);
}

// Экспорт функций для тестирования (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        initProjectsFilters,
        validateTestimonialForm,
        setRating,
        getCategoryStyles
    };
}