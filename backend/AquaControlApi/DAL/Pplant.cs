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
    public class Pplant
    {

        public async Task Add(Plant plant)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AddPlant", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plant.Id);
                command.Parameters.AddWithValue("@idDevice", plant.Device.Id);
                command.Parameters.AddWithValue("@umbralHumidity", plant.UmbralHumidity);

                if (!(plant.Image is null))
                    command.Parameters.AddWithValue("@image", plant.Image);

                if (!(plant.Description is null))
                    command.Parameters.AddWithValue("@description", plant.Description);

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

        public async Task Update(Plant plant)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UpdatePlant", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plant.Id);
                command.Parameters.AddWithValue("@idDevice", plant.Device.Id);
                command.Parameters.AddWithValue("@umbralHumidity", plant.UmbralHumidity);

                if (!(plant.Image is null))
                    command.Parameters.AddWithValue("@image", plant.Image);

                if (!(plant.Description is null))
                    command.Parameters.AddWithValue("@description", plant.Description);

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

        public async Task Delete(Plant plant)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("DeletePlant", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plant.Id);
                command.Parameters.AddWithValue("@idDevice", plant.Device.Id);

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

        public async Task<Plant> GetPlantByIdAndDevice(int idPlant, int idDevice)
        {

            Plant plant = null;

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("PlantByIdAndDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@code", idPlant);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    Device deviceFound = await new Pdevice().GetDeviceById(idDevice);

                    await reader.ReadAsync();

                    plant = new Plant(Convert.ToInt16(reader["codeLand"]),Convert.ToInt16(reader["limitHumidity"]),
                                           reader["capture"] is DBNull ? null : (byte[])reader["capture"],
                                           reader["info"] is DBNull ? null : Convert.ToString(reader["info"]), deviceFound);

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

            return plant;
        }

        public async Task<List<Plant>> GetAllPlantsByDevice(int idDevice)
        {

            List<Plant> plants = new List<Plant>();

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AllPlantsByDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    Device deviceFound = await new Pdevice().GetDeviceById(idDevice);

                    while (await reader.ReadAsync())
                    {
                       Plant plant = new Plant(Convert.ToInt16(reader["codeLand"]), Convert.ToInt16(reader["limitHumidity"]),
                                            reader["capture"] is DBNull ? null : (byte[])reader["capture"],
                                            reader["info"] is DBNull ? null : Convert.ToString(reader["info"]), deviceFound);

                        plants.Add(plant);

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

            return plants;
        }


    }

}
