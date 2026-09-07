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
        string id;
        string token;
        User user;
        DateTime? created;
        DateTime? lastModified;

        [Required(ErrorMessage = "Debe indicar ID del dispositivo movil")]
        [MaxLength(16, ErrorMessage = "El Id de dispositivo movil no puede tener mas de 16 caracteres")]
        public string Id
        {
            set { id = value; }
            get { return id; }
        }



        [Required(ErrorMessage = "Debe indicar token")]
        [MaxLength(300, ErrorMessage = "El token no puede exceder los 300 caracteres")]
        public string Token
        {
            set { token = value; }
            get { return token; }
        }

        [Required(ErrorMessage = "Debe indicar un un usuario")]
        public User User
        {
            set { user = value; }
            get { return user; }
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

        public UserDeviceToken(string id, User user, string token, DateTime created, DateTime lastModified)
        {
            Id = id;
            User = user;
            Token = token;
            Created = created;
            LastModified = lastModified;
        }
    }
}
