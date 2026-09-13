using Api.Filters;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    public class UserOfAlertController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDeviceUser")]
        [ValidateModelFilter]
        [HttpPut("api/userOfAlert/{idAlert}")]
        public async Task<ActionResult> UpdateAlertStateToSeen([FromBody] UserOfAlert userOfAlert, int idAlert)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);
                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                Alert alertFound = await new Lalert().GetAlertById(idAlert);

                if (alertFound is null) return StatusCode(404, "Alerta no encontrada");

                if (userOfAlert.User.Id != idUser || alertFound.Device.Id != idDevice) return StatusCode(403, "No tiene autorizacion para acceder a esta alerta");

                await new LuserOfAlert().UpdateAlertUserState(alertFound, userOfAlert);

                return Ok(userOfAlert);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}
