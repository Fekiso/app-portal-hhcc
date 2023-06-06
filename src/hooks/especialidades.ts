import axios from "axios";
import { Especialidades, Usuario } from "../interfaces";

export const getEspecialidades = async(usuario: Usuario) => {
  const url = localStorage.getItem("urlAxio");
  const config = {
    headers: { Authorization: `Bearer ${usuario.token}` },
  };

  try {
  let listadoEspecialidades: Especialidades[] = [];
    const response = await axios.get(`${url}Especialidades`, config);
    if (response.data.length !== 0) {
      listadoEspecialidades = response.data;
    } 
    return listadoEspecialidades;
  } catch (e) {
    // mostrarNotificacion(
    //   true,
    //   "Ocurrió un problema al intentar consultar las especialidades registradas",
    //   "rojo"
    // );
  }
  
};
