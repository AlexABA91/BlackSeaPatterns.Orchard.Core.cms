document.addEventListener('DOMContentLoaded', function () {

	// Плавный скролл по секциям
	const sectionsContainer = document.querySelector('.sections-container')
	const navContainer = document.querySelector('.navigation-bar')
	const burgerButton = document.querySelector('.burger-menu')
	const closeButton = document.querySelector('.close-btn')
	if (sectionsContainer) {
		const sections = document.querySelectorAll('.section')
		let currentIndex = 0
		let isScrolling = false
		let touchStartY = 0 // Начальная позиция касания по Y
		const anchorLinks = document.querySelectorAll('.nav-anchor')

		// Функция для прокрутки к определенной секции
		const scrollToSection = index => {
			console.log('Scrolling to section index:', index)
			if (index >= 0 && index < sections.length) {

				document.querySelector(anchorLinks[index].dataset.bsTarget).scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
					currentIndex = index
			}
		}

		// Функция для выполнения скролла и установки задержки
		const performScroll = newIndex => {
			if (isScrolling) return
			isScrolling = true

			scrollToSection(newIndex)

			// Блокировка прокрутки на время анимации
			setTimeout(() => {
				isScrolling = false
			}, 600) // Должно совпадать с длительностью CSS transition
		}

		// Обработчик события прокрутки колесом мыши
		const handleWheel = event => {
			if (isScrolling) {
				event.preventDefault()
				return
			}

			event.preventDefault()

			if (event.deltaY > 0) {
				// Прокрутка вниз
				if (currentIndex < sections.length - 1) {
					performScroll(currentIndex + 1)
				}
			} else {
				// Прокрутка вверх
				if (currentIndex > 0) {
					performScroll(currentIndex - 1)
				}
			}
		}

		// Обработчик начала касания
		const handleTouchStart = event => {
			if (isScrolling) return
			touchStartY = event.touches[0].clientY
		}

		// Обработчик движения пальца
		const handleTouchMove = event => {
			if (isScrolling) {
				event.preventDefault()
				return
			}

			const touchCurrentY = event.touches[0].clientY
			const deltaY = touchStartY - touchCurrentY

			// Определяем свайп и его направление
			if (Math.abs(deltaY) > 50) {
				// Порог для срабатывания свайпа
				event.preventDefault()
				if (deltaY > 0) {
					// Свайп вверх (прокрутка вниз)
					if (currentIndex < sections.length - 1) {
						performScroll(currentIndex + 1)
					}
				} else {
					// Свайп вниз (прокрутка вверх)
					if (currentIndex > 0) {
						performScroll(currentIndex - 1)
					}
				}
				// Сбрасываем начальную позицию, чтобы избежать многократных срабатываний
				touchStartY = touchCurrentY
			}
		}
		burgerButton.addEventListener('click', () => {
			navContainer.classList.add('open')
			burgerButton.style.display = 'none'
		})

		closeButton.addEventListener('click', () => {
			navContainer.classList.remove('open')
			burgerButton.style.display = 'flex'
		})

		// Обработчики для якорных ссылок в навигационной панели
		
		anchorLinks.forEach((link, index) => {

			link.dataset.index = index; 

			link.addEventListener('click', () => {

				currentIndex = parseInt(link.dataset.index)
				// Проверяем, является ли устройство мобильным
				if (window.innerWidth <= 768) {
					// Закрываем навигационную панель
					navContainer.classList.remove('open')
					burgerButton.style.display = 'flex'
				}
			})
		})

		// Привязка событий
		sectionsContainer.addEventListener('wheel', handleWheel, { passive: false })
		sectionsContainer.addEventListener('touchstart', handleTouchStart, {
			passive: false,
		})
		sectionsContainer.addEventListener('touchmove', handleTouchMove, {
			passive: false,
		})

		// Инициализация первой секции
		scrollToSection(0)
	}
})
