import { useEffect, useState } from "react";
import { Usuario } from "../interfaces";

type UseUsuario = {
  guardarSesionUsuario: (usuario: Usuario) => void;
  recuperarSesion: () => Usuario;
};

const useUsuario = (): UseUsuario => {
  const guardarSesionUsuario = (usuarioLogueado: Usuario) => {
    sessionStorage.setItem("hcUL", JSON.stringify(usuarioLogueado));
  };

  const recuperarSesion = () => {
    //@ts-ignore
    return (
      JSON.parse(
        //@ts-ignore
        sessionStorage.getItem("hcUL")
      ) || {
        usuario: "",
        password: "",
        token: "",
        codigo: 0,
        especialidadNom: "",
        nombreCompleto: "",
        nombreUsuario: "",
        prestadorCod: 0,
        prestadorNom: "",
        prestadores: [],
        rol: "",
      }
    );
  };

  return { recuperarSesion, guardarSesionUsuario };
};

export default useUsuario;
