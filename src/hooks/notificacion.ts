import { useState } from "react";

type UseNotificacion = {
  mostrar: boolean;
  mensaje: string;
  color: string;
  mostrarNotificacion: (
    mostrarMensaje: boolean,
    mensajeMostrar: string,
    colorMostrar: string
  ) => void;
};

const useNotificacion = (): UseNotificacion => {
  const [mostrar, setMostrar] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const mostrarNotificacion = (
    mostrarMensaje: boolean,
    mensajeMostrar: string,
    colorMostrar: string
  ) => {
    setMostrar(mostrarMensaje);
    setMensaje(mensajeMostrar);
    setColor(colorMostrar);
  };
  return { mostrar, mensaje, color, mostrarNotificacion };
};

export default useNotificacion;
