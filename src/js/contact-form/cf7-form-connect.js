document.addEventListener("DOMContentLoaded", () => {
  // Remove console logs for production, but keep error logs for debugging
  document.addEventListener("wpcf7mailsent", (event) => {
    const formElement = event.target;

    if (!formElement || typeof formElement.classList?.contains !== "function") {
      console.error("❌ CF7 redirect failed: formElement is invalid.");
      return;
    }

    // Check if form contains the redirect class (inside the form)
    if (!formElement.querySelector(".js-redirect-form")) {
      return; // No redirect needed
    }

    const nombre = formElement.querySelector('input[name="cr-name"]')?.value || "";
    const correo = formElement.querySelector('input[name="cr-email"]')?.value || "";
    const telefono = formElement.querySelector('input[name="cr-phone"]')?.value || "";
    const idioma = formElement.querySelector('select[name="cr-language"]')?.value || "";

    const params = new URLSearchParams({
      client_name: nombre,
      correo,
      telefono,
      idioma,
    });

    if (typeof contactRedirectData?.redirectUrl === "string" && contactRedirectData.redirectUrl) {
      window.location.href = contactRedirectData.redirectUrl + "?" + params.toString();
    } else {
      console.error("CF7 redirect failed: Redirect URL is missing.");
    }
  });
});
