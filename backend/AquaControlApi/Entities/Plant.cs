using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class Plant
    {
        private int id;
        private int umbralHumidity;
        private bool indoor;
        private byte[]? image;
        private string? description;
        private Device device;

        [Required(ErrorMessage = "Debe indicar el numero de planta")]
        [Range(0, int.MaxValue, ErrorMessage = "Numero de la planta debe ser un valor positivo")]
        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        [Required(ErrorMessage = "Debe indicar un umbral de humedad")]
        [Range(0, 100, ErrorMessage = "Umbral de humedad debe estar entre 0 y 100")]
        public int UmbralHumidity
        {
            set { umbralHumidity = value; }
            get { return umbralHumidity; }
        }

        [MinLength(1, ErrorMessage = "Imagen no valida")]
        public byte[]? Image
        {
            set { image = value; }
            get { return image; }
        }

        [Required(ErrorMessage = "Debe indicar si la planta esta en un lugar cerrado o no")]
        public Boolean Indoor
        {
            set { indoor = value; }
            get { return indoor; }
        }

        [MaxLength(500, ErrorMessage = "Descripcion solo pueden tener un maximo de 500 caracteres")]
        public string? Description
        {
            set { description = value; }
            get { return description; }
        }

        [Required(ErrorMessage = "Planta debe pertenecer a un dispositivo de riego")]
        public Device Device
        {
            set { device = value; }
            get { return device; }
        }

        public Plant() { }

        public Plant(int id, int umbralHumidity, bool indoor, byte[] image, string description, Device device)
        {

            Id = id;
            UmbralHumidity = umbralHumidity;
            Image = image;
            Indoor = indoor;
            Description = description?.Trim();
            Device = device;

        }

        public Plant(int id, int umbralHumidity, bool indoor, string description, Device device)
        {

            Id = id;
            UmbralHumidity = umbralHumidity;
            Indoor = indoor;
            Description = description?.Trim();
            Device = device;

        }

    }

}
