// REACT
import React, { useEffect, useState } from 'react';
import { CircularProgress, useToast } from '@chakra-ui/react';

// GOOGLE RECAPTCHA
import ReCAPTCHA from 'react-google-recaptcha';

// CHAKRA UI COMPONENTS
import {
  Box,
  Text,
  Stack,
  Input,
  Button,
  Select,
  Checkbox,
  IconButton,
} from '@chakra-ui/react';

// CHAKRA UI ICONS
import { CloseIcon } from '@chakra-ui/icons';

import './index.css';
import sendContactEmail, { validateEmail } from '../../../../utils/email';
import useFetch from '../../../../hooks/fetch';

const Popup = () => {
  const toast = useToast();
  const [popup, setPopup] = useState(false);
  const [form, setForm] = useState({
    email: '',
    edad: 0,
    sexo: '',
    pais: '',
    razonDeConsulta: '',
    deseaRecibirNotificaciones: false,
    captcha: '',
    details: {
      country_code: '',
      country_name: '',
      city: '',
      postal: '',
      latitude: '',
      longitude: '',
      IP: '',
      state: '',
    },
  });
  const [sexList, setSexList] = useState([]);
  const [razonList, setRazonList] = useState([]);
  const [paisList, setPaisList] = useState([]);
  const popupFilled = window.localStorage.getItem('popup');

  const sendForm = () => {
    // VALIDAR CAPTCHA
    if (!form.captcha) {
      toast({
        title: 'Por favor completa el reCAPTCHA',
        status: 'error',
      });
      return;
    }

    //  VALIDAR EMAIL
    if (!validateEmail(form.email)) {
      toast({
        title: 'Tu correo electrónico no es válido.',
        status: 'error',
      });
      return;
    }

    // ENVIAR
    sendContactEmail({
      ...form,
      callBack: (msg) => {
        toast({
          title: 'Hemos recibido tu información correctamente.',
          status: 'success',
        });
      },
    });

    // GAURDAR FORMULARIO
    fetch(`${import.meta.env.VITE_APP_API_URL}/visitas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Client-ID [my-client-id]',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify(form),
    })
      .then((resp) => {
        window.localStorage.setItem('popup', form.email);
        return console.log('formulario enviado correctamente.');
      })
      .catch((err) => console.log('Error'));

    closePopup();
  };

  const handleInputs = (ev) =>
    setForm((prev) => ({ ...prev, [ev.target.name]: ev.target.value }));

  const handleCheckbox = (ev) =>
    setForm((prev) => ({
      ...prev,
      deseaRecibirNotificaciones: ev.target.checked,
    }));

  useEffect(() => {
    // if (!import.meta.env.DEV) {
    //   setTimeout(() => {
    //     setPopup(true);
    //   }, 3000);
    // }
    if (!popupFilled) {
      setTimeout(() => {
        setPopup(true);
        getUserGeolocationDetails();
      }, 3000);
    }
  }, []);

  const closePopup = () => {
    setPopup(false);
  };

  if (popup) {
    document.body.classList.add('active-popup');
  } else {
    document.body.classList.remove('active-popup');
  }

  const onChange = (value) => setForm((prev) => ({ ...prev, captcha: value }));

  // GET USER LOCATION
  const getUserGeolocationDetails = async () => {
    try {
      await fetch(
        'https://geolocation-db.com/json/86f5f280-f4eb-11ec-8676-4f4388bc6daa'
      )
        .then((response) => response.json())
        .then((data) =>
          setForm((prev) => {
            if (!prev) {
              return console.log('No state');
            }
            return { ...prev, details: data };
          })
        )
        .catch((err) => console.log('Imposible obtener la info.'));
    } catch (error) {
      return console.log('Error al obtener la info.');
    }
  };

  return (
    <>
      {popup && (
        <Box
          top='0'
          left='0'
          right='0'
          bottom='0'
          zIndex='2'
          width='100vw'
          height='100vh'
          position='fixed'
        >
          {/* OVERLAY */}
          <Box
            zIndex='2'
            width='100%'
            height='100%'
            position='fixed'
            onClick={closePopup}
            bgColor='rgba(0,0,0,0.5)'
            backdropFilter='blur(4px)'
            _hover={{ cursor: 'pointer' }}
          ></Box>

          {/* CONTENT */}
          <Box
            top='50%'
            left='50%'
            zIndex='2'
            borderRadius='8px'
            position='absolute'
            padding='40px 32px 32px 32px'
            bgColor='rgba(255,255,255,0.8)'
            transform='translate(-50%, -50%)'
            width={{ base: '324px', md: '720px' }}
            height={{ base: '480px', md: 'auto' }}
            overflow={{ base: 'scroll', md: 'hidden' }}
          >
            <IconButton
              size='xs'
              top='10px'
              right='10px'
              position='absolute'
              icon={<CloseIcon />}
              onClick={closePopup}
            />

            {/* POPUP TITLE */}
            <Text
              fontWeight='500'
              textAlign='center'
              marginBottom='24px'
              fontFamily='Montserrat Medium'
              fontSize={{ base: '2xl', md: '3xl' }}
            >
              Queremos saber más sobre usted
            </Text>

            {/* FORM */}
            <Stack gap={{ base: '16px', md: '24px' }}>
              {/* EMAIL FIELD */}
              <Stack
                gap='0px'
                direction={{ base: 'column', md: 'row' }}
                alignItems='center'
              >
                <Text
                  fontFamily='Montserrat Medium'
                  fontSize={{ base: 'lg', md: 'xl' }}
                  width={{ base: '100%', lg: '12%' }}
                >
                  E-mail:
                </Text>
                <Input
                  name='email'
                  onChange={handleInputs}
                  type='email'
                  bgColor='white'
                  width={{ base: '100%', lg: '88%' }}
                />
              </Stack>

              <Stack direction={{ base: 'column', md: 'row' }} gap='16px'>
                {/* AGE FIELD */}
                <Stack
                  gap='0px'
                  width='100%'
                  alignItems='center'
                  direction={{ base: 'column', md: 'row' }}
                >
                  <Text
                    fontFamily='Montserrat Medium'
                    fontSize={{ base: 'lg', md: 'xl' }}
                    width={{ base: '100%', md: '25%' }}
                  >
                    Edad:
                  </Text>
                  <Input
                    name='edad'
                    onChange={handleInputs}
                    type='number'
                    bgColor='white'
                    width={{ base: '100%', md: '75%' }}
                  />
                </Stack>

                {/* GENDER FIELD */}
                <Stack
                  gap='0px'
                  width='100%'
                  alignItems='center'
                  direction={{ base: 'column', md: 'row' }}
                >
                  <Text
                    fontFamily='Montserrat Medium'
                    fontSize={{ base: 'lg', md: 'xl' }}
                    width={{ base: '100%', md: '25%' }}
                  >
                    Sexo:
                  </Text>
                  {!sexList ? (
                    <CircularProgress />
                  ) : (
                    <Select
                      name='sexo'
                      onChange={handleInputs}
                      bgColor='white'
                      fontFamily='Montserrat Medium'
                      placeholder='Selecciona tu sexo'
                      width={{ base: '100%', md: '75%' }}
                    >
                      {sexList.map((item) => (
                        <option key={item.id} value={item.nombre}>
                          {item.nombre}
                        </option>
                      ))}
                    </Select>
                  )}
                </Stack>
              </Stack>

              {/* COUNTRY FIELD */}
              <Stack
                gap='0px'
                alignItems='center'
                direction={{ base: 'column', md: 'row' }}
              >
                <Text
                  fontFamily='Montserrat Medium'
                  fontSize={{ base: 'lg', md: 'xl' }}
                  width={{ base: '100%', md: '10%' }}
                >
                  País:
                </Text>
                {!paisList ? (
                  <CircularProgress />
                ) : (
                  <Select
                    name='pais'
                    onChange={handleInputs}
                    bgColor='white'
                    fontFamily='Montserrat Medium'
                    width={{ base: '100%', md: '90%' }}
                    placeholder='Selecciona una opción'
                  >
                    {paisList.map((item) => (
                      <option key={item.id} value={item.nombre}>
                        {item.nombre}
                      </option>
                    ))}
                  </Select>
                )}
              </Stack>

              {/* INQUIRY FIELD */}
              <Stack
                gap='0px'
                alignItems='center'
                direction={{ base: 'column', md: 'row' }}
              >
                <Text
                  fontFamily='Montserrat Medium'
                  fontSize={{ base: 'lg', md: 'xl' }}
                  width={{ base: '100%', md: '30%' }}
                >
                  Rázon de consulta:
                </Text>
                {!razonList ? (
                  <CircularProgress />
                ) : (
                  <Select
                    name='razonDeConsulta'
                    onChange={handleInputs}
                    bgColor='white'
                    fontFamily='Montserrat Medium'
                    width={{ base: '100%', md: '70%' }}
                    placeholder='Selecciona una opción'
                  >
                    {razonList.map((item) => (
                      <option key={item.id} value={item.nombre}>
                        {item.nombre}
                      </option>
                    ))}
                  </Select>
                )}
              </Stack>

              {/* NEWSLETTER CHECKBOX */}
              <Checkbox borderColor='black' onChange={handleCheckbox}>
                <Text fontFamily='Montserrat Medium'>
                  Deseo recibir notificaciones
                </Text>
              </Checkbox>

              {/* GOOGLE RECAPTCHA */}
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_APP_GOOGLE_RECAPTCHA_KEY}
                onChange={onChange}
              />

              {/* SEND BUTTON */}
              <Button
                color='white'
                bgColor='blue.700'
                onClick={sendForm}
                fontFamily='Montserrat Medium'
                size={{ base: 'md', md: 'lg' }}
                _hover={{ bgColor: 'green.700' }}
              >
                Enviar
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Popup;
