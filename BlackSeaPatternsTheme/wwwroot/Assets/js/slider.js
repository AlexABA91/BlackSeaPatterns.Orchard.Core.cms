import Swiper from '../swiper/swiper.mjs'
import Autoplay from '../swiper/modules/autoplay.mjs'
import Navigation from '../swiper/modules/navigation.mjs'
import Keyboard  from '../swiper/modules/keyboard.mjs'
import EffectCreative  from '../swiper/modules/effect-creative.mjs'
import EffectFade  from '../swiper/modules/effect-fade.mjs'

document.addEventListener('DOMContentLoaded', function () {

	const isMobile = window.matchMedia('(max-width: 768px)').matches
	const swiperGall = document.querySelector('.swiper-gallery')

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
