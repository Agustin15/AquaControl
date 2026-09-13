using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class HumidityPlantationLog
    {
        int id;
        double percentege;
        Plantation plantation;
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

        [Required(ErrorMessage = "Debe indicar la plantacion a la que pertenece el registro de humedad")]
        public Plantation Plantation
        {
            set { plantation = value; }
            get { return plantation; }
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

        public HumidityPlantationLog() { }

        public HumidityPlantationLog(int id, double percentege, Plantation plantation, WeatherData weatherData, DateTime datetimeLog)
        {

            Id = id;
            Percentege = percentege;
            Plantation = plantation;
            WeatherData = weatherData;
            DatetimeLog = datetimeLog;

        }
    }
}
