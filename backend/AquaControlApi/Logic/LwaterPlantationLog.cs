using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class LwaterPlantationLog
    {

        public async Task<int> Add(WaterPlantationLog waterPlantationLog)

        {
            if (waterPlantationLog is null) throw new Exception("Debe indicar un riego a agregar");
            int idGenerated = await new PwaterPlantationLog().Add(waterPlantationLog);
            return idGenerated;

        }
        public async Task UpdateWaterPlantationLogFinished(WaterPlantationLog waterPlantationLog)
        {
            if (waterPlantationLog is null) throw new Exception("Debe indicar un riego a actualizar");

            await new PwaterPlantationLog().UpdateWaterPlantationLogFinished(waterPlantationLog);

        }


        public async Task<WaterPlantationLog> GetLastWaterPlantationLog(int idPlantation, int idTank, int idDevice)
        {

            WaterPlantationLog waterPlantationLog = await new PwaterPlantationLog().GetLastWaterPlantationLog(idPlantation, idTank, idDevice);

            return waterPlantationLog;
        }


        public async Task<int> GetAmountWaterPlantationLogs(int idTank, int idPlantation, int idDevice)
        {
            int amounts = await new PwaterPlantationLog().GetAmountWaterPlantationLogs(idTank, idPlantation, idDevice);

            return amounts;
        }

        public async Task<List<WaterPlantationLog>> GetWaterPlantationLogsOffset(int idTank, int idPlantation, int idDevice, int offset)
        {

            List<WaterPlantationLog> waterPlantationLogs = new List<WaterPlantationLog>();

            waterPlantationLogs = await new PwaterPlantationLog().GetWaterPlantationLogsOffset(idTank, idPlantation, idDevice, offset);

            return waterPlantationLogs;

        }
    }

}
