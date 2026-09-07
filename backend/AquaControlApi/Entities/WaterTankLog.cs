using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class WaterTankLog
    {
        int id;
        double percentege;
        Tank tank;
        WaterPlantLog? waterPlantMostNearly;
        DateTime? datetimeLog;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }


        [Required(ErrorMessage = "Debe indicar el porcentaje de nivel de agua del tanque")]
        [Range(0, 100, ErrorMessage = "Porcentaje de agua debe estar entre 0 y 100")]

        public double Percentege
        {
            set { percentege = value; }
            get { return percentege; }
        }

        [Required(ErrorMessage = "Debe indicar tanque al que pertenece el registro de nivel de agua")]
        public Tank Tank
        {
            set { tank = value; }
            get { return tank; }
        }

        public WaterPlantLog? WaterPlantMostNearly
        {
            set { waterPlantMostNearly = value; }
            get { return waterPlantMostNearly; }
        }


        [Required(ErrorMessage = "Fecha del monitoreo es requerida")]
        public DateTime? DatetimeLog
        {
            set { datetimeLog = value; }
            get { return datetimeLog; }
        }

        public WaterTankLog() { }

        public WaterTankLog(int id, Tank tank, double percentege, WaterPlantLog waterPlantMostNearly, DateTime datetimeLog)
        {

            Id = id;
            Tank = tank;
            Percentege = percentege;
            WaterPlantMostNearly = waterPlantMostNearly;
            DatetimeLog = datetimeLog;

        }

    }
}
