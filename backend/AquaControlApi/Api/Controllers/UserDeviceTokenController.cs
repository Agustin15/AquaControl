using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{

    [ApiController]
    public class UserDeviceTokenController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        [Route("api/userDeviceToken")]
        public async Task<ActionResult> VerifyIfExistsUserDeviceToken([FromBody] UserDeviceToken userDeviceToken)
        {
            try

            {

                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.NameIdentifier) is null)
                    return Unauthorized();

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                if (!ModelState.IsValid) return StatusCode(400, new { message = ModelState.Values.First().Errors.First().ErrorMessage });

                if (userDeviceToken.User.Id != idUser)
                    return StatusCode(403, new { message = "Usuario del token del dispositivo movil ingresado, no coindice con el logueado" });

                UserDeviceToken userDeviceTokenFound = await new LuserDeviceToken().GetUserDeviceTokenById(userDeviceToken.Id);

                if (userDeviceTokenFound == null)
                {
                    await new LuserDeviceToken().Add(userDeviceToken);
                }
                else if (userDeviceTokenFound.Token != userDeviceToken.Token)
                {
                    await new LuserDeviceToken().Update(userDeviceTokenFound);
                }


                return StatusCode(201, true);

            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }


    }
}
