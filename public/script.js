class AppleSlideshow {
	constructor() {
		this.currentSlide = 0
		this.totalSlides = document.querySelectorAll(".slide").length
		this.slides = document.querySelectorAll(".slide")
		this.prevBtn = document.getElementById("prevBtn")
		this.nextBtn = document.getElementById("nextBtn")
		this.slideCounter = document.getElementById("slideCounter")
		this.progress = document.getElementById("progress")

		this.init()
	}

	init() {
		this.updateSlideCounter()
		this.updateProgress()
		this.updateNavButtons()
		this.bindEvents()
		this.resetAnimations()
	}

	bindEvents() {
		this.prevBtn.addEventListener("click", () => this.previousSlide())
		this.nextBtn.addEventListener("click", () => this.nextSlide())

		// Keyboard navigation
		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				this.previousSlide()
			} else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
				e.preventDefault()
				this.nextSlide()
			}
		})

		// Touch/swipe support
		let startX = 0
		let startY = 0

		document.addEventListener("touchstart", (e) => {
			startX = e.touches[0].clientX
			startY = e.touches[0].clientY
		})

		document.addEventListener("touchend", (e) => {
			if (!startX || !startY) return

			const endX = e.changedTouches[0].clientX
			const endY = e.changedTouches[0].clientY

			const diffX = startX - endX
			const diffY = startY - endY

			// Only trigger if horizontal swipe is more significant than vertical
			if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
				if (diffX > 0) {
					this.nextSlide()
				} else {
					this.previousSlide()
				}
			}

			startX = 0
			startY = 0
		})
	}

	showSlide(n) {
		// Hide all slides
		this.slides.forEach((slide) => {
			slide.classList.remove("active")
		})

		// Clamp slide number
		if (n >= this.totalSlides) this.currentSlide = this.totalSlides - 1
		if (n < 0) this.currentSlide = 0

		// Show current slide
		this.slides[this.currentSlide].classList.add("active")

		// Reset and trigger animations
		this.resetAnimations()

		this.updateSlideCounter()
		this.updateProgress()
		this.updateNavButtons()
	}

	nextSlide() {
		if (this.currentSlide < this.totalSlides - 1) {
			this.currentSlide++
			this.showSlide(this.currentSlide)
		}
	}

	previousSlide() {
		if (this.currentSlide > 0) {
			this.currentSlide--
			this.showSlide(this.currentSlide)
		}
	}

	updateSlideCounter() {
		this.slideCounter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`
	}

	updateProgress() {
		const progressPercent = ((this.currentSlide + 1) / this.totalSlides) * 100
		this.progress.style.width = `${progressPercent}%`
	}

	updateNavButtons() {
		this.prevBtn.disabled = this.currentSlide === 0
		this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1
	}

	resetAnimations() {
		// Reset all animations on the current slide
		const currentSlideElement = this.slides[this.currentSlide]
		const animatedElements = currentSlideElement.querySelectorAll(".fade-in, .slide-up, .slide-left, .slide-right")

		// Remove animation classes temporarily
		animatedElements.forEach((element) => {
			element.style.animation = "none"
			element.offsetHeight // Trigger reflow
			element.style.animation = null
		})
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new AppleSlideshow()
})

document.addEventListener("contextmenu", (e) => {
	e.preventDefault()
})
