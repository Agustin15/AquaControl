using Api.Filters;
using DAL;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{

    [ApiController]
    public class UserOfDeviceController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Bearer", Roles = ("Administrador,Operador"), Policy = "HasDevice")]
        [ValidateModelFilter]
        [Route("api/userOfDevice/device/{idDevice}")]
        [HttpPost]
        public async Task<IActionResult> AddUserOfDevice([FromBody] UserOfDevice userOfDevice, string idDevice)
        {

            try
            {
                string idDeviceToken = User.FindFirst("IdDevice").Value;

                if (idDevice != idDeviceToken) return StatusCode(404, new { message = "No tiene acceso a este dipositivo de riego" });

                Device device = await new Ldevice().GetDeviceById(idDevice);

                if (device is null) return StatusCode(404, new { message = "Dispositivo no encontrado" });

                await new LuserOfDevice().AddUserDevice(device, userOfDevice);

                return Ok(true);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }

        }


        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador,Operador", Policy = "HasDevice")]
        [ValidateModelFilter]
        [HttpPut]
        [Route("api/userOfDevice/device/{idDevice}")]
        public async Task<IActionResult> UpdateUserOfDevice([FromBody] UserOfDevice userOfDevice, string idDevice)
        {
            try
            {
                string idDeviceToken = User.FindFirst("IdDevice").Value;

                if (idDevice != idDeviceToken) return StatusCode(403, new { message = "No tiene accesso a este dipositivo de riego" });

                Device device = await new Ldevice().GetDeviceById(idDevice);

                if (device is null) return StatusCode(404, new { message = "Dispositivo no encontrado" });

                await new LuserOfDevice().UpdateUserDevice(device, userOfDevice);

                return Ok(userOfDevice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador,Operador", Policy = "HasDevice")]
        [ValidateModelFilter]
        [HttpDelete]
        [Route("api/userOfDevice/device/{idDevice}")]
        public async Task<IActionResult> DeleteUserOfDevice([FromBody] UserOfDevice userOfDevice, string idDevice)
        {
            try
            {
                string idDeviceToken = User.FindFirst("IdDevice").Value;

                if (idDevice != idDeviceToken) return StatusCode(403, new { message = "No tiene accesso a este dipositivo de riego" });

                Device device = await new Ldevice().GetDeviceById(idDevice);

                if (device is null) return StatusCode(404, new { message = "Dispositivo no encontrado" });

                await new LuserOfDevice().DeleteUserDevice(device, userOfDevice);

                return Ok(userOfDevice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

    }
}
