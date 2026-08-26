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

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AddDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@placeName", device.PlaceName);
                command.Parameters.AddWithValue("@idUser", device.User.Id);

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
        public async Task UpdatePlaceNameDevice(Device device)
        {

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UpdatePlaceNameDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@placeName", device.PlaceName);
                command.Parameters.AddWithValue("@idUser", device.User.Id);
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

        public async Task<List<Device>> GetAllDevicesByUser(int idUser)
        {

            List<Device> devices = new List<Device>();

            SqlConnection connection = new SqlConnection(DBConnection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AllDevicesByUser", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codeEntity", idUser);

                connection.Open();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {

                    User userFound = await new Puser().GetUserById(idUser);

                    while (await reader.ReadAsync())
                    {
                        Device device = new Device(Convert.ToInt16(reader["codePlaque"]), Convert.ToString(reader["place"]),
                             userFound, Convert.ToDateTime(reader["inserted"]));

                        devices.Add(device);
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

        internal async Task<Device> GetDeviceById(int idDevice)
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

                    await reader.ReadAsync();

                    User userFound = await new Puser().GetUserById(Convert.ToInt16(reader["codeEntity"]));

                    device = new Device(Convert.ToInt16(reader["codePlaque"]), Convert.ToString(reader["place"]),
                         userFound, Convert.ToDateTime(reader["inserted"]));

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


    }

}
