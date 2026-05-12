document.addEventListener('DOMContentLoaded', () => {
    const yearTabs = document.getElementById('yearTabs');
    const mobileTabsBtn = document.getElementById('mobileTabsBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');

    if (yearTabs) {
        const tabs = Array.from(yearTabs.querySelectorAll('.gallery-year-tab'));
        
        // --- 1. Дублирование табов в выпадающее меню ---
        if (mobileDropdown) {
            tabs.forEach(tab => {
                const clone = tab.cloneNode(true);
                // При клике на таб в выпадающем меню
                clone.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const year = clone.dataset.year;
                    setActiveYear(year);
                    
                    // Закрываем меню после выбора
                    mobileDropdown.classList.remove('active');
                    mobileTabsBtn?.classList.remove('open');
                });
                mobileDropdown.appendChild(clone);
            });
        }

        const dropdownTabs = mobileDropdown ? Array.from(mobileDropdown.querySelectorAll('.gallery-year-tab')) : [];

        // Функция установки активного года (синхронизирует обе группы кнопок)
        const setActiveYear = (year) => {
            [...tabs, ...dropdownTabs].forEach(t => {
                if (t.dataset.year === year) {
                    t.classList.add('active');
                } else {
                    t.classList.remove('active');
                }
            });

            // Переключение видимости сеток галереи
            const grids = document.querySelectorAll('.gallery-grid');
            grids.forEach(grid => {
                if (grid.dataset.year === year) {
                    grid.classList.add('active');
                } else {
                    grid.classList.remove('active');
                }
            });

            updateMobileTabsVisibility();
            
            console.log(`Switching gallery to year: ${year}`);
        };

        const updateMobileTabsVisibility = () => {
            if (!window.matchMedia('(max-width: 768px)').matches) return;

            const activeTab = yearTabs.querySelector('.gallery-year-tab.active');
            if (!activeTab) return;

            const activeIndex = tabs.indexOf(activeTab);

            // Скрываем все мобильные табы в основной строке
            tabs.forEach(t => t.classList.remove('mobile-visible'));

            // Логика: показываем 2 таба
            if (activeIndex === 0) {
                // Если первый - показываем его и следующий
                tabs[0]?.classList.add('mobile-visible');
                if (tabs.length > 1) tabs[1]?.classList.add('mobile-visible');
            } else {
                // Иначе показываем предыдущий и активный
                tabs[activeIndex - 1]?.classList.add('mobile-visible');
                tabs[activeIndex]?.classList.add('mobile-visible');
            }
        };

        // --- 2. Инициализация ---
        updateMobileTabsVisibility();

        // Скрываем кнопку выпадающего списка, если табов 2 или меньше
        if (mobileTabsBtn && tabs.length <= 2) {
            mobileTabsBtn.style.display = 'none';
        }

        // Клик по основным табам
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                setActiveYear(tab.dataset.year);
            });
        });

        // --- 3. Управление выпадающим списком ---
        if (mobileTabsBtn && mobileDropdown) {
            mobileTabsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = mobileDropdown.classList.toggle('active');
                mobileTabsBtn.classList.toggle('open', isOpen);
            });

            // Закрытие при клике вне
            document.addEventListener('click', (e) => {
                if (!mobileDropdown.contains(e.target) && e.target !== mobileTabsBtn) {
                    mobileDropdown.classList.remove('active');
                    mobileTabsBtn.classList.remove('open');
                }
            });
        }

        window.addEventListener('resize', updateMobileTabsVisibility);
    }

    // --- 4. Логика Lightbox (Полноэкранный просмотр) ---
    const overlay = document.getElementById('fullscreen-overlay');
    const fullImg = document.getElementById('fullscreen-image');
    const closeBtn = document.getElementById('fullscreen-close');
    const prevBtn = document.getElementById('fullscreen-prev');
    const nextBtn = document.getElementById('fullscreen-next');
    
    let currentImages = [];
    let currentIndex = 0;

    const openLightbox = (index, images) => {
        currentImages = images;
        currentIndex = index;
        updateLightboxImage();
        overlay.classList.add('active');
        document.documentElement.classList.add('no-scroll');

        // Запрос настоящего полноэкранного режима для оверлея
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else if (overlay.webkitRequestFullscreen) { /* Safari */
            overlay.webkitRequestFullscreen();
        } else if (overlay.msRequestFullscreen) { /* IE11 */
            overlay.msRequestFullscreen();
        }
    };

    const updateLightboxImage = () => {
        if (currentImages[currentIndex]) {
            fullImg.style.opacity = '0';
            setTimeout(() => {
                fullImg.src = currentImages[currentIndex];
                fullImg.style.opacity = '1';
            }, 150);
        }
    };

    const closeLightbox = () => {
        overlay.classList.remove('active');
        document.documentElement.classList.remove('no-scroll');

        // Выход из полноэкранного режима
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const showNext = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    };

    const showPrev = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    };

    // Делегирование клика на изображения в галерее
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-image')) {
            const grid = e.target.closest('.gallery-grid');
            if (!grid) return;

            const images = Array.from(grid.querySelectorAll('.gallery-image')).map(img => img.src);
            const index = images.indexOf(e.target.src);
            
            openLightbox(index, images);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    // Закрытие по клику на фон
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
    }

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (!overlay || !overlay.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});