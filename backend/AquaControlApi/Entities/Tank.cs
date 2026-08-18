using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class Tank
    {
        private int id;
        private double height;
        private Device device;


        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        public double Height
        {
            set { height = value; }
            get { return height; }
        }


        public void Validar()
        {
            if (Height <= 0)
                throw new Exception("Altura del tanque debe ser al menos mayor a cero");

            if (Device is null)
                throw new Exception("Tanque debe pertenecer a un dispositivo de riego");
        }

        public Device Device
        {
            set { device = value; }
            get { return device; }
        }


        public Tank() { }

        public Tank(int id, double height, Device device)
        {

            Id = id;
            Height = height;
            Device = device;


        }
    }

}
