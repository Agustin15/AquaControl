using System;
using System.Collections.Generic;
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
        private DateTime datetimeLog;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }
        public Tank Tank
        {
            set { tank = value; }
            get { return tank; }
        }

        public double Percentege
        {
            set { percentege = value; }
            get { return percentege; }
        }

        public DateTime DatetimeLog
        {
            set { datetimeLog = value; }
            get { return datetimeLog; }
        }
        public void Validar()
        {

            if (Tank is null)
                throw new Exception("Debe indicar un tanque");

            if (percentege < 0 || percentege > 100)
                throw new Exception("Porcentaje de agua del tanque debe estar entre 0 y 100");

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
