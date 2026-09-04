using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class Palert
    {

        public async Task<int> Add(Alert alert)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("AddAlert", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@title", alert.Title);
                command.Parameters.AddWithValue("@message", alert.Message);
                command.Parameters.AddWithValue("@type", alert.Type);
                command.Parameters.AddWithValue("@idDevice", alert.Device.Id);

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
        public async Task UpdateAlertState(Alert alert)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("UpdateAlertState", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", alert.Id);
                command.Parameters.AddWithValue("@state", alert.Seen);

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

        public async Task Delete(Alert alert)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("DeleteAlertById", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", alert.Id);

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

        public async Task<int> GetAmountAlertsByDevice(int idDevice)
        {

            int amount = 0;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AmountAlerts", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codePlaque", idDevice);


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
        public async Task<List<Alert>> GetAlertsByDeviceOffset(int offset, int idDevice)
        {

            List<Alert> alertsOffset = new List<Alert>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AlertsOffset", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@offset", offset);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    Device deviceFound = await new Pdevice().GetDeviceById(idDevice);

                    while (await reader.ReadAsync())
                    {


                        alertsOffset.Add(new Alert(Convert.ToInt16(reader["code"]), Convert.ToString(reader["heading"]),
                            Convert.ToString(reader["text"]), Convert.ToString(reader["category"]), Convert.ToBoolean(reader["observed"]), deviceFound)
                          );

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

            return alertsOffset;
        }

    }

}
