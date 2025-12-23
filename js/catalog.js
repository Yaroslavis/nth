// catalog.js

document.addEventListener('DOMContentLoaded', function() {
            // Элементы DOM
            const productsGrid = document.getElementById('products-container');
            const productCards = document.querySelectorAll('.product-card');
            const productCount = document.getElementById('product-count');
            const viewButtons = document.querySelectorAll('.view-btn');
            const sortSelect = document.getElementById('sort-select');
            const resetFiltersBtn = document.getElementById('reset-filters');
            const applyFiltersBtn = document.getElementById('apply-filters');
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const minPriceInput = document.getElementById('min-price');
            const maxPriceInput = document.getElementById('max-price');
            const rangeMin = document.querySelector('.range-min');
            const rangeMax = document.querySelector('.range-max');
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites');
            const quickViewButtons = document.querySelectorAll('.product-card__quick-view');
            const modal = document.getElementById('quick-view-modal');
            const modalClose = document.querySelector('.modal__close');
            const quickOrderButtons = document.querySelectorAll('.quick-order');

            // Переменные состояния
            let currentView = 'grid';
            let filters = {
                lineType: [],
                performance: [],
                brand: [],
                minPrice: 0,
                maxPrice: 10000000
            };

            // Инициализация фильтров по цене
            function initPriceFilter() {
                const minPrice = parseInt(minPriceInput.value) || 0;
                const maxPrice = parseInt(maxPriceInput.value) || 10000000;

                filters.minPrice = minPrice;
                filters.maxPrice = maxPrice;

                rangeMin.value = minPrice;
                rangeMax.value = maxPrice;

                updatePriceSlider();
            }

            // Обновление ползунка цены
            function updatePriceSlider() {
                const minVal = parseInt(rangeMin.value);
                const maxVal = parseInt(rangeMax.value);

                if (minVal > maxVal) {
                    rangeMin.value = maxVal;
                    rangeMax.value = minVal;
                }

                const minPercent = (minVal / 10000000) * 100;
                const maxPercent = (maxVal / 10000000) * 100;

                const sliderTrack = document.querySelector('.slider-track');
                sliderTrack.style.left = minPercent + '%';
                sliderTrack.style.right = (100 - maxPercent) + '%';

                minPriceInput.value = rangeMin.value;
                maxPriceInput.value = rangeMax.value;

                filters.minPrice = parseInt(rangeMin.value);
                filters.maxPrice = parseInt(rangeMax.value);
            }

            // Переключение вида отображения
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const view = this.getAttribute('data-view');

                    viewButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    currentView = view;
                    productsGrid.classList.toggle('list-view', view === 'list');

                    // Сохраняем в localStorage
                    localStorage.setItem('catalogView', view);
                });
            });

            // Восстановление вида из localStorage
            const savedView = localStorage.getItem('catalogView');
            if (savedView) {
                const button = document.querySelector(`.view-btn[data-view="${savedView}"]`);
                if (button) {
                    button.click();
                }
            }

            // Сортировка товаров
            sortSelect.addEventListener('change', function() {
                const sortBy = this.value;
                sortProducts(sortBy);
            });

            function sortProducts(sortBy) {
                const products = Array.from(productCards);

                products.sort((a, b) => {
                    const priceA = parseInt(a.getAttribute('data-price'));
                    const priceB = parseInt(b.getAttribute('data-price'));
                    const nameA = a.querySelector('.product-card__title a').textContent;
                    const nameB = b.querySelector('.product-card__title a').textContent;

                    switch (sortBy) {
                        case 'price-asc':
                            return priceA - priceB;
                        case 'price-desc':
                            return priceB - priceA;
                        case 'name':
                            return nameA.localeCompare(nameB);
                        case 'newest':
                            // Для примера сортируем по наличию бейджа "Новинка"
                            const isNewA = a.querySelector('.product-badge--new');
                            const isNewB = b.querySelector('.product-badge--new');
                            return (isNewB ? 1 : 0) - (isNewA ? 1 : 0);
                        default: // popular
                            // Для примера сортируем по наличию бейджа "Хит"
                            const isHitA = a.querySelector('.product-badge--hit');
                            const isHitB = b.querySelector('.product-badge--hit');
                            return (isHitB ? 1 : 0) - (isHitA ? 1 : 0);
                    }
                });

                // Переставляем элементы в DOM
                products.forEach(product => {
                    productsGrid.appendChild(product);
                });
            }

            // Обработка чекбоксов фильтров
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const filterType = this.getAttribute('name');
                    const value = this.getAttribute('value');

                    if (this.checked) {
                        if (!filters[filterType].includes(value)) {
                            filters[filterType].push(value);
                        }
                    } else {
                        filters[filterType] = filters[filterType].filter(item => item !== value);
                    }
                });
            });

            // Обработка ползунков цены
            rangeMin.addEventListener('input', updatePriceSlider);
            rangeMax.addEventListener('input', updatePriceSlider);

            minPriceInput.addEventListener('change', function() {
                rangeMin.value = this.value || 0;
                updatePriceSlider();
            });

            maxPriceInput.addEventListener('change', function() {
                rangeMax.value = this.value || 10000000;
                updatePriceSlider();
            });

            // Применение фильтров
            applyFiltersBtn.addEventListener('click', applyFilters);

            function applyFilters() {
                let visibleCount = 0;

                productCards.forEach(card => {
                    const lineType = card.getAttribute('data-category');
                    const brand = card.getAttribute('data-brand');
                    const price = parseInt(card.getAttribute('data-price'));

                    // Проверяем все фильтры
                    const matchesLineType = filters.lineType.length === 0 || filters.lineType.includes(lineType);
                    const matchesBrand = filters.brand.length === 0 || filters.brand.includes(brand);
                    const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;

                    // Для производительности нужно добавить атрибут data-performance на карточки
                    // Временно пропускаем этот фильтр

                    if (matchesLineType && matchesBrand && matchesPrice) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                productCount.textContent = visibleCount;
            }

            // Сброс фильтров
            resetFiltersBtn.addEventListener('click', function() {
                // Сброс чекбоксов
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });

                // Сброс цены
                minPriceInput.value = '0';
                maxPriceInput.value = '10000000';
                rangeMin.value = 0;
                rangeMax.value = 10000000;

                // Сброс фильтров
                filters = {
                    lineType: [],
                    performance: [],
                    brand: [],
                    minPrice: 0,
                    maxPrice: 10000000
                };

                // Обновление ползунка
                updatePriceSlider();

                // Показываем все товары
                productCards.forEach(card => {
                    card.style.display = 'block';
                });

                productCount.textContent = productCards.length;
            });

            // Добавление в корзину
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productCard = this.closest('.product-card');
                    const productName = productCard.querySelector('.product-card__title a').textContent;
                    const productPrice = productCard.querySelector('.price-current').textContent;

                    // Обновляем счетчик корзины
                    const cartCount = document.querySelector('.cart-count');
                    let count = parseInt(cartCount.textContent) || 0;
                    count++;
                    cartCount.textContent = count;

                    // Анимация
                    this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
                    this.classList.add('btn--success');

                    // Восстанавливаем кнопку через 2 секунды
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
                        this.classList.remove('btn--success');
                    }, 2000);

                    // Показываем уведомление
                    showNotification(`Товар "${productName}" добавлен в корзину!`);

                    // Сохраняем в localStorage
                    addToCartLocalStorage(productCard);
                });
            });

            // Добавление в избранное
            addToFavoritesButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const icon = this.querySelector('i');

                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        this.classList.add('active');
                        showNotification('Товар добавлен в избранное');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        this.classList.remove('active');
                        showNotification('Товар удален из избранного');
                    }

                    // Сохраняем в localStorage
                    toggleFavoriteLocalStorage(this);
                });
            });

            // Быстрый заказ
            quickOrderButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productCard = this.closest('.product-card');
                    const productName = productCard.querySelector('.product-card__title a').textContent;

                    // Показываем форму быстрого заказа
                    showQuickOrderModal(productName);
                });
            });

            // Быстрый просмотр
            quickViewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productCard = this.closest('.product-card');
                    showQuickView(productCard);
                });
            });

            // Показать быстрый просмотр
            function showQuickView(productCard) {
                const productImage = productCard.querySelector('img').src;
                const productName = productCard.querySelector('.product-card__title a').textContent;
                const productDescription = productCard.querySelector('.product-card__description').textContent;
                const productPrice = productCard.querySelector('.price-current').textContent;


                const quickViewContent = `
            <div class="quick-view-content">
                <div class="quick-view__images">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="quick-view__details">
                    <h2 class="quick-view__title">${productName}</h2>
                    <p class="quick-view__description">${productDescription}</p>
                    
                    <div class="quick-view__features">
                        ${Array.from(productCard.querySelectorAll('.feature')).map(feature => `
                            <div class="feature">
                                ${feature.innerHTML}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="quick-view__price">
                        <div class="price-current">${productPrice}</div>
                        ${productOldPrice ? `<div class="price-old">${productOldPrice}</div>` : ''}
                    </div>
                    
                    <div class="quick-view__actions">
                        <button class="btn btn--primary btn--large add-to-cart">
                            <i class="fas fa-shopping-cart"></i>
                            Добавить в корзину
                        </button>
                        <button class="btn btn--secondary quick-order">
                            <i class="fas fa-bolt"></i>
                            Быстрый заказ
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.quick-view').innerHTML = quickViewContent;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Добавляем обработчики для кнопок в модальном окне
        const modalAddToCart = document.querySelector('.modal .add-to-cart');
        const modalQuickOrder = document.querySelector('.modal .quick-order');
        
        if (modalAddToCart) {
            modalAddToCart.addEventListener('click', function() {
                const addToCartBtn = productCard.querySelector('.add-to-cart');
                addToCartBtn.click();
            });
        }
        
        if (modalQuickOrder) {
            modalQuickOrder.addEventListener('click', function() {
                showQuickOrderModal(productName);
                modal.classList.remove('active');
            });
        }
    }

    // Показать форму быстрого заказа
    function showQuickOrderModal(productName) {
        const quickOrderModal = `
            <div class="modal" id="quick-order-modal">
                <div class="modal__overlay"></div>
                <div class="modal__content">
                    <button class="modal__close" aria-label="Закрыть">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="quick-order-form">
                        <h2>Быстрый заказ</h2>
                        <p>Вы заказываете: <strong>${productName}</strong></p>
                        <form>
                            <div class="form-group">
                                <input type="text" placeholder="Ваше имя" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" placeholder="Телефон" required>
                            </div>
                            <div class="form-group">
                                <input type="email" placeholder="Email" required>
                            </div>
                            <button type="submit" class="btn btn--primary btn--block">
                                <i class="fas fa-bolt"></i>
                                Заказать
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно в DOM
        document.body.insertAdjacentHTML('beforeend', quickOrderModal);
        
        // Показываем его
        const quickOrderModalElement = document.getElementById('quick-order-modal');
        quickOrderModalElement.classList.add('active');
        
        // Добавляем обработчик закрытия
        const closeBtn = quickOrderModalElement.querySelector('.modal__close');
        closeBtn.addEventListener('click', function() {
            quickOrderModalElement.remove();
        });
        
        // Закрытие при клике на оверлей
        quickOrderModalElement.querySelector('.modal__overlay').addEventListener('click', function() {
            quickOrderModalElement.remove();
        });
        
        // Обработка формы
        const form = quickOrderModalElement.querySelector('form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо за заказ! Наш менеджер свяжется с вами в течение 15 минут.');
            quickOrderModalElement.remove();
        });
    }

    // Показать уведомление
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
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
        }, 3000);
    }

    // Локальное хранилище для корзины
    function addToCartLocalStorage(productCard) {
        const productId = productCard.getAttribute('data-id') || Date.now();
        const productName = productCard.querySelector('.product-card__title a').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;
        const productImage = productCard.querySelector('img').src;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Проверяем, есть ли уже товар в корзине
        const existingProduct = cart.find(item => item.id === productId);
        
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Локальное хранилище для избранного
    function toggleFavoriteLocalStorage(button) {
        const productCard = button.closest('.product-card');
        const productId = productCard.getAttribute('data-id') || Date.now();
        
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        const isFavorite = button.classList.contains('active');
        
        if (isFavorite) {
            // Добавляем в избранное
            if (!favorites.includes(productId)) {
                favorites.push(productId);
            }
        } else {
            // Удаляем из избранного
            favorites = favorites.filter(id => id !== productId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Закрытие модального окна
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Закрытие по клику на оверлей
    modal.querySelector('.modal__overlay').addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Инициализация
    initPriceFilter();
    applyFilters(); // Применяем фильтры при загрузке
    
    // CSS для уведомлений
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-green);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 3000;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .btn--success {
            background: var(--accent-green) !important;
        }
        
        .quick-view-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .quick-view__images img {
            width: 100%;
            border-radius: 10px;
        }
        
        .quick-view__title {
            font-size: 1.8rem;
            margin-bottom: 15px;
        }
        
        .quick-view__description {
            margin-bottom: 20px;
            color: #666;
        }
        
        .quick-view__features {
            margin-bottom: 20px;
        }
        
        .quick-view__price {
            margin-bottom: 25px;
        }
        
        .quick-view__actions {
            display: flex;
            gap: 15px;
        }
        
        @media (max-width: 768px) {
            .quick-view-content {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});