using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class PwaterTankLog
    {
        public async Task Add(WaterTankLog waterTankLog)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("AddWaterTankLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@percentege", waterTankLog.Percentege);
                command.Parameters.AddWithValue("@idTank", waterTankLog.Tank.Id);
                command.Parameters.AddWithValue("@idDevice", waterTankLog.Tank.Device.Id);

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


        public async Task<List<WaterTankLog>> GetWaterTankLogsLastWeek(int idTank, int idDevice)
        {

            WaterTankLog waterTankLog = null;
            WaterPlantationLog waterPlantationLogMostNearly = null;
            List<WaterTankLog> waterTankLogs = new List<WaterTankLog>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("WaterTankLogsLastWeek", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idBowl", idTank);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    List<Tank> tanks = await new Ptank().GetAllTanksByDevice(idDevice);
                    Tank tankFound = tanks.Find(t => t.Id == idTank);
                    while (await reader.ReadAsync())
                    {
                        waterPlantationLogMostNearly = await new PwaterPlantationLog().
                            GetWaterPlantationLogMostNearylToWaterTank(idTank, idDevice, Convert.ToDateTime(reader["moment"]), Convert.ToDouble(reader["measure"]));


                        waterTankLog = new WaterTankLog(Convert.ToInt32(reader["codeLiquidBowl"]), Convert.ToDouble(reader["measure"]),
                            tankFound, (waterPlantationLogMostNearly != null ? waterPlantationLogMostNearly : null), Convert.ToDateTime(reader["moment"]));

                        waterTankLogs.Add(waterTankLog);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            finally
            {
                await connection.CloseAsync();
            }
            return waterTankLogs;
        }

    }

}
