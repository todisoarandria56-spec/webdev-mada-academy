/* ==========================================
   WEBDEV MADA ACADEMY
   Interactions du site
   ========================================== */

"use strict";

// Attendre que la page HTML soit chargée
document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. ANNÉE AUTOMATIQUE DANS LE FOOTER
    // ======================================

    const yearElements = document.querySelectorAll("[data-year]");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    // ======================================
    // 2. NAVIGATION ET MENU MOBILE
    // ======================================

    const menuButton = document.querySelector("#menu-toggle");
    const navigation = document.querySelector(".nav-links");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("menu-open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("menu-open");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }


    // ======================================
    // 3. SCROLL DOUX VERS LES SECTIONS
    // ======================================

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // ======================================
    // 4. CHOIX D'UNE FORMATION
    // ======================================

    const courseButtons = document.querySelectorAll("[data-course]");
    const courseSelect = document.querySelector("#formation");

    courseButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const courseName = button.dataset.course;

            if (courseSelect && courseName) {
                const matchingOption = Array.from(
                    courseSelect.options
                ).find(function (option) {
                    return option.value === courseName ||
                           option.textContent.trim() === courseName;
                });

                if (matchingOption) {
                    courseSelect.value = matchingOption.value;
                }
            }

            const registrationSection =
                document.querySelector("#inscription");

            if (registrationSection) {
                registrationSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });


    // ======================================
    // 5. FORMULAIRE D'INSCRIPTION
    // ======================================

    const registrationForm =
        document.querySelector("#registration-form");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!registrationForm.reportValidity()) {
                return;
            }

            const formData = new FormData(registrationForm);

            const name =
                formData.get("nom") ||
                formData.get("name") ||
                "";

            const email =
                formData.get("email") || "";

            const formation =
                formData.get("formation") || "";

            const phone =
                formData.get("telephone") ||
                formData.get("phone") ||
                "";

            const message = [
                "DEMANDE D'INSCRIPTION",
                "WEBDEV MADA ACADEMY",
                "-------------------------",
                "Nom : " + name,
                "Email : " + email,
                "Téléphone : " + phone,
                "Formation : " + formation,
                "Date : " + new Date().toLocaleString("fr-FR"),
                "-------------------------",
                "Cette demande doit être vérifiée par l'administration."
            ].join("\n");

            // Créer un fichier texte contenant la demande
            const file = new Blob(
                [message],
                { type: "text/plain;charset=utf-8" }
            );

            const fileURL = URL.createObjectURL(file);
            const downloadLink = document.createElement("a");

            downloadLink.href = fileURL;
            downloadLink.download = "inscription-webdev-mada.txt";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();

            URL.revokeObjectURL(fileURL);

            showNotice(
                "Votre demande a été préparée dans un fichier texte. " +
                "Elle n'a pas encore été envoyée à l'administration.",
                "success"
            );
        });
    }


    // ======================================
    // 6. PROFESSEUR IA — MODE DÉMONSTRATION
    // ======================================

    const chatForm = document.querySelector("#chat-form");
    const chatInput = document.querySelector("#chat-input");
    const chatMessages = document.querySelector("#chat-messages");

    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const question = chatInput.value.trim();

            if (!question) {
                showNotice(
                    "Écris d'abord ta question.",
                    "error"
                );
                return;
            }

            addChatMessage(question, "user");
            chatInput.value = "";

            const response = createDemoResponse(question);

            addChatMessage(response, "bot");
        });
    }


    // ======================================
    // 7. BOUTONS DE PAIEMENT ORANGE MONEY
    // ======================================

    document.querySelectorAll("[data-payment]").forEach(
        function (button) {
            button.addEventListener("click", function () {
                const paymentInfo =
                    document.querySelector("#payment-info");

                if (paymentInfo) {
                    paymentInfo.classList.remove("hidden");

                    paymentInfo.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                } else {
                    showNotice(
                        "Les instructions de paiement doivent encore " +
                        "être configurées par l'administration.",
                        "info"
                    );
                }
            });
        }
    );


    // ======================================
    // 8. BOUTONS DE COPIE DU CODE
    // ======================================

    document.querySelectorAll("[data-copy]").forEach(
        function (button) {
            button.addEventListener("click", async function () {
                const targetSelector = button.dataset.copy;
                const target = document.querySelector(targetSelector);

                if (!target) {
                    return;
                }

                const textToCopy =
                    target.innerText || target.textContent || "";

                try {
                    await navigator.clipboard.writeText(textToCopy);

                    showNotice(
                        "Texte copié dans le presse-papiers.",
                        "success"
                    );
                } catch (error) {
                    showNotice(
                        "La copie automatique n'est pas disponible " +
                        "dans ce navigateur. Sélectionne le texte " +
                        "et copie-le manuellement.",
                        "info"
                    );
                }
            });
        }
    );


    // ======================================
    // 9. FONCTIONS DU CHAT
    // ======================================

    function addChatMessage(text, sender) {
        const message = document.createElement("div");

        message.className = "message " + sender;

        // textContent empêche l'interprétation du texte comme HTML
        message.textContent = text;

        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    function createDemoResponse(question) {
        const text = question.toLowerCase();

        if (text.includes("html")) {
            return (
                "HTML sert à structurer une page web. " +
                "Par exemple : <h1>Bonjour</h1> crée un grand titre. " +
                "Essaie ensuite d'ajouter un paragraphe avec <p>."
            );
        }

        if (text.includes("css")) {
            return (
                "CSS permet de modifier l'apparence d'une page web. " +
                "Exemple : h1 { color: goldenrod; } colore le titre. " +
                "Tu peux aussi changer la taille, les marges et le fond."
            );
        }

        if (text.includes("javascript") || text.includes("js")) {
            return (
                "JavaScript rend une page interactive. " +
                "Exemple : alert('Bonjour !'); affiche un message. " +
                "Tu peux ensuite apprendre les variables, les fonctions " +
                "et les événements."
            );
        }

        if (text.includes("site")) {
            return (
                "Pour créer un site web, commence par HTML pour " +
                "la structure, CSS pour le design, puis JavaScript " +
                "pour les interactions. Apprends chaque étape avec " +
                "de petits exercices."
            );
        }

        return (
            "Bienvenue dans la démonstration du Prof IA de " +
            "WEBDEV MADA ACADEMY ! Pour apprendre, demande-moi " +
            "une explication sur HTML, CSS ou JavaScript. " +
            "Attention : cette version utilise des réponses prédéfinies " +
            "et n'est pas encore connectée à une véritable IA."
        );
    }


    // ======================================
    // 10. AFFICHER UNE NOTIFICATION
    // ======================================

    function showNotice(message, type) {
        let notice = document.querySelector("#site-notice");

        if (!notice) {
            notice = document.createElement("div");
            notice.id = "site-notice";

            notice.setAttribute("role", "status");

            Object.assign(notice.style, {
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(90%, 500px)",
                padding: "15px 20px",
                borderRadius: "10px",
                zIndex: "9999",
                boxShadow: "0 8px 25px rgba(0,0,0,.3)",
                fontSize: "14px",
                textAlign: "center"
            });

            document.body.appendChild(notice);
        }

        notice.textContent = message;

        if (type === "success") {
            notice.style.background = "#D6A64F";
            notice.style.color = "#21160D";
        } else if (type === "error") {
            notice.style.background = "#8F2929";
            notice.style.color = "#FFFFFF";
        } else {
            notice.style.background = "#2B1B12";
            notice.style.color = "#FFF9EF";
            notice.style.border = "1px solid #D6A64F";
        }

        notice.style.display = "block";

        clearTimeout(notice.hideTimer);

        notice.hideTimer = setTimeout(function () {
            notice.style.display = "none";
        }, 5000);
    }

});
