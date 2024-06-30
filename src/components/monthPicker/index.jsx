import React, { useState } from "react";
import {
  Grid,
  GridItem,
  Select,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";

import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";

const months = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const MonthPicker = ({ onAccept, minWidth }) => {
  // RANGE 0 - 11 (0  undefined)
  const [ranges, setRanges] = useState([0, 0]);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const { onOpen, onClose: onCloseDisclosure, isOpen } = useDisclosure();

  const handleClick = (index) => () => {
    if (isFirstClick) {
      setRanges([0, index]);
      setIsFirstClick(false);
      return;
    } else {
      if (index === ranges[1] || index === ranges[0]) {
        setRanges([index, index]);
        return;
      }

      if (index > ranges[1]) {
        setRanges([ranges[1], index]);
        return;
      }

      if (index > ranges[0]) {
        setRanges([ranges[0], index]);
        return;
      } else if (index < ranges[0]) {
        setRanges([index, ranges[1]]);
        return;
      }
    }
  };

  const closeAndSend = () => {
    onCloseDisclosure();
    onAccept(ranges.map((range) => range + 1));
  };

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={closeAndSend}>
      <PopoverTrigger>
        <HStack
          rounded="md"
          paddingLeft="4"
          paddingRight="3"
          justifyContent="space-between"
          bgColor="rgba(255,255,255,0.5)"
          minWidth={minWidth ?? { base: "100%", md: "40%" }}
        >
          <Text
            fontSize="2xl"
            lineHeight="1.8"
            fontWeight="600"
            vtextAlign="left"
            fontFamily="Times"
            pointerEvents="none"
            letterSpacing="1.2px"
          >
            {isFirstClick
              ? "Elegir mes"
              : `${months[ranges[0]]} - ${months[ranges[1]]}`}
          </Text>

          <ChevronDownIcon fontSize="lg" />
        </HStack>
      </PopoverTrigger>
      <PopoverContent
        direction="column"
        borderRadius="8px"
        bgColor="gray.100"
        boxShadow="rgba(0, 0, 0, 0.25) 0px 7px 21px"
      >
        <Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(4, 1fr)">
          {months.map((month, index) => {
            const rangeColor =
              index > ranges[0] && index < ranges[1] ? "gray.300" : "gray.100";
            const bgColor =
              index === ranges[0] || index === ranges[1]
                ? "green.700"
                : rangeColor;

            const textColor =
              index === ranges[0] || index === ranges[1] ? "white" : "black";

            return (
              <GridItem
                p={2}
                key={index}
                colSpan={1}
                rowSpan={1}
                border="1px"
                cursor="pointer"
                bgColor={bgColor}
                color={textColor}
                textAlign="center"
                borderRadius="8px"
                borderColor="gray.200"
                fontFamily="Montserrat"
                onClick={handleClick(index)}
              >
                {month}
              </GridItem>
            );
          })}
        </Grid>
        <Button
          mt={2}
          size="md"
          color="white"
          bgColor="blue.700"
          borderRadius="8px"
          onClick={closeAndSend}
          rightIcon={<SearchIcon />}
          fontFamily="Montserrat Medium"
          _hover={{ bgColor: "blue.700" }}
        >
          Consultar
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default MonthPicker;
