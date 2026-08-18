CREATE DATABASE AquaControl; 

USE AquaControl

CREATE TABLE Users(
idUser INT IDENTITY(1,1) PRIMARY KEY,
username VARCHAR(15) NOT NULL UNIQUE,
email VARCHAR(30) NOT NULL UNIQUE CHECK(email LIKE '%@%.%'), 
password VARCHAR(60) NOT NULL,
joined DATETIME NOT NULL DEFAULT GETDATE()
)

CREATE TABLE Devices(
idDevice INT IDENTITY(1,1) PRIMARY KEY,
placeName VARCHAR(15) NOT NULL,
created DATETIME NOT NULL DEFAULT GETDATE(),
idUser INT NOT NULL FOREIGN KEY REFERENCES Users(idUser) ON DELETE CASCADE,
)


CREATE TABLE Tanks(
id INT CHECK(id>0),
idDevice INT FOREIGN KEY REFERENCES Devices(idDevice) ON DELETE CASCADE,
height DECIMAL(4,1) NOT NULL CHECK(height>0)
PRIMARY KEY(id,idDevice)
)

CREATE TABLE Plants(
id INT CHECK(id>0),
idDevice INT NOT NULL FOREIGN KEY REFERENCES Devices(idDevice) ON DELETE CASCADE,
umbralHumidity INT NOT NULL CHECK(umbralHumidity >=0 and umbralHumidity <=100),
image VARBINARY(MAX),
description VARCHAR(500),
PRIMARY KEY(id,idDevice)
)

CREATE TABLE WaterTankLogs(
id INT IDENTITY(1,1) PRIMARY KEY, 
percentege DECIMAL(4,1) NOT NULL CHECK(percentege>=0 and percentege<=100),
datetimeLog DATETIME NOT NULL DEFAULT GETDATE(),
idTank INT NOT NULL,
idDevice INT NOT NULL,
FOREIGN KEY (idTank,idDevice) REFERENCES Tanks(id,idDevice) ON DELETE CASCADE,
) 


CREATE TABLE HumidityPlantLogs(
id INT IDENTITY(1,1) PRIMARY KEY, 
percentege INT NOT NULL CHECK(percentege>=0 and percentege<=100),
datetimeLog  DATETIME NOT NULL DEFAULT GETDATE(),
idPlant INT NOT NULL,
idDevice INT NOT NULL,
FOREIGN KEY (idPlant,idDevice) REFERENCES Plants(id,idDevice) ON DELETE CASCADE,
)

CREATE TABLE WaterPlantLogs(
id INT IDENTITY(1,1) PRIMARY KEY,
datetimeStart DATETIME NOT NULL DEFAULT GETDATE(),
datetimeEnd DATETIME,
type VARCHAR(10) NOT NULL CHECK(type IN ('Automatico','Manual')),
state VARCHAR(15) NOT NULL CHECK(state IN ('Completado','Fallido','En curso')),
levelTankBefore DECIMAL(4,1) NOT NULL CHECK(levelTankBefore>=0 and levelTankBefore<=100),
levelTankAfter DECIMAL(4,1) CHECK(levelTankAfter>=0 and levelTankAfter<=100),
humidityBefore INT NOT NULL CHECK(humidityBefore>=0 and humidityBefore<=100),
humidityAfter INT CHECK(humidityAfter>=0 and humidityAfter<=100),
idTank INT NOT NULL,
idPlant INT NOT NULL,
idDevice INT NOT NULL,
FOREIGN KEY (idTank,idDevice) REFERENCES Tanks(id,idDevice) ON DELETE CASCADE,
FOREIGN KEY (idPlant,idDevice) REFERENCES Plants(id,idDevice)
)

GO

CREATE TABLE Alerts(
id INT IDENTITY(1,1) PRIMARY KEY,
message VARCHAR(45) NOT NULL,
datetimeAlert DATETIME NOT NULL DEFAULT GETDATE(),
state BIT NOT NULL,
idTank INT NOT NULL,
idDevice INT NOT NULL,
FOREIGN KEY (idTank,idDevice) REFERENCES Tanks(id,idDevice) ON DELETE CASCADE
)
 
GO

CREATE OR ALTER  VIEW Entities AS
select idUser as code,username as entity,email as correspondence,password as entityKey,joined as created from Users;

GO

