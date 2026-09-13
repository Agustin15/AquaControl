using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace DAL
{
    public class PhumidityPlantationLog
    {
        public async Task Add(HumidityPlantationLog humidityPlantationLog)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("AddHumidityPlantationLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@percentege", humidityPlantationLog.Percentege);
                command.Parameters.AddWithValue("@weatherData", JsonSerializer.Serialize(humidityPlantationLog.WeatherData));
                command.Parameters.AddWithValue("@idPlantation", humidityPlantationLog.Plantation.Id);
                command.Parameters.AddWithValue("@idDevice", humidityPlantationLog.Plantation.Device.Id);

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

        public async Task<List<HumidityPlantationLog>> GetHumidityPlantationLogsLastWeek(int idPlantation, int idDevice)
        {

            WeatherData weatherData = null;
            List<HumidityPlantationLog> humidityPlantLogs = new List<HumidityPlantationLog>();
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {
                SqlCommand command = new SqlCommand("HumidityPlantationLogsLastWeek", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idLand", idPlantation);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                List<Plantation> plantations = await new Pplantation().GetAllPlantationsByDevice(idPlantation);

                Plantation plantationFound = plantations.Find(plant => plant.Id == idPlantation);

                if (reader.HasRows)
                {

                    while (await reader.ReadAsync())
                    {
                        weatherData = JsonSerializer.Deserialize<WeatherData>((string)reader["ambientData"]);

                        HumidityPlantationLog humidityPlantLog = new HumidityPlantationLog(Convert.ToInt32(reader["codeHumidityLand"]),
                        Convert.ToInt32(reader["measure"]), plantationFound, weatherData, Convert.ToDateTime(reader["moment"]));

                        humidityPlantLogs.Add(humidityPlantLog);
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
            return humidityPlantLogs;
        }


    }

}
