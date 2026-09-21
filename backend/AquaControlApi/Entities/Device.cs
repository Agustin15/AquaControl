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
        string id;
        string placeName;
        string location;
        bool linked = false;
        List<UserOfDevice> usersOfDevice;
        DateTime? created;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe indicar -identificador del dispositivo de riego")]
        public string Id
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

        [Required(ErrorMessage = "Debe indicar si el dispositivo se ha configurado o no")]
        public bool Linked
        {
            set { linked = value; }
            get { return linked; }
        }

        [MinLength(1, ErrorMessage = "Debe asociar al menos un usuario al dispositivo")]
        public List<UserOfDevice> UsersOfDevice
        {
            set { usersOfDevice = value; }
            get { return usersOfDevice; }
        }

        public DateTime? Created
        {
            set { created = value; }
            get { return created; }
        }

        public Device() { }

        public Device(string id, string placeName, string location,bool linked, List<UserOfDevice> usersOfDevice, DateTime created)
        {

            Id = id;
            PlaceName = placeName?.Trim();
            Location = location?.Trim();
            Linked = linked;
            UsersOfDevice = usersOfDevice;
            Created = created;

        }
    }

}
