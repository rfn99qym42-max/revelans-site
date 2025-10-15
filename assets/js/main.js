document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const primaryNav = document.querySelector(".primary-nav");
    const yearTarget = document.getElementById("current-year");

    if (primaryNav) {
        const normalizedCurrentPath = window.location.pathname.replace(/\/$/, "/index.html");
        primaryNav.querySelectorAll("a").forEach((link) => {
            const linkHref = link.getAttribute("href");
            if (!linkHref) {
                return;
            }
            const linkPath = new URL(linkHref, window.location.href).pathname.replace(/\/$/, "/index.html");
            if (linkPath === normalizedCurrentPath) {
                link.classList.add("is-active");
            }
        });
    }

    const contactForm = document.querySelector("[data-contact-form]");
    if (contactForm) {
        const statusElement = contactForm.querySelector("[data-form-status]");
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const resetStatus = () => {
            if (!statusElement) {
                return;
            }
            statusElement.hidden = true;
            statusElement.textContent = "";
            statusElement.classList.remove("form-alert--success", "form-alert--error");
        };
        const showStatus = (type, message) => {
            if (!statusElement) {
                return;
            }
            statusElement.classList.remove("form-alert--success", "form-alert--error");
            if (type === "success") {
                statusElement.classList.add("form-alert--success");
            } else if (type === "error") {
                statusElement.classList.add("form-alert--error");
            }
            statusElement.textContent = message;
            statusElement.hidden = false;
        };

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            resetStatus();

            const originalButtonText = submitButton ? submitButton.textContent : "";
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Versturen...";
            }

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: contactForm.method || "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Form submit failed");
                }

                contactForm.reset();
                showStatus("success", "Bedankt voor je bericht! We nemen zo snel mogelijk contact op.");
            } catch (error) {
                showStatus("error", "Er ging iets mis bij het verzenden. Probeer het later opnieuw of mail ons op info@revelans.nl.");
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    }

    if (yearTarget) {
        yearTarget.textContent = new Date().getFullYear();
    }

    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", () => {
            const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isExpanded));
            primaryNav.classList.toggle("is-open");
        });

        primaryNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navToggle.setAttribute("aria-expanded", "false");
                primaryNav.classList.remove("is-open");
            });
        });
    }
});
