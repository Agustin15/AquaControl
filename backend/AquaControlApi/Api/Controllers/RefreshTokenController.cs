using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{

    [ApiController]
    public class RefreshTokenController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "RefreshBearer", Policy = "HasUser")]
        [Authorize(Policy = "HasRole")]
        [Route("api/refreshToken")]
        [HttpPost]
        public async Task<ActionResult> RefreshToken()
        {

            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                string idDevice = "", roleInDevice = "";


                if (User.FindFirst("IdDevice") != null)
                    idDevice = User.FindFirst("IdDevice").Value;

                if (User.FindAll(ClaimTypes.Role).Count() > 1)
                    roleInDevice = User.FindAll(ClaimTypes.Role).ElementAt(1).Value;

                Authentication authentication = new Authentication();

                User userFound = await new Luser().GetUserById(idUser);

                if (userFound is null) throw new Exception("Usuario no encontrado");

                var jwtAccessToken = authentication.GenerateAccessJWTtoken(userFound, idDevice, roleInDevice);

                return Ok(new { accessToken = jwtAccessToken });
            }
            catch (Exception ex)
            {
                return StatusCode(401, new { message = ex.Message });
            }
        }
    }
}
