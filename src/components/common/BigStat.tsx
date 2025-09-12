import { Tooltip, Stat, StatNumber, StatHelpText } from '@chakra-ui/react';
import React from 'react';
import { formatStat, BigStatMode } from '../../utils/numbers';

type Props = {
  value: number | string;
  compactFrom?: number;
  mode?: BigStatMode;
  showExactHelper?: boolean;
  withTooltip?: boolean; // 👈 nuevo: permitir quitar tooltip
  numberProps?: React.ComponentProps<typeof StatNumber>; // 👈 estilos del número
  statProps?: React.ComponentProps<typeof Stat>; // 👈 estilos del contenedor
  helpTextProps?: React.ComponentProps<typeof StatHelpText>;
};

export default function BigStat({
  value,
  compactFrom = 10_000,
  mode = 'long',
  showExactHelper = true,
  withTooltip = true,
  numberProps,
  statProps,
  helpTextProps,
}: Props) {
  const fmt = formatStat(Number(value) || 0, { compactFrom, mode });

  const content = (
    <Stat textAlign='right' {...statProps}>
      <StatNumber
        fontFamily='Oswald'
        fontSize={{ base: '7xl', md: '8xl' }} // default
        lineHeight='1'
        sx={{ fontVariantNumeric: 'tabular-nums' }}
        {...numberProps} // override desde props
      >
        {fmt.display}
      </StatNumber>

      {showExactHelper && fmt.isCompact && (
        <StatHelpText
          fontFamily='Oswald'
          fontSize={{ base: 'large', md: 'large' }}
          lineHeight='1'
          paddingTop={'5px'}
          {...helpTextProps}
        >
          Exacto: {fmt.long}
        </StatHelpText>
      )}
    </Stat>
  );

  return withTooltip ? (
    <Tooltip hasArrow label={`${fmt.long} (exacto)`} openDelay={300}>
      {content}
    </Tooltip>
  ) : (
    content
  );
}
