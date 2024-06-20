import React, { useState } from "react";

import { Stack, Text, Button, Image, Divider } from "@chakra-ui/react";

import { DownloadIcon } from "@chakra-ui/icons";

import folder from "../../../../../../assets/folder.png";
import DownloadImage from "../../../../../../components/downloadImage";
import { useContext } from "react";
import StatisticsContext from "../../context";

const DownloadTable = ({ satisticsRef, url }) => {
  const { setIsScreenShotTime } = useContext(StatisticsContext);

  // DOWNLOAD
  const downloadXLS = () =>
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

          <Button
            size="lg"
            bgColor="#ccc"
            onClick={downloadXLS}
            rightIcon={<DownloadIcon />}
            fontFamily="Montserrat Medium"
            _hover={{ bgColor: "green.700", color: "white" }}
          >
            Descargar
          </Button>
        </Stack>

        <DownloadImage
          label="Descargar infografía del período"
          containerRef={satisticsRef}
          onSS={setIsScreenShotTime}
        />
      </Stack>
    </>
  );
};

export default DownloadTable;
