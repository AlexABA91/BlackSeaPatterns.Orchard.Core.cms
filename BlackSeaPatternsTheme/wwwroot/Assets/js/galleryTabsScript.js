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
    const toggleBtn = document.getElementById('fullscreen-toggle');
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
        
        // По умолчанию открываем как "затененный оверлей" (не настоящий Fullscreen)
        // Настоящий Fullscreen теперь включается только кнопкой
    };

    const toggleFullscreen = (e) => {
        if (e) e.stopPropagation();
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            // Вход в полноэкранный режим
            const enterFS = overlay.requestFullscreen || overlay.webkitRequestFullscreen || overlay.msRequestFullscreen;
            if (enterFS) {
                const promise = enterFS.call(overlay);
                if (promise && promise.then) {
                    promise.then(() => {
                        // На мобилках пытаемся развернуть в ландшафт
                        if (window.matchMedia('(max-width: 1024px)').matches && screen.orientation && screen.orientation.lock) {
                            screen.orientation.lock('landscape').catch(() => {});
                        }
                    }).catch(() => {});
                }
            }
        } else {
            // Выход из полноэкранного режима
            const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
            if (exitFS) exitFS.call(document);
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

        // Выход из полноэкранного режима при закрытии
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
            if (exitFS) exitFS.call(document);
        }
        
        // Разблокировка ориентации
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
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

    // Делегирование двойного клика
    document.addEventListener('dblclick', (e) => {
        // Если двойной клик по картинке в галерее - открываем как оверлей
        if (e.target.classList.contains('gallery-image')) {
             // Клик уже сработал и открыл, но на всякий случай
             if (!overlay.classList.contains('active')) {
                const grid = e.target.closest('.gallery-grid');
                if (grid) {
                    const images = Array.from(grid.querySelectorAll('.gallery-image')).map(img => img.src);
                    const index = images.indexOf(e.target.src);
                    openLightbox(index, images);
                }
             }
             // Гарантируем отсутствие FS при dblclick
             if (document.fullscreenElement || document.webkitFullscreenElement) {
                 const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
                 if (exitFS) exitFS.call(document);
             }
        }

        // Если двойной клик внутри открытого оверлея - выходим из FS в режим оверлея
        if (overlay.classList.contains('active') && (e.target === fullImg || e.target === overlay)) {
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
                if (exitFS) exitFS.call(document);
            }
        }
    });

    if (toggleBtn) toggleBtn.addEventListener('click', toggleFullscreen);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    // Закрытие по клику на фон (только если не FS)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
    }

    // Обработка выхода из FS (например по Esc) для разблокировки ориентации
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    });
    document.addEventListener('webkitfullscreenchange', () => {
        if (!document.webkitFullscreenElement && screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    });

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (!overlay || !overlay.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    });
});