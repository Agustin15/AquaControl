using System.ComponentModel.DataAnnotations;

namespace Api.Model
{
    public class LoginDto
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe ingresar nombre de usuario")]
        public string Username { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Debe ingresar contraseña")]
        public string Password { get; set; }
    }
}
