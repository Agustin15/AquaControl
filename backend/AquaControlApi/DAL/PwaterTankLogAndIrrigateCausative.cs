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
    public class PwaterTankLogAndIrrigateCausative
    {

        public async Task<List<WaterTankLogAndIrrigateCausative>> GetWaterTankLogsWithIrrigateCausativeLastWeek(int idTank, int idDevice)
        {

            List<WaterTankLogAndIrrigateCausative> waterTankLogsWithIrrigateCausativeLastWeek =
                new List<WaterTankLogAndIrrigateCausative>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("WaterTankLogsWithIrrigateCausativeLastWeek", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idBowl", idTank);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();


                if (reader.HasRows)
                {

                    Tank tankFound = await new Ptank().GetTankByIdAndDevice(idTank, idDevice);
                    List<Plant> plants = await new Pplant().GetAllPlantsByDevice(idDevice);

                    while (await reader.ReadAsync())
                    {

                        WaterTankLog waterTankLog = new WaterTankLog(Convert.ToInt16(reader["codeLiquidBowl"]), tankFound,
                            Convert.ToDouble(reader["measure"]), Convert.ToDateTime(reader["moment"]));

                        WaterPlantLog irrigateCausative = null;

                        if (!(reader["codeWaterPlant"] is DBNull))
                        {
                            Plant plantFound = plants.Find(plant => plant.Id == Convert.ToInt16(reader["idLand"]));

                            irrigateCausative = new WaterPlantLog(Convert.ToInt16(reader["codeWaterPlant"]), tankFound, plantFound,
                          Convert.ToDateTime(reader["momentStart"]), Convert.ToDateTime(reader["momentEnd"]),
                            Convert.ToString(reader["category"]), Convert.ToString(reader["mood"]),
                            Convert.ToDouble(reader["prevMeasureBowl"]), Convert.ToDouble(reader["postMeasureBowl"]),
                            Convert.ToInt16(reader["prevHumidity"]), Convert.ToInt16(reader["postHumidity"]));
                        }

                        waterTankLogsWithIrrigateCausativeLastWeek.Add(
                            new WaterTankLogAndIrrigateCausative(waterTankLog, irrigateCausative));
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

            return waterTankLogsWithIrrigateCausativeLastWeek;
        }
    }

}
