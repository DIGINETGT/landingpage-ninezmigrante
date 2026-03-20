export const validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const SMTP_JS_SRC = 'https://smtpjs.com/v3/smtp.js';

const loadSmtpJs = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('SMTP loader only runs in the browser.'));
      return;
    }

    if (window.Email?.send) {
      resolve(window.Email);
      return;
    }

    const existing = document.querySelector(`script[src="${SMTP_JS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Email), {
        once: true,
      });
      existing.addEventListener(
        'error',
        () => reject(new Error('No se pudo cargar smtpjs.')),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = SMTP_JS_SRC;
    script.async = true;
    script.onload = () => resolve(window.Email);
    script.onerror = () => reject(new Error('No se pudo cargar smtpjs.'));
    document.body.appendChild(script);
  });

/**
 * Envía un correo electrónico a info@ninezmigrante.org con los datos proporcionados por el usuario
 */
const sendContactEmail = async ({
  email,
  phone,
  name,
  age,
  gender,
  subject,
  country,
  message,
  callBack = () => {},
}) => {
  const Email = await loadSmtpJs();
  const result = await Email.send({
    Host: 'smtp.elasticemail.com',
    Username: 'alexdanielsantosv@gmail.com',
    Password: '8596A4CC2E48D0FD981D12089DA72CE574B1',
    addresses: email,
    To: 'info@ninezmigrante.org',
    From: 'alexdanielsantosv@gmail.com',
    Subject: subject ?? 'Nuevo mensaje desde NiñezMigrante.org',
    Body: `Correo: ${email}, Mensaje: ${message} ${
      phone
        ? `Telefono: ${phone}, Nombre: ${name}`
        : `Edad: ${age}, Genero: ${gender}, Pais: ${country}`
    }`,
  });

  callBack(result);
  return result;
};

export default sendContactEmail;
