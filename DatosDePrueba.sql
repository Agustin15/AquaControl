use AquaControl
--------------------------------------------------CropsTypes---------------------------------------------------------- 

EXEC AddCropType 'Planta','https://res.cloudinary.com/prw3eivq/image/upload/v1789077623/plant.png',40,70;

EXEC AddCropType 'Patata','https://res.cloudinary.com/prw3eivq/image/upload/v1789077621/potato.png',50,70;

EXEC AddCropType 'Trigo','https://res.cloudinary.com/prw3eivq/image/upload/v1789077618/wheat.png',35,65;

EXEC AddCropType 'Sandia','https://res.cloudinary.com/prw3eivq/image/upload/v1789077626/watermelon.png',45,70;

EXEC AddCropType 'Tomate','https://res.cloudinary.com/prw3eivq/image/upload/v1789077623/tomato.png',50,70;

EXEC AddCropType 'Remolacha','https://res.cloudinary.com/prw3eivq/image/upload/v1789077623/beet.png',50,70;

EXEC AddCropType 'Col','https://res.cloudinary.com/prw3eivq/image/upload/v1789077624/cabbage.png',50,75;

EXEC AddCropType 'Zanahoria','https://res.cloudinary.com/prw3eivq/image/upload/v1789077616/carrot.png',45,70;

EXEC AddCropType 'Maíz','https://res.cloudinary.com/prw3eivq/image/upload/v1789077617/corn.png',45,70;

EXEC AddCropType 'Pepino','https://res.cloudinary.com/prw3eivq/image/upload/v1789077764/cucumber.png',55,75;

EXEC AddCropType 'Berenjena','https://res.cloudinary.com/prw3eivq/image/upload/v1789077619/eggplant.png',50,70;

EXEC AddCropType 'Ajo','https://res.cloudinary.com/prw3eivq/image/upload/v1789077627/garlic.png',40,65;

EXEC AddCropType 'Jengibre','https://res.cloudinary.com/prw3eivq/image/upload/v1789077617/ginger.png',60,80;

EXEC AddCropType 'Puerro','https://res.cloudinary.com/prw3eivq/image/upload/v1789077625/leek.png',55,75;

EXEC AddCropType 'Lechuga','https://res.cloudinary.com/prw3eivq/image/upload/v1789077626/lettuce.png',55,75;

EXEC AddCropType 'Cebolla','https://res.cloudinary.com/prw3eivq/image/upload/v1789077622/onion.png',40,65;

EXEC AddCropType 'Pimiento','https://res.cloudinary.com/prw3eivq/image/upload/v1789077620/pepper.png',50,70;

EXEC AddCropType 'Calabaza','https://res.cloudinary.com/prw3eivq/image/upload/v1789077617/pumpkin.png',45,70;

EXEC AddCropType 'Arroz','https://res.cloudinary.com/prw3eivq/image/upload/v1789077615/rice.png',65,85;

EXEC AddCropType 'Romero','https://res.cloudinary.com/prw3eivq/image/upload/v1789077723/rosemary.png',30,50;

EXEC AddCropType 'Rosas','https://res.cloudinary.com/prw3eivq/image/upload/v1789077619/roses.png',45,65;

EXEC AddCropType 'Soja','https://res.cloudinary.com/prw3eivq/image/upload/v1789077615/soy.png',50,70;

EXEC AddCropType 'Fresa','https://res.cloudinary.com/prw3eivq/image/upload/v1789077622/strawberry.png',55,75;

EXEC AddCropType 'Caña de azúcar','https://res.cloudinary.com/prw3eivq/image/upload/v1789077615/sugarcane.png',60,80;

EXEC AddCropType 'Girasol','https://res.cloudinary.com/prw3eivq/image/upload/v1789077618/sunflower.png',40,65;

EXEC AddCropType 'Tulipán','https://res.cloudinary.com/prw3eivq/image/upload/v1789077616/tulip.png',40,60;

--------------------------------------------------Tanks---------------------------------------------------------- 
EXEC AddTank 1,1,30
--------------------------------------------------Plants---------------------------------------------------------- 

EXEC AddPlantation 1,1,'Sandia',45,70,0,6,null
--------------------------------------------------simulation day---------------------------------------------------------- 

EXEC AddHumidityPlantLog @percentege = 70,@weatherData='{
  "Humidity": 65,
  "Temperature": 15,
  "PrecipitationChance": 50,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}', @idPlantation = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 100, @idTank = 1,@idDevice= 1;

EXEC AddHumidityPlantLog @percentege = 65,@weatherData='{
  "Humidity": 60,
  "Temperature": 17,
  "PrecipitationChance": 50,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}',@idPlantation = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 100, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 58,@weatherData='{
  "Humidity": 57,
  "Temperature": 17,
  "PrecipitationChance": 45,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}',@idPlantation = 1,@idDevice= 1;

EXEC AddHumidityPlantLog @percentege = 44,@weatherData='{
  "Humidity": 50,
  "Temperature": 20,
  "PrecipitationChance": 45,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}',@idPlantation = 1,@idDevice= 1;


EXEC AddWaterPlantationLog @type='Automatico',@levelTankBefore=100,@humidityBefore=44, @idTank=1, @idPlantation=1,@idDevice= 1;
EXEC UpdateWaterPlantationLogFinished @id=1, @state='Completado',@levelTankAfter=90, @humidityAfter=70;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;

EXEC AddHumidityPlantLog @percentege = 67,@weatherData='{
  "Humidity": 60,
  "Temperature": 15,
  "PrecipitationChance": 60,
  "Icon": "//cdn.weatherapi.com/weather/64x64/night/122.png"
}', @idPlantation = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;

EXEC AddHumidityPlantLog @percentege = 60,@weatherData='{
  "Humidity": 60,
  "Temperature": 15,
  "PrecipitationChance": 58,
  "Icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
}', @idPlantation = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 57,@weatherData='{
  "Humidity": 66,
  "Temperature": 13,
  "PrecipitationChance": 55,
  "Icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
}'
, @idPlantation = 1,@idDevice= 1;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 50,@weatherData='{
  "Humidity": 68,
  "Temperature": 13,
  "PrecipitationChance": 50,
  "Icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
}'
,@idPlantation = 1,@idDevice= 1;


EXEC AddWaterPlantationLog @type='Automatico',@levelTankBefore=80,@humidityBefore=50, @idTank=1, @idPlantation=1,@idDevice= 1;
EXEC UpdateWaterPlantationLogFinished @id=2, @state='Completado',@levelTankAfter=84, @humidityAfter=70;

EXEC AddWaterTankLog @percentege = 86, @idTank = 1,@idDevice= 1;