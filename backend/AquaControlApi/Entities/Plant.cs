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
        private byte[] image;
        private string description;
        private Device device;

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

        public byte[] Image
        {
            set { image = value; }
            get { return image; }
        }

        [Required(ErrorMessage = "Debe indicar si es encerrado o no")]
        public Boolean Indoor
        {
            set { indoor = value; }
            get { return indoor; }
        }

        public string Description
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


        public void Validation()
        {
            if (!String.IsNullOrWhiteSpace(Description) && Description.Length > 500)
                throw new Exception("Descripcion debe contener como maximo 500 caracteres");

            if (image != null && image.Length == 0) throw new Exception("Debe indicar una imagen");
        }

        public Plant() { }

        public Plant(int id, int umbralHumidity, bool indoor, byte[] image, string description, Device device)
        {

            Id = id;
            UmbralHumidity = umbralHumidity;
            Image = image;
            Indoor = indoor;
            Description = description.Trim();
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
