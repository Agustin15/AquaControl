import styles from "./InfoToBind.module.css";

export const InfoToBind = () => {
  return (
    <div className={styles.infoToBind}>
      <p>
        El equipo de monitoreo y transmisión de datos necesita conectarse a una
        red Wi-Fi (preferiblemente la del lugar donde estará instalado el
        sistema de riego). Para vincularlo, primero debes conectar tu celular al
        dispositivo mediante Bluetooth y así transferirle las credenciales de la
        red para completar el emparejamiento.
      </p>
      <h4>Datos para establecer la conexion a traves de bluetooth:</h4>
      <p>
        <b>Nombre del dispositivo:</b> HC_Riego
      </p>
      <p>
        <b>Contraseña:</b>984@KLDF
      </p>

      <p>
        <b>Ubicacion geografica del equipo:</b>
        Si deseas obtener datos climáticos para analizar el historial de humedad
        de la tierra segun el clima o evitar riegos ante una alta probabilidad de lluvia, te
        recomendamos ingresar la ubicación donde se instalará el sistema
        de riego.
      </p>

      <p>
        Una vez vinculado, podrás enviarle las credenciales de la red Wi-Fi
        mediante la opción «Agregar nuevo dispositivo» para que el equipo se
        conecte a internet y puedas controlarlo desde tu celular a cualquier
        distancia.
      </p>
      <p>
        Una vez configurado el nuevo equipo de riego, el celular puede
        desvincularse de la conexión Bluetooth.
      </p>
    </div>
  );
};
