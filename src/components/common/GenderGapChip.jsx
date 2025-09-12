import React from 'react';
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  VisuallyHidden,
} from '@chakra-ui/react';
import { WarningTwoIcon, InfoOutlineIcon } from '@chakra-ui/icons';

// Si ya tienes formatInt úsalo, si no, fallback simple:
const nf = new Intl.NumberFormat('es-GT');
const formatInt = (n) => nf.format(Number(n) || 0);

export default function GenderGapChip({
  total = 0,
  male = 0,
  female = 0,
  canDisaggregate = true, // GT: true, HN/SV: false (no suelen reportar M/F)
  size = 'sm',
}) {
  const m = Number(male) || 0;
  const f = Number(female) || 0;
  const t = Number(total) || 0;
  const sum = m + f;
  const gap = Math.max(0, t - sum);

  // nada que mostrar
  if (t <= 0) return null;

  // País no desagrega y ambos son 0 => chip informativo, NO advertencia
  if (!canDisaggregate && sum === 0) {
    return (
      <Tooltip
        hasArrow
        label='Este país reporta totales por departamento, sin desagregación por género.'
        openDelay={250}
      >
        <Tag size={size} colorScheme='gray' variant='subtle'>
          <TagLeftIcon as={InfoOutlineIcon} />
          <TagLabel>Sin desagregación por género</TagLabel>
          <VisuallyHidden> (total {formatInt(t)})</VisuallyHidden>
        </Tag>
      </Tooltip>
    );
  }

  // Hay brecha real (faltantes)
  if (gap > 0) {
    const label = `${formatInt(gap)} sin desagregar`;
    return (
      <Tooltip
        hasArrow
        label='Diferencia entre el total y la suma F+M. Registros sin desagregar por género.'
        openDelay={250}
      >
        <Tag size={size} colorScheme='orange' variant='subtle'>
          <TagLeftIcon as={WarningTwoIcon} />
          <TagLabel>{label}</TagLabel>
        </Tag>
      </Tooltip>
    );
  }

  // Todo cuadra (opcional: no mostrar nada)
  return null;
}
