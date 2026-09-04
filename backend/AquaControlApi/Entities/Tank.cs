using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class Tank
    {
        private int id;
        private double height;
        private Device device;

        [Required(ErrorMessage = "Debe indicar el numero de tanque")]
        [Range(0, int.MaxValue, ErrorMessage = "Numero de tanque debe ser un valor positivo")]
        public int Id
        {
            set { id = value; }
            get { return id; }
        }


        [Required(ErrorMessage = "Debe indicar altura del tanque")]
        [Range(15, 800, ErrorMessage = "Altura del tanque debe estar entre 15 y 800 CM")]
        public double Height
        {
            set { height = value; }
            get { return height; }
        }


        [Required(ErrorMessage = "Tanque debe pertenecer a un dispositivo de riego")]
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
