function ready() {
  const navContainer = document.getElementById("navbarSupportedContent")
  const toggleButton = document.getElementById("toggleButton")
  const navLinks = Array.from(document.querySelectorAll('.navigation a[href^="#"]'))
  const navItems = Array.from(document.querySelectorAll(".navigation .nav-item"))
  const header = document.querySelector(".site-navbar")
  const mobileBreakpoint = window.matchMedia("(max-width: 991px)")
  const contactForm = document.querySelector("[data-contact-form]")
  const contactFeedback = document.querySelector("[data-contact-feedback]")
  const emailLink = document.querySelector("[data-email-link]")
  const copyEmailButton = document.querySelector("[data-copy-email]")
  const emailFeedback = document.querySelector("[data-email-feedback]")
  const syncHeaderOffset = () => {
    const headerOffset = header ? header.offsetHeight : 88
    document.documentElement.style.setProperty("--nav-scroll-offset", `${headerOffset}px`)
  }

  const setMenuState = (isOpen) => {
    if (!navContainer || !toggleButton) return

    navContainer.classList.toggle("show", isOpen)
    toggleButton.setAttribute("aria-expanded", String(isOpen))
  }

  if (toggleButton && navContainer) {
    toggleButton.addEventListener("click", () => {
      if (!mobileBreakpoint.matches) return
      setMenuState(!navContainer.classList.contains("show"))
    })

    document.addEventListener("click", (event) => {
      if (!mobileBreakpoint.matches || !navContainer.classList.contains("show")) return
      if (navContainer.contains(event.target) || toggleButton.contains(event.target)) return

      setMenuState(false)
    })

    window.addEventListener("resize", () => {
      syncHeaderOffset()

      if (!mobileBreakpoint.matches) {
        setMenuState(false)
      }
    })
  }

  const setActiveLink = (id) => {
    navItems.forEach((item) => item.classList.remove("active"))

    const link = navLinks.find((navLink) => navLink.getAttribute("href") === `#${id}`)
    if (link) {
      const item = link.closest(".nav-item")
      if (item) item.classList.add("active")
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetSelector = link.getAttribute("href")
      const target = document.querySelector(targetSelector)

      if (!target) return

      event.preventDefault()
      target.scrollIntoView({ behavior: "smooth", block: "start" })

      if (navContainer && navContainer.classList.contains("show")) {
        setMenuState(false)
      }
    })
  })

  const sections = Array.from(document.querySelectorAll("section[id]"))

  const onScroll = () => {
    const offset = header ? header.offsetHeight + 32 : 32
    let currentId = sections[0] ? sections[0].id : ""

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offset) {
        currentId = section.id
      }
    })

    if (currentId) setActiveLink(currentId)
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  syncHeaderOffset()
  onScroll()

  const setFeedbackMessage = (element, message, statusClass) => {
    if (!element) return

    element.textContent = message
    element.className = `contact-feedback is-visible ${statusClass}`
  }

  const setContactFeedback = (message, statusClass) => {
    setFeedbackMessage(contactFeedback, message, statusClass)
  }

  const setEmailFeedback = (message, statusClass) => {
    setFeedbackMessage(emailFeedback, message, statusClass)
  }

  if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      const endpoint = contactForm.getAttribute("action")
      if (!endpoint || endpoint.includes("your-form-id")) {
        setContactFeedback("Set your real Formspree form endpoint in site metadata before using the contact form.", "is-error")
        return
      }

      if (!contactForm.reportValidity()) return

      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalLabel = submitButton ? submitButton.textContent : ""

      if (submitButton) {
        submitButton.disabled = true
        submitButton.textContent = "Sending..."
      }

      setContactFeedback("Sending your message...", "is-success")

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: new FormData(contactForm)
        })

        if (!response.ok) throw new Error("Submission failed")

        contactForm.reset()
        setContactFeedback("Your message was sent successfully. I will get back to you soon.", "is-success")
      } catch (error) {
        setContactFeedback("The message could not be sent right now. Please email support@ompirit.com directly.", "is-error")
      } finally {
        if (submitButton) {
          submitButton.disabled = false
          submitButton.textContent = originalLabel
        }
      }
    })
  }

  if (emailLink && emailFeedback) {
    emailLink.addEventListener("click", () => {
      const emailAddress = emailLink.getAttribute("data-email-address") || emailLink.textContent.trim()

      setEmailFeedback("Opening your email app...", "is-success")

      window.setTimeout(() => {
        if (document.visibilityState === "visible" && document.hasFocus()) {
          setEmailFeedback(`If nothing opened, your browser may not have a mail app linked. Copy ${emailAddress} or send to it manually.`, "is-error")
        }
      }, 1200)
    })
  }

  if (copyEmailButton && emailFeedback) {
    copyEmailButton.addEventListener("click", async () => {
      const emailAddress = copyEmailButton.getAttribute("data-email-address")

      if (!emailAddress) return

      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        setEmailFeedback(`Copy ${emailAddress} manually if your email app did not open.`, "is-error")
        return
      }

      try {
        await navigator.clipboard.writeText(emailAddress)
        setEmailFeedback(`${emailAddress} copied to your clipboard.`, "is-success")
      } catch (error) {
        setEmailFeedback(`Copy ${emailAddress} manually if your email app did not open.`, "is-error")
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", ready)
