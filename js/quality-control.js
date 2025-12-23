// quality-control.js - интерактивность для страницы контроля качества

document.addEventListener('DOMContentLoaded', function() {
    // Анимация сканирующей линии
    const scanLine = document.querySelector('.scan-line');
    if (scanLine) {
        let speed = 3;
        scanLine.addEventListener('click', function() {
            speed = speed === 3 ? 1 : 3;
            this.style.animationDuration = `${speed}s`;
        });
    }

    // Интерактивные дефекты
    const defects = document.querySelectorAll('.defect');
    defects.forEach(defect => {
        defect.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.5)';
            this.style.boxShadow = '0 0 15px #ef4444';
        });

        defect.addEventListener('mouseleave', function() {
            this.style.animation = 'pulse 2s infinite';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });

        defect.addEventListener('click', function() {
            const defectInfo = document.createElement('div');
            defectInfo.className = 'defect-info';
            defectInfo.innerHTML = `
                <div class="defect-info-content">
                    <h4>Обнаружен дефект</h4>
                    <p>Тип: ${this.classList.contains('defect-1') ? 'Точечный' : 'Микротрещина'}</p>
                    <p>Размер: ${this.classList.contains('defect-1') ? '8 нм' : '6 нм'}</p>
                    <button class="close-defect-info">Закрыть</button>
                </div>
            `;
            defectInfo.style.cssText = `
                position: absolute;
                top: ${this.offsetTop + 20}px;
                left: ${this.offsetLeft + 20}px;
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                z-index: 1000;
                border: 2px solid #ef4444;
                max-width: 200px;
            `;

            document.querySelector('.control-process-visual').appendChild(defectInfo);

            // Удаление при клике на кнопку закрытия
            defectInfo.querySelector('.close-defect-info').addEventListener('click', function() {
                defectInfo.remove();
            });

            // Автоматическое удаление через 5 секунд
            setTimeout(() => {
                if (defectInfo.parentNode) {
                    defectInfo.remove();
                }
            }, 5000);
        });
    });

    // Интерактивная таблица оборудования
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Удаляем активный класс у всех строк
            tableRows.forEach(r => r.classList.remove('active'));
            // Добавляем активный класс текущей строке
            this.classList.add('active');

            // Показываем дополнительную информацию
            const equipmentName = this.querySelector('div:first-child strong').textContent;
            alert(`Выбрано оборудование: ${equipmentName}\n\nПодробная информация была отправлена в отдельную панель (в реальном приложении).`);
        });
    });

    // Валидация формы с чекбоксами
    const orderForm = document.querySelector('.order-form__content');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверка обязательных полей
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const checkboxes = document.querySelectorAll('input[name="control"]:checked');

            if (!name || !email || !phone) {
                alert('Пожалуйста, заполните обязательные поля (имя, email, телефон)');
                return;
            }

            if (checkboxes.length === 0) {
                alert('Пожалуйста, выберите хотя бы один тип контроля');
                return;
            }

            // Сбор данных формы
            const formData = {
                name: name,
                email: email,
                phone: phone,
                productType: document.getElementById('product-type').value,
                controls: Array.from(checkboxes).map(cb => cb.value),
                quantity: document.getElementById('quantity').value,
                standard: document.getElementById('standard').value,
                requirements: document.getElementById('requirements').value
            };

            console.log('Данные формы:', formData);

            // Здесь обычно отправка формы на сервер
            alert('Заявка на контроль качества отправлена!\n\nНаш специалист свяжется с вами в течение 2 часов для уточнения деталей.');

            // Сброс формы
            this.reset();
        });
    }

    // Анимация карточек методов при скролле
    const methodCards = document.querySelectorAll('.method-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    // Начальные стили и наблюдение
    methodCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Интерактивные сертификаты
    const certificates = document.querySelectorAll('.certificate');
    certificates.forEach(cert => {
        cert.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.cert-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        cert.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.cert-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });

        cert.addEventListener('click', function() {
            const certName = this.querySelector('h3').textContent;
            const certDesc = this.querySelector('p').textContent;

            const modal = document.createElement('div');
            modal.className = 'certificate-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-icon">${this.querySelector('.cert-icon').innerHTML}</div>
                    <h3>${certName}</h3>
                    <p>${certDesc}</p>
                    <p class="modal-details">Этот сертификат подтверждает соответствие нашей лаборатории международным стандартам качества и компетентности.</p>
                    <button class="modal-download">Скачать копию</button>
                </div>
            `;

            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                backdrop-filter: blur(5px);
            `;

            document.body.appendChild(modal);

            // Закрытие модального окна
            modal.querySelector('.modal-close').addEventListener('click', function() {
                modal.remove();
            });

            modal.querySelector('.modal-download').addEventListener('click', function() {
                alert('Сертификат будет скачан в формате PDF');
            });

            // Закрытие при клике на фон
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });

    // Динамическое обновление цены на основе выбранных опций
    function updatePriceEstimate() {
        const checkboxes = document.querySelectorAll('input[name="control"]:checked');
        const quantity = parseInt(document.getElementById('quantity').value) || 1;

        let basePrice = 0;
        checkboxes.forEach(cb => {
            switch (cb.value) {
                case 'visual':
                    basePrice += 5000;
                    break;
                case 'dimension':
                    basePrice += 10000;
                    break;
                case 'electrical':
                    basePrice += 15000;
                    break;
                case 'reliability':
                    basePrice += 20000;
                    break;
            }
        });

        const totalPrice = basePrice * quantity;

        // Показываем оценку стоимости
        const priceDisplay = document.querySelector('.price-estimate') || (function() {
            const div = document.createElement('div');
            div.className = 'price-estimate';
            div.style.cssText = `
                background: #dbeafe;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
                border-left: 4px solid #3b82f6;
            `;
            document.querySelector('.order-form').insertBefore(div, document.querySelector('.form-footer'));
            return div;
        })();

        if (totalPrice > 0) {
            priceDisplay.innerHTML = `
                <strong>Примерная стоимость:</strong> ${totalPrice.toLocaleString('ru-RU')} ₽
                <br><small>Итоговая стоимость будет уточнена после консультации с инженером</small>
            `;
        } else {
            priceDisplay.innerHTML = '<em>Выберите типы контроля для расчета стоимости</em>';
        }
    }

    // Слушатели для обновления цены
    document.querySelectorAll('input[name="control"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePriceEstimate);
    });

    document.getElementById('quantity').addEventListener('input', updatePriceEstimate);

    // Запуск начального расчета
    setTimeout(updatePriceEstimate, 500);
});