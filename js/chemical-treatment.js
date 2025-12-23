// chemical-treatment.js - интерактивность для страницы химической обработки

document.addEventListener('DOMContentLoaded', function() {
    // Анимация пузырьков
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
        bubble.style.animationDelay = `${index * 0.5}s`;
    });

    // Валидация формы
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

            alert('Заявка отправлена! Наш специалист свяжется с вами в ближайшее время.');
            this.reset();
        });
    }

    // Анимация при наведении на карточки
    const treatmentCards = document.querySelectorAll('.treatment-card');
    treatmentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });

    // Анимация волны в ванне
    const bathLiquid = document.querySelector('.bath-liquid');
    if (bathLiquid) {
        setInterval(() => {
            bathLiquid.style.animation = 'none';
            setTimeout(() => {
                bathLiquid.style.animation = 'liquid-wave 3s ease-in-out infinite';
            }, 10);
        }, 3000);
    }
});