const getCountryContent = ({ countryID, content, capitalize }) => {
  if (capitalize) {
    if (countryID === "elsalvador") return "El Salvador";
    return countryID.substring(0, 1).toUpperCase() + countryID.substring(1);
  }

  const newContent = content[countryID];

  if (!newContent) {
    return content?.["guatemala"];
  }

  return newContent;
};

export const getDepartmentData = (databorders) => {
  const depTotals = {};
  const depSubDepTotals = {};
  const depSubDepGenderTotals = {};

  databorders?.forEach((report) => {
    report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.country_contributions?.data?.forEach(
      (contribution) => {
        contribution.attributes?.returned?.data?.attributes?.municipality_contributions?.data?.forEach(
          (muni) => {
            const subDepName =
              muni.attributes?.municipality?.data?.attributes?.name;

            const depName =
              muni.attributes?.municipality?.data?.attributes?.department?.data?.attributes?.name
                ?.toLowerCase()
                .replaceAll(" ", "")
                .replaceAll("department", "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

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

            depTotals[depName] = depTotals[depName]
              ? depTotals[depName] + muniCant
              : muniCant;
          }
        );
      }
    );
  });

  return {
    depTotals,
    depSubDepTotals,
    depSubDepGenderTotals,
  };
};

export default getCountryContent;
