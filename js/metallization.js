// metallization.js - специфичный JavaScript для страницы металлизации

document.addEventListener('DOMContentLoaded', function() {
    // Переключение вкладок в разделе материалов
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Удаляем активный класс у всех кнопок и панелей
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Добавляем активный класс текущей кнопке и соответствующей панели
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Анимация для визуализации процесса металлизации
    const processVisual = document.querySelector('.metallization-process-compact');
    if (processVisual) {
        processVisual.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.15)';
        });

        processVisual.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.08)';
        });
    }

    // Валидация формы заказа
    const orderForm = document.querySelector('.order-form__content');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            if (!name || !email || !phone) {
                alert('Пожалуйста, заполните обязательные поля (имя, email, телефон)');
                return;
            }

            // Здесь обычно отправка формы на сервер
            alert('Заявка отправлена! Наш специалист свяжется с вами в ближайшее время.');
            orderForm.reset();
        });
    }

    // Интерактивность для FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');

            // Переключаем класс active
            this.classList.toggle('active');

            // Анимируем открытие/закрытие ответа
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Анимация для карточек металлизации
    const metallizationCards = document.querySelectorAll('.metallization-card');
    metallizationCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});