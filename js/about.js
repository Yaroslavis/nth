// about.js - интерактивность для страницы "О компании"

document.addEventListener('DOMContentLoaded', function() {
    // Анимация статистики
    const stats = document.querySelectorAll('.stat-number');

    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                }
            }, 30);
        });
    }

    // Запуск анимации при прокрутке до секции
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-hero__stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Анимация карточек команды
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        member.style.transitionDelay = `${index * 0.1}s`;

        setTimeout(() => {
            member.style.opacity = '1';
            member.style.transform = 'translateY(0)';
        }, 500 + index * 100);
    });

    // Интерактивная временная шкала
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            const year = this.querySelector('.timeline-year');
            if (year) {
                year.style.background = 'linear-gradient(135deg, #60a5fa, #3b82f6)';
            }
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            const year = this.querySelector('.timeline-year');
            if (year) {
                year.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            }
        });
    });

    // Анимация иконок партнеров
    const partnerLogos = document.querySelectorAll('.partner-logo');
    partnerLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        logo.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Валидация формы подписки (если есть)
    const subscribeForm = document.querySelector('.site-footer__subscribe');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email && email.includes('@')) {
                alert('Спасибо за подписку! Вы будете получать наши новости.');
                this.reset();
            } else {
                alert('Пожалуйста, введите корректный email адрес.');
            }
        });
    }
});