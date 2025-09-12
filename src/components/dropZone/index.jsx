import React, { forwardRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';

const DropZone = forwardRef(
  ({ isDragOver, empty, slot, children, placeholder, ...rest }, ref) => {
    return (
      <Box
        ref={ref}
        minH={{ base: '260px', md: '320px' }}
        h='100%'
        w='100%'
        display='flex'
        flexDir='column'
        alignItems='center'
        justifyContent='center'
        bg={isDragOver ? 'blue.50' : 'white'}
        borderWidth='2px'
        borderStyle={empty ? 'dashed' : 'solid'}
        borderColor={isDragOver ? 'blue.400' : 'gray.300'}
        rounded='2xl'
        shadow={isDragOver ? 'md' : 'xs'}
        transition='all .15s ease'
        p={{ base: 4, md: 6 }}
        position='relative'
        {...rest}
      >
        {empty ? (
          <Box textAlign='center' color='gray.500'>
            <ArrowUpIcon boxSize={8} mb={2} />
            <Text fontWeight='semibold'>Zona {slot}</Text>
            <Text fontSize='sm'>Suelta un departamento aquí</Text>
          </Box>
        ) : (
          children
        )}

        {placeholder}
      </Box>
    );
  }
);

export default DropZone;
