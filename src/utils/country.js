const countryByCode = {
  gt: 'guatemala',
  sv: 'elsalvador',
  hn: 'honduras',
};
const getCountryContent = ({ countryID: id, content, capitalize }) => {
  let countryID = countryByCode[id?.toLowerCase() ?? 'gt'] ?? 'guatemala';

  if (capitalize) {
    if (countryID === 'elsalvador') return 'El Salvador';
    return countryID.substring(0, 1).toUpperCase() + countryID.substring(1);
  }

  const newContent = content[countryID];

  if (!newContent) {
    return content?.['guatemala'];
  }

  return newContent;
};

export const getDepartmentData = (databorders) => {
  const depSubDepTotals = {};
  const depSubDepGenderTotals = {};

  databorders?.forEach((report) => {
    report.attributes?.returned?.data?.attributes?.municipality_contributions?.data?.forEach(
      (muni) => {
        const subDepName =
          muni.attributes?.municipality?.data?.attributes?.name;

        const depName =
          muni.attributes?.municipality?.data?.attributes?.department?.data?.attributes?.name
            ?.toLowerCase()
            .replaceAll(' ', '')
            .replaceAll('department', '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const muniCant = muni.attributes?.cant || 0;
        const gender =
          muni.attributes?.gender?.data?.attributes?.name?.toLowerCase();

        depSubDepTotals[depName] = {
          ...depSubDepTotals[depName],
          [subDepName]: depSubDepTotals?.[depName]?.[subDepName]
            ? depSubDepTotals[depName][subDepName] + muniCant
            : muniCant,
        };

        depSubDepGenderTotals[depName] = {
          ...depSubDepGenderTotals[depName],
          [gender]: depSubDepGenderTotals?.[depName]?.[gender]
            ? depSubDepGenderTotals[depName][gender] + muniCant
            : muniCant,
        };
      }
    );
  });

  return {
    depSubDepTotals,
    depSubDepGenderTotals,
  };
};

export const getDepartmentDataCapital = (databorders) => {
  const depTotals = {};

  databorders?.forEach((report) => {
    report.attributes?.returned?.data?.attributes?.department_contributions?.data?.forEach(
      (muni) => {
        const depName = muni.attributes?.department?.data?.attributes?.name
          ?.toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll('department', '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        const muniCant = muni.attributes?.cant || 0;

        depTotals[depName] = depTotals[depName]
          ? depTotals[depName] + muniCant
          : muniCant;
      }
    );
  });

  return {
    depTotals,
  };
};

export default getCountryContent;
