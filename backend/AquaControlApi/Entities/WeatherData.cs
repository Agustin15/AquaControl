using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class WeatherData
    {
        public int Humidity { set; get; }
        public double Temperature { set; get; }
        public double PrecipitationChance { set; get; }
        public string Icon { set; get; }

        public WeatherData() { }

        public WeatherData(int humidity, double temperature, double precipitationChance, string icon)
        {

            Humidity = humidity;
            Temperature = temperature;
            PrecipitationChance = PrecipitationChance;
            Icon = icon;
        }
    }
}
