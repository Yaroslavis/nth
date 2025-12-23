// packaging.js - интерактивность для страницы корпусирования

document.addEventListener('DOMContentLoaded', function() {
    // Анимация FAQ
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

    // Анимация для визуализации чипа
    const chipVisual = document.querySelector('.chip-visual');
    if (chipVisual) {
        chipVisual.addEventListener('mouseenter', function() {
            const wires = this.querySelectorAll('.wire');
            wires.forEach((wire, index) => {
                wire.style.animation = 'wire-glow 0.5s infinite alternate';
                wire.style.animationDelay = `${index * 0.1}s`;
            });
        });

        chipVisual.addEventListener('mouseleave', function() {
            const wires = this.querySelectorAll('.wire');
            wires.forEach(wire => {
                wire.style.animation = 'wire-glow 2s infinite alternate';
            });
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
            this.reset();
        });
    }

    // Анимация карточек при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками
    document.querySelectorAll('.type-card, .equipment-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});