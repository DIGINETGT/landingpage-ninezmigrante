import React from "react";

// POLYGONS
import Ahuachapan from "../../../../../../../../../../../components/departments/components/polygons/sv/ahuachapan";
import Cabanas from "../../../../../../../../../../../components/departments/components/polygons/sv/cabanas";
import Chalatenango from "../../../../../../../../../../../components/departments/components/polygons/sv/chalatenango";
import Cuscatlan from "../../../../../../../../../../../components/departments/components/polygons/sv/cuscatlan";
import LaLibertad from "../../../../../../../../../../../components/departments/components/polygons/sv/lalibertad";
import LaPaz from "../../../../../../../../../../../components/departments/components/polygons/sv/lapaz";
import LaUnion from "../../../../../../../../../../../components/departments/components/polygons/sv/launion";
import Morazan from "../../../../../../../../../../../components/departments/components/polygons/sv/morazan";
import SanMiguel from "../../../../../../../../../../../components/departments/components/polygons/sv/sanmiguel";
import SanSalvador from "../../../../../../../../../../../components/departments/components/polygons/sv/sansalvador";
import SantaAna from "../../../../../../../../../../../components/departments/components/polygons/sv/santaana";
import SanVicente from "../../../../../../../../../../../components/departments/components/polygons/sv/sanvicente";
import Sonsonate from "../../../../../../../../../../../components/departments/components/polygons/sv/sonsonate";
import Usulutan from "../../../../../../../../../../../components/departments/components/polygons/sv/usulutan";

const ModalContentSV = ({ modalDep }) => {
  return (
    <svg
      xmlnsMapsvg="http://mapsvg.com"
      xmlnsDc="http://purl.org/dc/elements/1.1/"
      xmlnsRdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlnsSvg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      mapsvgGeoViewBox="-89.351340 17.418870 -83.127223 12.984061"
      width="100%"
      height="100%"
      id="modalSVG"
    >
      {modalDep === "ahuachapan" && <Ahuachapan />}
      {modalDep === "cabanas" && <Cabanas />}
      {modalDep === "chalatenango" && <Chalatenango />}
      {modalDep === "cuscatlan" && <Cuscatlan />}
      {modalDep === "la_libertad" && <LaLibertad />}
      {modalDep === "la_paz" && <LaPaz />}
      {modalDep === "la_union" && <LaUnion />}
      {modalDep === "morazan" && <Morazan />}
      {modalDep === "san_miguel" && <SanMiguel />}
      {modalDep === "san_salvador" && <SanSalvador />}
      {modalDep === "santa_ana" && <SantaAna />}
      {modalDep === "san_vicente" && <SanVicente />}
      {modalDep === "sonsonate" && <Sonsonate />}
      {modalDep === "usulutan" && <Usulutan />}
    </svg>
  );
};

export default ModalContentSV;
