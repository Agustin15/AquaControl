using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace DAL
{
    public class Pplant
    {

        public async Task Add(Plant plant)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            SqlTransaction transaction = null;

            try
            {

                SqlCommand command = new SqlCommand("AddPlant", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plant.Id);
                command.Parameters.AddWithValue("@idDevice", plant.Device.Id);
                command.Parameters.AddWithValue("@umbralHumidity", plant.UmbralHumidity);
                command.Parameters.AddWithValue("@indoor", plant.Indoor);

                if (plant.Image != null)
                    command.Parameters.AddWithValue("@image", plant.Image);

                if (!String.IsNullOrEmpty(plant.Description))
                    command.Parameters.AddWithValue("@description", plant.Description);

                await connection.OpenAsync();

                transaction = (SqlTransaction)await connection.BeginTransactionAsync();
                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();

                string topic = "device/" + plant.Device.Id + "/plant";

                await MqttClient.Instance.PublishMessage(topic,
                    new { plant = new Plant(plant.Id, plant.UmbralHumidity, plant.Indoor, plant.Description, plant.Device) });

                await transaction.CommitAsync();

            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();

                throw new Exception(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
        }

        public async Task Update(Plant plant)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            SqlTransaction transaction = null;

            try
            {

                SqlCommand command = new SqlCommand("UpdatePlant", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plant.Id);
                command.Parameters.AddWithValue("@idDevice", plant.Device.Id);
                command.Parameters.AddWithValue("@umbralHumidity", plant.UmbralHumidity);
                command.Parameters.AddWithValue("@indoor", plant.Indoor);

                if (plant.Image != null)
                    command.Parameters.AddWithValue("@image", plant.Image);

                if (!String.IsNullOrEmpty(plant.Description))
                    command.Parameters.AddWithValue("@description", plant.Description);

                await connection.OpenAsync();

                transaction = (SqlTransaction)await connection.BeginTransactionAsync();
                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();

                string topic = "device/" + plant.Device.Id + "/plant";

                await MqttClient.Instance.PublishMessage(topic,
                    new { plant = new Plant(plant.Id, plant.UmbralHumidity, plant.Indoor, plant.Description, plant.Device) });

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
        }

        public async Task Delete(Plant plant)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            SqlTransaction transaction = null;

            try
            {

                SqlCommand command = new SqlCommand("DeletePlant", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plant.Id);
                command.Parameters.AddWithValue("@idDevice", plant.Device.Id);

                await connection.OpenAsync();
                transaction = (SqlTransaction)await connection.BeginTransactionAsync();
                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();


                string topic = "device/" + plant.Device.Id + "/plant";
                await MqttClient.Instance.PublishMessage(topic, new { plant = (Plant)null });

                await transaction.CommitAsync();

            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
        }


        public async Task<List<Plant>> GetAllPlantsByDevice(int idDevice)
        {

            List<Plant> plants = new List<Plant>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

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
                        Plant plant = new Plant(Convert.ToInt16(reader["codeLand"]), Convert.ToInt16(reader["limitHumidity"]), (bool)reader["inside"],
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
