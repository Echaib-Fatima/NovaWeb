/* ========================================
   NOVAWEB - MAIN JAVASCRIPT
======================================== */


/* ========================================
   MOBILE MENU
======================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (navMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

    });

}


/* ========================================
   CLOSE MOBILE MENU AFTER CLICK
======================================== */

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (navMenu) {
            navMenu.classList.remove("active");
        }

        if (menuToggle) {

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        }

    });

});


/* ========================================
   HEADER SCROLL EFFECT
======================================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* ========================================
   ACTIVE NAVIGATION
======================================== */

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

navLinks.forEach(link => {

    const linkPage =
        link.getAttribute("href").split("/").pop();

    if (linkPage === currentPage) {

        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    }

});


/* ========================================
   SIMPLE SCROLL REVEAL
======================================== */

const revealElements = document.querySelectorAll(
    ".service-card, .section-heading, .cta-box"
);

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    revealElements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });

}


/* ========================================
   CLOSE MENU WHEN CLICKING OUTSIDE
======================================== */

document.addEventListener("click", (event) => {

    if (!navMenu || !menuToggle) return;

    const clickedInsideMenu =
        navMenu.contains(event.target);

    const clickedButton =
        menuToggle.contains(event.target);

    if (
        navMenu.classList.contains("active") &&
        !clickedInsideMenu &&
        !clickedButton
    ) {

        navMenu.classList.remove("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

    }

});


/* ========================================
   CURRENT YEAR
======================================== */

const yearElements = document.querySelectorAll(
    ".current-year"
);

yearElements.forEach(element => {

    element.textContent = new Date().getFullYear();

});


/* ========================================
   CONSOLE MESSAGE
======================================== */

console.log(
    "NovaWeb 🚀 — Website loaded successfully."
);
/* ========================================
   CONTACT FORM - BACKEND
======================================== */
console.log("SCRIPT NOVAWEB CHARGÉ");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm && formSuccess) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const submitButton = contactForm.querySelector(".form-submit");

        if (submitButton) {
            submitButton.disabled = true;

            submitButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Envoi en cours...
            `;
        }

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            project_type: document.getElementById("service").value,
            budget: document.getElementById("budget").value,
            message: document.getElementById("message").value
        };

        try {

            const response = await fetch(
                "http://localhost:3000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            const responseText = await response.text();

        let data;

            try {
                data = JSON.parse(responseText);
            } catch (error) {
    console.error("Réponse du serveur:", responseText);

    throw new Error(
        "Le serveur a retourné une réponse invalide."
    );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Une erreur est survenue."
                );
            }
            console.log("✅ FORM SUCCESS REACHED");
            formSuccess.style.display = "flex";
            formSuccess.classList.add("show");

            console.log("MESSAGE SUCCESS AFFICHÉ");
            contactForm.reset();
            formSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
            });
        } catch (error) {

            console.error("ERREUR COMPLETE:", error);

            alert(
            "Erreur : " + error.message
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML = `
                    Envoyer ma demande
                    <i class="fa-solid fa-paper-plane"></i>
                `;
            }
        }

    });

}

