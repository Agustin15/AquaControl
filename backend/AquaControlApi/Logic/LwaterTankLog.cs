using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class LwaterTankLog
    {
        public async Task Add(WaterTankLog waterTankLog)
        {
            if (waterTankLog is null) throw new Exception("Debe indicar un registro del nivel de agua del tanque para agregar");
            await new PwaterTankLog().Add(waterTankLog);

        }

    }

}
