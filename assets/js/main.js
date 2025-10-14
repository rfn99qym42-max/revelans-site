document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const primaryNav = document.querySelector(".primary-nav");
    const yearTarget = document.getElementById("current-year");

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
