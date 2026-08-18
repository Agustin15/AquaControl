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
    public class PwaterTankLog
    {
        public async Task Add(WaterTankLog waterTankLog)
        {

            SqlConnection connection = new SqlConnection(Connection.Cnn);
            try
            {
                SqlCommand command = new SqlCommand("AddWaterTankLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@percentege", waterTankLog.Percentege);
                command.Parameters.AddWithValue("@idTank", waterTankLog.Tank.Id);
                command.Parameters.AddWithValue("@idDevice", waterTankLog.Tank.Device.Id);

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

    }

}
