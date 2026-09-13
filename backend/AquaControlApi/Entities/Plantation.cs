using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class Plantation
    {
        int id;
        int humidityMin;
        int humidityMax;
        bool indoor;
        CropType cropType;
        int amountPlants;
        string? image;
        Device device;

        [Required(ErrorMessage = "Debe indicar el numero de planta")]
        [Range(0, int.MaxValue, ErrorMessage = "Numero de la planta debe ser un valor positivo")]
        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        [Required(ErrorMessage = "Debe indicar el tipo de culitvo")]
        public CropType CropType
        {
            set { cropType = value; }
            get { return cropType; }
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


        [MinLength(1, ErrorMessage = "Imagen no valida")]
        public string? Image
        {
            set { image = value; }
            get { return image; }
        }


        [Required(ErrorMessage = "Debe indicar cantidad de plantas sembradas")]
        [Range(1, 6, ErrorMessage = "Plantas sembradas debe ser entre 1 y 6")]
        public int AmountPlants
        {
            set { amountPlants = value; }
            get { return amountPlants; }
        }

        [Required(ErrorMessage = "Debe indicar si la planta esta en un lugar cerrado o no")]
        public bool Indoor
        {
            set { indoor = value; }
            get { return indoor; }
        }

        [Required(ErrorMessage = "Planta debe pertenecer a un dispositivo de riego")]
        public Device Device
        {
            set { device = value; }
            get { return device; }
        }

        public Plantation() { }

        public Plantation(int id, CropType cropType, int humidityMin, int humidityMax, string image, int amountPlants, bool indoor, Device device)
        {

            Id = id;
            CropType = cropType;
            HumidityMin = humidityMin;
            HumidityMax = humidityMax;
            Image = image;
            AmountPlants = amountPlants;
            Indoor = indoor;
            Device = device;

        }

        public Plantation(int id, CropType cropType, int humidityMin, int humidityMax, int amountPlants, bool indoor, Device device)
        {

            Id = id;
            cropType = cropType;
            HumidityMin = humidityMin;
            HumidityMax = humidityMax;
            AmountPlants = amountPlants;
            Indoor = indoor;
            Device = device;

        }
        public void ValidationHumidity()
        {
            if (HumidityMax <= HumidityMin) throw new Exception("Humedad maxima no puede ser menor o igual a humedad minima");

        }

    }

}
