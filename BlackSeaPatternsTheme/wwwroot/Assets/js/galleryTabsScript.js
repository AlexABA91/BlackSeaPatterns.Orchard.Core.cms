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

            updateMobileTabsVisibility();
            
            // TODO: Логика фильтрации галереи
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
});