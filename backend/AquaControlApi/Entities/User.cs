using System.Text.RegularExpressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Entities
{
    public class User
    {
        int id;
        string username;
        string email;
        string password;
        DateTime joined;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        public string Username
        {
            set { username = value; }
            get { return username; }
        }

        public string Email
        {
            set { email = value; }
            get { return email; }
        }

        public string Password
        {
            set { password = value; }
            get { return password; }
        }

        public DateTime Joined
        {
            set { joined = value; }
            get { return joined; }
        }

        public void Validar()
        {

            if (String.IsNullOrEmpty(Username.Trim())) throw new Exception("Debe ingresar un nombre de usuario");

            if (Username.Trim().Length > 15) throw new Exception("Nombre de usuario no debe pasar de 15 caracteres");

            if (String.IsNullOrEmpty(Password)) throw new Exception("Debe ingresar una contraseña");

            if (!Regex.IsMatch(Password, @"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{13,}$"))
                throw new Exception("Formato de contraseña no valido");

            if (String.IsNullOrEmpty(Email)) throw new Exception("Debe ingresar un correo");

            if (!Regex.IsMatch(Email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
                throw new Exception("Formato de correo no valido");


        }


        public User() { }

        public User(int id, string username, string email, string password, DateTime joined)
        {

            Id = id;
            Username = username;
            Email = email;
            Password = password;
            Joined = joined;

        }
    }

}
