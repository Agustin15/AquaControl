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
    public class Pplantation
    {

        public async Task Add(Plantation plantation)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            SqlTransaction transaction = null;

            try
            {

                SqlCommand command = new SqlCommand("AddPlantation", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plantation.Id);
                command.Parameters.AddWithValue("@idDevice", plantation.Device.Id);
                command.Parameters.AddWithValue("@humidityMin", plantation.HumidityMin);
                command.Parameters.AddWithValue("@humidityMax", plantation.HumidityMax);
                command.Parameters.AddWithValue("@type", plantation.CropType.Name);
                command.Parameters.AddWithValue("@amountPlants", plantation.AmountPlants);
                command.Parameters.AddWithValue("@indoor", plantation.Indoor);

                if (plantation.Image != null)
                    command.Parameters.AddWithValue("@image", plantation.Image);

                await connection.OpenAsync();

                transaction = (SqlTransaction)await connection.BeginTransactionAsync();
                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();

                string topic = "device/" + plantation.Device.Id + "/plantation";

                await MqttClient.Instance.PublishMessage(topic,
                    new
                    {
                        plantation = new Plantation(plantation.Id, plantation.CropType, plantation.HumidityMin, plantation.HumidityMin,
                        plantation.AmountPlants, plantation.Indoor, plantation.Device)
                    });

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

        public async Task Update(Plantation plantation)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            SqlTransaction transaction = null;

            try
            {

                SqlCommand command = new SqlCommand("UpdatePlantation", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plantation.Id);
                command.Parameters.AddWithValue("@idDevice", plantation.Device.Id);
                command.Parameters.AddWithValue("@humidityMin", plantation.HumidityMin);
                command.Parameters.AddWithValue("@humidityMax", plantation.HumidityMax);
                command.Parameters.AddWithValue("@type", plantation.CropType.Name);
                command.Parameters.AddWithValue("@amountPlants", plantation.AmountPlants);
                command.Parameters.AddWithValue("@indoor", plantation.Indoor);

                if (plantation.Image != null)
                    command.Parameters.AddWithValue("@image", plantation.Image);

                await connection.OpenAsync();

                transaction = (SqlTransaction)await connection.BeginTransactionAsync();
                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();

                string topic = "device/" + plantation.Device.Id + "/plantation";

                await MqttClient.Instance.PublishMessage(topic,
                    new
                    {
                        plantation = new Plantation(plantation.Id, plantation.CropType, plantation.HumidityMin, plantation.HumidityMin,
                        plantation.AmountPlants, plantation.Indoor, plantation.Device)
                    });

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

        public async Task Delete(Plantation plantation)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            SqlTransaction transaction = null;

            try
            {

                SqlCommand command = new SqlCommand("DeletePlantation", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", plantation.Id);
                command.Parameters.AddWithValue("@idDevice", plantation.Device.Id);

                await connection.OpenAsync();
                transaction = (SqlTransaction)await connection.BeginTransactionAsync();
                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();


                string topic = "device/" + plantation.Device.Id + "/plantation";
                await MqttClient.Instance.PublishMessage(topic, new { plantation = (Plantation)null });

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


        public async Task<List<Plantation>> GetAllPlantationsByDevice(int idDevice)
        {

            List<Plantation> plantations = new List<Plantation>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AllPlantationsByDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    Device deviceFound = await new Pdevice().GetDeviceById(idDevice);

                    List<CropType> cropsTypes = await new PcropType().GetAllCropsTypes();

                    while (await reader.ReadAsync())
                    {
                        CropType cropTypeFound = cropsTypes.Find(crop => crop.Name == Convert.ToString(reader["category"]));

                        Plantation plantation = new Plantation
                            (Convert.ToInt32(reader["codeLand"]), cropTypeFound, Convert.ToInt32(reader["humidityLowest"]),
                            Convert.ToInt32(reader["humidityHighest"]), reader["capture"] is DBNull ? null : Convert.ToString(reader["capture"]),
                            Convert.ToInt32(reader["amountSowns"]), (bool)reader["inside"], deviceFound);

                        plantations.Add(plantation);

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

            return plantations;
        }


    }

}
