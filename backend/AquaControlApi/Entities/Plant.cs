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
        private byte[] image;
        private string description;
        private Device device;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

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

        public string Description
        {
            set { description = value; }
            get { return description; }
        }

        public Device Device
        {
            set { device = value; }
            get { return device; }
        }


        public void Validar()
        {

            if (umbralHumidity > 100 || umbralHumidity < 0) throw new Exception("Umbral de humedad debe estar entre 0 y 100");

            if (!String.IsNullOrWhiteSpace(Description) && Description.Length > 500)
                throw new Exception("Descripcion debe contener como maximo 500 caracteres");

            if (image != null && image.Length == 0) throw new Exception("Debe indicar una imagen");

            if (Device is null)
                throw new Exception("Planta debe pertenecer a un dispositivo de riego");
        }

        public Plant() { }

        public Plant(int id, int umbralHumidity, byte[] image, string description, Device device)
        {

            Id = id;
            UmbralHumidity = umbralHumidity;
            Image = image;
            Description = description;
            Device = device;

        }
    }

}
