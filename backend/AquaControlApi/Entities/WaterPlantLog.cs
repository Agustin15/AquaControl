using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        private DateTime? datetimeStart;
        private DateTime? datetimeEnd;
        private string type;
        private string state;
        private double levelTankBefore;
        private double? levelTankAfter;
        private int humidityBefore;
        private int? humidityAfter;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }


        [Required(ErrorMessage = "Debe ingresar un tanque")]
        public Tank Tank
        {
            set { tank = value; }
            get { return tank; }
        }

        [Required(ErrorMessage = "Debe ingresar una planta")]
        public Plant Plant
        {
            set { plant = value; }
            get { return plant; }
        }

        public DateTime? DatetimeStart
        {
            set { datetimeStart = value; }
            get { return datetimeStart; }
        }

        public DateTime? DatetimeEnd
        {
            set { datetimeEnd = value; }
            get { return datetimeEnd; }
        }

        [Required(ErrorMessage = "Debe indicar el tipo de riego")]
        [AllowedValues(["Automatico", "Manual"], ErrorMessage = "Tipo de riego debe ser manual o automatico")]
        public string Type
        {
            set { type = value; }
            get { return type; }
        }

        [Required(ErrorMessage = "Debe indicar el estado del riego")]
        [AllowedValues(["En curso", "Completado", "Fallido", "Interrumpido"],
            ErrorMessage = "Estado de riego solo acepta los valores:Completado - En curso - Fallido - Interrumpido")]
        public string State
        {
            set { state = value; }
            get { return state; }
        }

        [Required(ErrorMessage = "Debe indicar el nivel que tiene el tanque previo al riego")]
        [Range(0, 100, ErrorMessage = "Nivel del tanque debe estar entre 0 y 100")]
        public double LevelTankBefore
        {
            set { levelTankBefore = value; }
            get { return levelTankBefore; }
        }

        [Range(0, 100, ErrorMessage = "Nivel del tanque debe estar entre 0 y 100")]
        public double? LevelTankAfter
        {
            set { levelTankAfter = value; }
            get { return levelTankAfter; }
        }

        [Required(ErrorMessage = "Debe indicar el nivel de humedad de la planta previo al riego")]
        [Range(0, 100, ErrorMessage = "Nivel de humedad debe estar entre 0 y 100")]
        public int HumidityBefore
        {
            set { humidityBefore = value; }
            get { return humidityBefore; }
        }

        [Range(0, 100, ErrorMessage = "Nivel de humedad debe estar entre 0 y 100")]
        public int? HumidityAfter
        {
            set { humidityAfter = value; }
            get { return humidityAfter; }
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
            State = state.Trim();
            Type = type.Trim();
            LevelTankBefore = levelTankBefore;
            LevelTankAfter = levelTankAfter;
            HumidityBefore = humidityBefore;
            HumidityAfter = humidityAfter;

        }

    }

}
