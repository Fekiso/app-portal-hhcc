import { useState } from "react";

type UseUrlAxio = {
  getUrlAxio: () => void;
};

const useUrlAxio = (): UseUrlAxio => {
  const getUrlAxio = (): string => {
    return localStorage.getItem("urlAxio") || "";
  };

  return { getUrlAxio };
};

export default useUrlAxio;
