import {
  Box,
  Code,
  Divider,
  Fade,
  Heading,
  Image,
  ScaleFade,
  SlideFade,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import LogoNinezMigrante from '../../../../assets/LogoNinezMigrante.png';
import React, { useState } from 'react';
import { useEffect } from 'react';

import LogoCoiproden from '../../../../assets/LogoCoiproden.png';
import LogoPami from '../../../../assets/LogoPAMI.png';
import LogoKnh from '../../../../assets/LogoKnh.png';

const Slider = () => {
  const { isOpen, onToggle } = useDisclosure(true);
  const { isOpenFadeIn, onToggleFadeIn } = useDisclosure(true);
  useEffect(() => {
    onToggle(false);
  }, []);
  return (
    <Box width='100%'>
      <Stack paddingBottom='10'>
        <Stack
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          alignContent='center'
          alignItem='center'
          width='100%'
        >
          <SlideFade in={isOpen} offsetY='50px'>
            <Heading as='h1' size='lg' noOfLines={1} fontFamily='Oswald'>
              Observatorio de derechos de la Niñez Migrante
            </Heading>
          </SlideFade>
        </Stack>
        <Stack paddingTop='5px' paddingBottom='10px'>
          <SlideFade in={isOpen} offsetY='-50px'>
            <Heading fontFamily='Times' as='h6' size='xs'>
              Monitoreo binacional de niñez migrante retornda Guatemala -
              Honduras
            </Heading>
          </SlideFade>
        </Stack>
      </Stack>
      <Stack>
        <SlideFade in={isOpen} offsetY='800px'>
          <Stack padding='5'>
            <Heading fontFamily='Oswald' as='h2' size='md'>
              Antecedentes
            </Heading>
          </Stack>
          <Stack
            paddingBottom='10px'
            display='flex'
            flexDirection='row'
            flexWrap='wrap'
            justifyContent='center'
            alignItems='center'
          >
            <Stack flex={2}>
              <Text p='5' fontFamily='Montserrat Medium'>
                Es una organización no gubernamental en Honduras, de carácter
                social, sin fines de lucro. Surge en el año 1989, conformada por
                organizaciones que trabajan para el bienestar de la niñez,
                adolescencia y juventud de Honduras. La Red COIPRODEN representa
                a 25 ONG a través de las cuales se ejecutan proyectos conjuntos.
                La base de la cooperación es la aplicación de la Convención
                sobre los Derechos del Niño, de la ONU.{' '}
              </Text>
            </Stack>

            <Stack
              flex={1}
              padding='1'
              width='100%'
              justifyContent='center'
              alignItems='center'
            >
              <Image src={LogoNinezMigrante} maxWidth='200px' />
            </Stack>
          </Stack>
          <Divider />
          <Stack paddingTop='20px'>
            <Stack>
              <Text p='5px 20px 0px 20px' fontFamily='Montserrat Medium'>
                El Monitoreo de niñez y adolescencia migrante registra y visibiliza los datos de niñez y
                adolescencia migrante hondureña y guatemalteca, como referencia
                para la toma de decisiones políticas, acciones de fiscalización,
                observancia, auditoría social y motivación para generar
                investigaciones sociales y académicas.
              </Text>
            </Stack>
            <Stack padding='5px 20px 20px 20px' direction='row'>
              <a
                href='http://pami-guatemala.org/proyectobinacionalmigracion/'
                target='_blank'
              >
                <Code
                  fontFamily='Times'
                  children='Proyecto “Fortalecimiento de los Sistemas de Protección y Garantía de Derechos de la Niñez y Adolescencia Migrante en Guatemala y Honduras"'
                />
              </a>
            </Stack>
          </Stack>
          <Stack paddingTop='20px'>
            <Stack>
              <Text p='5px 20px 0px 20px' fontFamily='Montserrat Medium'>
                La pobreza extrema, violencia, exclusión social, corrupción,
                discriminación, impunidad, violencia ausencia de servicios
                básicos, entre otros, son problemas estructurales que siguen
                siendo los motivos por los cuales las niñas, niños y
                adolescentes de los países del norte centroamericano migran a
                los Estados Unidos. Este escenario demuestra que, más allá de
                una decisión, constituye una expulsión o una huida, pues no
                existen condiciones dignas ni elementales de subsistencia en sus
                países de origen.
              </Text>
            </Stack>
          </Stack>
          <Stack paddingTop='20px'>
            <Stack>
              <Text p='5px 20px 0px 20px' fontFamily='Montserrat Medium'>
                Esta situación permite situar un escenario en el que la gestión
                pública del Estado debe considerar la migración como un fenómeno
                desde varias perspectivas integradas, con enfoque de derechos, y
                no limitarse únicamente a los retornos. En esa ruta migratoria,
                la niñez y adolescencia migrante es víctima de distintos tipos
                de violencias (abuso sexual, violencia, trata, extorsión,
                desapariciones y asesinatos), sin que las autoridades asuman su
                rol de garantes y se niegan a impulsar acciones que garanticen
                una protección integral.
              </Text>
            </Stack>
          </Stack>
          <Stack paddingTop='20px'>
            <Stack>
              <Text p='5px 20px 0px 20px' fontFamily='Montserrat Medium'>
                En ese sentido, los esfuerzos de este proyecto se orientan a
                impulsar el enfoque de Derechos Humanos para el abordaje de
                niñas, niños y adolescentes migrantes; esto implica que la
                atención sea diferenciada, que se contemple la protección
                integral y se garantice su interés superior.
              </Text>
            </Stack>
          </Stack>
        </SlideFade>
      </Stack>
    </Box>
  );
};

export default Slider;
