# AquaControl
 
 <img src="https://img.shields.io/badge/v11.16.0-636363?style=flat&logo=NPM&logoColor=%23FFFFFF&logoSize=25&label=NPM&labelColor=%2329A345&color=%23636363"> <img src="https://img.shields.io/badge/Framework%208.0-512BD4?style=flat&logo=.NET&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%23512BD4&color=%23512BD4">


Consiste en un sistema inteligente de riego automatizado basado en el microcontrolador ESP32 y tecnologías IoT (Internet de las Cosas).
El sistema está diseñado para optimizar el recurso hídrico y asegurar el cuidado autónomo de las plantas. Sus funciones principales son:

Control del nivel del tanque: Mide de forma constante el nivel de agua disponible en el depósito de reserva para prevenir el funcionamiento en seco de la bomba.

Datos periodicos cada 1 hora durante la semana sobre el estado del tanque y de la humedad de planta

Riego automatico/manual: Funcion para iniciar la bomba de agua para comenzar el riego, en caso de que los niveles de humedad de la planta estan por debajo de su umbral estimado.

Conectividad en tiempo real:Se transfieren datos constantemente usando el protocolo MQTT, publicandolos en un Broker para que la app y el microcontrolador esten recibiendo datos instantaneamente.


### Desarrollado con

- <img src="https://img.shields.io/badge/React.js--0c979c?style=flat&labelColor=0c979c&logo=react&logoColor=white&logoSize=auto" alt="React.js">
- <img src="https://img.shields.io/badge/Javascript--f5ff0e?style=flat&labelColor=f5ff0e&logo=javascript&logoColor=black&logoSize=auto" alt="Javascript">
- <img src="https://img.shields.io/badge/CSS-2254C9?style=flat&logo=CSS&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%232254C9&color=%232254C9">
- <img src="https://img.shields.io/badge/ASP.NET%20CORE%20-512BD4?style=flat&logo=.NET&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%23512BD4&color=%23512BD4">
- <img src="https://img.shields.io/badge/MQTT-660066?style=flat&logo=mqtt&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%23660066&color=%23660066">
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

- [@capacitorjs](https://capacitorjs.com/docs/getting-started)
- [@sweetalert2](https://sweetalert2.github.io/)
- [@react-router](https://github.com/remix-run/react-router)
- [@mqtt.js](https://github.com/mqttjs/MQTT.js)


### Variables de entorno

     VITE_BACKEND_LOCALHOST=<url of backend>
     VITE_FRONTEND_LOCALHOST=<url of frontend>
     VITE_URL_MQTT_BROKER=<url of your broker mqtt>
     VITE_BROKER_USERNAME=<account username to access to your broker mqtt>
     VITE_BROKER_PASSWORD=<account password to access to your broker mqtt>

#### Backend

> Navegar a backend

    cd backend/AquaControlApi
      
> Instalar dependencias proyecto Api  

       dotnet restore
    
#### Dependencias en Api.csproj para instalar con NuGet

- [@dotenv.net 4.0.2](https://www.nuget.org/packages/dotenv.net)
- [@Microsoft.AspNetCore.Authentication.JwtBearer 8.0.29](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer/8.0.29)

> Instalar dependencias proyecto Logic 

       dotnet restore
    
#### Dependencias en Logic.csproj para instalar con NuGet

- [@BCrypt.Net-Next 4.2.0](https://www.nuget.org/packages/BCrypt.Net-Next/)
- [@System.IdentityModel.Tokens.Jwt 8.21.0](https://www.nuget.org/packages/system.identitymodel.tokens.jwt/)


> Instalar dependencias en proyecto DAL

       dotnet restore
    
#### Dependencias en DAL.csproj

- [@Microsoft.Data.SqlClient 7.0.2](https://www.nuget.org/packages/microsoft.data.sqlclient)
- [@MQTTnet 5.2.0.1603](https://www.nuget.org/packages/mqttnet/)

### Variables de entorno

     STRING_CONNECTION=<string connection to connect SQL Server database >
     ACCESS_TOKEN_SECRET_KEY=<secret key of token that will use the app to access to api>
     REFRESH_TOKEN_SECRET_KEY=<secret key of token that will use the app to create new access token>
     DEVICE_TOKEN_SECRET_KEY=<secret key that will use the Esp32 to access to api>
     ACCESS_TOKEN_EXPIRED_MINUTES=<minutes access token expiration>
     REFRESH_TOKEN_EXPIRED_MINUTES=<minutes refresh token expiration>
     LOCALHOST_FRONTEND=<url of frontend>
     LOCALHOST_BACKEND=<url of backend>
