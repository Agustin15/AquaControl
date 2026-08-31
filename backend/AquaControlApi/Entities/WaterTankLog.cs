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
        private int id;
        private Tank tank;
        private double percentege;
        private DateTime? datetimeLog;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        [Required(ErrorMessage = "Debe indicar tanque al que pertenece el registro de nivel de agua")]
        public Tank Tank
        {
            set { tank = value; }
            get { return tank; }
        }


        [Required(ErrorMessage = "Debe indicar el porcentaje de nivel de agua del tanque")]
        [Range(0, 100, ErrorMessage = "Porcentaje de agua debe estar entre 0 y 100")]

        public double Percentege
        {
            set { percentege = value; }
            get { return percentege; }
        }

        [Required(ErrorMessage = "Fecha del monitoreo es requerida")]
        public DateTime? DatetimeLog
        {
            set { datetimeLog = value; }
            get { return datetimeLog; }
        }
     
        public WaterTankLog() { }

        public WaterTankLog(int id, Tank tank, double percentege, DateTime datetimeLog)
        {

            Id = id;
            Tank = tank;
            Percentege = percentege;
            DatetimeLog = datetimeLog;

        }
    }
}
