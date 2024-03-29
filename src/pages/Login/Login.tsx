import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPopover,
  IonRow,
  IonButton as StyledButton,
} from "@ionic/react";
import axios from "axios";
import {
  eye,
  eyeOff,
  eyeOffOutline,
  eyeOutline,
  help,
  helpOutline,
  person,
  personOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Usuario } from "../../interfaces";
import "./Login.css";
import useUsuario from "../../hooks/usuarios";
import UseUrlAxio from "../../hooks/urlAxio";
import useNotificacion from "../../hooks/notificacion";
import CustomToast from "../../components/CustomToast/CustomToast";

interface ContainerProps {
  setUsuarioLogueado: (prestador: Usuario) => void;
}

const LoginIonic: React.FC<ContainerProps> = ({ setUsuarioLogueado }) => {
  const [cargando, setCargando] = useState(false);
  const [blnVerPassword, setBlnVerPassword] = useState(false);
  const [usuario, setUsuario] = useState({
    usuario: "",
    password: "",
    token: "",
  });
  const [tituloPagina, setTituloPagina] = useState("");
  const [errorUsuario, setErrorUsuario] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [msjErrorPassword, setMsjErrorPassword] = useState("");
  const [registrarPaciente, setRegistrarPaciente] = useState(false);
  const { guardarSesionUsuario } = useUsuario();
  const [toast, setToast] = useState({ open: false, mensaje: "", tipo: "" });
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { getUrlAxio } = UseUrlAxio();

  const history = useHistory();

  const handleChangeVisibilityOfPassword = () => {
    setBlnVerPassword(!blnVerPassword);
  };

  useEffect(() => {
    setTituloPagina(localStorage.getItem("nombreClinica") || "");
    document.title = localStorage.getItem("tituloWeb") || "";
    sessionStorage.setItem("hcUL", JSON.stringify({}) || "");
  }, []);

  const loginPaciente = async (usuario: string, password: string) => {
    try {
      const response = await axios.post(`${getUrlAxio()}Usuarios/Login`, {
        nombreUsuario: usuario,
        password: password,
      });
      return response.data.token;
    } catch (error: any) {
      setErrorPassword(true);
      setMsjErrorPassword("Usuario o Password incorrecto");
      mostrarNotificacion(true, "Error: " + error.response.data, "rojo");
    }
  };

  const obtenerPrestador = async (token: string, documento: string) => {
    let prestador: Usuario;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(`${getUrlAxio()}Usuarios?usuario=${documento}`, config);
      const data = response.data[0];
      prestador = {
        usuario: usuario.usuario,
        password: usuario.password,
        token: token,
        codigo: data.codigo,
        rol: data.rol,
        nombreUsuario: data.nombreUsuario,
        nombreCompleto: data.nombreCompleto,
        prestadorNom: data.prestadorNom,
        prestadorCod: data.prestadorCod,
        especialidadNom: data.especialidadNom,
        prestadores: data.prestadores,
      };
      return prestador;
    } catch (error: any) {
      console.error("Error en petición obtenerPaciente", error.response);
      mostrarNotificacion(
        true,
        "Se produjo un error al intentar consultar los datos del paciente",
        "rojo"
      );
    }
  };

  const handleClickLogin = async () => {
    setCargando(true);
    if (usuario.usuario !== "" && usuario.password !== "") {
      const token = await loginPaciente(usuario.usuario, usuario.password);
      const prestador = await obtenerPrestador(token, usuario.usuario);
      if (prestador) {
        mostrarNotificacion(true, "Sesión iniciada correctamente", "verde");
        setUsuarioLogueado(prestador);
        guardarSesionUsuario(prestador);
        history.push("/portal/");
      }
    } else {
      if (usuario.usuario !== "") setErrorUsuario(true);
      if (usuario.password !== "") {
        setErrorPassword(true);
        setMsjErrorPassword("Debe ingresar su contraseña");
      }
    }
    setCargando(false);
  };

  const handleClickSubmit = () => {
    setCargando(true);
    handleClickLogin();
    setCargando(false);
  };

  const handleChangeUsuario = (e: any) => {
    const value = e.target.value;
    //Reemplazamos los valores no numericos por espacios en blanco
    //   const filteredValue = value.replace(/[^0-9]+/g, "");
    setUsuario({ usuario: value, password: usuario.password, token: "" });
  };

  const handleChangePassword = (e: any) => {
    const value = e.target.value;
    //Reemplazamos los valores no numericos por espacios en blanco
    //   const filteredValue = value.replace(/[^0-9]+/g, "");
    setUsuario({ usuario: usuario.usuario, password: value, token: "" });
  };

  const handleCloseModalRegistrarPaciente = () => {
    setRegistrarPaciente(false);
  };

  return (
    // @ts-ignore
    <IonGrid type="overlay" contentId="main">
      <IonRow className="LoginViewRow justify-content-center">
        <IonCol>
          <IonCard>
            <IonCardHeader>
              <IonRow className="justify-content-center">
                <IonCardTitle>
                  <h3>Historias Clínicas de Pacientes</h3>
                  <p>Inicio de sesion</p>
                </IonCardTitle>
              </IonRow>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem lines="none" fill="solid">
                  <IonLabel position="floating">Usuario</IonLabel>
                  {/*<IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={helpOutline}
                    md={help}
                    id="btnHelpNrodocumento"
                    size="small"
                  />
                  <IonPopover
                    trigger="btnHelpNrodocumento"
                    triggerAction="click"
                  >
                    <IonContent class="ion-padding">
                      Solo se aceptan valores numericos
                    </IonContent>
                  </IonPopover> */}
                  <IonInput
                    value={usuario.usuario}
                    onKeyUp={handleChangeUsuario}
                    autofocus
                    inputMode="numeric"
                  />
                  <IonIcon aria-hidden="true" slot="end" ios={personOutline} md={person} />
                </IonItem>
                <IonItem lines="none" fill="solid" className={`${errorPassword && "ion-invalid"}`}>
                  <IonLabel position="floating">Contraseña</IonLabel>
                  {/* <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={helpOutline}
                    md={help}
                    id="btnHelpPassword"
                    size="small"
                  />
                  <IonPopover trigger="btnHelpPassword" triggerAction="click">
                    <IonContent class="ion-padding">
                      
                    </IonContent>
                  </IonPopover> */}
                  <IonInput
                    value={usuario.password}
                    onKeyUp={handleChangePassword}
                    type={blnVerPassword ? "text" : "password"}
                    className="passwordInput"
                  />
                  <IonIcon
                    aria-hidden="true"
                    slot="end"
                    ios={blnVerPassword ? eyeOutline : eyeOffOutline}
                    md={blnVerPassword ? eye : eyeOff}
                    onClick={handleChangeVisibilityOfPassword}
                  />
                  <IonNote slot="error">{msjErrorPassword}</IonNote>
                </IonItem>
              </IonList>
              <StyledButton
                // @ts-ignore
                lines="none"
                size="large"
                className="violeta justify-content-center"
                onClick={handleClickSubmit}
              >
                Ingresar
              </StyledButton>
              {/*<StyledButton
                // @ts-ignore
                lines="none"
                fill="clear"
                className="justify-content-center"
                onClick={(e) => setRegistrarPaciente(true)}
              >
                <h5>¿No es paciente?, REGISTRESE</h5> 
              </StyledButton>*/}
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      {/* <NuevoPaciente
          mostrarNotificacion={mostrarNotificacion}
          openModal={registrarPaciente}
          closeModal={handleCloseModalRegistrarPaciente}
        /> */}

      <CustomToast mostrar={mostrar} mensaje={mensaje} color={color} />

      {/*{cargando && <LoadingBackdrop visualizar={cargando} />} */}
    </IonGrid>
  );
};

export default LoginIonic;
