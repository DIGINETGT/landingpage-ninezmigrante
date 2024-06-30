import React from 'react';
import { useDisclosure } from '@chakra-ui/react';

import {
  Icon,
  Text,
  Stack,
  Image,
  Drawer,
  IconButton,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';

import { Link } from 'react-router-dom';

import { HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';

import LogoNinezMigrante from '../../../../../../assets/LogoNinezMigrante.png';

const MobileNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        size="lg"
        onClick={onOpen}
        colorScheme="white"
        icon={<HamburgerIcon fontSize="2xl" />}
        display={{ base: 'block', md: 'none' }}
      />

      <Drawer onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay backdropFilter="blur(8px)" />
        <DrawerContent>
          <DrawerHeader bgColor="blue.700">
            <Link to="/" onClick={onClose}>
              <Stack direction="row" alignItems="center">
                <Image src={LogoNinezMigrante} width="64px" />
                <Text
                  color="white"
                  fontSize="1.8rem"
                  fontWeight="500"
                  fontFamily="Oswald"
                >
                  NiñezMigrante.org
                </Text>
              </Stack>
            </Link>
          </DrawerHeader>
          <DrawerBody bgColor="blue.500">
            <Stack spacing="16px" onClick={onClose} padding="24px 0px">
              <Link to="/observatory">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Monitoreo
                  </Text>
                </Stack>
              </Link>

              <Link to="/country/gt">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Guatemala
                  </Text>
                </Stack>
              </Link>

              <Link to="/country/hn">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Honduras
                  </Text>
                </Stack>
              </Link>

              <Link to="/country/hn">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    El Salvador
                  </Text>
                </Stack>
              </Link>

              <Link to="/customize">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Personalizar
                  </Text>
                </Stack>
              </Link>

              <Link to="/compare">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Comparar
                  </Text>
                </Stack>
              </Link>

              <Link to="/borders">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Detenidos en fronteras
                  </Text>
                </Stack>
              </Link>

              <Link to="/organizations">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Organizaciones
                  </Text>
                </Stack>
              </Link>

              <Link to="/documentation">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Documentación
                  </Text>
                </Stack>
              </Link>

              <Link to="/contact">
                <Stack direction="row" alignItems="center">
                  <Icon as={ChevronRightIcon} color="gray.600" />
                  <Text fontFamily="Montserrat Medium" color="gray.600">
                    Contacto
                  </Text>
                </Stack>
              </Link>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
