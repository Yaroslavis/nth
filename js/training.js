document.addEventListener("DOMContentLoaded", function() {
    initCourseTabs();
    initEnrollmentButtons();
    initTrainingForm();
    initSuccessModal();
    initScrollAnimations();
});


function initCourseTabs() {
    var tabButtons = document.querySelectorAll(".tab-btn");
    var tabPanes = document.querySelectorAll(".tab-pane");

    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var tabId = button.getAttribute("data-tab");

            tabButtons.forEach(function(btn) { btn.classList.remove("active"); });
            tabPanes.forEach(function(pane) { pane.classList.remove("active"); });

            button.classList.add("active");

            var pane = document.getElementById(tabId);
            if (pane) pane.classList.add("active");
        });
    });
}


function initEnrollmentButtons() {
    var buttons = document.querySelectorAll(".course-enroll");
    if (!buttons.length) return;

    buttons.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var courseName = btn.getAttribute("data-course");
            var select = document.getElementById("training-course");
            var formBlock = document.getElementById("consultation");

            if (select) select.value = courseName || "";

            if (formBlock) {
                formBlock.scrollIntoView({ behavior: "smooth" });

                setTimeout(function() {
                    if (select) select.focus();
                }, 400);
            }
        });
    });
}


function initTrainingForm() {
    var form = document.getElementById("training-form");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        if (!validateTrainingForm()) return;

        var data = {
            name: (document.getElementById("training-name") || {}).value || "",
            email: (document.getElementById("training-email") || {}).value || "",
            phone: (document.getElementById("training-phone") || {}).value || "",
            company: (document.getElementById("training-company") || {}).value || "",
            format: (document.getElementById("training-format") || {}).value || "",
            course: (document.getElementById("training-course") || {}).value || "",
            comments: (document.getElementById("training-comments") || {}).value || "",
            date: new Date().toISOString()
        };

        console.log("Отправка формы:", data);

        showSuccessModal();
        form.reset();

        setTimeout(function() {
            form.scrollIntoView({ behavior: "smooth" });
        }, 400);
    });

    var phone = document.getElementById("training-phone");
    if (phone) {
        phone.addEventListener("input", function() {
            this.value = this.value.replace(/[^\d+()\s-]/g, "");
        });
    }
}


function validateTrainingForm() {
    var name = document.getElementById("training-name");
    var email = document.getElementById("training-email");
    var phone = document.getElementById("training-phone");

    var valid = true;

    if (!name || !name.value.trim()) {
        showError(name, "Введите имя");
        valid = false;
    } else clearError(name);

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.value.trim() || !emailRegex.test(email.value)) {
        showError(email, "Введите корректный email");
        valid = false;
    } else clearError(email);

    var digits = phone && phone.value ? phone.value.replace(/[^\d]/g, "") : "";
    if (!digits || digits.length < 10) {
        showError(phone, "Введите корректный номер телефона");
        valid = false;
    } else clearError(phone);

    return valid;
}


function showError(input, message) {
    if (!input) return;

    var group = input.closest(".form-group");
    if (!group) return;

    clearError(input);

    input.classList.add("error");

    var error = document.createElement("div");
    error.className = "error-message";
    error.textContent = message;

    group.appendChild(error);
}

function clearError(input) {
    if (!input) return;

    var group = input.closest(".form-group");
    if (!group) return;

    input.classList.remove("error");

    var err = group.querySelector(".error-message");
    if (err) err.remove();
}


function initSuccessModal() {
    var modal = document.getElementById("success-modal");
    if (!modal) return;

    var overlay = modal.querySelector(".modal__overlay");
    var xClose = modal.querySelector(".modal__close");
    var btnClose = document.getElementById("close-success-modal");

    window.showSuccessModal = function() {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    function hide() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (overlay) overlay.addEventListener("click", hide);
    if (xClose) xClose.addEventListener("click", hide);
    if (btnClose) btnClose.addEventListener("click", hide);

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modal.classList.contains("active")) hide();
    });
}


function initScrollAnimations() {
    var elements = document.querySelectorAll(
        ".benefit-card, .format-card, .course-card, .instructor-card"
    );

    if (!elements.length) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add("animated");
        });
    }, { threshold: 0.15 });

    elements.forEach(function(el) {
        observer.observe(el);
    });
}