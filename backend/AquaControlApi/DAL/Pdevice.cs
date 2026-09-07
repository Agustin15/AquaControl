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
    public class Pdevice
    {

        public async Task Add(Device device)
        {
            SqlTransaction transaction = null;
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AddDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@placeName", device.PlaceName);
                command.Parameters.AddWithValue("@location", device.Location);

                SqlParameter parameterIdGenerated = new SqlParameter();
                parameterIdGenerated.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(parameterIdGenerated);

                await connection.OpenAsync();

                transaction = (SqlTransaction)await connection.BeginTransactionAsync();
                command.Transaction = transaction;

                await command.ExecuteNonQueryAsync();

                int idGenerated = (int)parameterIdGenerated.Value;
                device.Id = idGenerated;

                foreach (User user in device.Users)
                {
                    await AddUserDevice(device, user, transaction);
                }

                await transaction.CommitAsync();

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

        public async Task Update(Device device)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UpdateDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@placeName", device.PlaceName);
                command.Parameters.AddWithValue("@location", device.Location);
                command.Parameters.AddWithValue("@idDevice", device.Id);

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
        public async Task Delete(Device device)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("DeleteDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idDevice", device.Id);
                SqlParameter returnValue = new SqlParameter();
                returnValue.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(returnValue);

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


        public async Task<Device> GetDeviceById(int idDevice)
        {

            Device device = null;

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("DeviceById", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@code", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();


                if (reader.HasRows)
                {
                    List<User> users = await UsersOfDevice(idDevice);

                    await reader.ReadAsync();

                    device = new Device(Convert.ToInt32(reader["codePlaque"]), Convert.ToString(reader["place"]),
                           reader["geography"] is DBNull ? null : Convert.ToString(reader["geography"]), users, Convert.ToDateTime(reader["inserted"]));

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

            return device;
        }

        public async Task AddUserDevice(Device device, User user, SqlTransaction transaction)
        {
            try
            {

                SqlCommand command = new SqlCommand("AddUserDevice", transaction.Connection, transaction);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idDevice", device.Id);
                command.Parameters.AddWithValue("@idUser", user.Id);

                await command.ExecuteNonQueryAsync();

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task DeleteUserDevice(Device device, User user)
        {
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("DeleteUserDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@idDevice", device.Id);
                command.Parameters.AddWithValue("@idUser", user.Id);

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

        internal async Task<List<User>> UsersOfDevice(int idDevice)
        {

            List<User> users = new List<User>();

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
                        users.Add(userFound);
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

        public async Task<List<Device>> GetDevicesByIdUser(int idUser)
        {

            List<Device> devices = new List<Device>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("DevicesOfUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codeEntity", idUser);

                await connection.OpenAsync();
                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    User userFound = await new Puser().GetUserById(idUser);

                    while (await reader.ReadAsync())
                    {
                        Device deviceFound = await new Pdevice().GetDeviceById(Convert.ToInt32(reader["codePlaque"]));
                        devices.Add(deviceFound);
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

            return devices;

        }


    }

}
