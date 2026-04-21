document.addEventListener('DOMContentLoaded', function () {
	// Основные элементы
	const sectionsContainer = document.querySelector('.sections-container')
	const navContainer = document.querySelector('.navigation-bar')
	const burgerButton = document.querySelector('.burger-menu')
	const closeButton = document.querySelector('.close-btn')
	const sections = document.querySelectorAll('.section')
	const anchorLinks = document.querySelectorAll('.nav-anchor')

	if (sections.length > 0) {
		let currentIndex = 0
		let isScrolling = false

		// Функция для плавного перехода к секции
		const scrollToSection = (index) => {
			if (index >= 0 && index < sections.length) {
				isScrolling = true
				sections[index].scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
				
				// Блокируем повторный перехват на время анимации
				setTimeout(() => {
					isScrolling = false
				}, 700) 
			}
		}

		// Обработка колесика мыши (только для десктопа)
		const handleWheel = (e) => {
			if (isScrolling) {
				e.preventDefault()
				return
			}

			if (document.querySelector('.fullscreen-overlay.active')) return

			const delta = e.deltaY
			
			if (Math.abs(delta) > 10) { 
				e.preventDefault()
				if (delta > 0) {
					if (currentIndex < sections.length - 1) {
						scrollToSection(currentIndex + 1)
					}
				} else {
					if (currentIndex > 0) {
						scrollToSection(currentIndex - 1)
					}
				}
			}
		}

		window.addEventListener('wheel', (e) => {
			if (window.innerWidth > 1024) { 
				handleWheel(e)
			}
		}, { passive: false })


		// Используем IntersectionObserver для отслеживания активной секции
		const observerOptions = {
			root: null,
			threshold: 0.5 
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const index = Array.from(sections).indexOf(entry.target)
					if (index !== -1) {
						currentIndex = index
						updateActiveMenuItem(index)
					}
				}
			})
		}, observerOptions)

		sections.forEach(section => observer.observe(section))

		function updateActiveMenuItem(activeIndex) {
			anchorLinks.forEach((link, idx) => {
				if (idx === activeIndex) {
					link.classList.add('active')
				} else {
					link.classList.remove('active')
				}
			})
		}

		// Обработчики кликов по меню
		anchorLinks.forEach((link, index) => {
			link.addEventListener('click', (e) => {
				const href = link.getAttribute('href')
				if (href.includes('#')) {
					const targetId = link.dataset.bsTarget
					if (document.querySelector(targetId)) {
						e.preventDefault()
						scrollToSection(index)

						if (window.innerWidth <= 768) {
							navContainer.classList.remove('open')
							burgerButton.style.display = 'flex'
						}
					}
				}
			})
		})

		// Логика бургер-меню
		burgerButton.addEventListener('click', () => {
			navContainer.classList.add('open')
			burgerButton.style.display = 'none'
		})

		closeButton.addEventListener('click', () => {
			navContainer.classList.remove('open')
			burgerButton.style.display = 'flex'
		})
	}
})
