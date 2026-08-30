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
    public class PhumidityPlantLog
    {
        public async Task Add(HumidityPlantLog humidityPlantLog)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("AddHumidityPlantLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@percentege", humidityPlantLog.Percentege);
                command.Parameters.AddWithValue("@weatherData", JsonSerializer.Serialize(humidityPlantLog.WeatherData));
                command.Parameters.AddWithValue("@idPlant", humidityPlantLog.Plant.Id);
                command.Parameters.AddWithValue("@idDevice", humidityPlantLog.Plant.Device.Id);

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

        public async Task<List<HumidityPlantLog>> GetHumidityPlantLogLastWeek(int idPlant, int idDevice)
        {

            WeatherData weatherData = null;
            List<HumidityPlantLog> humidityPlantLogs = new List<HumidityPlantLog>();
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {
                SqlCommand command = new SqlCommand("HumidityPlantLogsLastWeek", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idLand", idPlant);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                List<Plant> plants = await new Pplant().GetAllPlantsByDevice(idPlant);

                Plant plantFound = plants.Find(plant => plant.Id == idPlant);

                if (reader.HasRows)
                {

                    while (await reader.ReadAsync())
                    {
                        weatherData = JsonSerializer.Deserialize<WeatherData>((string)reader["ambientData"]);

                        HumidityPlantLog humidityPlantLog = new HumidityPlantLog(Convert.ToInt16(reader["codeHumidityLand"]), plantFound,
                        Convert.ToInt16(reader["measure"]), weatherData, Convert.ToDateTime(reader["moment"]));

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
