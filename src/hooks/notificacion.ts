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
  ocultarNotificacion: () => void;
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

  const ocultarNotificacion = () => {
    setMostrar(false);
    setMensaje("");
    setColor("");
  };

  return { mostrar, mensaje, color, mostrarNotificacion, ocultarNotificacion };
};

export default useNotificacion;
