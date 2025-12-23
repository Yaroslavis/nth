// photolithography.js - специфичная логика для страницы фотолитографии

document.addEventListener('DOMContentLoaded', function() {
    // Переключение вкладок фоторезистов
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Убираем активный класс у всех кнопок
            tabBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Скрываем все вкладки
            tabPanes.forEach(pane => pane.classList.remove('active'));
            // Показываем выбранную вкладку
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Анимация визуализации процесса
    const processSteps = document.querySelectorAll('.step-visual');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNumber = entry.target.querySelector('.step-number').textContent;
                animateStep(stepNumber, entry.target);
                stepObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    processSteps.forEach(step => {
        stepObserver.observe(step);
    });

    function animateStep(stepNumber, element) {
        const content = element.querySelector('.step-visual-content');

        switch (stepNumber) {
            case '1':
                // Анимация нанесения фоторезиста
                const photoresist = content.querySelector('.photoresist');
                photoresist.style.height = '0';
                setTimeout(() => {
                    photoresist.style.transition = 'height 1s ease';
                    photoresist.style.height = '20px';
                }, 300);
                break;

            case '2':
                // Анимация экспонирования
                const lightBeam = content.querySelector('.light-beam');
                lightBeam.style.height = '0';
                setTimeout(() => {
                    lightBeam.style.transition = 'height 1s ease';
                    lightBeam.style.height = '40px';

                    // Изменение цвета фоторезиста после экспонирования
                    setTimeout(() => {
                        const exposedResist = content.querySelector('.photoresist.exposed');
                        if (exposedResist) {
                            exposedResist.style.transition = 'background 0.5s ease';
                            exposedResist.style.background = 'linear-gradient(135deg, #FF6347, #FF7F50)';
                        }
                    }, 500);
                }, 300);
                break;

            case '3':
                // Анимация проявления
                const developedResist = content.querySelector('.photoresist.developed');
                if (developedResist) {
                    developedResist.style.width = '0';
                    setTimeout(() => {
                        developedResist.style.transition = 'width 1s ease';
                        developedResist.style.width = '60%';
                    }, 300);
                }
                break;
        }

        // Добавляем класс анимации для всего элемента
        element.classList.add('animated-step');
    }

    // Форма заказа с дополнительной логикой
    const orderForm = document.querySelector('.order-form__content');
    if (orderForm) {
        // Динамическое обновление формы в зависимости от типа литографии
        const lithographyTypeSelect = document.getElementById('lithography-type');
        const resolutionInput = document.getElementById('resolution');

        if (lithographyTypeSelect && resolutionInput) {
            lithographyTypeSelect.addEventListener('change', function() {
                const selectedType = this.value;

                // Устанавливаем рекомендуемое разрешение в зависимости от типа
                switch (selectedType) {
                    case 'projection':
                        resolutionInput.value = '0.35';
                        resolutionInput.placeholder = '0.35-1.0 мкм';
                        break;
                    case 'contact':
                        resolutionInput.value = '0.5';
                        resolutionInput.placeholder = '0.5-2.0 мкм';
                        break;
                    case 'e-beam':
                        resolutionInput.value = '0.01';
                        resolutionInput.placeholder = '0.01-0.1 мкм (10-100 нм)';
                        break;
                    default:
                        resolutionInput.value = '';
                        resolutionInput.placeholder = 'например: 0.5';
                }
            });
        }

        // Валидация разрешения
        if (resolutionInput) {
            resolutionInput.addEventListener('blur', function() {
                const value = parseFloat(this.value);
                const selectedType = lithographyTypeSelect ? lithographyTypeSelect.value : '';

                if (!isNaN(value)) {
                    switch (selectedType) {
                        case 'projection':
                            if (value < 0.35 || value > 1.0) {
                                showNotification('Для проекционной литографии рекомендуется разрешение 0.35-1.0 мкм', 'warning');
                            }
                            break;
                        case 'contact':
                            if (value < 0.5 || value > 2.0) {
                                showNotification('Для контактной литографии рекомендуется разрешение 0.5-2.0 мкм', 'warning');
                            }
                            break;
                        case 'e-beam':
                            if (value < 0.01 || value > 0.1) {
                                showNotification('Для электронно-лучевой литографии рекомендуется разрешение 0.01-0.1 мкм', 'warning');
                            }
                            break;
                    }
                }
            });
        }
    }

    // Показать технические характеристики оборудования при наведении
    const equipmentCards = document.querySelectorAll('.equipment-card');
    equipmentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const specs = this.querySelector('.equipment-specs');
            if (specs) {
                specs.style.maxHeight = specs.scrollHeight + 'px';
                specs.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function() {
            const specs = this.querySelector('.equipment-specs');
            if (specs) {
                specs.style.maxHeight = '0';
                specs.style.opacity = '0';
            }
        });
    });

    // Калькулятор стоимости
    const costCalculator = document.createElement('div');
    costCalculator.className = 'cost-calculator';
    costCalculator.innerHTML = `
        <div class="calculator-container">
            <h3><i class="fas fa-calculator"></i> Ориентировочная стоимость</h3>
            <div class="calculator-form">
                <div class="calc-row">
                    <label>Тип литографии:</label>
                    <select id="calc-type">
                        <option value="projection">Проекционная</option>
                        <option value="contact">Контактная</option>
                        <option value="e-beam">Электронно-лучевая</option>
                    </select>
                </div>
                <div class="calc-row">
                    <label>Количество пластин:</label>
                    <input type="range" id="calc-count" min="1" max="100" value="1">
                    <span id="calc-count-value">1 шт</span>
                </div>
                <div class="calc-row">
                    <label>Сложность:</label>
                    <select id="calc-complexity">
                        <option value="simple">Простая (1 маска)</option>
                        <option value="medium">Средняя (2-3 маски)</option>
                        <option value="complex">Сложная (4+ масок)</option>
                    </select>
                </div>
                <div class="calc-result">
                    <div class="result-label">Примерная стоимость:</div>
                    <div class="result-value" id="calc-result">от 15 000 ₽</div>
                </div>
                <button class="btn btn--primary btn--small" id="calc-details">
                    <i class="fas fa-info-circle"></i> Подробный расчет
                </button>
            </div>
        </div>
    `;

    // Добавляем калькулятор перед формой заказа
    const orderSection = document.querySelector('.order-section');
    if (orderSection) {
        orderSection.insertAdjacentElement('beforebegin', costCalculator);

        // Стили для калькулятора
        const calculatorStyles = document.createElement('style');
        calculatorStyles.textContent = `
            .cost-calculator {
                padding: 60px 0;
                background: white;
            }
            
            .calculator-container {
                max-width: 800px;
                margin: 0 auto;
                background: #f8f9fa;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px var(--shadow-light);
            }
            
            .calculator-container h3 {
                text-align: center;
                margin-bottom: 30px;
                color: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .calculator-form {
                display: grid;
                gap: 20px;
            }
            
            .calc-row {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .calc-row label {
                flex: 1;
                font-weight: 500;
                color: var(--primary-color);
            }
            
            .calc-row select, .calc-row input {
                flex: 2;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
            }
            
            #calc-count {
                flex: 1;
            }
            
            #calc-count-value {
                min-width: 50px;
                text-align: center;
                font-weight: 500;
            }
            
            .calc-result {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: white;
                border-radius: 10px;
                margin: 20px 0;
                border: 2px solid var(--accent-yellow);
            }
            
            .result-label {
                font-size: 1.1rem;
                font-weight: 500;
                color: var(--primary-color);
            }
            
            .result-value {
                font-size: 2rem;
                font-weight: 700;
                color: var(--accent-yellow);
            }
            
            #calc-details {
                width: 100%;
                justify-content: center;
            }
            
            @media (max-width: 768px) {
                .calc-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
                
                .calc-row label, .calc-row select, .calc-row input {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(calculatorStyles);

        // Логика калькулятора
        const calcType = document.getElementById('calc-type');
        const calcCount = document.getElementById('calc-count');
        const calcCountValue = document.getElementById('calc-count-value');
        const calcComplexity = document.getElementById('calc-complexity');
        const calcResult = document.getElementById('calc-result');
        const calcDetailsBtn = document.getElementById('calc-details');

        // Базовая стоимость за тип литографии
        const basePrices = {
            projection: 15000,
            contact: 8000,
            'e-beam': 50000
        };

        // Множители сложности
        const complexityMultipliers = {
            simple: 1.0,
            medium: 1.5,
            complex: 2.0
        };

        function calculateCost() {
            const type = calcType.value;
            const count = parseInt(calcCount.value);
            const complexity = calcComplexity.value;

            let basePrice = basePrices[type];
            let multiplier = complexityMultipliers[complexity];

            // Скидка за количество
            let quantityDiscount = 1.0;
            if (count > 10) quantityDiscount = 0.9;
            if (count > 50) quantityDiscount = 0.8;
            if (count > 100) quantityDiscount = 0.7;

            // Расчет стоимости
            let total = basePrice * multiplier * count * quantityDiscount;

            // Округление
            total = Math.round(total / 1000) * 1000;

            // Обновление отображения
            calcResult.textContent = `от ${total.toLocaleString('ru-RU')} ₽`;
        }

        // Обработчики событий
        calcType.addEventListener('change', calculateCost);
        calcCount.addEventListener('input', function() {
            calcCountValue.textContent = `${this.value} шт`;
            calculateCost();
        });
        calcComplexity.addEventListener('change', calculateCost);

        // Кнопка подробного расчета
        calcDetailsBtn.addEventListener('click', function() {
            const typeText = calcType.options[calcType.selectedIndex].text;
            const count = calcCount.value;
            const complexityText = calcComplexity.options[calcComplexity.selectedIndex].text;

            const message = `Запрошен расчет для:\n• ${typeText}\n• ${count} пластин\n• ${complexityText}`;

            // Прокрутка к форме заказа и заполнение полей
            document.querySelector('#order-form').scrollIntoView({ behavior: 'smooth' });

            // Заполнение формы заказа данными из калькулятора
            if (lithographyTypeSelect) {
                lithographyTypeSelect.value = calcType.value;
            }

            const waferCountInput = document.getElementById('wafer-count');
            if (waferCountInput) {
                waferCountInput.value = count;
            }

            showNotification('Данные из калькулятора перенесены в форму заказа', 'success');
        });

        // Инициализация расчета
        calculateCost();
    }

    // Дополнительная анимация для элементов
    const animatedElements = document.querySelectorAll('.lithography-card, .qc-card');

    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // Добавляем CSS для анимаций
    const animationsStyle = document.createElement('style');
    animationsStyle.textContent = `
        .animated-step {
            animation: stepPulse 0.5s ease;
        }
        
        @keyframes stepPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .animate-fade-in {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
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
        
        .equipment-specs {
            max-height: 0;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            overflow: hidden;
        }
    `;
    document.head.appendChild(animationsStyle);
});

// Функция показа уведомлений (должна быть доступна из service-page.js)
function showNotification(message, type = 'success') {
    // Используем функцию из service-page.js или создаем свою
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Простая реализация, если функция не доступна
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}