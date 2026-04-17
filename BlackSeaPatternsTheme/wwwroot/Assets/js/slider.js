import Swiper from '../swiper/swiper.mjs'
import Autoplay from '../swiper/modules/autoplay.mjs'
import Navigation from '../swiper/modules/navigation.mjs'
import Keyboard  from '../swiper/modules/keyboard.mjs'
import EffectCreative  from '../swiper/modules/effect-creative.mjs'
import EffectFade  from '../swiper/modules/effect-fade.mjs'

document.addEventListener('DOMContentLoaded', function () {

	const isMobile = window.matchMedia('(max-width: 768px)').matches
	const swiperGall = document.querySelector('.swiper-gallery')
	const fullscreenOverlay = document.getElementById('fullscreen-overlay')
	const fullscreenImage = document.getElementById('fullscreen-image')

	const sponsorLogos = [
		'wwwroot/Sponsor2.png',
		'wwwroot/Слой 0.png',
		'wwwroot/Слой 1.png',
		'wwwroot/Слой 3.png',
		'wwwroot/Слой 4.png',
		'wwwroot/spnsor1.png',
	]

	const sponsorLoopSlides = Array.from({ length: 5 }, () => sponsorLogos).flat()

	let swiper = null

	if (swiperGall) {
		swiper = new Swiper('.swiper-gallery', {
			modules: [Navigation],
			loop: true,
			speed: 650,
			effect: isMobile ? 'fade' : 'creative',
			creativeEffect: {
				prev: {
					shadow: true,
					translate: ['-35%', 0, -35],
					rotate: [0, 0, -50],
				},
				next: {
					translate: ['35%', 0, -35],
					rotate: [0, 0, 50],
				},
			},
			slidesPerView: 1,
			spaceBetween: 0,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
		})
	}

	const openFullscreenByIndex = index => {
		if (!fullscreenOverlay || !fullscreenImage) return

		let img = document.querySelector(`.swiper-gallery .swiper-slide[data-swiper-slide-index="${index}"] img`)
		if (!img && swiperGall) {
			const slides = swiperGall.querySelectorAll('.swiper-slide img')
			img = slides[index]
		}
		if (!img) return

		fullscreenImage.src = img.src
		fullscreenOverlay.classList.add('active')
	}

	if (swiperGall && swiper) {
		swiperGall.addEventListener('dblclick', event => {
			const slide = event.target.closest('.swiper-slide')
			if (!slide) return

			// find image inside clicked slide and open it
			const img = slide.querySelector('img')
			if (!img) return
			fullscreenImage.src = img.src
			fullscreenOverlay.classList.add('active')
		})
	}

	if (fullscreenOverlay) {
		fullscreenOverlay.addEventListener('click', () => {
			fullscreenOverlay.classList.remove('active')
		})
	}
    //duplication on sponsor jury and organizers tracks
	const duplicateTrack = (htmlClass) => {
		const track = document.querySelector(htmlClass)
		if (track === null) return
		for (let i = 0; i < 2; i++) {
			track.innerHTML += track.innerHTML
		}
	}

	duplicateTrack('.jury-track')
	duplicateTrack('.organizers-track')
	duplicateTrack('.sponsors-track')
})
