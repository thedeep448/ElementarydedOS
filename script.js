/* ============================================
   elementary OS — Guía Completa
   JavaScript / Funcionalidades e interacciones
   ============================================ */

"use strict";

/* ------------------------------------------------------------------
   1. Barra de progreso de scroll
   ------------------------------------------------------------------ */
(function () {
    const progressBar = document.getElementById("scrollProgress");

    if (progressBar) {
        window.addEventListener(
            "scroll",
            () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = percent + "%";
            },
            { passive: true }
        );
    }
})();

/* ------------------------------------------------------------------
   2. Navbar: sombra al hacer scroll
   ------------------------------------------------------------------ */
(function () {
    const navbar = document.getElementById("navbar");

    if (navbar) {
        const updateNav = () => {
            navbar.classList.toggle("scrolled", window.scrollY > 10);
        };
        window.addEventListener("scroll", updateNav, { passive: true });
        updateNav();
    }
})();

/* ------------------------------------------------------------------
   3. Hero: animación de entrada de la captura
   ------------------------------------------------------------------ */
(function () {
    const hero = document.querySelector(".hero");
    if (hero) {
        window.addEventListener("load", () => hero.classList.add("loaded"));
        if (document.readyState === "complete") hero.classList.add("loaded");
    }
})();

/* ------------------------------------------------------------------
   4. Menú responsive (hamburguesa)
   ------------------------------------------------------------------ */
(function () {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("open");
            toggle.classList.toggle("open", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("open");
                toggle.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                menu.classList.remove("open");
                toggle.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }
})();

/* ------------------------------------------------------------------
   5. Navegación suave + resaltado de sección activa
   ------------------------------------------------------------------ */
(function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const targetId = anchor.getAttribute("href");
            if (targetId.length <= 1) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const navbar = document.querySelector("#navbar");
            const headerOffset = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });

    if ("IntersectionObserver" in window && navLinks.length && sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("id");
                        navLinks.forEach((link) => {
                            const active = link.getAttribute("href") === "#" + id;
                            link.classList.toggle("active", active);
                            if (active) {
                                link.setAttribute("aria-current", "true");
                            } else {
                                link.removeAttribute("aria-current");
                            }
                        });
                    }
                });
            },
            { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
        );
        sections.forEach((section) => observer.observe(section));
    }
})();

/* ------------------------------------------------------------------
   6. Animaciones al aparecer (scroll reveal)
   ------------------------------------------------------------------ */
(function () {
    const revealElements = document.querySelectorAll(".fade-in");

    if ("IntersectionObserver" in window && revealElements.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealElements.forEach((el) => observer.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add("visible"));
    }
})();

/* ------------------------------------------------------------------
   7. Lightbox de imágenes
   ------------------------------------------------------------------ */
(function () {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (lightbox && lightboxImg && lightboxClose) {
        const openLightbox = (item) => {
            const img = item.querySelector("img");
            const caption = item.dataset.caption || (img && img.alt) || "";
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || "Imagen ampliada";
            lightboxCaption.textContent = caption;
            lightbox.classList.add("open");
            document.body.style.overflow = "hidden";
            lightboxClose.focus();
        };

        galleryItems.forEach((item) => {
            item.addEventListener("click", () => openLightbox(item));
        });

        const closeLightbox = () => {
            lightbox.classList.remove("open");
            document.body.style.overflow = "";
        };

        lightboxClose.addEventListener("click", (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    }
})();

/* ------------------------------------------------------------------
   8. Botón "volver arriba"
   ------------------------------------------------------------------ */
(function () {
    const btn = document.getElementById("backToTop");

    if (btn) {
        window.addEventListener(
            "scroll",
            () => {
                btn.classList.toggle("visible", window.scrollY > 500);
            },
            { passive: true }
        );

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
})();

/* ------------------------------------------------------------------
   9. Timeline interactiva (versiones)
   ------------------------------------------------------------------ */
(function () {
    const tabs = document.querySelectorAll(".version-tab");
    const panels = document.querySelectorAll(".version-panel");

    if (!tabs.length || !panels.length) return;

    const activateVersion = (version) => {
        tabs.forEach((tab) => {
            const active = tab.dataset.version === version;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-selected", String(active));
        });
        panels.forEach((panel) => {
            panel.classList.toggle("active", panel.dataset.version === version);
        });
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const version = tab.dataset.version;
            if (version) activateVersion(version);
        });
    });

    tabs.forEach((tab, index) => {
        tab.addEventListener("keydown", (e) => {
            let next = null;
            if (e.key === "ArrowRight") next = tabs[index + 1] || tabs[0];
            if (e.key === "ArrowLeft") next = tabs[index - 1] || tabs[tabs.length - 1];
            if (next) {
                e.preventDefault();
                next.focus();
                next.click();
            }
        });
    });
})();