CREATE OR ALTER  VIEW Plaques AS
select idDevice as codePlaque, placeName as place,created as inserted,idUser as codeEntity from Devices;

GO

CREATE OR ALTER  VIEW Bowls AS
select id as codeBowl,idDevice as idPlaque,height as limit from Tanks;
GO

CREATE OR ALTER  VIEW Lands AS
select id as codeLand,idDevice as idPlaque,umbralHumidity as limitHumidity,image as capture,description as info from Plants;

GO

CREATE OR ALTER  VIEW LiquidBowlRecords AS
select id as codeLiquidBowl,percentege as measure,datetimeLog as moment,idTank as idBowl,idDevice as idPlaque from WaterTankLogs;
GO

CREATE OR ALTER VIEW HumidityLandRecords AS
select id as codeHumidityLand,percentege as measure,datetimeLog as moment,idPlant as idLand,idDevice as idPlaque from HumidityPlantLogs;
GO

CREATE OR ALTER VIEW PlantWateringRecords AS
select id as codeWaterPlant,
datetimeStart as momentStart,datetimeEnd as momentEnd,type as category,state as mood,levelTankBefore as prevMeasureBowl,
levelTankAfter as postMeasureBowl,humidityBefore as prevHumidity,humidityAfter as postHumidity,idTank as idBowl, 
idPlant as idLand,idDevice as idPlaque from WaterPlantLogs;
GO

CREATE OR ALTER VIEW Notifications AS
select id as code,message as text,datetimeAlert as momentAlert,state as mood,idTank as idBowl,idDevice as idPlaque from Alerts;
GO


-----1 Client Error 
-----2 Not found Error
-----3 Conflict Error 
-----4 Server Error 

------------------------------------------------------------Usuario--------------------------------------------------------------

CREATE OR ALTER PROCEDURE AddUser @username VARCHAR(15),@email VARCHAR(30),@password VARCHAR(60) AS
BEGIN

IF EXISTS(select * from Users where username=@username)
BEGIN
RAISERROR('Nombre de usuario ya en uso',16,3)
RETURN
END 

IF (@email NOT LIKE '%@%.%')
BEGIN
RAISERROR('Formato de correo incorrecto',16,3)
RETURN
END 

IF EXISTS(select * from Users where email=@email)
BEGIN
RAISERROR('Correo ya en uso',16,3)
RETURN
END 

BEGIN TRY

INSERT INTO Users(username,email,password) Values(@username,@email,@password)

RETURN SCOPE_IDENTITY()

END TRY 
BEGIN CATCH
BEGIN
RAISERROR('Error inesperado al crear cuenta',16,4)
RETURN
END
END CATCH

END

GO


CREATE OR ALTER PROCEDURE UpdateUsername @idUser INT,@username VARCHAR(15) AS
BEGIN

IF NOT EXISTS(select * from Users where idUser=@idUser)
BEGIN
RAISERROR('Usuario no encontrado',16,2)
RETURN
END 

IF EXISTS(select * from Users where username=@username and idUser=@idUser)
BEGIN
RAISERROR('Nombre de usuario ya en uso',16,3)
RETURN
END 

Update Users set username=@username where idUser=@idUser
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar nombre de usuario',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE UpdatePasswordUser @idUser INT,@password VARCHAR(60) AS
BEGIN

IF NOT EXISTS(select * from Users where idUser=@idUser)
BEGIN
RAISERROR('Usuario no encontrado',16,2)
RETURN
END 

Update Users set password=@password where idUser=@idUser
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar contraseña',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE UserByUsername @username VARCHAR(15) AS
BEGIN

select * from Entities where entity=@username
END 

GO

CREATE OR ALTER PROCEDURE UserByEmail @email VARCHAR(30) AS
BEGIN

select code,entity,correspondence,created from Entities where correspondence=@email
END 

GO

CREATE OR ALTER PROCEDURE UserById @idUser INT AS
BEGIN

select code,entity,correspondence,created from Entities where code=@idUser
END 

GO

CREATE OR ALTER PROCEDURE AllUsers @idUser INT AS
BEGIN

select code,entity,correspondence,created from Entities;

END 


GO

------------------------------------------------------------Dispositivo--------------------------------------------------------------
CREATE OR ALTER PROCEDURE AddDevice @placeName VARCHAR(15),@idUser INT AS
BEGIN

