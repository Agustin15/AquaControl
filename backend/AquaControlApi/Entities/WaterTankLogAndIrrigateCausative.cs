using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class WaterTankLogAndIrrigateCausative
    {
        WaterTankLog waterTankLog;
        WaterPlantLog irrigateCausative;

        public WaterTankLog WaterTankLog
        {
            set { waterTankLog = value; }
            get { return waterTankLog; }

        }
        public WaterPlantLog IrrigateCausative
        {
            set { irrigateCausative = value; }
            get { return irrigateCausative; }

        }


        public WaterTankLogAndIrrigateCausative()
        {
        }

        public WaterTankLogAndIrrigateCausative(WaterTankLog waterTankLog, WaterPlantLog irrigateCausative)
        {
            WaterTankLog = waterTankLog;
            IrrigateCausative = irrigateCausative;
        }

        public void Validar()
        {
            if (WaterTankLog is null) throw new Exception("Registro de nivel de agua del tanque no puede ser nulo");

        }
    }
}
