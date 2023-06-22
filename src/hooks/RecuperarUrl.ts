import { useState } from "react";

type UseRecuperarUrl = {
  getUrlPagina: () => void;
};

const UseRecuperarUrl = (): UseRecuperarUrl => {
    const getUrlPagina = (): string => {
      return sessionStorage.getItem("name") || "";
    };
  
    return { getUrlPagina };
  };
  
  export default UseRecuperarUrl;
  