import React from "react";
import { Box, Text, Spinner, Stack } from "@chakra-ui/react";

const LoadSplash = ({ title, description, open, setBlur }) => {
  return (
    <Box
      data-html2canvas-ignore="true"
      style={{
        top: -10,
        left: 0,
        zIndex: 1000,
        width: "100vw",
        height: "101vh",
        display: "flex",
        position: "fixed",
        alignItems: "center",
        opacity: setBlur ? 1 : 0,
        justifyContent: "center",
        backdropFilter: "blur(30px)",
        pointerEvents: setBlur ? "all" : "none",
      }}
    >
      <Stack
        p={10}
        maxW={400}
        bgColor="#fff"
        borderRadius={12}
        direction="column"
        alignItems="center"
        style={{
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <Box mb={5}>
          <Text fontSize="1.5em" fontFamily="Oswald">
            {title}
          </Text>
          <Text fontSize="1em" fontFamily="Montserrat" lineHeight={1.2}>
            {description}
          </Text>
        </Box>
        <Spinner size="lg" />
      </Stack>
    </Box>
  );
};

export default LoadSplash;
