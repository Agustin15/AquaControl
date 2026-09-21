using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class UserOfDevice
    {
        User user;
        string role;
        DateTime? joined;


        [Required(ErrorMessage = "Debe indicar un usuario")]
        public User User
        {
            set { user = value; }
            get { return user; }
        }

        [AllowedValues(["Operador", "Lector"], ErrorMessage = "Rol no valido")]
        public string Role
        {
            set { role = value; }
            get { return role; }
        }

        public DateTime? Joined
        {
            set { joined = value; }
            get { return joined; }
        }

        public UserOfDevice() { }

        public UserOfDevice(User user,string role, DateTime joined)
        {
            User = user;
            Role = role;
            Joined = joined;
        }
    }
}
