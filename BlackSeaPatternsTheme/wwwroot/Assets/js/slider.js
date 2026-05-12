document.addEventListener('DOMContentLoaded', function () {

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
