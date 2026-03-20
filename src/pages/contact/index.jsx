// REACT
import React, { useState, useEffect } from "react";

// GOOGLE RECAPTCHA
import ReCAPTCHA from "react-google-recaptcha";

// CHAKRA UI COMPONENTS
import {
  Box,
  Input,
  Stack,
  Button,
  Heading,
  Textarea,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import sendContactEmail, { validateEmail } from "../../utils/email";

const ContactPage = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    subject: "",
    message: "",
    captcha: "",
  });

  const sendForm = async () => {
    // VALIDAR CAPTCHA
    if (!form.captcha) {
      toast({
        title: "Por favor completa el reCAPTCHA.",
        status: "error",
      });
      return;
    }

    //  VALIDAR EMAIL
    if (!validateEmail(form.email)) {
      toast({
        title: "Tu correo electrónico no es válido.",
        status: "error",
      });
      return;
    }

    try {
      await sendContactEmail({
        ...form,
        callBack: () => {
          toast({
            title: "Hemos recibido tu información correctamente.",
            status: "success",
          });
        },
      });
    } catch (error) {
      toast({
        title: "No se pudo enviar el mensaje.",
        description: error?.message ?? "Intenta nuevamente.",
        status: "error",
      });
    }
  };

  const handleInputs = (ev) =>
    setForm((prev) => ({ ...prev, [ev.target.name]: ev.target.value }));

  const onChange = (value) => {
    setForm((prev) => ({ ...prev, captcha: value }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <Box padding={{ base: "24px", md: "40px" }} bgColor="blue.500">
      <Stack
        spacing="40px"
        margin="0 auto"
        maxWidth="800px"
        alignItems="flex-start"
        justifyContent="center"
      >
        <Heading fontFamily="Montserrat Medium">Contacto</Heading>

        <FormControl>
          <FormLabel htmlFor="text" fontFamily="Montserrat Medium">
            Nombre:
          </FormLabel>
          <Input
            id="name"
            type="text"
            bgColor="white"
            marginBottom="24px"
            name="name"
            onChange={handleInputs}
            fontFamily="Montserrat Medium"
          />
          <FormLabel htmlFor="email" fontFamily="Montserrat Medium">
            E-mail:
          </FormLabel>
          <Input
            id="email"
            type="email"
            bgColor="white"
            marginBottom="24px"
            name="email"
            onChange={handleInputs}
            fontFamily="Montserrat Medium"
          />
          <FormLabel htmlFor="number" fontFamily="Montserrat Medium">
            Teléfono:
          </FormLabel>
          <Input
            id="phone"
            type="number"
            bgColor="white"
            marginBottom="24px"
            name="phone"
            onChange={handleInputs}
            fontFamily="Montserrat Medium"
          />
          <FormLabel htmlFor="text" fontFamily="Montserrat Medium">
            Asunto:
          </FormLabel>
          <Input
            id="subject"
            type="text"
            bgColor="white"
            marginBottom="24px"
            name="subject"
            onChange={handleInputs}
            fontFamily="Montserrat Medium"
          />
          <FormLabel htmlFor="text" fontFamily="Montserrat Medium">
            Mensaje:
          </FormLabel>
          <Textarea
            id="message"
            bgColor="white"
            marginBottom="24px"
            name="message"
            onChange={handleInputs}
            fontFamily="Montserrat Medium"
          />

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_APP_GOOGLE_RECAPTCHA_KEY}
            onChange={onChange}
          />

          <Button
            size="lg"
            width="100%"
            color="white"
            marginTop="24px"
            bgColor="green.700"
            onClick={sendForm}
            fontFamily="Montserrat Medium"
            _hover={{ bgColor: "blue.700" }}
          >
            Enviar
          </Button>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default ContactPage;
