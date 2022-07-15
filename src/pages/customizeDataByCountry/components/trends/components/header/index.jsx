// REACT
import React from "react";

// CHAKRA UI COMONENTS
import { Box, Stack, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box width="100%" padding="40px">
      {/* CONTAINER */}
      <Stack
        margin="auto"
        maxWidth="800px"
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        {/* NUMBER */}
        <Stack>
          <Text fontFamily="Oswald" fontSize="8em" lineHeight="1">
            1
          </Text>
        </Stack>

        {/* TITLE AND INSTRUCTIONS */}
        <Stack spacing="0px">
          <Text fontFamily="Oswald" fontSize="4xl">
            TENDENCIAS
          </Text>
          <Text fontFamily="Arial" fontSize="sm">
            <span style={{ fontWeight: "bold" }}>Instrucciones: </span> Para
            realizar una comparación personalizada, elija el período de
            comparación y luego arrastre al lienzo la variable que desea
            comparar (género, rango etario, condición de viaje, vía de retorno o
            país de retorno). Por útlimo, elija el tipo de gráfico a desplegar.
            Luego de mostrar su gráfica de tendencia personalizada, puede
            guardar la imagen en su dispositivo haciendo clic en el botón
            “descargar imagen”.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
