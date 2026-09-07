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
    public class PuserOfAlert
    {
        internal async Task Add(Alert alert, UserOfAlert userOfAlert, SqlTransaction transaction)
        {

            try
            {
                SqlCommand command = new SqlCommand("AddUserOfAlert", transaction.Connection, transaction);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idAlert", alert.Id);
                command.Parameters.AddWithValue("@idUser", userOfAlert.User.Id);
                command.Parameters.AddWithValue("@seen", userOfAlert.Seen == true ? 1 : 0);

                await command.ExecuteNonQueryAsync();

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task UpdateAlertUserState(Alert alert, UserOfAlert userOfAlert)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("UpdateAlertUserState", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idAlert", alert.Id);
                command.Parameters.AddWithValue("@idUser", userOfAlert.User.Id);
                command.Parameters.AddWithValue("@seen", userOfAlert.Seen == true ? 1 : 0);

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

        internal async Task<List<UserOfAlert>> GetUsersOfAlert(int idAlert)
        {

            List<UserOfAlert> usersOfAlert = new List<UserOfAlert>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("UsersOfAlert", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codeNotification", idAlert);

                await connection.OpenAsync();
                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {


                    while (await reader.ReadAsync())
                    {

                        User userFound = await new Puser().GetUserById(Convert.ToInt32(reader["codeEntity"]));
                        bool seen = Convert.ToBoolean(reader["observed"]);

                        usersOfAlert.Add(new UserOfAlert(seen, userFound));
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

            return usersOfAlert;

        }
    }
}
