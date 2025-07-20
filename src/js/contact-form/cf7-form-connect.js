document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("wpcf7mailsent", (event) => {
    const formElement = event.target;
    const container = formElement.closest(".wpcf7");

    // Only proceed if this form has the 'js-redirect-form' class
    if (!container || !container.classList.contains("js-redirect-form")) {
      return;
    }

    // Optional: check that event detail matches container form ID (extra safety)
    const expectedFormID = Number(container.getAttribute("data-wpcf7-id"));
    const formID = event.detail ? Number(event.detail.contactFormId) : 0;
    if (formID !== expectedFormID || formID === 0) {
      return;
    }

    const nombre = formElement.querySelector('input[name="cr-name"]')?.value || "";
    const correo = formElement.querySelector('input[name="cr-email"]')?.value || "";
    const telefono = formElement.querySelector('input[name="cr-phone"]')?.value || "";
    const idioma = formElement.querySelector('select[name="cr-language"]')?.value || "";

    const params = new URLSearchParams({
      client_name: nombre,
      correo: correo,
      telefono: telefono,
      idioma: idioma,
    });

    window.location.href = "/contact/?" + params.toString();
  });
});
