using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class HumidityPlantLog
    {
        private int id;
        private Plant plant;
        private double percentege;
        private DateTime datetimeLog;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        public Plant Plant
        {
            set { plant = value; }
            get { return plant; }
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

            if (Plant is null)
                throw new Exception("Debe indicar un planta");

            if (percentege < 0 || percentege > 100)
                throw new Exception("Porcentaje de humedad debe estar entre 0 y 100");

        }

        public HumidityPlantLog() { }

        public HumidityPlantLog(int id, Plant plant, double percentege, DateTime datetimeLog)
        {

            Id = id;
            Plant = plant;
            Percentege = percentege;
            DatetimeLog = datetimeLog;

        }
    }
}
