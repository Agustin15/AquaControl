using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class LwaterTankLogAndIrrigateCausative
    {
        public async Task<List<WaterTankLogAndIrrigateCausative>> GetWaterTankLogsAndIrrigateCausativeLastWeek(int idTank, int idDevice)
        {

            List<WaterTankLogAndIrrigateCausative> waterTankLogsAndIrrigateCausativeLastWeek = await
                new PwaterTankLogAndIrrigateCausative().GetWaterTankLogsWithIrrigateCausativeLastWeek(idTank, idDevice);

            return waterTankLogsAndIrrigateCausativeLastWeek;
        }
    }

}
