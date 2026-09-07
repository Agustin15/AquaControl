using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class HumidityPlantLog
    {
        int id;
        double percentege;
        Plant plant;
        WeatherData weatherData;
        DateTime? datetimeLog;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        [Required(ErrorMessage = "Debe indicar el porcentaje de humedad de la planta")]
        [Range(0, 100, ErrorMessage = "Porcentaje de humedad debe estar entre 0 y 100")]
        public double Percentege
        {
            set { percentege = value; }
            get { return percentege; }
        }

        [Required(ErrorMessage = "Debe indicar planta a la que pertenece el registro de humedad")]
        public Plant Plant
        {
            set { plant = value; }
            get { return plant; }
        }

        [Required(ErrorMessage = "Debe indicar informacion del clima")]
        public WeatherData WeatherData
        {
            set { weatherData = value; }
            get { return weatherData; }
        }
        public DateTime? DatetimeLog
        {
            set { datetimeLog = value; }
            get { return datetimeLog; }
        }

        public HumidityPlantLog() { }

        public HumidityPlantLog(int id, Plant plant, double percentege, WeatherData weatherData, DateTime datetimeLog)
        {

            Id = id;
            Plant = plant;
            Percentege = percentege;
            WeatherData = weatherData;
            DatetimeLog = datetimeLog;

        }
    }
}
