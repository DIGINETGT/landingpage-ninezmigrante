import React from 'react';
import { Tag, Tooltip, HStack, Icon } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const formatMonthES = (iso) =>
  new Date(iso).toLocaleDateString('es-GT', { year: 'numeric', month: 'long' });

export default function UnknownChip({ unknown = 0, byMonth = [] }) {
  if (!unknown) return null;

  const months = byMonth.filter((m) => (m?.unknown || 0) > 0);
  const label = months.length
    ? months
        .map((m) => `${formatMonthES(m.reportMonth)}: ${m.unknown}`)
        .join(' • ')
    : 'Sin detalle por mes';

  return (
    <Tooltip hasArrow label={label} openDelay={200}>
      <HStack>
        <Tag colorScheme='orange' borderRadius='full' px={3} py={1}>
          Sin clasificar: {unknown}
          <Icon as={InfoOutlineIcon} ml='6px' />
        </Tag>
      </HStack>
    </Tooltip>
  );
}
