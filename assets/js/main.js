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

    const reviewsList = document.querySelector("[data-reviews-list]");
    if (reviewsList) {
        const emptyState = document.querySelector("[data-reviews-empty]");
        const renderStars = (rating) => {
            const maxStars = 5;
            const safeRating = Math.max(0, Math.min(maxStars, Math.round(Number(rating) || 0)));
            const filled = "★".repeat(safeRating);
            const empty = "☆".repeat(maxStars - safeRating);
            return `${filled}${empty}`;
        };

        fetch("assets/data/reviews.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Kan reviews niet laden");
                }
                return response.json();
            })
            .then((reviews) => {
                if (!Array.isArray(reviews) || reviews.length === 0) {
                    if (emptyState) {
                        emptyState.hidden = false;
                    }
                    return;
                }

                const fragment = document.createDocumentFragment();
                reviews.forEach((review) => {
                    const card = document.createElement("article");
                    card.className = "review-card";

                    const header = document.createElement("div");
                    header.className = "review-card__header";

                    const author = document.createElement("p");
                    author.className = "review-card__author";
                    if (review.url) {
                        const link = document.createElement("a");
                        link.href = review.url;
                        link.target = "_blank";
                        link.rel = "noopener";
                        link.textContent = review.author || "Anonieme reviewer";
                        author.appendChild(link);
                    } else {
                        author.textContent = review.author || "Anonieme reviewer";
                    }

                    const rating = document.createElement("span");
                    rating.className = "review-card__rating";
                    rating.setAttribute("aria-label", `Waardering ${review.rating || 0} van 5 sterren`);
                    rating.textContent = renderStars(review.rating);

                    header.appendChild(author);
                    header.appendChild(rating);

                    const text = document.createElement("p");
                    text.className = "review-card__text";
                    text.textContent = review.text || "";

                    const meta = document.createElement("p");
                    meta.className = "review-card__meta";
                    if (review.date) {
                        meta.textContent = `Google review • ${review.date}`;
                    } else {
                        meta.textContent = "Google review";
                    }

                    card.appendChild(header);
                    card.appendChild(text);
                    card.appendChild(meta);
                    fragment.appendChild(card);
                });

                reviewsList.appendChild(fragment);
            })
            .catch(() => {
                if (emptyState) {
                    emptyState.hidden = false;
                    emptyState.textContent = "Reviews konden niet geladen worden. Voeg ze toe in assets/data/reviews.json.";
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
