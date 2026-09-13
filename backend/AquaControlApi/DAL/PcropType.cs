using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Data;
using Entities;

namespace DAL
{
    public class PcropType
    {

        public async Task<List<CropType>> GetAllCropsTypes()
        {
            SqlConnection connection = new SqlConnection(DBConnection.Cnn);
            List<CropType> cropsTypes = new List<CropType>();
            CropType cropType = new CropType();

            try
            {
                SqlCommand command = new SqlCommand("AllCropsTypes", connection);
                command.CommandType = CommandType.StoredProcedure;

                await connection.OpenAsync();

                SqlDataReader reader = await command.ExecuteReaderAsync();

                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {

                        cropType = new CropType(Convert.ToString(reader["identification"]), Convert.ToString(reader["photo"]), Convert.ToInt32(reader["humidityLowest"]),
                            Convert.ToInt32(reader["humidityHighest"]));

                        cropsTypes.Add(cropType);
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

            return cropsTypes;

        }



    }
}
