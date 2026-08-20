using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class WaterPlantLog
    {
        private int id;
        private Tank tank;
        private Plant plant;
        private DateTime datetimeStart;
        private DateTime datetimeEnd;
        private string type;
        private string state;
        private double levelTankBefore;
        private double levelTankAfter;
        private int humidityBefore;
        private int humidityAfter;

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

        public Plant Plant
        {
            set { plant = value; }
            get { return plant; }
        }

        public DateTime DatetimeStart
        {
            set { datetimeStart = value; }
            get { return datetimeStart; }
        }

        public DateTime DatetimeEnd
        {
            set { datetimeEnd = value; }
            get { return datetimeEnd; }
        }

        public string Type
        {
            set { type = value; }
            get { return type; }
        }

        public string State
        {
            set { state = value; }
            get { return state; }
        }

        public double LevelTankBefore
        {
            set { levelTankBefore = value; }
            get { return levelTankBefore; }
        }

        public double LevelTankAfter
        {
            set { levelTankAfter = value; }
            get { return levelTankAfter; }
        }

        public int HumidityBefore
        {
            set { humidityBefore = value; }
            get { return humidityBefore; }
        }
        public int HumidityAfter
        {
            set { humidityAfter = value; }
            get { return humidityAfter; }
        }

        public void Validar()
        {
            if (tank is null) throw new Exception("Debe indicar un tanque para el riego");
            if (plant is null) throw new Exception("Debe indicar una planta para el riego");
            if (type != "Automatico" && type != "Manual") throw new Exception("Tipo de riego debe ser manual o automatico");
            if (state != "Completado" && state != "En curso" && state != "Fallido")
                throw new Exception("Estado de riego solo acepta los valores:completado o en curso o fallido");

        }
        public WaterPlantLog() { }


        public WaterPlantLog(int id, Tank tank, Plant plant, DateTime datetimeStart, DateTime datetimeEnd, string type, string state,
         double levelTankBefore, double levelTankAfter, int humidityBefore, int humidityAfter)
        {

            Id = id;
            Tank = tank;
            Plant = plant;
            DatetimeStart = datetimeStart;
            DatetimeEnd = datetimeEnd;
            State = state;
            Type = type;
            LevelTankBefore = levelTankBefore;
            LevelTankAfter = levelTankAfter;
            HumidityBefore = humidityBefore;
            HumidityAfter = humidityAfter;

        }

    }

}
