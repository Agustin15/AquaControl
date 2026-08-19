# AquaControl

Consiste en un sistema inteligente de riego automatizado basado en el microcontrolador ESP32 y tecnologías IoT (Internet de las Cosas).
El sistema está diseñado para optimizar el recurso hídrico y asegurar el cuidado autónomo de las plantas. Sus funciones principales son:

Control del nivel del tanque:Mide de forma constante el nivel de agua disponible en el depósito de reserva para prevenir el funcionamiento en seco de la bomba.

Datos periodicos cada 1 hora durante la semana sobre el estado del tanque y de la humedad de planta

Riego automatico/manual: Funcion para iniciar la bomba de agua para comenzar el riego, en caso de que los niveles de humedad de la planta estan por debajo de su umbral estimado.

Conectividad en tiempo real:Se transfieren datos constantemente usando el protocolo MQTT, publicandolos en un Broker para que la app y el microcontrolador esten recibiendo datos instantaneamente.


### Desarrollado con

- <img src="https://img.shields.io/badge/React.js--0c979c?style=flat&labelColor=0c979c&logo=react&logoColor=white&logoSize=auto" alt="React.js">
- <img src="https://img.shields.io/badge/Javascript--f5ff0e?style=flat&labelColor=f5ff0e&logo=javascript&logoColor=black&logoSize=auto" alt="Javascript">
- <img src="https://img.shields.io/badge/CSS--0c379c?style=flat&labelColor=0c379c&logo=css3&logoColor=white&logoSize=auto" alt="CSS">
- <img src="https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white" alt=".NET badge">
- <img src="https://github.com/mqttjs/MQTT.js/workflows/MQTT.js%20CI/badge.svg" >
- <img src="https://img.shields.io/badge/Microsoft_SQL_Server-CC2927" alt="SQL Server">



### Clonar repositorio

     git clone https://github.com/Agustin15/AquaControl.git

### Requisitos

- NPM v11.16.0
- ASP.NET CORE (.NET FRAMEWORK 8.0)
- SQL SERVER (>=2019)
- Broker MQTT

### Instalacion ⚙

#### Frontend

> Navegar a frontend

    cd frontend

> Instalar dependencias

    npm install

#### Dependencias

- [@capacitor](https://capacitorjs.com/docs/getting-started)
- [@sweetalert2](https://sweetalert2.github.io/)
- [@react-router](https://github.com/remix-run/react-router)
- [@mqtt](https://github.com/mqttjs/MQTT.js)

### Variables de entorno

 VITE_BACKEND_LOCALHOST=<LOCALHOST_BACKEND_URL>
 VITE_FRONTEND_LOCALHOST=<LOCALHOST_FRONTEND_URL>
 VITE_URL_MQTT_BROKER=<MQTT_URL_BROKER>
 VITE_BROKER_USERNAME=<MQTT_ACCOUNT_USERNAME_BROKER>
 VITE_BROKER_PASSWORD=<MQTT_ACCOUNT_PASSWORD_BROKER>
