import React from "react";
import moment from "moment-timezone";
import { Stack, Text } from "@chakra-ui/react";

const formatUpdateDate = (value) => {
  if (!value) return "";

  const parsed = moment(value);
  if (parsed.isValid()) {
    return parsed.tz("America/Guatemala").format("DD-MM-YYYY");
  }

  return String(value).split("T")[0];
};

const LastDate = ({ updateDate, isScreenShotTime, sources = <></> }) => {
  return (
    <Stack
      direction="column"
      margin="auto"
      maxWidth="800px"
      mt={10}
      mb={10}
      style={{
        padding: isScreenShotTime ? "0px 0 20px 0" : "5px",
        borderBottom: "2px solid #222",
        borderTop: "2px solid #222",
      }}
    >
      {sources}
      <Text
        fontFamily="Oswald"
        fontSize="1.4em"
        textAlign="center"
      >{`Fecha de última actualización: ${formatUpdateDate(updateDate)}`}</Text>
    </Stack>
  );
};

export default LastDate;
