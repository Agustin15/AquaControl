using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class UserOfAlert
    {
        bool seen = false;
        User user;

        [Required(ErrorMessage = "Debe indicar estado de visualizacion de la alerta")]
        public bool Seen
        {
            set { seen = value; }
            get { return seen; }
        }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe indicar un usuario")]
        public User User
        {
            set { user = value; }
            get { return user; }
        }

        public UserOfAlert() { }

        public UserOfAlert(bool seen, User user)
        {
            Seen = seen;
            User = user;
        }
    }
}
