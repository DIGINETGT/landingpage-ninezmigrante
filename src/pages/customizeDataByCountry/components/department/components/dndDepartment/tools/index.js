// TOOLS
import depName from '../../../../../../country/components/statistics/components/heatMap/components/modal/utils';
import { reorder } from '../../../../../../../utils/tools';
import { colors } from '../../../../../../../utils/theme';
import countryDeps, { depColors } from '../utils';
import { year } from '../../../../../../../utils/year';

export const getItemStyle = (isDragging, draggableStyle, isMobile = false) => ({
  userSelect: 'none',
  minWidth: isMobile ? '43%' : 55,
  height: isMobile ? '43%' : 55,
  margin: `0 8px 0 0`,
  borderRadius: '5px',
  transition: 'background 0.2s ease-in-out',
  background: 'transparent',
  ...draggableStyle,
});

export const getListStyle = () => ({
  display: 'flex',
  padding: 8,
});

export const getDataItemStyle = (isDragging) => ({
  height: 305,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: isDragging ? '5px' : '0',
  transition: 'background 0.2s ease-in-out',
  background: isDragging ? 'rgba(0,0,0,0.1)' : 'transparent',
});

/**
 * Obtiene datos de una API, luego actualiza el estado de la aplicación
 */
export const updateSection = ({
  id,
  dep,
  setDepDataList,
  setDepList,
  depData,
  depDataCapital,
}) => {
  const depGenderTotalsData = { ...depData }?.depSubDepGenderTotals?.[dep];
  const depGenderTotals = {
    male: depGenderTotalsData?.masculino ?? 0,
    female: depGenderTotalsData?.femenino ?? 0,
  };

  const totalNumber = depDataCapital?.depTotals?.[dep];
  const total = Number.isNaN(totalNumber) ? 0 : totalNumber;

  setDepDataList((prev) => {
    const tmp = [...prev];
    tmp[id] = {
      ...depGenderTotals,
      name: depName?.[dep],
      id: dep,
      total,
      reload: false,
    };

    // COLORES
    setDepList((prevDeps) => {
      const tmpDeps = [...prevDeps].map((depPath) => ({
        ...depPath,
        color: colors?.heatMin?.[100],
      }));

      tmp.forEach((data, index) => {
        if (data.name?.length) {
          const depIndex = tmpDeps.findIndex(
            (depInfo) => depInfo.id === data.id
          );

          if (tmpDeps[depIndex]) tmpDeps[depIndex].color = depColors[index];
        }
      });

      return tmpDeps;
    });

    return tmp;
  });
};

/**
 * Si el destino es el mismo que el origen, reordene la lista; de lo contrario, actualice la sección.
 * @returns el resultado de la llamada de función a updateSection.
 */
// export const onDragEnd = ({
//   result,
//   countryID,
//   period,
//   setDepList,
//   depDataCapital,
//   depData,
//   setDepDataList,
// }) => {
//   if (!result.destination) return;

//   if (result.destination.droppableId === "droppableDeps") {
//     setDepList((depList) =>
//       reorder(depList, result.source.index, result.destination.index)
//     );
//   } else {
//     // DATA
//     const id = +result.destination.droppableId.substring(13) - 1;
//     const dep = result.draggableId;

//     // LOADING
//     setDepDataList((prevData) => {
//       const tmp = [...prevData];
//       tmp[id] = { reload: true };
//       return tmp;
//     });

//     // ACTUALIZAR
//     updateSection({
//       id,
//       dep,
//       countryID,
//       period,
//       setDepDataList,
//       setDepList,
//       depData,
//       depDataCapital,
//     });
//   }
// };

// 🔁 NUEVO onDragEnd: arma la tarjeta con los mapas que ya tienes
export function onDragEnd({
  result,
  setDepDataList,
  depDataCapital, // { depTotals: { quetzaltenango: 37, ... } }
  depData, // { depSubDepGenderTotals: { quetzaltenango: { masculino: 22, femenino: 15 }, ... } }
}) {
  const { destination, draggableId } = result;
  if (!destination) return;

  // A qué “slot” cayó
  const slot =
    destination.droppableId === 'droppableData1'
      ? 0
      : destination.droppableId === 'droppableData2'
      ? 1
      : destination.droppableId === 'droppableData3'
      ? 2
      : -1;

  if (slot < 0) return;

  // Id del depto es el draggableId (p.e. "quetzaltenango")
  const id = String(draggableId);
  const name = depName?.[id] || id;

  const totalsMap = depDataCapital?.depTotals || {};
  const gendersMap = depData?.depSubDepGenderTotals || {};

  const male = Number(gendersMap?.[id]?.masculino || 0);
  const female = Number(gendersMap?.[id]?.femenino || 0);

  // Si no encontramos department_contributions, usa M+F como fallback
  const total = Number.isFinite(totalsMap?.[id])
    ? Number(totalsMap[id])
    : male + female || null;

  // DEBUG opcional
  // console.log("build card:", { id, name, total, male, female });

  setDepDataList((prev) => {
    const next = [...prev];
    next[slot] = {
      reload: false,
      id,
      name,
      total,
      male,
      female,
    };
    return next;
  });
}
