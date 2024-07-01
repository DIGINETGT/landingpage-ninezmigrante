import React, { useRef } from "react";

// POLYGONS
import Quetzaltenango from "../polygons/gt/quetzaltenango";
import Huehuetenango from "../polygons/gt/huehuetenango";
import Chimaltenango from "../polygons/gt/chimaltenango";
import Suchitepequez from "../polygons/gt/suchitepequez";
import Sacatepequez from "../polygons/gt/sacatepequez";
import AltaVerapaz from "../polygons/gt/altaVerapaz";
import BajaVerapaz from "../polygons/gt/bajaVerapaz";
import Totonicapan from "../polygons/gt/totonicapan";
import Retalhuleu from "../polygons/gt/retalhuleu";
import Chiquimula from "../polygons/gt/chiquimula";
import Guatemala from "../polygons/gt/guatemala";
import SantaRosa from "../polygons/gt/santaRosa";
import Escuintla from "../polygons/gt/escuintla";
import SanMarcos from "../polygons/gt/sanMarcos";
import Progreso from "../polygons/gt/progreso";
import Jutiapa from "../polygons/gt/jutiapa";
import Zacapa from "../polygons/gt/zacapa";
import Jalapa from "../polygons/gt/jalapa";
import Quiche from "../polygons/gt/quiche";
import Solola from "../polygons/gt/solola";
import Izabal from "../polygons/gt/izabal";
import Peten from "../polygons/gt/peten";

import useSVGResize from "../../hooks";

const ModalContentGT = ({ id, customColor = "", disableHeat = false }) => {
  const svgRef = useRef(null);
  useSVGResize(svgRef);

  return (
    <svg
      x="0px"
      y="0px"
      version="1.2"
      width="100%"
      ref={svgRef}
      height="100%"
      xmlSpace="preserve"
      viewBox="0 0 585.94 612"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      {id === "quetzaltenango" && (
        <Quetzaltenango customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "huehuetenango" && (
        <Huehuetenango customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "chimaltenango" && (
        <Chimaltenango customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "suchitepequez" && (
        <Suchitepequez customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "sacatepequez" && (
        <Sacatepequez customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "alta_verapaz" && (
        <AltaVerapaz customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "baja_verapaz" && (
        <BajaVerapaz customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "totonicapan" && (
        <Totonicapan customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "retalhuleu" && (
        <Retalhuleu customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "chiquimula" && (
        <Chiquimula customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "guatemala" && (
        <Guatemala customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "santa_rosa" && (
        <SantaRosa customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "escuintla" && (
        <Escuintla customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "san_marcos" && (
        <SanMarcos customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "el_progreso" && (
        <Progreso customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "jutiapa" && (
        <Jutiapa customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "zacapa" && (
        <Zacapa customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "jalapa" && (
        <Jalapa customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "quiche" && (
        <Quiche customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "solola" && (
        <Solola customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "izabal" && (
        <Izabal customColor={customColor} disableHeat={disableHeat} />
      )}
      {id === "peten" && (
        <Peten customColor={customColor} disableHeat={disableHeat} />
      )}
    </svg>
  );
};

export default ModalContentGT;
