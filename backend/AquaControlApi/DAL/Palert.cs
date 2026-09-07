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

            SqlTransaction transaction = null;
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

                transaction = (SqlTransaction)await connection.BeginTransactionAsync();

                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();

                int idGenerated = (int)parameterIdGenerated.Value;
                alert.Id = idGenerated;

                foreach (UserOfAlert userOfAlert in alert.UsersOfAlert)
                {
                    await new PuserOfAlert().Add(alert, userOfAlert, transaction);
                }

                await transaction.CommitAsync();

                return idGenerated;

            }
            catch (Exception ex)
            {
                if (transaction != null)
                    await transaction.RollbackAsync();

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
                SqlCommand command = new SqlCommand("DeleteAlert", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idAlert", alert.Id);

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

        public async Task<Alert> GetAlertById(int idAlert)
        {

            Alert alertFound = null;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AlertById", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@code", idAlert);


                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    await reader.ReadAsync();

                    Device deviceFound = await new Pdevice().GetDeviceById(Convert.ToInt32(reader["idPlaque"]));

                    List<UserOfAlert> usersOfAlert = await new PuserOfAlert().GetUsersOfAlert(idAlert);

                    alertFound = new Alert(Convert.ToInt32(reader["code"]), Convert.ToString(reader["heading"]),
                           Convert.ToString(reader["text"]), Convert.ToString(reader["category"]), usersOfAlert, deviceFound, Convert.ToDateTime(reader["momentAlert"]));

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

            return alertFound;
        }
        public async Task<int> GetAmountAlertsByDeviceAndUser(int idDevice, int idUser)
        {

            int amount = 0;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AmountAlertsByUserAndDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codePlaque", idDevice);
                command.Parameters.AddWithValue("@codeEntity", idUser);


                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    await reader.ReadAsync();
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
        public async Task<List<Alert>> GetAlertsByDeviceAndUserOffset(int offset, int idDevice, int idUser)
        {

            List<Alert> alertsOffset = new List<Alert>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AlertsByUserAndDeviceOffset", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@offset", offset);
                command.Parameters.AddWithValue("@codePlaque", idDevice);
                command.Parameters.AddWithValue("@codeEntity", idUser);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    Device deviceFound = await new Pdevice().GetDeviceById(idDevice);

                    while (await reader.ReadAsync())
                    {

                        List<UserOfAlert> usersOfAlert = await new PuserOfAlert().GetUsersOfAlert(Convert.ToInt32(reader["code"]));

                        alertsOffset.Add(new Alert(Convert.ToInt32(reader["code"]), Convert.ToString(reader["heading"]),
                            Convert.ToString(reader["text"]), Convert.ToString(reader["category"]), usersOfAlert, deviceFound, Convert.ToDateTime(reader["momentAlert"]))
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
