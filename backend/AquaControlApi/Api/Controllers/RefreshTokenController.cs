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
        [Authorize(AuthenticationSchemes = "RefreshBearer")]
        [Route("api/refreshToken")]
        [HttpPost]
        public ActionResult RefreshToken()
        {

            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.NameIdentifier) is null || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                Authentication authentication = new Authentication();

                var jwtAccessToken = authentication.GenerateAccessJWTtoken(idUser, idDevice);

                return Ok(new { accessToken = jwtAccessToken });
            }
            catch (Exception ex)
            {
                return StatusCode(401, new { message = ex.Message });
            }
        }
    }
}
