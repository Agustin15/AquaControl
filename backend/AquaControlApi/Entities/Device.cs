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
        List<User>? users;
        DateTime? created;

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
        [RegularExpression(@"^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$", ErrorMessage = "Formato de ubicacion incorrecto")]
        public string Location
        {
            set { location = value; }
            get { return location; }
        }

        [MinLength(1, ErrorMessage = "Debe asociar al menos un usuario al dispositivo")]
        public List<User>? Users
        {
            set { users = value; }
            get { return users; }
        }

        public DateTime? Created
        {
            set { created = value; }
            get { return created; }
        }

        public Device() { }

        public Device(int id, string placeName, string location, List<User> users, DateTime created)
        {

            Id = id;
            PlaceName = placeName?.Trim();
            Location = location?.Trim();
            Users = users;
            Created = created;

        }
    }

}
