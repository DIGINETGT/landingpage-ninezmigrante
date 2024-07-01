import React from "react";

// POLYGONS
import Atlantida from "../../../../../polygons/hn/atlantida";
import Choluteca from "../../../../../polygons/hn/choluteca";
import Colon from "../../../../../polygons/hn/colon";
import Comayagua from "../../../../../polygons/hn/comayagua";
import Copan from "../../../../../polygons/hn/copan";
import Cortes from "../../../../../polygons/hn/cortes";
import ElParaiso from "../../../../../polygons/hn/elparaiso";
import Francis from "../../../../../polygons/hn/francis";
import Gracias from "../../../../../polygons/hn/gracias";
import Intibuca from "../../../../../polygons/hn/intibuca";
import IslasBahia from "../../../../../polygons/hn/islasbahia";
import LaPaz from "../../../../../polygons/hn/lapaz";
import Lempira from "../../../../../polygons/hn/lempira";
import Ocotepeque from "../../../../../polygons/hn/ocotepeque";
import Olancho from "../../../../../polygons/hn/olancho";
import SantaBarbara from "../../../../../polygons/hn/santabarbara";
import Valle from "../../../../../polygons/hn/valle";
import Yoro from "../../../../../polygons/hn/yoro";

const ModalContentHN = ({ modalDep }) => {
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
      {modalDep === "atlantida" && <Atlantida />}
      {modalDep === "choluteca" && <Choluteca />}
      {modalDep === "colon" && <Colon />}
      {modalDep === "comayagua" && <Comayagua />}
      {modalDep === "copan" && <Copan />}
      {modalDep === "cortes" && <Cortes />}
      {modalDep === "el_paraiso" && <ElParaiso />}
      {modalDep === "francis" && <Francis />}
      {modalDep === "gracias" && <Gracias />}
      {modalDep === "intibuca" && <Intibuca />}
      {modalDep === "islas_bahia" && <IslasBahia />}
      {modalDep === "la_paz" && <LaPaz />}
      {modalDep === "lempira" && <Lempira />}
      {modalDep === "ocotepeque" && <Ocotepeque />}
      {modalDep === "olancho" && <Olancho />}
      {modalDep === "santa_barbara" && <SantaBarbara />}
      {modalDep === "valle" && <Valle />}
      {modalDep === "yoro" && <Yoro />}
    </svg>
  );
};

export default ModalContentHN;
