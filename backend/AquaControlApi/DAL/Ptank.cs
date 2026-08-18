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
    public class Ptank
    {
        public async Task Add(Tank tank)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AddTank", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", tank.Id);
                command.Parameters.AddWithValue("@idDevice", tank.Device.Id);
                command.Parameters.AddWithValue("@height", tank.Height);

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

        public async Task Update(Tank tank)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("UpdateTank", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", tank.Id);
                command.Parameters.AddWithValue("@idDevice", tank.Device.Id);
                command.Parameters.AddWithValue("@height", tank.Height);


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

        public async Task Delete(Tank tank)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("DeleteTank", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", tank.Id);
                command.Parameters.AddWithValue("@idDevice", tank.Device.Id);

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


        public async Task<Tank> GetTankByIdAndDevice(int idTank, int idDevice)
        {

            Tank tank = null;

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("TankByIdAndDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@code", idTank);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    Device deviceFound = await new Pdevice().GetDeviceById(idDevice);

                    await reader.ReadAsync();
                    tank = new Tank(Convert.ToInt16(reader["codeBowl"]), Convert.ToDouble(reader["limit"]),
                        deviceFound);

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

            return tank;
        }

        public async Task<List<Tank>> GetAllTanksByDevice(int idDevice)
        {

            List<Tank> tanks = new List<Tank>();

            SqlConnection connection = new SqlConnection(Connection.Cnn);

            try
            {

                SqlCommand command = new SqlCommand("AllTanksByDevice", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    Device deviceFound = await new Pdevice().GetDeviceById(idDevice);

                    while (await reader.ReadAsync())
                    {

                        Tank tank = new Tank(Convert.ToInt16(reader["codeBowl"]),
                           Convert.ToDouble(reader["limit"]), deviceFound);

                        tanks.Add(tank);

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

            return tanks;
        }

    }

}
