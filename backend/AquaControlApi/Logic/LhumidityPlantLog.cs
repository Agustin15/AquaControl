using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class LhumidityPlantLog
    {
        public async Task Add(HumidityPlantLog humidityPlantLog)
        {
            if (humidityPlantLog is null) throw new Exception("Debe indicar una registro de humedad a agregar");
            await new PhumidityPlantLog().Add(humidityPlantLog);

        }

        public async Task<List<HumidityPlantLog>> GetHumidityPlantLogLastWeek(int idPlant, int idDevice)
        {

            List<HumidityPlantLog> humidityPlantLogs = new List<HumidityPlantLog>();

            humidityPlantLogs = await new PhumidityPlantLog().GetHumidityPlantLogLastWeek(idPlant, idDevice);

            return humidityPlantLogs;
        }

    }
}