IF NOT EXISTS(select * from Users where idUser=@idUser)
BEGIN
RAISERROR('Usuario no encontrado',16,2)
RETURN
END 

IF EXISTS(select * from Devices where idUser=@idUser and placeName=@placeName)
BEGIN
RAISERROR('Ya tiene un dispositivo de riego que tiene este nombre de lugar',16,2)
RETURN
END 

INSERT INTO Devices(placeName,idUser) Values(@placeName,@idUser)
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al registrar dispositivo',16,4)
RETURN
END 

END 

GO

CREATE OR ALTER PROCEDURE UpdatePlaceNameDevice @placeName VARCHAR(15),@idUser INT,@idDevice INT AS
BEGIN

IF NOT EXISTS(select * from Devices where idDevice=idDevice)
BEGIN
RAISERROR('Dispositivo no encontrado',16,2)
RETURN
END 

IF EXISTS(select * from Devices where idUser=@idUser and placeName=@placeName and idDevice!=@idDevice)
BEGIN
RAISERROR('Ya tiene un dispositivo de riego que tiene este nombre de lugar',16,2)
RETURN
END 

UPDATE Devices set placeName=@placeName where idDevice=@idDevice 

IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar nombre del dispositivo',16,4)
RETURN
END 

END 

GO

CREATE OR ALTER PROCEDURE DeleteDevice @idDevice INT AS
BEGIN


IF NOT EXISTS(select * from Devices where idDevice=@idDevice)
BEGIN
RAISERROR('Dispositivo no encontrado',16,2)
RETURN
END 

Delete from Devices where idDevice=@idDevice

IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar dispositivo',16,4)
RETURN
END 


END 

GO

CREATE OR ALTER PROCEDURE AllDevicesByUser @codeEntity INT AS
BEGIN

select * from Plaques where codeEntity=@codeEntity

END 

GO


CREATE OR ALTER PROCEDURE DeviceById @code INT AS
BEGIN

select * from Plaques where codePlaque=@code

END 

GO


------------------------------------------------------------Tanque--------------------------------------------------------------
CREATE OR ALTER PROCEDURE AddTank @id INT,@idDevice INT,@height DECIMAL(4,1) AS
BEGIN

IF(@id<=0)
BEGIN
RAISERROR('Numero de tanque debe ser mayor a cero',16,1)
RETURN
END


IF(@height<=0)
BEGIN
RAISERROR('Altura del tanque debe ser mayor a cero',16,1)
RETURN
END

IF NOT EXISTS(select * from Devices where idDevice=@idDevice)
BEGIN
RAISERROR('Dispositivo no encontrado',16,2)
RETURN
END

IF EXISTS(select * from Tanks where @id=id and idDevice=@idDevice)
BEGIN
RAISERROR('Ya existe un tanque con este numero en el dispositivo de riego',16,1)
RETURN
END


INSERT INTO Tanks(id,idDevice,height) Values(@id,@idDevice,@height)

IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar tanque de agua',16,4)
RETURN
END 

END

GO


CREATE OR ALTER PROCEDURE DeleteTank @id INT, @idDevice INT AS
BEGIN

IF NOT EXISTS(select * from Tanks where id=@id)
BEGIN
RAISERROR('Tanque no encontrado',16,2)
RETURN
END 

DELETE FROM Tanks where id=@id and idDevice=@idDevice

IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar tanque de agua',16,4)
RETURN
END 

END

GO


CREATE OR ALTER PROCEDURE UpdateTank @id INT,@idDevice INT, @height DECIMAL(4,1) AS
BEGIN

IF NOT EXISTS(select * from Tanks where id=@id and idDevice=@idDevice)
BEGIN
RAISERROR('Tanque no encontrado',16,2)
RETURN
END 

IF(@height<=0)
BEGIN
RAISERROR('Altura del tanque debe ser mayor a cero',16,1)
RETURN
END

UPDATE Tanks set height=@height where id=@id and idDevice=@idDevice
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar tanque de agua',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE AllTanksByDevice @codePlaque INT AS 
BEGIN

select * from Bowls where idPlaque=@codePlaque;

END

GO


CREATE OR ALTER PROCEDURE TankByIdAndDevice @code INT,@codePlaque INT AS 
BEGIN
select * from Bowls where codeBowl=@code and idPlaque=@codePlaque;
END

GO


------------------------------------------------------------Planta--------------------------------------------------------------

