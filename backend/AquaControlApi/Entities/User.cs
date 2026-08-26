using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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

        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe ingresar un nombre de usuario")]
        [MaxLength(15, ErrorMessage = "Nombre de usuario no debe pasar de 15 caracteres")]
        public string Username
        {
            set { username = value; }
            get { return username; }
        }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe ingresar un correo")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Formato de correo incorrecto")]
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



        public User() { }

        public User(int id, string username, string email, string password, DateTime joined)
        {

            Id = id;
            Username = username.Trim();
            Email = email.Trim();
            Password = password.Trim();
            Joined = joined;

        }
        public void ValidationPassword()
        {
            if (!Regex.IsMatch(Password, @"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{13,}$"))
                throw new Exception("Formato de contraseña incorrecto");
        }
    }

}
