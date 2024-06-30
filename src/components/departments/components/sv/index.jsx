import React, { useRef } from "react";

// POLYGONS
import Ahuachapan from "../polygons/sv/ahuachapan";
import Cabanas from "../polygons/sv/cabanas";
import Chalatenango from "../polygons/sv/chalatenango";
import Cuscatlan from "../polygons/sv/cuscatlan";
import LaLibertad from "../polygons/sv/lalibertad";
import LaPaz from "../polygons/sv/lapaz";
import LaUnion from "../polygons/sv/launion";
import Morazan from "../polygons/sv/morazan";
import SanMiguel from "../polygons/sv/sanmiguel";
import SanSalvador from "../polygons/sv/sansalvador";
import SantaAna from "../polygons/sv/santaana";
import SanVicente from "../polygons/sv/sanvicente";
import Sonsonate from "../polygons/sv/sonsonate";
import Usulutan from "../polygons/sv/usulutan";

import useSVGResize from "../../hooks";

const ModalContentSV = ({ id, customColor = "", disableHeat = false }) => {
  const svgRef = useRef(null);
  useSVGResize(svgRef);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      id="departmentSVG"
      xmlns="http://www.w3.org/2000/svg"
    >
      {id === "ahuachapan" && (
        <Ahuachapan customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "cabanas" && (
        <Cabanas customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "chalatenango" && (
        <Chalatenango customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "cuscatlan" && (
        <Cuscatlan customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "la_libertad" && (
        <LaLibertad customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "la_paz" && (
        <LaPaz customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "la_union" && (
        <LaUnion customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "morazan" && (
        <Morazan customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "san_miguel" && (
        <SanMiguel customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "san_salvador" && (
        <SanSalvador customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "santa_ana" && (
        <SantaAna customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "san_vicente" && (
        <SanVicente customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "sonsonate" && (
        <Sonsonate customColor={customColor} disableHeat={disableHeat} />
      )}

      {id === "usulutan" && (
        <Usulutan customColor={customColor} disableHeat={disableHeat} />
      )}
    </svg>
  );
};

export default ModalContentSV;