CREATE OR ALTER PROCEDURE AddPlant @id INT, @idDevice INT,@umbralHumidity INT, @image VARBINARY(MAX)=NULL,@description VARCHAR(500)=NULL AS
BEGIN

IF(@id<=0)
BEGIN
RAISERROR('Numero de planta debe ser mayor a cero',16,1)
RETURN
END

IF(@umbralHumidity<0 OR @umbralHumidity>100)
BEGIN
RAISERROR('Umbral de humedad debes estar entre o 100',16,1)
RETURN
END

IF NOT EXISTS(select * from Devices where idDevice=@idDevice)
BEGIN
RAISERROR('Dispositivo no encontrado',16,2)
RETURN
END 

INSERT INTO Plants(id,umbralHumidity,image,description,idDevice) VALUES(@id,@umbralHumidity,@image,@description,@idDevice)

IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar planta',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE UpdatePlant @id INT,@idDevice INT,@umbralHumidity INT,@image VARBINARY(MAX)=NULL,@description VARCHAR(500)=NULL AS
BEGIN

IF(@umbralHumidity<0 OR @umbralHumidity>100)
BEGIN
RAISERROR('Umbral de humedad debes estar entre o 100',16,1)
RETURN
END

IF NOT EXISTS(select * from Plants where id=@id and idDevice=@idDevice)
BEGIN
RAISERROR('Planta no encontrada',16,2)
RETURN
END 

Update Plants set umbralHumidity=@umbralHumidity, image=@image,description=@description where id=@id and idDevice=@idDevice
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar datos de la planta',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE DeletePlant @id INT,@idDevice INT AS
BEGIN

IF NOT EXISTS(select * from Plants where id=@id and idDevice=@idDevice)
BEGIN
RAISERROR('Planta no encontrada',16,2)
RETURN
END 

DELETE from Plants where id=@id and idDevice=@idDevice

IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al eliminar planta',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE AllPlantsByDevice @codePlaque INT AS 
BEGIN
select * from Lands where idPlaque=@codePlaque;
END

GO


CREATE OR ALTER PROCEDURE PlantByIdAndDevice @code INT,@codePlaque INT AS 
BEGIN
select * from Lands where codeLand=@code and idPlaque=@codePlaque;
END

GO

------------------------------------------------------------Registro nivel del tanque----------------------------------------------------------

CREATE OR ALTER PROCEDURE AddWaterTankLog @percentege DECIMAL(4,1),@idTank INT,@idDevice INT AS
BEGIN

IF (@percentege<0 OR @percentege>100)
BEGIN
RAISERROR('Porcentaje debe estar entre 0 y 100',16,1)
RETURN
END

IF NOT EXISTS(select * from Tanks where id=@idTank and idDevice=@idDevice)
BEGIN
RAISERROR('Tanque no encontrado',16,2)
RETURN
END

INSERT INTO WaterTankLogs(percentege,idTank,idDevice) VALUES(@percentege,@idTank,@idDevice)
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al registrar el nivel del tanque de agua',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE WaterTankLogsWithIrrigateCausativeLastWeek @idBowl INT,@codePlaque INT AS
BEGIN

DECLARE @dateStartWeek DATETIME 
DECLARE @dateEndWeek DATETIME 

select @dateStartWeek= DATEADD (weekday,-(DATEPART(WEEKDAY,GETDATE())-1), GETDATE())
select @dateEndWeek= DATEADD (weekday,7-DATEPART(WEEKDAY,GETDATE()), GETDATE())

select * from LiquidBowlRecords L 
OUTER APPLY (select TOP 1 * from PlantWateringRecords P where P.idBowl=L.idBowl and P.idPlaque=L.idPlaque and 
P.momentStart<L.moment and P.postMeasureBowl=L.measure ORDER BY P.momentStart DESC) A 
where L.idBowl=@idBowl and L.idPlaque=@codePlaque and CAST(L.moment AS DATE)>=CAST(@dateStartWeek AS DATE) and CAST(L.moment AS DATE)<=CAST(@dateEndWeek AS DATE)

END

GO

------------------------------------------------------------Nivel de humedad de la tierra-------------------------------------------------------

CREATE OR ALTER PROCEDURE AddHumidityPlantLog @percentege INT,@idPlant INT,@idDevice INT AS
BEGIN

