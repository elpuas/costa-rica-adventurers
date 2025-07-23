document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("wpcf7mailsent", (event) => {
    const formElement = event.target;
    const container = formElement.closest(".wpcf7");

    // Only proceed if the form is designated for redirection.
    if (!container || !container.classList.contains("js-redirect-form")) {
      return;
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

    // Safely redirect using the dynamic URL provided from PHP.
    if (typeof contactRedirectData?.redirectUrl === 'string' && contactRedirectData.redirectUrl) {
      window.location.href = contactRedirectData.redirectUrl + "?" + params.toString();
    } else {
      console.error("CF7 redirect failed: Redirect URL is missing.");
    }
  });
});