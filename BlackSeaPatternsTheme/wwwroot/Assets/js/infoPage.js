document.addEventListener('DOMContentLoaded', () => {
	const registrationBtn = document.getElementById('info-button')
	const redirectUrl = 'https://blackseapatternsfest.azurewebsites.net/'

	if (!registrationBtn) return

	const ensureRedirectLoader = () => {
		let loader = document.getElementById('site-loader')

		if (!loader) {
			loader = document.createElement('div')
			loader.id = 'site-loader'
			loader.className = 'site-loader'
			loader.setAttribute('aria-live', 'polite')
			loader.setAttribute('aria-label', 'Loading page')
			loader.innerHTML = `
				<video class="site-loader__video" autoplay muted loop playsinline aria-hidden="true">
					<source src="wwwroot/02177274386663000000000000000000000ffffc0a8ac5dd6ec27.webm" type="video/webm" />
				</video>
				<p class="site-loader__text">Loading...</p>
			`
			document.body.appendChild(loader)
		}

		loader.classList.remove('is-hidden')
		loader.removeAttribute('aria-hidden')
		loader.style.pointerEvents = 'all'
	}

	registrationBtn.addEventListener('click', () => {
		ensureRedirectLoader()

		setTimeout(() => {
			window.location.href = redirectUrl
		}, 120)
	})
})