IF (@percentege<0 OR @percentege>100)
BEGIN
RAISERROR('Porcentaje debe estar entre 0 y 100',16,1)
RETURN
END


IF NOT EXISTS(select * from Plants where id=@idPlant and idDevice=@idDevice)
BEGIN
RAISERROR('Planta no encontrada',16,2)
RETURN
END


INSERT INTO HumidityPlantLogs(percentege,idPlant,idDevice) VALUES(@percentege,@idPlant,@idDevice)
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al registrar el nivel de humedad de la tierra',16,4)
RETURN
END 

END

GO

CREATE OR ALTER PROCEDURE HumidityPlantLogsLastWeek @idLand INT,@codePlaque INT AS
BEGIN

DECLARE @dateStartWeek DATETIME 
DECLARE @dateEndWeek DATETIME 

select @dateStartWeek= DATEADD (weekday,-(DATEPART(WEEKDAY,GETDATE())-1), GETDATE())
select @dateEndWeek= DATEADD (weekday,7-DATEPART(WEEKDAY,GETDATE()), GETDATE())

select * from HumidityLandRecords where idLand=@idLand and idPlaque=@codePlaque and 
CAST(moment AS DATE)>=CAST(@dateStartWeek AS DATE) and CAST(moment AS DATE)<=CAST(@dateEndWeek AS DATE)
END

GO


--------------------------------------------------------------Riego-------------------------------------------------------------------


CREATE OR ALTER PROCEDURE AddWaterPlantLog @type VARCHAR(10),@levelTankBefore INT,@humidityBefore INT,@idTank INT,@idPlant INT,@idDevice INT AS
BEGIN

IF (@type NOT IN ('Automatico','Manual'))
BEGIN
RAISERROR('Tipo debe ser Automatico o Manual',16,1)
RETURN
END

IF(@levelTankBefore<0 OR @levelTankBefore>100)
BEGIN
RAISERROR('Nivel del tanque debe estar enter 0 y 100',16,2)
RETURN
END 

IF(@humidityBefore<0 OR @humidityBefore>100)
BEGIN
RAISERROR('Humedad debe estar enter 0 y 100',16,2)
RETURN
END 


IF NOT EXISTS(select * from Tanks where id=@idTank and idDevice=@idDevice)
BEGIN
RAISERROR('Tanque no encontrado',16,2)
RETURN
END

IF NOT EXISTS(select * from Plants where id=@idPlant and idDevice=@idDevice)
BEGIN
RAISERROR('Planta no encontrado',16,2)
RETURN
END

BEGIN TRY
INSERT INTO WaterPlantLogs(type,state,levelTankBefore,humidityBefore,idTank,idPlant,idDevice) 
VALUES(@type,'En curso',@levelTankBefore,@humidityBefore,@idTank,@idPlant,@idDevice)

return SCOPE_IDENTITY()

END TRY
BEGIN CATCH
BEGIN
RAISERROR('Error inesperado al registrar el riego',16,4)
RETURN
END 
END CATCH

END

GO


CREATE OR ALTER PROCEDURE UpdateStateWaterPlantLog @id INT,@state VARCHAR(15),@levelTankAfter DECIMAL(4,1),@humidityAfter INT AS 

BEGIN

IF NOT EXISTS(select * from WaterPlantLogs where id=@id)
BEGIN
RAISERROR('Registro de riego no encontrado',16,2)
RETURN
END


IF(@levelTankAfter<0 OR @levelTankAfter>100)
BEGIN
RAISERROR('Nivel del tanque debe estar enter 0 y 100',16,2)
RETURN
END 


IF(@humidityAfter<0 OR @humidityAfter>100)
BEGIN
RAISERROR('Humedad debe estar enter 0 y 100',16,2)
RETURN
END 


IF (@state NOT IN ('Completado','Fallido','En curso'))
BEGIN
RAISERROR('Estado solo acepta los valores compleado,fallido o en curso ',16,1)
RETURN
END


UPDATE WaterPlantLogs set datetimeEnd=GETDATE(),state=@state,levelTankAfter=@levelTankAfter,humidityAfter=@humidityAfter where id=@id

IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar los datos del riego',16,4)
RETURN
END 

END

GO


CREATE OR ALTER PROCEDURE LastWaterPlantLog @idBowl INT,@idLand INT,@codePlaque INT AS
BEGIN

