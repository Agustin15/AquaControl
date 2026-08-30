using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class Alert
    {
        private int id;
        private string message;
        private DateTime datetimeAlert;
        private bool seen = false;
        private Device device;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Mensaje no puede estar vacio")]
        public string Message
        {
            set { message = value; }
            get { return message; }
        }

        [Required(ErrorMessage = "Fecha de creacion de la alerta no pude ser nula")]
        public DateTime DatetimeAlert
        {
            set { datetimeAlert = value; }
            get { return datetimeAlert; }
        }

        [Required(ErrorMessage = "Debe indicar estado de visualizacion de la alerta")]
        public bool Seen
        {
            set { seen = value; }
            get { return seen; }
        }

        [Required(ErrorMessage = "Alerta debe pertencer a algun dispositivo de riego")]
        public Device Device
        {
            set { device = value; }
            get { return device; }
        }

        public Alert() { }

        public Alert(int id, string message, bool seen, Device device)
        {
            Id = id;
            Message = message?.Trim();
            Seen = seen;
            Device = device;
        }




    }

}
