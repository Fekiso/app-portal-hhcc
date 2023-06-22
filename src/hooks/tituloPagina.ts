import { useState } from "react";

type UseTituloPagina = {
  tituloPagina: string;
  guardarTituloPagina: (clinica: string) => void;
  recuperartituloPagina: () => string;
};

const useTituloPagina = (): UseTituloPagina => {
  const [tituloPagina, setTituloPagina] = useState<string>("");

  const guardarTituloPagina = (nuevoTitulo: string) => {
    sessionStorage.setItem("tituloPagina", nuevoTitulo || "OVUM");
    setTituloPagina(nuevoTitulo || "OVUM");
  };

  const recuperartituloPagina = (): string => {
    setTituloPagina(JSON.parse(sessionStorage.getItem("tituloPagina") || ""));
    return JSON.parse(sessionStorage.getItem("tituloPagina") || "");
  };

  return {
    tituloPagina,
    recuperartituloPagina,
    guardarTituloPagina,
  };
};



export default UseTituloPagina;
