// import React from "react";
// import { Paciente, Usuario } from "../../interfaces";
// import { IonAccordion, IonAccordionGroup, IonActionSheet, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonRow, IonTitle, IonToolbar } from "@ionic/react";
// import StyledButton from "../StyledButton/StyledButton";
// import dayjs from "dayjs";
// import CustomDesplegable from "../CustomDesplegable/CustomDesplegable";
// import { cloudDownloadOutline, eyeOutline } from "ionicons/icons";
// import { Document, Page, pdfjs } from "react-pdf";
// import CustomToast from "../CustomToast/CustomToast";
// interface ContainerProps {
//   pacienteProps?: Paciente;
//   usuarioLogueado: Usuario;
//   abrirModal: boolean;
//   setAbrirModal: (abrir: boolean) => void;
// }
// const ModalPdfsPaciente: React.FC<ContainerProps> = ({
//   pacienteProps,
//   usuarioLogueado,
//   abrirModal,
//   setAbrirModal,
// }) => {
//   const [tituloPagina, setTituloPagina] = useState("");
//   const [listadoEstudios, setListadoEstudios] = useState([]);
//   const [listadoEstudiosFiltrados, setListadoEstudiosFiltrados] = useState([]);
//   const [estudioSel, setEstudioSel] = useState(-1);
//   const [listadoEstudiosFiltro, setListadoEstudiosFiltro] = useState([]);
//   const [estudioPdf, setEstudioPdf] = useState({
//     fecha: "",
//     nombre: "",
//     doc: {},
//   });
//   const [abrirModal, setAbrirModal] = useState(false);

//   return
//     <IonModal isOpen={abrirModal} onDidDismiss={() => setAbrirModal(false)}>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Imagenes Pdf paciente</IonTitle>
//           <StyledButton slot="end" fill="clear" expand="full" onClick={() => setAbrirModal(false)}>
//             Salir
//           </StyledButton>
//         </IonToolbar>
//       </IonHeader>
//       {listadoEstudios.length <= 0 ? (
//         <IonGrid>
//           <IonRow className="ion-justify-content-center">
//             <IonCol>
//               <div className="ion-text-center">
//                 <p>No tiene estudios registrados</p>
//               </div>
//             </IonCol>
//           </IonRow>
//         </IonGrid>
//       ) : (
//         <>
//           {/*Desplegable con filtros*/}
//           <IonAccordionGroup expand="inset">
//             <IonAccordion value={"a"}>
//               <IonItem slot="header" color="light">
//                 <IonLabel>Filtrar</IonLabel>
//               </IonItem>
//               <div slot="content">
//                 <IonGrid>
//                   <IonRow>
//                     <IonCol size="12" size-md="6">
//                       <IonItem>
//                         <CustomDesplegable
//                           array={listadoEstudiosFiltro}
//                           value={estudioSel}
//                           handleChange={FiltrarEstudios}
//                           mostrarTodos={true}
//                           mostrarSearch={true}
//                           label={"Seleccione un tipo de estudio"}
//                           id="Estudios"
//                         />
//                       </IonItem>
//                     </IonCol>
//                   </IonRow>
//                 </IonGrid>
//               </div>
//             </IonAccordion>
//           </IonAccordionGroup>
//           {/* Tabla */}
//           <IonList lines="none">
//             <IonGrid>
//               <IonItem className="fila cabecera">
//                 <IonCol className="celda cabecera">
//                   <p>Fecha</p>
//                 </IonCol>
//                 <IonCol className="celda cabecera">
//                   <p>Nombre de estudio</p>
//                 </IonCol>
//                 <IonCol className="celda cabecera">
//                   <p>Estudio</p>
//                 </IonCol>
//               </IonItem>
//               {listadoEstudiosFiltrados.map((fila) => (
//                 <IonItem key={fila.nombre} className="fila">
//                   <IonCol className="celda">
//                     <p>{dayjs(fila.fecha).format("DD/MM/YYYY")}</p>
//                   </IonCol>
//                   <IonCol className="celda">
//                     <p>{fila.estudioNom}</p>
//                   </IonCol>
//                   <IonCol className="celda" itemProp="">
//                     <div className="iconColumn">
//                       <IonButton shape="roud" fill="clear" onClick={() => VisualizarPdf(fila)}>
//                         <IonIcon size="large" ios={eyeOutline} md={eye} />
//                       </IonButton>
//                       <IonButton shape="roud" fill="clear" onClick={() => DescargarPdf(fila)}>
//                         <IonIcon size="large" ios={cloudDownloadOutline} md={cloudDownload} />
//                       </IonButton>
//                     </div>
//                   </IonCol>
//                 </IonItem>
//               ))}
//             </IonGrid>
//           </IonList>

//           <IonActionSheet
//             header={`${estudioPdf.nombre}-${dayjs(estudioPdf.fecha).format("DD/MM/YYYY")}`}
//             buttons={[
//               {
//                 text: "Cancelar",
//                 role: "cancel",
//                 data: {
//                   action: "cancel",
//                 },
//               },
//             ]}
//             onDidDismiss={abrirCerrarModal}
//           >
//             <IonContent className="ion-padding">
//               {estudioPdf.doc && (
//                 <Document file={estudioPdf.doc} onLoadSuccess={onDocumentLoadSuccess}>
//                   {[...Array(numPages)].map((_, index) => (
//                     <Page
//                       key={`page_${index + 1}`}
//                       pageNumber={1}
//                       renderTextLayer={false}
//                       wrap={false}
//                     />
//                   ))}
//                 </Document>
//               )}
//             </IonContent>
//           </IonActionSheet>
//           <IonModal isOpen={abrirModal} backdropDismiss={false} expand="block">
//             <IonHeader>
//               <IonToolbar>
//                 <IonTitle>
//                   {`${estudioPdf.nombre}-${dayjs(estudioPdf.fecha).format("DD/MM/YYYY")}`}
//                 </IonTitle>
//                 <IonButtons slot="end">
//                   <IonButton strong={true} onClick={() => abrirCerrarModal()}>
//                     Cerrar
//                   </IonButton>
//                 </IonButtons>
//               </IonToolbar>
//             </IonHeader>
//             <IonContent className="ion-padding">
//               {estudioPdf.doc && (
//                 <Document file={estudioPdf.doc} onLoadSuccess={onDocumentLoadSuccess}>
//                   {[...Array(numPages)].map((_, index) => (
//                     <Page
//                       key={`page_${index + 1}`}
//                       pageNumber={1}
//                       renderTextLayer={false}
//                       wrap={false}
//                     />
//                   ))}
//                 </Document>
//               )}
//             </IonContent>
//           </IonModal>

//           <CustomToast mostrar={mostrar} mensaje={mensaje} color={color} />
//         </>
//       )}
//     </IonModal>;
// };

// export default ModalPdfsPaciente;

export default <a>a</a>;
