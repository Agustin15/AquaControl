using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class Device
    {
        int id;
        string placeName;
        User user;
        DateTime created;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        public string PlaceName
        {
            set { placeName = value; }
            get { return placeName; ; }
        }

        public User User
        {
            set { user = value; }
            get { return user; }
        }

        public DateTime Created
        {
            set { created = value; }
            get { return created; }
        }

        public void Validar()
        {

            if (String.IsNullOrEmpty(PlaceName.Trim())) throw new Exception("Debe ingresar nombre del lugar");

            if (PlaceName.Trim().Length > 15) throw new Exception("Nombre del lugar no debe pasar de 15 caracteres");

            if (User is null) throw new Exception("Usuario no puede estar vacio");
        }


        public Device() { }

        public Device(int id, string placeName, User user, DateTime created)
        {

            Id = id;
            PlaceName = placeName;
            User = user;
            Created = created;

        }
    }

}
