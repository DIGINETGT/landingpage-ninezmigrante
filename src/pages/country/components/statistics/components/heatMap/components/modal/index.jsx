// REACT
import React, { useState, useRef } from "react";

// CHAKRA UI COMPONENTS
import {
  Text,
  Modal,
  Stack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

//UTILS
import depName from "./utils";

// COMPONENTS
import ModalMapContent from "./components/modalMapContent";
import ModelContent from "./components/modalContent";
import DownloadTable from "../../../../components/downloadTable";
import GraphFooter from "../../../../../../../../components/graphFooter";
import StatisticsContext from "../../../../context";

const MapModal = ({
  modalDep,
  onCloseModal,
  year,
  period,
  periodId,
  country,
  depTotals,
  genderDepTotals,
}) => {
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);

  const onCloseChange = () => {
    onCloseModal();
  };

  const satisticsRef = useRef(null);

  return (
    <StatisticsContext.Provider
      value={{ isScreenShotTime, setIsScreenShotTime }}
    >
      <Modal
        size="2xl"
        isCentered
        isOpen={modalDep.length !== 0}
        onClose={onCloseChange}
      >
        <ModalOverlay backdropFilter="blur(4px)" bgColor="rgba(0, 0, 0, 0.5)" />
        <ModalContent
          maxHeight="calc(100vh - 50px)"
          overflowY="auto"
          margin="24px"
          ref={satisticsRef}
          padding="24px 12px 32px 12px"
          bgColor="rgba(255, 255, 255, 0.9)"
        >
          <ModalHeader fontFamily="Oswald" fontWeight="500" fontSize="4xl">
            {depName[modalDep]}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              width="100%"
              spacing={"32px"}
              alignItems="center"
              justifyContent="space-between"
              marginBottom="40px"
              direction={{ base: "column", md: "row" }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                width={{ base: "100%", md: "50%" }}
              >
                <ModalMapContent modalDep={modalDep} country={country} />
              </Stack>
              <Stack
                spacing="24px"
                alignItems="center"
                justifyContent="center"
                width={{ base: "100%", md: "50%" }}
              >
                <ModelContent
                  year={year}
                  period={period}
                  country={country}
                  dataRes={genderDepTotals}
                  dep={depName[modalDep]}
                />
                <Stack
                  width="100%"
                  direction="column"
                  alignItems="center"
                  justifyContent="space-between"
                  maxHeight={{ base: "100px", md: "100%" }}
                  padding={{ base: "0px 16px 0px 0px", md: "0px" }}
                >
                  {depTotals &&
                    Object.keys(depTotals).length > 0 &&
                    Object.keys(depTotals)
                      .sort((a, b) => a.localeCompare(b))
                      .map((dep) => (
                        <Stack
                          key={dep}
                          width="100%"
                          height="100%"
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Text fontFamily="Montserrat Medium">{dep}:</Text>
                          <Text fontFamily="Montserrat Medium">
                            {depTotals[dep]}
                          </Text>
                        </Stack>
                      ))}
                </Stack>
              </Stack>
            </Stack>

            {isScreenShotTime && <GraphFooter responsive />}

            <DownloadTable satisticsRef={satisticsRef} periodId={periodId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </StatisticsContext.Provider>
  );
};

export default MapModal;
