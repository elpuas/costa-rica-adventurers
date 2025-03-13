document.addEventListener("DOMContentLoaded", () => {
  const selector = ".wpcf7";
  const container = document.querySelector(selector);

  if (container) {
    document.addEventListener(
      "wpcf7mailsent",
      (event) => {
        // Get the closest container that holds the data attribute (e.g. <div class="wpcf7 ...">)
        const container = event.target.closest(".wpcf7");
        const expectedFormID = container
          ? Number(container.getAttribute("data-wpcf7-id"))
          : 0;

        // Get the form ID from the event details
        const formID = Number(event.detail.contactFormId);

        // Check if the form ID matches the expected value
        if (formID === expectedFormID && formID !== 0) {
          const formElement = event.target;
          const nombreEl = formElement.querySelector('input[name="text-758"]');
          const correoEl = formElement.querySelector('input[name="email-372"]');
          const telefonoEl = formElement.querySelector(
            'input[name="tel-tours"]'
          );
          const idiomaEl = formElement.querySelector('select[name="text-759"]');

          const nombre = nombreEl ? nombreEl.value : "";
          const correo = correoEl ? correoEl.value : "";
          const telefono = telefonoEl ? telefonoEl.value : "";
          const idioma = idiomaEl ? idiomaEl.value : "";

          const params = new URLSearchParams();
          params.set("client_name", nombre);
          params.set("correo", correo);
          params.set("telefono", telefono);
          params.set("idioma", idioma);

          window.location.href = "/contact/?" + params.toString();
        }
      },
      false
    );
  }
});
