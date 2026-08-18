using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class LwaterPlantLog
    {

        public async Task<int> Add(WaterPlantLog waterPlantLog)

        {
            if (waterPlantLog is null) throw new Exception("Debe indicar un riego a agregar");
            int idGenerated = await new PwaterPlantLog().Add(waterPlantLog);
            return idGenerated;

        }
        public async Task UpdateStateWaterPlantLog(WaterPlantLog waterPlantLog)
        {
            if (waterPlantLog is null) throw new Exception("Debe indicar un riego a actualizar");

            await new PwaterPlantLog().UpdateStateWaterPlantLog(waterPlantLog);

        }


        public async Task<WaterPlantLog> GetLastWaterPlantLog(int idPlant, int idTank, int idDevice)
        {

            WaterPlantLog waterPlantLog = await new PwaterPlantLog().GetLastWaterPlantLog(idPlant, idTank, idDevice);

            return waterPlantLog;
        }


        public async Task<int> GetAmountWaterPlantLogs(int idTank, int idPlant, int idDevice)
        {
            int amounts = await new PwaterPlantLog().GetAmountWaterPlantLogs(idTank, idPlant, idDevice);

            return amounts;
        }

        public async Task<List<WaterPlantLog>> GetWaterPlantLogsOffset(int idTank, int idPlant, int idDevice, int offset)
        {

            List<WaterPlantLog> waterPlantLogs = new List<WaterPlantLog>();

            waterPlantLogs = await new PwaterPlantLog().GetWaterPlantLogsOffset(idTank, idPlant, idDevice, offset);

            return waterPlantLogs;

        }
    }

}