select TOP 1 * from PlantWateringRecords where idBowl=@idBowl and idLand=@idLand and idPlaque=@codePlaque 
ORDER BY momentStart

END

GO

CREATE OR ALTER PROCEDURE AmountLogsWaterPlant @idBowl INT,@idLand INT,@codePlaque INT AS
BEGIN

select COUNT(*) as amount from PlantWateringRecords where idBowl=@idBowl and idLand=@idLand and idPlaque=@codePlaque 

END

GO

CREATE OR ALTER PROCEDURE RecordWaterPlantOffset @idBowl INT,@idLand INT,@codePlaque INT,@offset INT AS
BEGIN

select * from PlantWateringRecords where idBowl=@idBowl and idLand=@idLand and idPlaque=@codePlaque 
ORDER BY momentStart OFFSET @offset ROWS FETCH NEXT 5 ROWS ONLY
END

GO


--------------------------------------------------------------Alerta-------------------------------------------------------------------

CREATE OR ALTER PROCEDURE AddAlert @message VARCHAR(200),@state BIT,@idTank INT,@idDevice INT AS 
BEGIN

IF NOT EXISTS(select * from Tanks where id=@idTank and idDevice=@idDevice)
BEGIN
RAISERROR('Tanque no encontrado',16,2)
RETURN
END 

INSERT INTO Alerts(message,state,idTank,idDevice) VALUES(@message,@state,@idTank,@idDevice)
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al agregar alerta',16,4)
RETURN
END 
END

GO


CREATE OR ALTER PROCEDURE UpdateAlertState @id INT,@state BIT AS 
BEGIN

IF NOT EXISTS(select * from Alerts where id=@id)
BEGIN
RAISERROR('Alerta no encontrada',16,2)
RETURN
END 

INSERT INTO Alerts(state) VALUES(@state)
IF (@@ERROR<>0)
BEGIN
RAISERROR('Error inesperado al actualizar alerta',16,4)
RETURN
END 

END

GO


CREATE OR ALTER PROCEDURE AmountAlerts @codePlaque INT AS 
BEGIN

select COUNT(*) as amount from Notifications where idPlaque=@codePlaque;

END

GO

CREATE OR ALTER PROCEDURE AlertsOffset @offset INT,@codePlaque INT AS 
BEGIN

select * from Notifications where idPlaque=@codePlaque ORDER BY momentAlert DESC OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY;
   
END
GO

--------------------------------------------------Datos de prueba---------------------------------------------------------- 

--------------------------------------------------Tanks---------------------------------------------------------- 
EXEC AddTank 1,1,30
--------------------------------------------------Plants---------------------------------------------------------- 
EXEC AddPlant 1,1,50,
    @image = NULL,
    @description = 'Planta de albahaca cultivada en maceta, requiere riego moderado y buena exposición al sol.';

--------------------------------------------------simulation day---------------------------------------------------------- 


EXEC AddHumidityPlantLog @percentege = 50, @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 100, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 40,  @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 100, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 30,  @idPlant = 1,@idDevice= 1;

EXEC AddWaterPlantLog @type='Automatico',@levelTankBefore=100,@humidityBefore=30, @idTank=1, @idPlant=1,@idDevice= 1;
EXEC UpdateStateWaterPlantLog @id=1, @state='Completado',@levelTankAfter=90, @humidityAfter=50;

EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 45,  @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 40,  @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 38,  @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 90, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 30,  @idPlant = 1,@idDevice= 1;

EXEC AddWaterPlantLog @type='Automatico',@levelTankBefore=90,@humidityBefore=30, @idTank=1, @idPlant=1,@idDevice= 1;
EXEC UpdateStateWaterPlantLog @id=2, @state='Completado',@levelTankAfter=82, @humidityAfter=50;

EXEC AddWaterTankLog @percentege = 82, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 50,  @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 82, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 42,  @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 82, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 40,  @idPlant = 1,@idDevice= 1;
EXEC AddWaterTankLog @percentege = 82, @idTank = 1,@idDevice= 1;
EXEC AddHumidityPlantLog @percentege = 40,  @idPlant = 1,@idDevice= 1;

EXEC AddWaterPlantLog @type='Automatico',@levelTankBefore=82,@humidityBefore=40, @idTank=1, @idPlant=1,@idDevice= 1;

EXEC UpdateStateWaterPlantLog @id=3, @state='Completado',@levelTankAfter=76, @humidityAfter=50;

