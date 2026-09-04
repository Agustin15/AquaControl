using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Entities;
using Microsoft.Data.SqlClient;

namespace DAL
{
    public class PuserDeviceToken
    {

        public async Task Add(UserDeviceToken userDeviceToken)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {
                SqlCommand command = new SqlCommand("AddUserDeviceToken", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idUserDevice", userDeviceToken.IdUserDevice);
                command.Parameters.AddWithValue("@token", userDeviceToken.Token);
                command.Parameters.AddWithValue("@idUser", userDeviceToken.User.Id);


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

        public async Task Update(UserDeviceToken userDeviceToken)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {
                SqlCommand command = new SqlCommand("UpdateUserDeviceToken", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idUserDevice", userDeviceToken.IdUserDevice);
                command.Parameters.AddWithValue("@token", userDeviceToken.Token);

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


        public async Task<UserDeviceToken> GetUserDeviceTokenById(string idUserDevice)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            UserDeviceToken userDeviceToken = null;

            try
            {
                SqlCommand command = new SqlCommand("UserDeviceTokenById", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@code", idUserDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    await reader.ReadAsync();

                    User userFound = await new Puser().GetUserById(Convert.ToInt32(reader["codeEntity"]));

                    DateTime lastUpdated = reader["lastUpdated"] is DBNull ? new DateTime(1970, 1, 1) : Convert.ToDateTime(reader["lastUpdated"]);

                    userDeviceToken = new UserDeviceToken(Convert.ToString(reader["code"]), userFound, Convert.ToString(reader["mark"]),
                        Convert.ToDateTime(reader["datetimeLog"]), lastUpdated);

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
            return userDeviceToken;

        }


        public async Task<List<UserDeviceToken>> GetUserDevicesTokensByIdUser(int idUser)
        {

            List<UserDeviceToken> tokens = new List<UserDeviceToken>();
            UserDeviceToken userDeviceToken = null;

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {
                SqlCommand command = new SqlCommand("UserDevicesTokensByUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codeEntity", idUser);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    User userFound = await new Puser().GetUserById(idUser);

                    while (await reader.ReadAsync())
                    {

                        DateTime lastUpdated = reader["lastUpdated"] is DBNull ? new DateTime(1970, 1, 1) : Convert.ToDateTime(reader["lastUpdated"]);

                        userDeviceToken = new UserDeviceToken(Convert.ToString(reader["code"]), userFound, Convert.ToString(reader["mark"]),
                            Convert.ToDateTime(reader["datetimeLog"]), lastUpdated);

                        tokens.Add(userDeviceToken);
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
            return tokens;

        }
    }
}

