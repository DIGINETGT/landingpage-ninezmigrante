import React, { useState } from "react";

import {
  Stack,
  Text,
  Button,
  Image,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";

import { DownloadIcon } from "@chakra-ui/icons";

import folder from "../../../../../../assets/folder.png";
import DownloadImage from "../../../../../../components/downloadImage";
import { useContext } from "react";
import StatisticsContext from "../../context";

const DownloadTable = ({ satisticsRef, files }) => {
  const { setIsScreenShotTime } = useContext(StatisticsContext);

  let data = files ?? [];

  // DOWNLOAD
  const downloadFile = (url) => () =>
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = `${filesUrl}`;
        a.click();
      });

  return (
    <>
      <Stack
        gap="40px"
        margin="auto"
        maxWidth="750px"
        direction="column"
        alignItems="center"
        justifyContent="center"
        mt={10}
      >
        <Accordion>
          <AccordionItem>
            <AccordionButton>
              <Stack
                data-html2canvas-ignore="true"
                gap="24px"
                alignItems="center"
                justifyContent="center"
                direction={{ base: "column", md: "row" }}
              >
                <Image src={folder} height="50px" />
                <Text fontFamily="Oswald" fontSize="2xl">
                  Descargar tabla XLS del período
                </Text>
              </Stack>
            </AccordionButton>

            <AccordionPanel mt={2} width="100%" bgColor="rgba(0,0,0,.04)" p={5}>
              {(data?.length ?? 0) > 0 ? (
                data?.map((file, fileIndex) => {
                  const isLastElement = fileIndex === (data?.length ?? 1) - 1;

                  return (
                    <Stack
                      data-html2canvas-ignore="true"
                      gap="24px"
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                      borderBottomColor="#ccc"
                      pb={5}
                      borderBottomWidth={isLastElement ? "0px" : "1px"}
                      marginBottom={isLastElement ? "0px" : "24px"}
                      direction={{ base: "column", md: "row" }}
                    >
                      <Text fontFamily="Oswald" fontSize="2xl">
                        {`REPORTE DE ${file?.name}`}
                      </Text>
                      <Button
                        size="lg"
                        as="a"
                        href={file?.url}
                        bgColor="#ccc"
                        target="_blank"
                        rel="noreferrer noopener"
                        rightIcon={<DownloadIcon />}
                        fontFamily="Montserrat Medium"
                        _hover={{ bgColor: "green.700", color: "white" }}
                      >
                        Descargar
                      </Button>
                    </Stack>
                  );
                })
              ) : (
                <Text variant="h6" align="center">
                  Sin fuente de datos.
                </Text>
              )}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <DownloadImage
                label="Descargar infografía del período"
                containerRef={satisticsRef}
                onSS={setIsScreenShotTime}
              />
            </AccordionButton>
          </AccordionItem>
        </Accordion>
      </Stack>
    </>
  );
};

export default DownloadTable;
