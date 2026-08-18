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
    public class Palert
    {

        public async Task Add(Alert alert)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("AddAlert");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@message", alert.Message);
                command.Parameters.AddWithValue("@state", alert.State);
                command.Parameters.AddWithValue("@idTank", alert.Tank.Id);
                command.Parameters.AddWithValue("@codePlaque", alert.Tank.Device.Id);
             
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
        public async Task UpdateAlertState(Alert alert)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("AddAlert");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@id", alert.Id);
                command.Parameters.AddWithValue("@state", alert.State);

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
            SqlConnection connection = new SqlConnection(Connection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AmountAlerts");
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

            SqlConnection connection = new SqlConnection(Connection.Cnn);
            try
            {

                SqlCommand command = new SqlCommand("AlertsOffset");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@offset", offset);
                command.Parameters.AddWithValue("@codePlaque", idDevice);

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    List<Tank> tanks = await new Ptank().GetAllTanksByDevice(idDevice);

                    while (await reader.ReadAsync())
                    {
                        Tank tankFound = tanks.Find(tank => tank.Id == Convert.ToInt16(reader["idBowl"]));

                        alertsOffset.Add(new Alert(Convert.ToInt16(reader["idPlaque"]), tankFound, Convert.ToString(reader["text"]),
                            Convert.ToBoolean(reader["mood"])));

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
