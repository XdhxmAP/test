/* =============================================================================
   Voksera — main.js
   Vanilla, dependency-free, progressive enhancement. Everything here is an
   enhancement: the site is fully usable (including the contact form) with
   JavaScript disabled.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- 1. Footer year ---------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- 2. Sticky-header scrolled state ----------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 3. Mobile menu ---------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  var body = document.body;

  if (toggle && menu) {
    var lastFocused = null;

    var openMenu = function () {
      lastFocused = document.activeElement;
      body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      menu.removeAttribute("aria-hidden");
      // focus the first link for keyboard users
      var first = menu.querySelector("a, button");
      if (first) { first.focus(); }
    };

    var closeMenu = function () {
      body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    };

    var toggleMenu = function () {
      if (body.classList.contains("menu-open")) { closeMenu(); }
      else { openMenu(); }
    };

    toggle.addEventListener("click", toggleMenu);

    // Close when a menu link is activated (covers in-page and cross-page links)
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { closeMenu(); }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("menu-open")) {
        closeMenu();
      }
    });

    // Safety: if we resize up to desktop while open, reset state
    var mq = window.matchMedia("(min-width: 768px)");
    var onMq = function (e) { if (e.matches) { closeMenu(); } };
    if (mq.addEventListener) { mq.addEventListener("change", onMq); }
    else if (mq.addListener) { mq.addListener(onMq); }
  }

  /* ---- 4. Contact form (Formspree, progressively enhanced) --------------- */
  /* Submits via fetch so the visitor never leaves the page. Without JS the
     form does a normal POST to Formspree and lands on their thank-you page.
     Until a real Formspree endpoint is wired in (see contact form comment in
     index.html / README), we intercept and point people to the email address
     instead of POSTing to a placeholder URL. */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('[type="submit"]');
    var action = form.getAttribute("action") || "";
    var notConfigured = action.indexOf("YOUR_FORM_ID") !== -1 || action === "";

    var setStatus = function (kind, msg) {
      if (!status) { return; }
      status.hidden = false;
      status.className = "form-status is-" + kind;
      status.textContent = msg;
    };

    form.addEventListener("submit", function (e) {
      // Let the browser surface its own validation UI first
      if (!form.checkValidity()) { return; }

      e.preventDefault();

      if (notConfigured) {
        setStatus(
          "info",
          "This form isn’t connected to a mail service yet. Please email us " +
          "directly at adham@voksera.com and we’ll get right back to you."
        );
        return;
      }

      var data = new FormData(form);
      if (submitBtn) { submitBtn.disabled = true; }
      setStatus("info", "Sending…");

      fetch(action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus(
              "success",
              "Thanks — your message is on its way. We’ll be in touch soon."
            );
          } else {
            return res.json().then(function (d) {
              var detail =
                d && d.errors && d.errors.length
                  ? d.errors.map(function (x) { return x.message; }).join(", ")
                  : "Something went wrong sending your message.";
              throw new Error(detail);
            });
          }
        })
        .catch(function () {
          setStatus(
            "error",
            "We couldn’t send that just now. Please email adham@voksera.com instead."
          );
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; }
        });
    });
  }
})();
