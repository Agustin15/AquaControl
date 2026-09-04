using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class UserDeviceToken
    {
        string idUserDevice;
        User user;
        string token;
        DateTime? created;
        DateTime? lastModified;


        [Required(ErrorMessage = "Identificador del dispositivo movil es requerido")]
        public string IdUserDevice
        {
            set { idUserDevice = value; }
            get { return idUserDevice; }
        }

        [Required(ErrorMessage = "Debe indicar un un usuario")]
        public User User
        {
            set { user = value; }
            get { return user; }
        }

        [Required(ErrorMessage = "Debe indicar token")]
        [MaxLength(300, ErrorMessage = "El token no puede exceder los 300 caracteres")]
        public string Token
        {
            set { token = value; }
            get { return token; }
        }

        public DateTime? Created
        {
            set { created = value; }
            get { return created; }
        }

        public DateTime? LastModified
        {
            set { lastModified = value; }
            get { return lastModified; }
        }

        public UserDeviceToken() { }

        public UserDeviceToken(string idUserDevice, User user, string token, DateTime created, DateTime lastModified)
        {
            IdUserDevice = idUserDevice?.Trim();
            User = user;
            Token = token;
            Created = created;
            LastModified = lastModified;
        }
    }
}
