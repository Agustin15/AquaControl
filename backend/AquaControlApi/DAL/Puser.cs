using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Entities;

namespace DAL
{
    public class Puser
    {

        public async Task<int> Add(User user)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AddUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@username", user.Username);
                command.Parameters.AddWithValue("@email", user.Email);
                command.Parameters.AddWithValue("@password", user.Password);
                SqlParameter returnValue = new SqlParameter();
                returnValue.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(returnValue);

                await connection.OpenAsync();

                await command.ExecuteNonQueryAsync();

                int idGenerated = (int)returnValue.Value;

                return idGenerated;


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

        public async Task<int> AddWithTransaction(User user, SqlConnection connectionTrn, SqlTransaction transaction)
        {

            try
            {

                SqlCommand command = new SqlCommand("AddUser", connectionTrn);
                command.Transaction = transaction;
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@username", user.Username);
                command.Parameters.AddWithValue("@email", user.Email);
                command.Parameters.AddWithValue("@password", user.Password);
                SqlParameter idGenerated = new SqlParameter();
                idGenerated.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(idGenerated);

                await command.ExecuteNonQueryAsync();

                return (int)idGenerated.Value;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task UpdateUser(User user)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UpdateUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@username", user.Username);
                command.Parameters.AddWithValue("@email", user.Email);
                command.Parameters.AddWithValue("@password", user.Password);

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
      
        public async Task<List<User>> GetAllUsers()
        {

            List<User> users = new List<User>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AllUsers", connection);
                command.CommandType = CommandType.StoredProcedure;

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        User user = new User(Convert.ToInt16(reader["code"]), Convert.ToString(reader["entity"]),
                         Convert.ToString(reader["correspondence"]), "", Convert.ToDateTime(reader["created"]));

                        users.Add(user);
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

            return users;
        }

        public async Task<User> GetUserByUsername(string username)
        {

            User user = null;

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UserByUsername", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@username", username);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    await reader.ReadAsync();

                    user = new User(Convert.ToInt16(reader["code"]), Convert.ToString(reader["entity"]),
                         Convert.ToString(reader["correspondence"]), Convert.ToString(reader["entityKey"]), 
                         Convert.ToDateTime(reader["created"]));
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

            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {

            User user = null;

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UserByEmail", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@email", email);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    await reader.ReadAsync();

                    user = new User(Convert.ToInt16(reader["code"]), Convert.ToString(reader["entity"]),
                              Convert.ToString(reader["correspondence"]), "", Convert.ToDateTime(reader["created"]));
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

            return user;
        }

        internal async Task<User> GetUserById(int idUser)
        {

            User user = null;

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UserById", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idUser", idUser);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    await reader.ReadAsync();

                    user = new User(Convert.ToInt16(reader["code"]), Convert.ToString(reader["entity"]),
                         Convert.ToString(reader["correspondence"]), "", Convert.ToDateTime(reader["created"]));
                }
                await reader.CloseAsync();

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            finally
            {
                connection.Close();
            }

            return user;
        }


    }

}
