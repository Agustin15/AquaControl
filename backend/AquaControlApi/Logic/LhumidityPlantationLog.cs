using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class LhumidityPlantationLog
    {
        public async Task Add(HumidityPlantationLog humidityPlantationLog)
        {
            if (humidityPlantationLog is null) throw new Exception("Debe indicar una registro de humedad a agregar");
            await new PhumidityPlantationLog().Add(humidityPlantationLog);

        }

        public async Task<List<HumidityPlantationLog>> GetHumidityPlantationLogsLastWeek(int idPlantation, int idDevice)
        {

            List<HumidityPlantationLog> humidityPlantationLogs = new List<HumidityPlantationLog>();

            humidityPlantationLogs = await new PhumidityPlantationLog().GetHumidityPlantationLogsLastWeek(idPlantation, idDevice);

            return humidityPlantationLogs;
        }

    }
}
