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
location VARCHAR(25) CHECK(location NOT LIKE '%[^A-Z,]%' and location LIKE '%,%'),
created DATETIME NOT NULL DEFAULT GETDATE(),
idUser INT NOT NULL FOREIGN KEY REFERENCES Users(idUser) ON DELETE CASCADE,
)

CREATE TABLE Tanks(
id INT CHECK(id>0),
idDevice INT FOREIGN KEY REFERENCES Devices(idDevice) ON DELETE CASCADE,
height DECIMAL(4,1) NOT NULL CHECK(height>=15 and height<=800)
PRIMARY KEY(id,idDevice)
)

CREATE TABLE Plants(
id INT CHECK(id>0),
idDevice INT NOT NULL FOREIGN KEY REFERENCES Devices(idDevice) ON DELETE CASCADE,
umbralHumidity INT NOT NULL CHECK(umbralHumidity >=0 and umbralHumidity <=100),
indoor BIT NOT NULL DEFAULT 0,
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
weatherData NVARCHAR(300) NOT NULL,
idPlant INT NOT NULL,
idDevice INT NOT NULL,
FOREIGN KEY (idPlant,idDevice) REFERENCES Plants(id,idDevice) ON DELETE CASCADE,
)

CREATE TABLE WaterPlantLogs(
id INT IDENTITY(1,1) PRIMARY KEY,
datetimeStart DATETIME NOT NULL DEFAULT GETDATE(),
datetimeEnd DATETIME,
type VARCHAR(10) NOT NULL CHECK(type IN ('Automatico','Manual')),
state VARCHAR(15) NOT NULL CHECK(state IN ('Completado','Fallido','En curso','Interrumpido')),
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

CREATE TABLE UserDevicesTokens(
idUserDevice VARCHAR(16) PRIMARY KEY,
token NVARCHAR(300) UNIQUE,
idUser INT NOT NULL FOREIGN KEY (idUser) REFERENCES Users(idUser) ON DELETE CASCADE,
created DATETIME NOT NULL DEFAULT GETDATE(),
lastModified DATETIME
)


GO

CREATE TABLE Alerts(
id INT IDENTITY(1,1) PRIMARY KEY,
title VARCHAR(30) NOT NULL,
message VARCHAR(60) NOT NULL,
type VARCHAR(11) NOT NULL CHECK(type IN('Advertencia','Exito')),
datetimeAlert DATETIME NOT NULL DEFAULT GETDATE(),
seen BIT NOT NULL DEFAULT 0,
idDevice INT NOT NULL FOREIGN KEY (idDevice) REFERENCES Devices(idDevice) ON DELETE CASCADE,
)

GO


GO


CREATE OR ALTER  VIEW Entities AS
select idUser as code,username as entity,email as correspondence,password as entityKey,joined as created from Users;

GO

CREATE OR ALTER  VIEW Plaques AS
select idDevice as codePlaque, placeName as place,location as geography,created as inserted,idUser as codeEntity from Devices;

GO

CREATE OR ALTER  VIEW Bowls AS
select id as codeBowl,idDevice as idPlaque,height as limit from Tanks;
GO

CREATE OR ALTER  VIEW Lands AS
select id as codeLand,idDevice as idPlaque,umbralHumidity as limitHumidity,indoor as inside,image as capture,description as info from Plants;

GO

CREATE OR ALTER  VIEW LiquidBowlRecords AS
select id as codeLiquidBowl,percentege as measure,datetimeLog as moment,idTank as idBowl,idDevice as idPlaque from WaterTankLogs;
GO

CREATE OR ALTER VIEW HumidityLandRecords AS
select id as codeHumidityLand,percentege as measure,datetimeLog as moment,weatherData as ambientData,idPlant as idLand,idDevice as idPlaque from HumidityPlantLogs;
GO

CREATE OR ALTER VIEW PlantWateringRecords AS
select id as codeWaterPlant,
datetimeStart as momentStart,datetimeEnd as momentEnd,type as category,state as mood,levelTankBefore as prevMeasureBowl,
levelTankAfter as postMeasureBowl,humidityBefore as prevHumidity,humidityAfter as postHumidity,idTank as idBowl, 
idPlant as idLand,idDevice as idPlaque from WaterPlantLogs;
GO

CREATE OR ALTER VIEW Notifications AS
select id as code,title as heading,message as text,type as category,datetimeAlert as momentAlert,seen as observed,idDevice as idPlaque from Alerts;
GO

CREATE OR ALTER VIEW IdentificationUserDevices AS
select idUserDevice as code,idUser as codeEntity,token as mark,created as datetimeLog,lastModified as lastUpdated from UserDevicesTokens;
GO


-----1 Client Error 
-----2 Not found Error
-----3 Conflict Error 
-----4 Server Error 

------------------------------------------------------------Users--------------------------------------------------------------

CREATE OR ALTER PROCEDURE AddUser @username VARCHAR(15),@email VARCHAR(30),@password VARCHAR(60) AS
BEGIN

BEGIN TRY

INSERT INTO Users (username,email,password) VALUES(@username,@email,@password)

RETURN SCOPE_IDENTITY()

END TRY 
BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
RETURN
END CATCH

END

GO


CREATE OR ALTER PROCEDURE UpdateUser @idUser INT,@username VARCHAR(15),@email VARCHAR(30),@password VARCHAR(60) AS
BEGIN

BEGIN TRY

Update Users set username=@username,email=@email,password=@password where idUser=@idUser

END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
RETURN
END CATCH

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

------------------------------------------------------------Devices--------------------------------------------------------------
CREATE OR ALTER PROCEDURE AddDevice @placeName VARCHAR(15),@location VARCHAR(35),@idUser INT AS
BEGIN

BEGIN TRY 
INSERT INTO Devices(placeName,location,idUser) Values(@placeName,@location,@idUser)
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
RETURN
END CATCH

END 

GO

CREATE OR ALTER PROCEDURE UpdateDevice @placeName VARCHAR(15),@location VARCHAR(35),@idDevice INT AS
BEGIN

BEGIN TRY

UPDATE Devices set placeName=@placeName,location=@location where idDevice=@idDevice 
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

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


------------------------------------------------------------Tanks--------------------------------------------------------------
CREATE OR ALTER PROCEDURE AddTank @id INT,@idDevice INT,@height DECIMAL(4,1) AS
BEGIN

BEGIN TRY
INSERT INTO Tanks(id,idDevice,height) Values(@id,@idDevice,@height)
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

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

BEGIN TRY
UPDATE Tanks set height=@height where id=@id and idDevice=@idDevice
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

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


------------------------------------------------------------Plants--------------------------------------------------------------

CREATE OR ALTER PROCEDURE AddPlant @id INT, @idDevice INT,@umbralHumidity INT,@indoor BIT, @image VARBINARY(MAX)=null,@description VARCHAR(500)=null AS
BEGIN

BEGIN TRY
INSERT INTO Plants(id,idDevice,umbralHumidity,indoor,image,description) Values(@id,@idDevice,@umbralHumidity,@indoor,@image,@description)
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

END

GO

CREATE OR ALTER PROCEDURE UpdatePlant @id INT,@idDevice INT,@umbralHumidity INT,@indoor BIT,@image VARBINARY(MAX)=null,@description VARCHAR(500)=null AS
BEGIN

BEGIN TRY
Update Plants set umbralHumidity=@umbralHumidity,indoor=@indoor,image=@image,description=@description where id=@id and idDevice=@idDevice
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

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

------------------------------------------------------------WaterTankLogs----------------------------------------------------------

CREATE OR ALTER PROCEDURE AddWaterTankLog @percentege DECIMAL(4,1),@idTank INT,@idDevice INT AS
BEGIN

BEGIN TRY
INSERT INTO WaterTankLogs(percentege,idTank,idDevice) VALUES(@percentege,@idTank,@idDevice)
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

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

------------------------------------------------------------HumidityPlantLogs-------------------------------------------------------

CREATE OR ALTER PROCEDURE AddHumidityPlantLog @percentege INT,@weatherData NVARCHAR(300),@idPlant INT,@idDevice INT AS
BEGIN

BEGIN TRY
INSERT INTO HumidityPlantLogs(percentege,weatherData,idPlant,idDevice) VALUES(@percentege,@weatherData,@idPlant,@idDevice)
END TRY
BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

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


--------------------------------------------------------------WaterPlants-------------------------------------------------------------------


CREATE OR ALTER PROCEDURE AddWaterPlantLog @type VARCHAR(10),@levelTankBefore INT,@humidityBefore INT,@idTank INT,@idPlant INT,@idDevice INT AS
BEGIN

BEGIN TRY

INSERT INTO WaterPlantLogs(type,state,levelTankBefore,humidityBefore,idTank,idPlant,idDevice) 
VALUES(@type,'En curso',@levelTankBefore,@humidityBefore,@idTank,@idPlant,@idDevice)

return SCOPE_IDENTITY()

END TRY
BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

END

GO


CREATE OR ALTER PROCEDURE UpdateWaterPlantLogFinished @id INT,@state VARCHAR(15),@levelTankAfter DECIMAL(4,1),@humidityAfter INT AS 

BEGIN

BEGIN TRY
UPDATE WaterPlantLogs set datetimeEnd=GETDATE(),state=@state,levelTankAfter=@levelTankAfter,humidityAfter=@humidityAfter where id=@id
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

END

GO


CREATE OR ALTER PROCEDURE LastWaterPlantLog @idBowl INT,@idLand INT,@codePlaque INT AS
BEGIN

select TOP 1 * from PlantWateringRecords where momentEnd is not null and idBowl=@idBowl and idLand=@idLand and idPlaque=@codePlaque 
ORDER BY momentStart

END

GO

CREATE OR ALTER PROCEDURE AmountLogsWaterPlant @idBowl INT,@idLand INT,@codePlaque INT AS
BEGIN

select COUNT(*) as amount from PlantWateringRecords where momentEnd is not null and idBowl=@idBowl and idLand=@idLand and idPlaque=@codePlaque 

END

GO

CREATE OR ALTER PROCEDURE RecordWaterPlantOffset @idBowl INT,@idLand INT,@codePlaque INT,@offset INT AS
BEGIN

select * from PlantWateringRecords where  momentEnd is not null and idBowl=@idBowl and idLand=@idLand and idPlaque=@codePlaque 
ORDER BY momentStart OFFSET @offset ROWS FETCH NEXT 5 ROWS ONLY
END

GO


--------------------------------------------------------------Alerts-------------------------------------------------------------------

CREATE OR ALTER PROCEDURE AddAlert @title VARCHAR(30), @message VARCHAR(60),@type VARCHAR(11),@idDevice INT AS 
BEGIN

BEGIN TRY
INSERT INTO Alerts(title,message,type,idDevice) VALUES(@title,@message,@type,@idDevice)

RETURN SCOPE_IDENTITY();

END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

END

GO


CREATE OR ALTER PROCEDURE UpdateAlertState @id INT,@seen BIT AS 
BEGIN

BEGIN TRY
Update Alerts set seen=@seen where id=@id
END TRY

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

END

GO

CREATE OR ALTER PROCEDURE DeleteAlertById @id INT AS 
BEGIN

IF NOT EXISTS(select * from Alerts where id=@id)
BEGIN
RAISERROR('Alerta no encontrada',16,4)
RETURN
END

BEGIN TRY
DELETE Alerts where id=@id
END TRY

BEGIN CATCH
RAISERROR('Error al eliminar alerta',16,4)
END CATCH

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

------------------------------------------------------UserDevicesTokens------------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE AddUserDeviceToken @idUserDevice VARCHAR(16),@idUser INT,@token NVARCHAR(300) AS
BEGIN

BEGIN TRY

INSERT INTO UserDevicesTokens(idUserDevice,token,idUser) VALUES(@idUserDevice,@token,@idUser)

END TRY 

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

END

GO

CREATE OR ALTER PROCEDURE UpdateUserDeviceToken @idUserDevice VARCHAR(16),@idUser INT,@token NVARCHAR(300) AS
BEGIN

BEGIN TRY

UPDATE UserDevicesTokens set token=@token where idUserDevice=@idUserDevice

END TRY 

BEGIN CATCH
DECLARE @error NVARCHAR(500)=ERROR_MESSAGE()
RAISERROR(@error,16,4)
END CATCH

END

GO


CREATE OR ALTER PROCEDURE UserDeviceTokenById @code VARCHAR(16) AS 
BEGIN

select * from IdentificationUserDevices where code=@code
END

GO

CREATE OR ALTER PROCEDURE UserDevicesTokensByUser @codeEntity INT AS 
BEGIN

select * from IdentificationUserDevices where codeEntity=@codeEntity

END

GO

----------------------------------------------------------------------------TRIGGERS----------------------------------------------------------------------------

----------------------------------------------------User----------------------------------------------------------------
CREATE OR ALTER TRIGGER ValidAddUser ON Users INSTEAD OF INSERT AS
BEGIN

IF EXISTS(select * from Users where username=(select username from inserted))
BEGIN
RAISERROR('Nombre de usuario ya en uso',16,3)
RETURN
END 

IF((select email from inserted) NOT LIKE '%@%.%')
BEGIN
RAISERROR('Formato de correo incorrecto',16,3)
RETURN
END 

IF EXISTS(select * from Users where email=(select email from inserted))
BEGIN
RAISERROR('Correo ya en uso',16,3)
RETURN
END 

INSERT INTO Users(username,email,password) (select username,email,password from inserted)

END


GO

CREATE OR ALTER TRIGGER ValidUpdateUser ON Users INSTEAD OF UPDATE AS
BEGIN

DECLARE @idUser INT 
DECLARE @usernameInserted VARCHAR(15)
DECLARE @emailInserted VARCHAR(30)
DECLARE @passwordInserted VARCHAR(60)

select @emailInserted=email,@usernameInserted=username,@passwordInserted=password from inserted
select @idUser=idUser from deleted

IF (@emailInserted NOT LIKE '%@%.%')
BEGIN
RAISERROR('Formato de correo incorrecto',16,3)
RETURN
END 

IF NOT EXISTS(select * from Users where idUser=@idUser)
BEGIN
RAISERROR('Usuario no encontrado',16,2)
RETURN
END 

IF EXISTS(select * from Users where username=@usernameInserted and idUser!=@idUser)
BEGIN
RAISERROR('Nombre de usuario ya en uso',16,3)
RETURN
END 

IF EXISTS(select * from Users where email=@emailInserted and idUser!=@idUser)
BEGIN
RAISERROR('Correo ya en uso',16,3)
RETURN
END 

UPDATE Users set username=@usernameInserted,email=@emailInserted,password=@passwordInserted

END

GO
--------------------------------------------------------------------Device----------------------------------------------------------------
CREATE OR ALTER TRIGGER ValidAddDevice ON Devices INSTEAD OF INSERT AS
BEGIN

IF ((select location from inserted) LIKE '%[^A-Z,]%' OR (select location from inserted) NOT LIKE '%,%')
BEGIN
RAISERROR('Formato de ubicacion incorrecto',16,2)
RETURN
END 

IF NOT EXISTS(select * from Users where idUser=(select idUser from inserted))
BEGIN
RAISERROR('Usuario no encontrado',16,2)
RETURN
END 

IF EXISTS(select * from Devices where idUser=(select idUser from inserted) and placeName=(select placeName from inserted))
BEGIN
RAISERROR('Ya tiene un dispositivo de riego que tiene este nombre de lugar',16,2)
RETURN
END 

INSERT INTO Devices(idUser,location,placeName) (select idUser,location,placeName from inserted)

 IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al agregar dispositivo',16,4)
        RETURN
    END
END

GO

CREATE OR ALTER TRIGGER ValidUpdateDevice ON Devices INSTEAD OF UPDATE AS
BEGIN

IF ((select location from inserted) LIKE '%[^A-Z,]%' OR (select location from inserted) NOT LIKE '%,%')
BEGIN
RAISERROR('Formato de ubicacion incorrecto',16,2)
RETURN
END 

IF EXISTS(select * from Devices where idUser=(select idUser from deleted) and idDevice!=(select idDevice from deleted) and placeName=(select placeName from inserted))
BEGIN
RAISERROR('Ya tiene un dispositivo de riego que tiene este nombre de lugar',16,2)
RETURN
END 

UPDATE Devices set location=(select location from inserted),placeName=(select placeName from inserted) 
Where idDevice=(select idDevice from deleted)

 IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al actualizar dispositivo',16,4)
        RETURN
    END

END

GO

------------------------------------------------------------------Tank------------------------------------------------------------------

CREATE OR ALTER TRIGGER ValidAddTank ON Tanks INSTEAD OF INSERT AS
BEGIN

IF EXISTS(select * from Tanks)
BEGIN
RAISERROR('Solo puede haber un tanque',16,1)
RETURN
END

IF((select id from inserted)<=0)
BEGIN
RAISERROR('Numero de tanque debe ser mayor a cero',16,1)
RETURN
END

IF((select height from inserted)<15 OR (select height from inserted)>800)
BEGIN
RAISERROR('Altura del tanque debe estar entre 15 y 800 CM',16,1)
RETURN
END

IF NOT EXISTS(select * from Devices where idDevice=(select idDevice from inserted))
BEGIN
RAISERROR('Dispositivo no encontrado',16,2)
RETURN
END

IF EXISTS(select * from Tanks where id=(select id from inserted) and idDevice=(select idDevice from inserted))
BEGIN
RAISERROR('Ya existe un tanque con este numero en el dispositivo de riego',16,1)
RETURN
END

INSERT INTO Tanks(id,idDevice,height) (select id,idDevice,height from inserted)

END
GO

CREATE OR ALTER TRIGGER ValidUpdateTank ON Tanks INSTEAD OF UPDATE AS
BEGIN

IF((select height from inserted)<15 OR (select height from inserted)>800)
BEGIN
RAISERROR('Altura del tanque debe estar entre 15 y 800 CM',16,1)
RETURN
END

IF NOT EXISTS(select * from Tanks where idDevice=(select idDevice from deleted) and id=(select id from deleted))
BEGIN
RAISERROR('Tanque no encontrado',16,2)
RETURN
END

UPDATE Tanks set height=(select height from inserted) where id=(select id from deleted) and IdDevice=(select idDevice from deleted)

 IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al actualizar datos del tanque de agua',16,4)
        RETURN
    END
END

GO
-----------------------------------------------------------------Plants---------------------------------------------------------------
CREATE OR ALTER TRIGGER ValidAddPlant ON Plants INSTEAD OF INSERT AS
BEGIN

IF EXISTS(select * from Plants)
BEGIN
RAISERROR('Solo puede haber una planta',16,1)
RETURN
END

IF((select id from inserted)<=0)
BEGIN
RAISERROR('Numero de planta debe ser mayor a cero',16,1)
RETURN
END

IF((select umbralHumidity from inserted)<0 OR (select umbralHumidity from inserted)>100)
BEGIN
RAISERROR('Umbral de humedad debes estar entre o 100',16,1)
RETURN
END

IF NOT EXISTS(select * from Devices where idDevice=(select idDevice from inserted))
BEGIN
RAISERROR('Dispositivo no encontrado',16,2)
RETURN
END 

INSERT INTO Plants(id,umbralHumidity,indoor,image,description,idDevice) (select id,umbralHumidity,indoor,image,description,idDevice from inserted)

 IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al agregar planta',16,4)
        RETURN
    END

END

GO

CREATE OR ALTER TRIGGER ValidUpdatePlant ON Plants INSTEAD OF UPDATE AS 

BEGIN
IF((select umbralHumidity from inserted)<0 OR (select umbralHumidity from inserted)>100)
BEGIN
RAISERROR('Umbral de humedad debes estar entre o 100',16,1)
RETURN
END

IF NOT EXISTS(select * from Plants where id=(select id from deleted) and idDevice=(select idDevice from deleted))
BEGIN
RAISERROR('Planta no encontrada',16,2)
RETURN
END 

Update Plants set umbralHumidity=(select umbralHumidity from inserted),indoor=(select indoor from inserted),
image=(select image from inserted),description=(select description from inserted) where id=(select id from deleted) and 
idDevice=(select idDevice from deleted)

 IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al actualizar datos de la planta',16,4)
        RETURN
    END

END

GO
-------------------------------------------------------WaterTankLog------------------------------------------------------
CREATE OR ALTER TRIGGER ValidAddWaterTankLog
ON WaterTankLogs
INSTEAD OF INSERT
AS
BEGIN

    IF EXISTS(SELECT * FROM inserted WHERE percentege < 0 OR percentege > 100)
    BEGIN
        RAISERROR('Porcentaje debe estar entre 0 y 100',16,1)
        RETURN
    END

    IF NOT EXISTS(SELECT * FROM Tanks WHERE id=(select id from inserted) and idDevice=(select idDevice from inserted))
    BEGIN
        RAISERROR('Tanque no encontrado',16,2)
        RETURN
    END

    INSERT INTO WaterTankLogs(percentege, idTank, idDevice) SELECT percentege, idTank, idDevice FROM inserted

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al registrar el nivel del tanque de agua',16,4)
        RETURN
    END

END
GO

-------------------------------------------------------HumidityPlantLog------------------------------------------------------
CREATE OR ALTER TRIGGER ValidAddHumidityPlantLog
ON HumidityPlantLogs
INSTEAD OF INSERT
AS
BEGIN

    IF EXISTS (SELECT * FROM inserted WHERE percentege < 0 OR percentege > 100)
    BEGIN
        RAISERROR('Porcentaje debe estar entre 0 y 100',16,1)
        RETURN
    END

    IF NOT EXISTS(
        SELECT * FROM Plants
        WHERE id = (SELECT idPlant FROM inserted)
          AND idDevice = (SELECT idDevice FROM inserted)
    )
    BEGIN
        RAISERROR('Planta no encontrada',16,2)
        RETURN
    END

    INSERT INTO HumidityPlantLogs(percentege, weatherData, idPlant, idDevice)
    SELECT percentege, weatherData, idPlant, idDevice FROM inserted

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al registrar el nivel de humedad de la tierra',16,4)
        RETURN
    END
END
GO


-------------------------------------------------------WaterPlantLog------------------------------------------------------

CREATE OR ALTER TRIGGER ValidAddWaterPlantLog
ON WaterPlantLogs
INSTEAD OF INSERT
AS
BEGIN
  
    IF EXISTS(SELECT * FROM inserted WHERE type NOT IN ('Automatico','Manual'))
    BEGIN
        RAISERROR('Tipo debe ser Automatico o Manual',16,1)
        RETURN
    END

    IF EXISTS(SELECT * FROM inserted WHERE levelTankBefore < 0 OR levelTankBefore > 100)
    BEGIN
        RAISERROR('Nivel del tanque debe estar enter 0 y 100',16,2)
        RETURN
    END

    IF EXISTS(SELECT * FROM inserted WHERE humidityBefore < 0 OR humidityBefore > 100)
    BEGIN
        RAISERROR('Humedad debe estar enter 0 y 100',16,2)
        RETURN
    END

    IF NOT EXISTS(
        SELECT * FROM Tanks
        WHERE id = (SELECT idTank FROM inserted)
          AND idDevice = (SELECT idDevice FROM inserted)
    )
    BEGIN
        RAISERROR('Tanque no encontrado',16,2)
        RETURN
    END

    IF NOT EXISTS(
        SELECT * FROM Plants
        WHERE id = (SELECT idPlant FROM inserted)
          AND idDevice = (SELECT idDevice FROM inserted)
    )
    BEGIN
        RAISERROR('Planta no encontrado',16,2)
        RETURN
    END

    INSERT INTO WaterPlantLogs(type, state, levelTankBefore, humidityBefore, idTank, idPlant, idDevice)
    SELECT type, 'En curso', levelTankBefore, humidityBefore, idTank, idPlant, idDevice
    FROM inserted

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al registrar el riego',16,4)
        RETURN
    END
END
GO


CREATE OR ALTER TRIGGER ValidUpdateWaterPlantLogFinished
ON WaterPlantLogs
INSTEAD OF UPDATE
AS
BEGIN

    IF NOT EXISTS(
        SELECT * FROM WaterPlantLogs
        WHERE id = (SELECT id FROM deleted)
    )
    BEGIN
        RAISERROR('Registro de riego no encontrado',16,2)
        RETURN
    END

    IF EXISTS(
        SELECT * FROM inserted
        WHERE levelTankAfter < 0 OR levelTankAfter > 100
    )
    BEGIN
        RAISERROR('Nivel del tanque debe estar enter 0 y 100',16,2)
        RETURN
    END

    IF EXISTS(
        SELECT * FROM inserted
        WHERE humidityAfter < 0 OR humidityAfter > 100
    )
    BEGIN
        RAISERROR('Humedad debe estar enter 0 y 100',16,2)
        RETURN
    END

    IF EXISTS(
        SELECT * FROM inserted
        WHERE state NOT IN ('Completado','Fallido','En curso','Interrumpido')
    )
    BEGIN
        RAISERROR('Estado solo acepta los valores:Compleado - Fallido - Interrumpido - En curso',16,1)
        RETURN
    END

    UPDATE WaterPlantLogs
    SET
        datetimeEnd = GETDATE(),
        state = (SELECT state FROM inserted),
        levelTankAfter = (SELECT levelTankAfter FROM inserted),
        humidityAfter = (SELECT humidityAfter FROM inserted)
    WHERE id IN (SELECT id FROM deleted);

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al actualizar los datos del riego',16,4)
        RETURN
    END
END
GO

-------------------------------------------------------Alert-----------------------------------------------------------------
CREATE OR ALTER TRIGGER ValidAddAlert
ON Alerts
INSTEAD OF INSERT
AS
BEGIN

    IF NOT EXISTS (
        SELECT *
        FROM Devices where idDevice=(select idDevice from inserted))
    BEGIN
        RAISERROR('Dispositivo no encontrado',16,2)
        RETURN
    END

	  IF EXISTS(
        SELECT *
        FROM inserted where type NOT IN('Advertencia','Exito'))
    BEGIN
        RAISERROR('Tipo de alerta solo acepta los valores, Advertencia o Exito',16,2)
        RETURN
    END

    INSERT INTO Alerts(title,message,type, idDevice) SELECT title,message,type, idDevice FROM inserted

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al agregar alerta',16,4)
        RETURN
    END
END
GO

CREATE OR ALTER TRIGGER ValidUpdateAlertState
ON Alerts
INSTEAD OF UPDATE
AS
BEGIN
   
    IF NOT EXISTS (
        SELECT * FROM Alerts
        WHERE id = (SELECT id FROM deleted)
    )
    BEGIN
        RAISERROR('Alerta no encontrada',16,2)
        RETURN
    END

    UPDATE Alerts SET seen = (SELECT seen FROM inserted) WHERE id IN (SELECT id FROM deleted);

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al actualizar alerta',16,4)
        RETURN
    END
END
GO

------------------------------------------------------------UserDevicesToken-------------------------------------------------------------------
CREATE OR ALTER TRIGGER ValidAddUserDeviceToken ON UserDevicesTokens INSTEAD OF INSERT
AS
BEGIN

    IF NOT EXISTS (
        SELECT *
        FROM Users where idUser=(select idUser from inserted))
    BEGIN
        RAISERROR('Usuario no encontrado',16,2)
        RETURN
    END

    IF EXISTS (
        SELECT *
        FROM UserDevicesTokens where idUserDevice=(select idUserDevice from inserted))
    BEGIN
        RAISERROR('Este identificador de dipositivo de movil ya existe',16,2)
        RETURN
    END

	   IF EXISTS (
        SELECT *
        FROM UserDevicesTokens where token=(select token from inserted))
    BEGIN
        RAISERROR('Token ya existente',16,2)
        RETURN
    END

    INSERT INTO UserDevicesTokens(idUserDevice,token,idUser) SELECT idUserDevice,token,idUser FROM inserted

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al agregar token del movil del usuario',16,4)
        RETURN
    END
END
GO


CREATE OR ALTER TRIGGER ValidUpdateDeviceToken ON UserDevicesTokens INSTEAD OF UPDATE
AS
BEGIN

    IF NOT EXISTS (
        SELECT *
        FROM UserDevicesTokens where idUserDevice=(select idUserDevice from inserted))
    BEGIN
        RAISERROR('Registro de token con este identificador de dispositivo movil no encontrado',16,2)
        RETURN
    END

	   IF EXISTS (
        SELECT *
        FROM UserDevicesTokens where token=(select token from inserted))
    BEGIN
        RAISERROR('Token ya existente',16,2)
        RETURN
    END

    UPDATE UserDevicesTokens set token=(select token from inserted),lastModified=GETDATE() where idUserDevice=(select idUserDevice from deleted)

    IF (@@ERROR <> 0)
    BEGIN
        RAISERROR('Error inesperado al actualizar token del movil del usuario',16,4)
        RETURN
    END
END
GO
