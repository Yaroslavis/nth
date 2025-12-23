// service-page.js - JavaScript для страницы "Заказать сервис"

document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы заказа сервиса
    const serviceOrderForm = document.getElementById('serviceOrderForm');

    if (serviceOrderForm) {
        serviceOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Сбор данных формы
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                serviceType: document.getElementById('service-type').value,
                equipment: document.getElementById('equipment').value,
                urgency: document.getElementById('urgency').value,
                problem: document.getElementById('problem').value
            };

            // Валидация
            if (!validateForm(formData)) {
                return;
            }

            // Отправка формы (заглушка)
            sendServiceRequest(formData);
        });
    }

    // Валидация формы
    function validateForm(data) {
        // Проверка имени
        if (!data.name || data.name.trim().length < 2) {
            showError('Пожалуйста, введите ваше имя');
            return false;
        }

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showError('Пожалуйста, введите корректный email');
            return false;
        }

        // Проверка телефона
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!data.phone || !phoneRegex.test(data.phone) || data.phone.replace(/\D/g, '').length < 10) {
            showError('Пожалуйста, введите корректный номер телефона');
            return false;
        }

        return true;
    }

    // Показ ошибки
    function showError(message) {
        // Создаем или находим элемент для ошибок
        let errorContainer = document.querySelector('.form-error');

        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-error';
            errorContainer.style.cssText = `
                background-color: #fee2e2;
                color: #dc2626;
                padding: 12px 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #fca5a5;
            `;

            const form = serviceOrderForm;
            form.insertBefore(errorContainer, form.firstChild);
        }

        errorContainer.textContent = message;

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            errorContainer.style.opacity = '0';
            errorContainer.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (errorContainer.parentNode) {
                    errorContainer.parentNode.removeChild(errorContainer);
                }
            }, 500);
        }, 5000);
    }

    // Отправка заявки (заглушка)
    function sendServiceRequest(data) {
        // В реальном приложении здесь был бы AJAX-запрос
        console.log('Отправка заявки на сервис:', data);

        // Показываем сообщение об успехе
        const submitButton = serviceOrderForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.innerHTML = '<i class="fas fa-check"></i> Заявка отправлена!';
        submitButton.style.backgroundColor = '#10b981';
        submitButton.disabled = true;

        // Сброс формы
        setTimeout(() => {
            serviceOrderForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.style.backgroundColor = '';
            submitButton.disabled = false;

            // Показать модальное окно с подтверждением
            showSuccessModal();
        }, 2000);
    }

    // Модальное окно успешной отправки
    function showSuccessModal() {
        const modalHTML = `
            <div class="success-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #10b981, #34d399);
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 35px;
                    ">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3 style="color: #1e293b; margin-bottom: 15px;">Заявка принята!</h3>
                    <p style="color: #64748b; line-height: 1.6; margin-bottom: 25px;">
                        Спасибо за вашу заявку! Наш специалист свяжется с вами в течение 15 минут для уточнения деталей.
                    </p>
                    <p style="color: #475569; font-size: 0.9rem; margin-bottom: 25px;">
                        <i class="fas fa-phone" style="color: #3b82f6;"></i>
                        Если нужна срочная помощь, звоните: <strong>+7 (911) 123-45-67</strong>
                    </p>
                    <button id="closeModal" style="
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    ">
                        Закрыть
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Обработчик закрытия модального окна
        document.getElementById('closeModal').addEventListener('click', function() {
            document.querySelector('.success-modal').remove();
        });

        // Закрытие по клику вне модального окна
        document.querySelector('.success-modal').addEventListener('click', function(e) {
            if (e.target.classList.contains('success-modal')) {
                this.remove();
            }
        });
    }

    // Обработка экстренного вызова
    const emergencyBtn = document.querySelector('a[href="tel:+78123092737"]');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            // Можно добавить Google Analytics или другую аналитику
            console.log('Экстренный вызов сервиса');
        });
    }

    // Плавная прокрутка к форме
    const orderLinks = document.querySelectorAll('a[href="#order-form"]');
    orderLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const formSection = document.getElementById('order-form');
            if (formSection) {
                formSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Динамическое обновление placeholder для поля телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length === 0) return;

            // Форматирование номера
            let formattedValue = '+7 ';

            if (value.length > 1) {
                formattedValue += '(' + value.substring(1, 4);
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(4, 7);
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(9, 11);
            }

            e.target.value = formattedValue;
        });
    }
});