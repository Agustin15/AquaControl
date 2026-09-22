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
    public class PuserOfDevice
    {


        internal async Task AddUserDeviceWithTransaction(Device device, UserOfDevice userOfDevice, SqlTransaction transaction)
        {
            try
            {

                SqlCommand command = new SqlCommand("AddUserDevice", transaction.Connection, transaction);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idDevice", device.Id);
                command.Parameters.AddWithValue("@idUser", userOfDevice.User.Id);
                command.Parameters.AddWithValue("@role", userOfDevice.Role);

                await command.ExecuteNonQueryAsync();

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task AddUserDevice(Device device, UserOfDevice userOfDevice)
        {
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AddUserDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idDevice", device.Id);
                command.Parameters.AddWithValue("@idUser", userOfDevice.User.Id);
                command.Parameters.AddWithValue("@role", userOfDevice.Role);

                connection.Open();

                await command.ExecuteNonQueryAsync();

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }

        }

        public async Task DeleteUserDevice(Device device, UserOfDevice userOfDevice)
        {
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("DeleteUserDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idDevice", device.Id);
                command.Parameters.AddWithValue("@idUser", userOfDevice.User.Id);

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

        public async Task UpdateUserOfDevice(Device device, UserOfDevice userOfDevice)
        {
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("UpdateUserDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idDevice", device.Id);
                command.Parameters.AddWithValue("@idUser", userOfDevice.User.Id);
                command.Parameters.AddWithValue("@role", userOfDevice.Role);

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

        internal async Task<List<UserOfDevice>> UsersOfDevice(string idDevice)
        {

            List<UserOfDevice> usersOfDevice = new List<UserOfDevice>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("UsersByIdDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();
                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {


                    while (await reader.ReadAsync())
                    {
                        User userFound = await new Puser().GetUserById(Convert.ToInt32(reader["codeEntity"]));

                        usersOfDevice.Add(new UserOfDevice(userFound, Convert.ToString(reader["responsability"]), Convert.ToDateTime(reader["inserted"])));
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

            return usersOfDevice;

        }

    }
}
