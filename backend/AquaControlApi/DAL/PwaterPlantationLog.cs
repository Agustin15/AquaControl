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
    public class PwaterPlantationLog
    {
        public async Task<int> Add(WaterPlantationLog waterPlantationLog)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {
                SqlCommand command = new SqlCommand("AddWaterPlantationLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@type", waterPlantationLog.Type);
                command.Parameters.AddWithValue("@levelTankBefore", waterPlantationLog.LevelTankBefore);
                command.Parameters.AddWithValue("@humidityBefore", waterPlantationLog.HumidityBefore);
                command.Parameters.AddWithValue("@idTank", waterPlantationLog.Tank.Id);
                command.Parameters.AddWithValue("@idPlant", waterPlantationLog.Plantation.Id);
                command.Parameters.AddWithValue("@idDevice", waterPlantationLog.Plantation.Device.Id);
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
        public async Task UpdateWaterPlantationLogFinished(WaterPlantationLog waterPlantationLog)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("UpdateWaterPlantationLogFinished", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", waterPlantationLog.Id);
                command.Parameters.AddWithValue("@state", waterPlantationLog.State);
                command.Parameters.AddWithValue("@levelTankAfter", waterPlantationLog.LevelTankAfter);
                command.Parameters.AddWithValue("@humidityAfter", waterPlantationLog.HumidityAfter);

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

        public async Task<WaterPlantationLog> GetLastWaterPlantationLog(int idPlantation, int idTank, int idDevice)
        {

            WaterPlantationLog waterPlantationLog = null;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("LastWaterPlantationLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idLand", idPlantation);
                command.Parameters.AddWithValue("@idBowl", idTank);
                command.Parameters.AddWithValue("@codePlaque ", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    List<Tank> tanks = await new Ptank().GetAllTanksByDevice(idDevice);
                    Tank tankFound = tanks.Find(tank => tank.Id == idTank);

                    List<Plantation> plants = await new Pplantation().GetAllPlantationsByDevice(idDevice);
                    Plantation plantationFound = plants.Find(plant => plant.Id == idPlantation);

                    if (await reader.ReadAsync())
                    {

                        waterPlantationLog = new WaterPlantationLog(Convert.ToInt32(reader["codeWaterPlant"]),
                            Convert.ToString(reader["category"]), Convert.ToString(reader["mood"]),
                            Convert.ToDouble(reader["prevMeasureBowl"]), Convert.ToDouble(reader["postMeasureBowl"]),
                            Convert.ToInt32(reader["prevHumidity"]), Convert.ToInt32(reader["postHumidity"]),
                            tankFound, plantationFound, Convert.ToDateTime(reader["momentStart"]), Convert.ToDateTime(reader["momentEnd"]));
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

            return waterPlantationLog;
        }


        internal async Task<WaterPlantationLog> GetWaterPlantationLogMostNearylToWaterTank(int idTank,
            int idDevice, DateTime waterTankLogDatetime, double levelTank)
        {

            WaterPlantationLog waterPlantationLog = null;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("WaterPlantationMostNearlyToWaterTank", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idBowl", idTank);
                command.Parameters.AddWithValue("@codePlaque", idDevice);
                command.Parameters.AddWithValue("@measureBowl ", levelTank);
                command.Parameters.AddWithValue("@momentWaterTank", waterTankLogDatetime);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    List<Tank> tanks = await new Ptank().GetAllTanksByDevice(idDevice);
                    Tank tankFound = tanks.Find(tank => tank.Id == idTank);

                    List<Plantation> plantations = await new Pplantation().GetAllPlantationsByDevice(idDevice);

                    if (await reader.ReadAsync())
                    {
                        Plantation plantationFound = plantations.Find(plant => plant.Id == Convert.ToInt32(reader["idLand"]));

                        waterPlantationLog = new WaterPlantationLog(Convert.ToInt32(reader["codeWaterPlant"]),
                                Convert.ToString(reader["category"]), Convert.ToString(reader["mood"]),
                                Convert.ToDouble(reader["prevMeasureBowl"]), Convert.ToDouble(reader["postMeasureBowl"]),
                                Convert.ToInt32(reader["prevHumidity"]), Convert.ToInt32(reader["postHumidity"]),
                                tankFound, plantationFound, Convert.ToDateTime(reader["momentStart"]), Convert.ToDateTime(reader["momentEnd"]));
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

            return waterPlantationLog;
        }


        public async Task<int> GetAmountWaterPlantationLogs(int idTank, int idPlantation, int idDevice)
        {

            int amount = 0;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AmountLogsWaterPlantation", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idBowl ", idTank);
                command.Parameters.AddWithValue("@idLand ", idPlantation);
                command.Parameters.AddWithValue("@codePlaque ", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    if (await reader.ReadAsync())
                        amount = Convert.ToInt32(reader["amount"]);
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
        public async Task<List<WaterPlantationLog>> GetWaterPlantationLogsOffset(int idTank, int idPlant, int idDevice, int offset)
        {

            List<WaterPlantationLog> waterPlantLogs = new List<WaterPlantationLog>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("RecordWaterPlantationOffset", connection);
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

                    List<Plantation> plants = await new Pplantation().GetAllPlantationsByDevice(idDevice);
                    Plantation plantationFound = plants.Find(plant => plant.Id == idPlant);


                    while (await reader.ReadAsync())
                    {

                        WaterPlantationLog waterPlantationLog = new WaterPlantationLog(Convert.ToInt32(reader["codeWaterPlant"]),
                              Convert.ToString(reader["category"]), Convert.ToString(reader["mood"]),
                              Convert.ToDouble(reader["prevMeasureBowl"]), Convert.ToDouble(reader["postMeasureBowl"]),
                              Convert.ToInt32(reader["prevHumidity"]), Convert.ToInt32(reader["postHumidity"]),
                              tankFound, plantationFound, Convert.ToDateTime(reader["momentStart"]), Convert.ToDateTime(reader["momentEnd"]));

                        waterPlantLogs.Add(waterPlantationLog);

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
