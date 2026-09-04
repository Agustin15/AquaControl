using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class Alert
    {
        private int id;
        private string title;
        private string message;
        private string type;
        private DateTime? datetimeAlert;
        private bool seen = false;
        private Device device;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }


        [Required(AllowEmptyStrings = false, ErrorMessage = "Titulo no puede estar vacio")]
        [MaxLength(30, ErrorMessage = "Titulo no puede tener mas de 30 caracteres")]
        public string Title
        {
            set { title = value; }
            get { return title; }
        }

        [Required(ErrorMessage = "Debe indicar el tipo de alerta")]
        [AllowedValues(["Advertencia", "Exito"], ErrorMessage = "Tipo de alerta solo acepta los valores Advertencia o Exito")]
        public string Type
        {
            set { type = value; }
            get { return type; }
        }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Mensaje no puede estar vacio")]
        [MaxLength(60, ErrorMessage = "Mensaje no puede tener mas de 60 caracteres")]
        public string Message
        {
            set { message = value; }
            get { return message; }
        }

        [Required(ErrorMessage = "Debe indicar estado de visualizacion de la alerta")]
        public bool Seen
        {
            set { seen = value; }
            get { return seen; }
        }
        public DateTime? DatetimeAlert
        {
            set { datetimeAlert = value; }
            get { return datetimeAlert; }
        }


        [Required(ErrorMessage = "Alerta debe pertencer a algun dispositivo de riego")]
        public Device Device
        {
            set { device = value; }
            get { return device; }
        }


        public Alert() { }

        public Alert(int id, string title, string message, string type, bool seen, Device device)
        {
            Id = id;
            Title = title?.Trim();
            Message = message?.Trim();
            Type = type?.Trim();
            Seen = seen;
            Device = device;

        }




    }

}
