import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Stack, Text, Image } from "@chakra-ui/react";

// ASSETS
import Male from "../../../../../../../../../../assets/male.png";
import Femenine from "../../../../../../../../../../assets/femenine.png";

const ModalContent = ({ total, dataRes }) => {
  const genders = {
    male: dataRes?.masculino,
    female: dataRes?.femenino,
  };

  return (
    <Stack
      width="100%"
      spacing="16px"
      direction="column"
      justifyContent="center"
    >
      <Stack alignItems="center" justifyContent="space-between" direction="row">
        <Text fontFamily="Oswald" fontSize="2xl">
          Total
        </Text>
        <Text fontFamily="Oswald" fontSize="5xl">
          {total ?? 0}
        </Text>
      </Stack>

      {(genders.female ?? 0 + genders.male ?? 0) > 0 && (
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
        >
          <Text fontFamily="Oswald" fontSize="2xl">
            Sexo
          </Text>

          <Stack direction="column" spacing="0px">
            {genders.female > 0 && (
              <Stack
                gap="8px"
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Image src={Femenine} height="32px" />
                <Text fontFamily="Oswald" fontSize="3xl" color="green.700">
                  {genders.female}
                </Text>
              </Stack>
            )}

            {genders.male > 0 && (
              <Stack
                gap="8px"
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Image src={Male} height="32px" />
                <Text color="yellow.700" fontFamily="Oswald" fontSize="3xl">
                  {genders.male}
                </Text>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ModalContent;
