# AquaControl
 
 <img src="https://img.shields.io/badge/v11.16.0-636363?style=flat&logo=NPM&logoColor=%23FFFFFF&logoSize=25&label=NPM&labelColor=%2329A345&color=%23636363"> <img src="https://img.shields.io/badge/Framework%208.0-512BD4?style=flat&logo=.NET&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%23512BD4&color=%23512BD4">


It consists of an intelligent automated irrigation system based on the ESP32 microcontroller and IoT (Internet of Things) technologies.
The system is designed to optimize water usage and ensure autonomous plant care. Its main functions are:

Tank level monitoring: Continuously measures the available water level in the reservoir to prevent the pump from running dry.

Periodic data reporting: Provides hourly updates throughout the week on the tank status and plant moisture levels.

Automatic/manual irrigation: A function to activate the water pump and begin irrigation when plant moisture levels fall below the established threshold.

Real-time connectivity: Data is continuously transmitted using the MQTT protocol and published to a broker, ensuring that both the app and the microcontroller receive information instantly.


### Developed with

- <img src="https://img.shields.io/badge/React.js--0c979c?style=flat&labelColor=0c979c&logo=react&logoColor=white&logoSize=auto" alt="React.js">
- <img src="https://img.shields.io/badge/Capacitor-119EFF?style=flat&logo=Capacitor&logoColor=%23119EFF&label=%20&color=white">
- <img src="https://img.shields.io/badge/Javascript--f5ff0e?style=flat&labelColor=f5ff0e&logo=javascript&logoColor=black&logoSize=auto" alt="Javascript">
- <img src="https://img.shields.io/badge/CSS-2254C9?style=flat&logo=CSS&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%232254C9&color=%232254C9">
- <img src="https://img.shields.io/badge/ASP.NET%20CORE%20-512BD4?style=flat&logo=.NET&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%23512BD4&color=%23512BD4">
- <img src="https://img.shields.io/badge/MQTT-660066?style=flat&logo=mqtt&logoColor=%23FFFFFF&logoSize=25&label=%20&labelColor=%23660066&color=%23660066">
- <img src="https://img.shields.io/badge/Microsoft_SQL_Server-CC2927" alt="SQL Server">



### Clone repository

     git clone https://github.com/Agustin15/AquaControl.git

### Requirements

- NPM v11.16.0
- ASP.NET CORE (.NET FRAMEWORK 8.0)
- SQL SERVER (>=2019)
- Broker MQTT

### Installation ⚙

#### Frontend

> Browse to frontend

    cd frontend

> Install dependences

    npm install

#### Dependences

- [@capacitorjs](https://capacitorjs.com/docs/getting-started)
- [@sweetalert2](https://sweetalert2.github.io/)
- [@react-router](https://github.com/remix-run/react-router)
- [@mqtt.js](https://github.com/mqttjs/MQTT.js)


#### Environment Variables

     VITE_BACKEND_LOCALHOST=<url of backend>
     VITE_FRONTEND_LOCALHOST=<url of frontend>
     VITE_URL_MQTT_BROKER=<url of your broker mqtt>
     VITE_BROKER_USERNAME=<account username to access to your broker mqtt>
     VITE_BROKER_PASSWORD=<account password to access to your broker mqtt>

#### Backend

> Browse to backend

    cd backend/AquaControlApi
      
> Install dependences Api proyect  

       dotnet restore
    
#### Dependences for install in Api.csproj with NuGet

- [@dotenv.net 4.0.2](https://www.nuget.org/packages/dotenv.net)
- [@Microsoft.AspNetCore.Authentication.JwtBearer 8.0.29](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer/8.0.29)

> Install dependences Logic proyect  

       dotnet restore
    
#### Dependences for install in Logic.csproj with NuGet

- [@BCrypt.Net-Next 4.2.0](https://www.nuget.org/packages/BCrypt.Net-Next/)
- [@System.IdentityModel.Tokens.Jwt 8.21.0](https://www.nuget.org/packages/system.identitymodel.tokens.jwt/)


> Install dependences DAL proyect 

       dotnet restore
    
#### Dependences for install in DAL.csproj with NuGet

- [@Microsoft.Data.SqlClient 7.0.2](https://www.nuget.org/packages/microsoft.data.sqlclient)
- [@MQTTnet 5.2.0.1603](https://www.nuget.org/packages/mqttnet/)

#### Environment Variables

     STRING_CONNECTION=<string connection to connect SQL Server database >
     ACCESS_TOKEN_SECRET_KEY=<secret key of token that will use the app to access to api>
     REFRESH_TOKEN_SECRET_KEY=<secret key of token that will use the app to create new access token>
     DEVICE_TOKEN_SECRET_KEY=<secret key that will use the Esp32 to access to api>
     ACCESS_TOKEN_EXPIRED_MINUTES=<minutes access token expiration>
     REFRESH_TOKEN_EXPIRED_MINUTES=<minutes refresh token expiration>
     LOCALHOST_FRONTEND=<url of frontend>
     LOCALHOST_BACKEND=<url of backend>


![Devices](/captures/Devices.jpg)

![Humidity week logs ](/captures/HumidityPlantLogs.jpg)

![Water level tank week logs ](/captures/WaterLevelLogs.jpg)

![Irrigatation](/captures/Irrigation.jpg)

![Irrigations record](/captures/IrrigationsRecord.jpg)

![Irrigation details](/captures/DetailsIrrigation.jpg)

![Plants](/captures/Plants.jpg)

![Tanks](/captures/Tanks.jpg)