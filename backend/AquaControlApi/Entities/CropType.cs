using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class CropType
    {
        string name;
        string image;
        int humidityMin;
        int humidityMax;

        [Required(ErrorMessage = "Debe indicar el nombre del cultivo")]
        [StringLength(30, ErrorMessage = "El nombre del cultivo no puede exceder los 30 caracteres")]
        public string Name
        {
            get { return name; }
            set { name = value; }
        }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe proporcionar una imagen del cultivo")]
        public string Image
        {
            get { return image; }
            set { image = value; }
        }


        [Required(ErrorMessage = "Debe indicar humedad minima")]
        [Range(0, 100, ErrorMessage = "Humedad minima debe estar entre 0 y 100")]
        public int HumidityMin
        {
            get { return humidityMin; }
            set { humidityMin = value; }
        }

        [Required(ErrorMessage = "Debe indicar humedad maxima")]
        [Range(0, 100, ErrorMessage = "Humedad maxima debe estar entre 0 y 100")]
        public int HumidityMax
        {
            get { return humidityMax; }
            set { humidityMax = value; }
        }


        public CropType() { }

        public CropType(string name, string image, int humidityMin, int humidityMax)
        {
            Name = name;
            Image = image;
            HumidityMin = humidityMin;
            HumidityMax = humidityMax;
        }

        public void ValidationHumidity()
        {
            if (HumidityMax <= HumidityMin) throw new Exception("Humedad maxima no puede ser menor o igual a humedad minima");

        }

    }
}
