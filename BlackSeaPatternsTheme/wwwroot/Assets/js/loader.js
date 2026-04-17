;(function () {
	const LOADER_ID = 'site-loader'
	const HIDDEN_CLASS = 'is-hidden'
	const FALLBACK_HIDE_DELAY = 4000

	const hideLoader = () => {
		const loader = document.getElementById(LOADER_ID)
		if (!loader || loader.classList.contains(HIDDEN_CLASS)) return

		loader.classList.add(HIDDEN_CLASS)
		loader.setAttribute('aria-hidden', 'true')

		setTimeout(() => {
			loader.remove()
		}, 400)
	}

	window.addEventListener('load', hideLoader)

	// Fallback in case some resource blocks full "load" event for too long
	setTimeout(hideLoader, FALLBACK_HIDE_DELAY)
})()
