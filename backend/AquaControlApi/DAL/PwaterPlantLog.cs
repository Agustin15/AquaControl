using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace DAL
{
    public class PwaterPlantLog
    {
        public async Task<int> Add(WaterPlantLog waterPlantLog)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {
                SqlCommand command = new SqlCommand("AddWaterPlantLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@type", waterPlantLog.Type);
                command.Parameters.AddWithValue("@levelTankBefore", waterPlantLog.LevelTankBefore);
                command.Parameters.AddWithValue("@humidityBefore", waterPlantLog.HumidityBefore);
                command.Parameters.AddWithValue("@idTank", waterPlantLog.Tank.Id);
                command.Parameters.AddWithValue("@idPlant", waterPlantLog.Plant.Id);
                command.Parameters.AddWithValue("@idDevice", waterPlantLog.Plant.Device.Id);
                SqlParameter parameterIdGenerated = new SqlParameter();
                parameterIdGenerated.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(parameterIdGenerated);

                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                return (int)parameterIdGenerated.Value;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            finally
            {
                await connection.CloseAsync();
            }
        }
        public async Task UpdateWaterPlantLogFinished(WaterPlantLog waterPlantLog)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("UpdateWaterPlantLogFinished", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", waterPlantLog.Id);
                command.Parameters.AddWithValue("@state", waterPlantLog.State);
                command.Parameters.AddWithValue("@levelTankAfter", waterPlantLog.LevelTankAfter);
                command.Parameters.AddWithValue("@humidityAfter", waterPlantLog.HumidityAfter);

                await connection.OpenAsync();

                await command.ExecuteNonQueryAsync();


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            finally
            {
                await connection.CloseAsync();
            }
        }

        public async Task<WaterPlantLog> GetLastWaterPlantLog(int idPlant, int idTank, int idDevice)
        {

            WaterPlantLog waterPlantLog = null;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("LastWaterPlantLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idLand", idPlant);
                command.Parameters.AddWithValue("@idBowl", idTank);
                command.Parameters.AddWithValue("@codePlaque ", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    List<Tank> tanks = await new Ptank().GetAllTanksByDevice(idDevice);
                    Tank tankFound = tanks.Find(tank => tank.Id == idTank);

                    List<Plant> plants = await new Pplant().GetAllPlantsByDevice(idDevice);
                    Plant plantFound = plants.Find(plant => plant.Id == idPlant);

                    await reader.ReadAsync();

                    waterPlantLog = new WaterPlantLog(Convert.ToInt16(reader["codeWaterPlant"]), tankFound, plantFound,
                          Convert.ToDateTime(reader["momentStart"]), Convert.ToDateTime(reader["momentEnd"]),
                            Convert.ToString(reader["category"]), Convert.ToString(reader["mood"]),
                            Convert.ToDouble(reader["prevMeasureBowl"]), Convert.ToDouble(reader["postMeasureBowl"]),
                            Convert.ToInt16(reader["prevHumidity"]), Convert.ToInt16(reader["postHumidity"]));

                }

                await reader.CloseAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            finally
            {
                await connection.CloseAsync();
            }

            return waterPlantLog;
        }


        public async Task<int> GetAmountWaterPlantLogs(int idTank, int idPlant, int idDevice)
        {

            int amount = 0;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AmountLogsWaterPlant", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idBowl ", idTank);
                command.Parameters.AddWithValue("@idLand ", idPlant);
                command.Parameters.AddWithValue("@codePlaque ", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    await reader.ReadAsync();
                    amount = Convert.ToInt16(reader["amount"]);
                }

                await reader.CloseAsync();

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }

            return amount;


        }
        public async Task<List<WaterPlantLog>> GetWaterPlantLogsOffset(int idTank, int idPlant, int idDevice, int offset)
        {

            List<WaterPlantLog> waterPlantLogs = new List<WaterPlantLog>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("RecordWaterPlantOffset", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idBowl ", idTank);
                command.Parameters.AddWithValue("@idLand ", idPlant);
                command.Parameters.AddWithValue("@codePlaque ", idDevice);
                command.Parameters.AddWithValue("@offset", offset);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    List<Tank> tanks = await new Ptank().GetAllTanksByDevice(idDevice);
                    Tank tankFound = tanks.Find(tank => tank.Id == idTank);

                    List<Plant> plants = await new Pplant().GetAllPlantsByDevice(idDevice);
                    Plant plantFound = plants.Find(plant => plant.Id == idPlant);


                    while (await reader.ReadAsync())
                    {

                        WaterPlantLog waterPlantLog = new WaterPlantLog(Convert.ToInt16(reader["codeWaterPlant"]), tankFound, plantFound,
                            Convert.ToDateTime(reader["momentStart"]), Convert.ToDateTime(reader["momentEnd"]),
                              Convert.ToString(reader["category"]), Convert.ToString(reader["mood"]),
                              Convert.ToDouble(reader["prevMeasureBowl"]), Convert.ToDouble(reader["postMeasureBowl"]),
                              Convert.ToInt16(reader["prevHumidity"]), Convert.ToInt16(reader["postHumidity"]));

                        waterPlantLogs.Add(waterPlantLog);

                    }

                }
                await reader.CloseAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            finally
            {
                await connection.CloseAsync();
            }

            return waterPlantLogs;
        }
    }

}
