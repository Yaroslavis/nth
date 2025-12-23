// etching.js - специфичный JavaScript для страницы травления

document.addEventListener('DOMContentLoaded', function() {
    // Активация вкладок материалов
    const tabButtons = document.querySelectorAll('.materials-tabs .tab-btn');
    const tabPanes = document.querySelectorAll('.materials-tabs .tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Убираем активный класс со всех кнопок и панелей
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Добавляем активный класс текущей кнопке и соответствующей панели
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Валидация формы заказа
    const orderForm = document.querySelector('.order-form__content');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Базовая валидация
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const etchingType = document.getElementById('etching-type').value;

            if (!name || !email || !phone || !etchingType) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }

            // Имитация отправки формы
            showNotification('Заявка отправлена! Наш специалист свяжется с вами в течение 2 часов.', 'success');
            orderForm.reset();
        });
    }

    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация плазмы в визуализации
    const plasmaElements = document.querySelectorAll('.plasma');
    plasmaElements.forEach(plasma => {
        setInterval(() => {
            plasma.style.opacity = plasma.style.opacity === '0.9' ? '0.6' : '0.9';
        }, 2000);
    });
});

// Функция показа уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
// Функция для развертывания/свертывания ответов FAQ
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Находим родительский элемент FAQ и ответ внутри него
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');

            // Переключаем класс активного состояния
            faqItem.classList.toggle('active');

            // Если элемент активен, показываем ответ
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.padding = '15px 0'; // или ваше значение padding
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                // Скрываем ответ
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.padding = '0';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }

            // Закрываем другие открытые вопросы (опционально)
            if (faqItem.classList.contains('active')) {
                faqQuestions.forEach(otherQuestion => {
                    const otherItem = otherQuestion.closest('.faq-item');
                    if (otherItem !== faqItem && otherItem.classList.contains('active')) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherQuestion.querySelector('i');

                        otherItem.classList.remove('active');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.opacity = '0';
                        otherAnswer.style.padding = '0';
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                });
            }
        });
    });
}

// Добавьте вызов функции в ваш DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... ваш существующий код ...

    // Инициализация FAQ
    initFAQ();

    // ... остальной код ...
});