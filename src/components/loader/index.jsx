import { Spinner, Stack } from "@chakra-ui/react";
import React from "react";

const Loader = ({ loading, ...props }) => {
  return (
    <Stack
      width="100%"
      position="absolute"
      height="100%"
      top={0}
      background="rgba(255, 255, 255, 0.05)"
      display="flex"
      backdropFilter="blur(5px)"
      alignItems="center"
      justifyContent="center"
      opacity={loading ? 1 : 0}
      transition='opacity 1s ease'
      pointerEvents={loading ? "all" : "none"}
      {...props}
    >
      <Spinner thickness="8px" size="xl" color="blue.300" />
    </Stack>
  );
};

export default Loader;
