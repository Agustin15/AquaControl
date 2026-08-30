
--------------------------------------------------Tanks---------------------------------------------------------- 
EXEC AddTank 1,1,30

--------------------------------------------------Plants---------------------------------------------------------- 
EXEC AddPlant 1,1,50,0,@image = NULL,
    @description = 'Planta de albahaca cultivada en maceta, requiere riego moderado y buena exposición al sol.';

--------------------------------------------------simulation day---------------------------------------------------------- 

EXEC AddHumidityPlantLog @percentege = 50,@weatherData='{
  "Humidity": 65,
  "Temperature": 15,
  "PrecipitationChance": 50,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}', @idPlant = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 100, @idTank = 1,@idDevice= 1;

EXEC AddHumidityPlantLog @percentege = 40,@weatherData='{
  "Humidity": 60,
  "Temperature": 17,
  "PrecipitationChance": 50,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}',@idPlant = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 100, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 30,@weatherData='{
  "Humidity": 57,
  "Temperature": 17,
  "PrecipitationChance": 45,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}',@idPlant = 1,@idDevice= 1;


EXEC AddWaterPlantLog @type='Automatico',@levelTankBefore=100,@humidityBefore=30, @idTank=1, @idPlant=1,@idDevice= 1;
EXEC UpdateStateWaterPlantLog @id=1, @state='Completado',@levelTankAfter=90, @humidityAfter=50;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 45,@weatherData='{
  "Humidity": 60,
  "Temperature": 15,
  "PrecipitationChance": 60,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}', @idPlant = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 40,@weatherData='{
  "Humidity": 60,
  "Temperature": 15,
  "PrecipitationChance": 58,
  "Icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
}', @idPlant = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 38,@weatherData='{
  "Humidity": 66,
  "Temperature": 13,
  "PrecipitationChance": 55,
  "Icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
}'
, @idPlant = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 34,@weatherData='{
  "Humidity": 68,
  "Temperature": 13,
  "PrecipitationChance": 50,
  "Icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
}'
,@idPlant = 1,@idDevice= 1;

EXEC AddWaterPlantLog @type='Automatico',@levelTankBefore=90,@humidityBefore=34, @idTank=1, @idPlant=1,@idDevice= 1;
EXEC UpdateStateWaterPlantLog @id=2, @state='Completado',@levelTankAfter=82, @humidityAfter=50;
