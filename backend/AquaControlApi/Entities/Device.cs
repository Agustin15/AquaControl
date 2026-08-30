using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Entities
{
    public class Device
    {
        int id;
        string placeName;
        string location;
        User user;
        DateTime created;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe indicar nombre del lugar al que pertenece el riego")]
        [MaxLength(15, ErrorMessage = "Nombre del lugar no debe pasar de 15 caracteres")]
        public string PlaceName
        {
            set { placeName = value; }
            get { return placeName; ; }
        }


        [Required(ErrorMessage = "Debe indicar una ubicacion")]
        [RegularExpression(@"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$",ErrorMessage ="Formato de ubicacion incorrecto")]
      
        public string Location
        {
            set { location = value; }
            get { return location; }
        }

        [Required(ErrorMessage = "Debe indicar un usuario")]
        public User User
        {
            set { user = value; }
            get { return user; }
        }


        [Required(ErrorMessage = "Fecha de creacion del dispositivo no puede ser nula")]
        public DateTime Created
        {
            set { created = value; }
            get { return created; }
        }

        public Device() { }

        public Device(int id, string placeName,string location, User user, DateTime created)
        {

            Id = id;
            PlaceName = placeName?.Trim();
            Location = location?.Trim();
            User = user;
            Created = created;

        }
    }

}
