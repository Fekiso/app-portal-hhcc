import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonPopover,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import dayjs from "dayjs";
import { alert, alertOutline, search, searchOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import CustomDesplegable from "../../components/CustomDesplegable/CustomDesplegable";
import DialogoConfirmacion from "../../components/DialogoConfirmacion/DialogoConfirmacion";
import StyledButton from "../../components/StyledButton/StyledButton";
import useNotificacion from "../../hooks/notificacion";
import {
  DesplegableModel,
  ErroresPaciente,
  Mutual,
  Paciente,
  TipoDocumento,
  Usuario,
} from "../../interfaces";
import CustomToast from "../../components/CustomToast/CustomToast";

interface ContainerProps {
  usuarioLogueado: Usuario;
}

const RegistrarPaciente: React.FC<ContainerProps> = ({ usuarioLogueado }) => {
  const [paciente, setPaciente] = useState<Paciente>({
    codigo: 0,
    hc: 0,
    documentoNro: 0,
    documentoTipo: 0,
    documentoTipoNombre: "",
    nombre: "",
    apellido: "",
    mutual: 0,
    mutualNombre: "",
    telefono: "",
    celular: "",
    email: "",
    sexo: "",
    mutualAfiliado: "",
    nacimiento: "",
    password: "",
  });
  const [erroresPaciente, setErroresPaciente] = useState<ErroresPaciente>({
    hc: false,
    documentoNro: false,
    documentoTipo: false,
    documentoTipoNombre: false,
    nombre: false,
    apellido: false,
    mutual: false,
    mutualNombre: false,
    telefono: false,
    celular: false,
    email: false,
    sexo: false,
    mutualAfiliado: false,
    nacimiento: false,
  });
  //arrays base
  const [mutuales, setMutuales] = useState<Mutual[]>([]);
  const [tiposDoc, setTiposDoc] = useState<TipoDocumento[]>([]);
  //arrays para  desplegables
  const [mutualesSelect, setMutualesSelect] = useState<DesplegableModel[]>([]);
  const [tiposDocSelect, setTiposDocSelect] = useState<DesplegableModel[]>([]);
  const [abrirCancelarRegistro, setAbrirCancelarRegistro] = useState<boolean>(false);
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();

  const CargarTiposDocs = async () => {
    const urlAxios = localStorage.getItem("urlAxio");
    const config = {
      headers: {
        Authorization: `Bearer ${usuarioLogueado.token}`,
      },
    };

    try {
      const response = await axios.get(`${urlAxios}Pacientes/DocumentoTipoTraer`, config);
      let listado: DesplegableModel[] = [];
      for (let i = 0; i < response.data.length; i++) {
        listado.push({
          codigo: response.data[i].codigo,
          text: response.data[i].nombre,
        });
      }

      setTiposDoc(response.data);
      setTiposDocSelect(listado);
    } catch (e) {
      // @ts-ignore
      mostrarNotificacion(true, e.message, "rojo");
    }

    // this.state.formCargando = false;
  };

  const CargarMutuales = async () => {
    const urlAxios = localStorage.getItem("urlAxio");
    const config = {
      headers: {
        Authorization: `Bearer ${usuarioLogueado.token}`,
      },
    };

    try {
      const response = await axios.get(`${urlAxios}Mutuales`, config);
      let listado: DesplegableModel[] = [];
      for (let i = 0; i < response.data.length; i++) {
        listado.push({
          codigo: response.data[i].codigo,
          text: response.data[i].nombre,
          nota: response.data[i].hojaRuta,
        });
      }
      setMutuales(response.data);
      setMutualesSelect(listado);
    } catch (e) {
      // @ts-ignore
      mostrarNotificacion(true, e.message, "rojo");
    }
  };

  useEffect(() => {
    CargarMutuales();
    CargarTiposDocs();
  }, []);

  useEffect(() => {
    console.log(mostrar);
  }, [mostrar]);

  const handleChangeInput = (value: any, id: string) => {
    let pacienteModificado = { ...paciente };

    switch (id) {
      case "mutual":
        mutuales.forEach((mutual) => {
          if (mutual.codigo === value) {
            pacienteModificado.mutual = mutual.codigo;
            pacienteModificado.mutualNombre = mutual.nombre;
          }
        });
        break;
      case "documentoTipo":
        tiposDoc.forEach((tipo) => {
          if (tipo.codigo === value) {
            pacienteModificado.documentoTipo = tipo.codigo;
            pacienteModificado.documentoTipoNombre = tipo.nombre;
          }
        });
        break;
      case "nombre":
        pacienteModificado.nombre = value;
        break;
      case "apellido":
        pacienteModificado.apellido = value;
        break;
      case "nacimiento":
        pacienteModificado.nacimiento = value;
        break;
      case "documentoNro":
        pacienteModificado.documentoNro = value;
        break;
      case "mutualAfiliado":
        pacienteModificado.mutualAfiliado = value;
        break;
      case "telefono":
        pacienteModificado.telefono = value;
        break;
      case "email":
        pacienteModificado.email = value;
        break;
      default:
        mostrarNotificacion(true, "Selección inválida", "rojo");
        break;
    }
    setPaciente(pacienteModificado);
  };

  const validarFormRegistroPaciente = (): boolean => {
    let errores: ErroresPaciente = {
      hc: false,
      documentoNro: false,
      documentoTipo: false,
      documentoTipoNombre: false,
      nombre: false,
      apellido: false,
      mutual: false,
      mutualNombre: false,
      telefono: false,
      celular: false,
      email: false,
      sexo: false,
      mutualAfiliado: false,
      nacimiento: false,
    };

    let pasa = true;
    if (paciente?.nombre === "" || paciente?.nombre === null) {
      pasa = false;
      errores.nombre = true;
    }
    if (paciente?.apellido === "" || paciente?.apellido === null) {
      pasa = false;
      errores.apellido = true;
    }
    if (paciente?.nacimiento === "" || paciente?.nacimiento === null) {
      pasa = false;
      errores.nacimiento = true;
    }
    if (paciente?.telefono === "" || paciente?.telefono === null) {
      pasa = false;
      errores.telefono = true;
    }
    if (paciente?.documentoNro === 0 || paciente?.documentoNro === null) {
      pasa = false;
      errores.documentoNro = true;
    }
    if (
      paciente?.email === "" ||
      paciente?.email === null ||
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
        paciente?.email
      )
    ) {
      pasa = false;
      errores.email = true;
    }
    if (
      paciente?.documentoTipo === null ||
      !tiposDoc.some((tipo) => tipo.codigo === paciente.documentoTipo)
    ) {
      pasa = false;
      errores.documentoTipo = true;
    }
    if (
      paciente?.mutual === null ||
      !mutuales.some((mutual) => mutual.codigo === paciente.mutual)
    ) {
      pasa = false;
      errores.mutual = true;
    }
    if (
      (paciente?.mutualAfiliado === "" || paciente?.mutualAfiliado === null) &&
      paciente?.mutual !== 1
    ) {
      pasa = false;
      errores.mutualAfiliado = true;
    }
    console.log(errores);
    console.log(pasa);
    setErroresPaciente(errores);
    return pasa;
  };

  const limpiarCampos = () => {
    setPaciente({
      codigo: 0,
      hc: 0,
      documentoNro: 0,
      documentoTipo: 0,
      documentoTipoNombre: "",
      nombre: "",
      apellido: "",
      mutual: 0,
      mutualNombre: "",
      telefono: "",
      celular: "",
      email: "",
      sexo: "",
      mutualAfiliado: "",
      nacimiento: "",
      password: "",
    });
  };

  const limpiarErrores = () => {
    setErroresPaciente({
      hc: false,
      documentoNro: false,
      documentoTipo: false,
      documentoTipoNombre: false,
      nombre: false,
      apellido: false,
      mutual: false,
      mutualNombre: false,
      telefono: false,
      celular: false,
      email: false,
      sexo: false,
      mutualAfiliado: false,
      nacimiento: false,
    });
  };
  const RegistrarPaciente = async () => {
    const urlAxios = localStorage.getItem("urlAxio");
    var config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    //Hay que revisar el endpoint, si falla la peticion salta al catch
    try {
      if (validarFormRegistroPaciente()) {
        const response = await axios.post(
          `${urlAxios}pacientes`,
          {
            hc: paciente.documentoNro,
            documentoNro: paciente.documentoNro,
            password: paciente.documentoNro,
            documentoTipo: paciente.documentoTipo,
            documentoTipoNombre: paciente.documentoTipoNombre,
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            mutual: paciente.mutual,
            mutualNombre: paciente.mutualNombre,
            celular: paciente.telefono,
            email: paciente.email,
            nacimiento: paciente.nacimiento,
            mutualAfiliado: paciente.mutual !== 1 ? paciente.mutualAfiliado : "-",
          },
          config
        );
        console.log(response);
        if (response.status === 200 && response.statusText === "OK") {
          mostrarNotificacion(true, "Paciente  registrado exitosamente", "verde");
          // limpiarCampos();
          limpiarErrores();
        } else {
          mostrarNotificacion(true, `Error: ${response.data.message}`, "rojo");
        }
      } else {
        mostrarNotificacion(true, "Faltan de rellenar algunos campos", "rojo");
      }
    } catch (e) {
      console.log(e);
      // @ts-ignore
      mostrarNotificacion(true, e.response?.data.message || e.message, "rojo");
    }
  };
  const confirmarCancelarRegistro = () => {
    togleAbrirCerrarCancelarRegistro();
    limpiarCampos();
    limpiarErrores();
  };

  const togleAbrirCerrarCancelarRegistro = () => {
    setAbrirCancelarRegistro(!abrirCancelarRegistro);
  };

  const handleClickRegistrarPaciente = () => {
    RegistrarPaciente();
  };

  return (
    <IonCard>
      <IonGrid>
        <IonCardContent>
          <IonList>
            <IonNote>Datos personales</IonNote>
            <IonRow>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    label="Nombre"
                    id="nombre"
                    label-placement="floating"
                    value={paciente.nombre}
                    // @ts-ignore
                    onKeyUp={(e) => handleChangeInput(e.target.value, "nombre")}
                    className={`${erroresPaciente.nombre && "ion-invalid"}`}
                  />

                  {erroresPaciente.nombre && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorNombre"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorNombre" triggerAction="click">
                        <IonContent class="ion-padding">No se ingreso el nombre</IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    label="Apellido"
                    id="apellido"
                    label-placement="floating"
                    value={paciente.apellido}
                    // @ts-ignore
                    onKeyUp={(e) => handleChangeInput(e.target.value, "apellido")}
                    className={`${erroresPaciente.apellido && "ion-invalid"}`}
                  />
                  {erroresPaciente.apellido && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorApellido"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorApellido" triggerAction="click">
                        <IonContent class="ion-padding">No se ingreso el apellido</IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    label="Tipo de documento"
                    label-placement="floating"
                    value={paciente.documentoTipoNombre}
                    className={`${erroresPaciente.documentoTipoNombre && "ion-invalid"}`}
                  />

                  <CustomDesplegable
                    array={tiposDocSelect}
                    value={paciente.documentoTipo}
                    handleChange={handleChangeInput}
                    mostrarTodos={false}
                    mostrarSearch={true}
                    id="documentoTipo"
                  />
                  {erroresPaciente.documentoTipo && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorTipoDoc"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorTipoDoc" triggerAction="click">
                        <IonContent class="ion-padding">
                          No se selecciono un tipo de documento
                        </IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    inputMode="numeric"
                    label="Numero de documento"
                    id="documentoNro"
                    label-placement="floating"
                    value={paciente.documentoNro !== 0 ? paciente.documentoNro : ""}
                    // @ts-ignore
                    onKeyUp={(e) => handleChangeInput(e.target.value, "documentoNro")}
                    className={`${erroresPaciente.documentoNro && "ion-invalid"}`}
                  />
                  {erroresPaciente.documentoNro && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorNroDocumento"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorNroDocumento" triggerAction="click">
                        <IonContent class="ion-padding">
                          No se ingreso un numero de documento
                        </IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    type="date"
                    label="Fecha de nacimiento"
                    label-placement="floating"
                    id="nacimiento"
                    value={paciente.nacimiento}
                    min={dayjs().subtract(110, "year").format("YYYY-MM-DD")}
                    max={dayjs().format("YYYY-MM-DD")}
                    // @ts-ignore
                    onIonChange={(e) => handleChangeInput(e.target.value, "nacimiento")}
                    className={`${erroresPaciente.nacimiento && "ion-invalid"}`}
                  />
                  {erroresPaciente.nacimiento && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorFechaNac"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorFechaNac" triggerAction="click">
                        <IonContent class="ion-padding">
                          No se ingreso una fecha de nacimiento valida
                        </IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
          </IonList>
          <IonList>
            <IonNote>Datos de mutual</IonNote>
            <IonRow>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    readonly
                    label="Mutual"
                    label-placement="floating"
                    id="mutualNombre"
                    value={paciente.mutualNombre}
                    // onKeyUp={(e) => documentoNro(e.target.value)}
                    className={`${erroresPaciente.mutualNombre && "ion-invalid"}`}
                  />
                  <CustomDesplegable
                    array={mutualesSelect}
                    value={paciente.mutual}
                    handleChange={handleChangeInput}
                    mostrarTodos={false}
                    mostrarSearch={true}
                    id="mutual"
                  />
                  {erroresPaciente.mutual && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorMutual"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorMutual" triggerAction="click">
                        <IonContent class="ion-padding">No se selecciono una mutual</IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    label="Numero de afiliado"
                    label-placement="floating"
                    id="mutualAfiliado"
                    value={paciente.mutualAfiliado}
                    // @ts-ignore
                    onKeyUp={(e) => handleChangeInput(e.target.value, "mutualAfiliado")}
                    className={`${erroresPaciente.mutualAfiliado && "ion-invalid"}`}
                  />
                  {erroresPaciente.mutualAfiliado && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorMutualAfiliado"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorMutualAfiliado" triggerAction="click">
                        <IonContent class="ion-padding">
                          No se ingreso un numero de afiliado, en caso de no tener
                        </IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
          </IonList>
          <IonList>
            <IonNote>Datos de contacto</IonNote>
            <IonRow>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    label="Telefono"
                    label-placement="floating"
                    id="telefono"
                    value={paciente.telefono}
                    // @ts-ignore
                    onKeyUp={(e) => handleChangeInput(e.target.value, "telefono")}
                    className={`${erroresPaciente.telefono && "ion-invalid"}`}
                  />
                  {erroresPaciente.telefono && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorTelefono"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorTelefono" triggerAction="click">
                        <IonContent class="ion-padding">
                          No se ingreso un telefono de contacto
                        </IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
              <IonCol size="12" size-md="6">
                <IonItem>
                  <IonInput
                    label="Correo electronico"
                    label-placement="floating"
                    id="email"
                    value={paciente.email}
                    // @ts-ignore
                    onKeyUp={(e) => handleChangeInput(e.target.value, "email")}
                    className={`${erroresPaciente.email && "ion-invalid"}`}
                  />
                  {erroresPaciente.email && (
                    <>
                      <IonIcon
                        aria-hidden="true"
                        slot="end"
                        ios={alertOutline}
                        md={alert}
                        id="btnErrorCorreo"
                        size="small"
                        color="danger"
                      />
                      <IonPopover trigger="btnErrorCorreo" triggerAction="click">
                        <IonContent class="ion-padding">
                          No se ingreso un correo electronico valido
                        </IonContent>
                      </IonPopover>
                    </>
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
          </IonList>

          <IonList>
            <IonToolbar>
              <IonRow className="ion-justify-content-around">
                <IonCol>
                  <StyledButton
                    // lines="none"
                    expand="block"
                    className="rojo ion-padding-horizontal"
                    onClick={togleAbrirCerrarCancelarRegistro}
                  >
                    Limpiar formulario
                  </StyledButton>
                </IonCol>
                <IonCol>
                  <StyledButton
                    // lines="none"
                    expand="block"
                    className="verde ion-padding-horizontal"
                    onClick={handleClickRegistrarPaciente}
                  >
                    Registrar paciente
                  </StyledButton>
                </IonCol>
              </IonRow>
            </IonToolbar>
          </IonList>
        </IonCardContent>
      </IonGrid>

      <CustomToast mostrar={mostrar} mensaje={mensaje} color={color} />
      <DialogoConfirmacion
        titulo="Limpiar formulario"
        contenido="¿Esta seguro de limpiar el formulario? Se perderan los datos que haya cargado"
        abrirCerrarModal={abrirCancelarRegistro}
        handleclickBotonNo={togleAbrirCerrarCancelarRegistro}
        handleclickBotonSi={confirmarCancelarRegistro}
        colorBotonNo="amarillo"
        colorBotonSi="rojo"
        textoBotonNo="Cancelar"
        textoBotonSi="Estoy seguro"
      />
    </IonCard>
  );
};

export default RegistrarPaciente;
