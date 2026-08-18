using Api.Model;
using DAL;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]

    public class DeviceController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("api/device")]
        [HttpPost]
        public async Task<IActionResult> AddDevice([FromBody] Device device)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.NameIdentifier) is null)
                    return Unauthorized();

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                User userFound = await new Luser().GetUserById(idUser);
                if (userFound is null) return StatusCode(404, new { message = "Usuario no encontrado" });

                device = new Device(0, device.PlaceName, userFound, DateTime.Now);

                device.Validar();

                await new Ldevice().Add(device);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut]
        [Route("api/device")]
        public async Task<IActionResult> UpdateDevice([FromBody] Device device)
        {
            try
            {

                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.NameIdentifier) is null)
                    return Unauthorized();

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devices = await new Ldevice().GetAllDevicesByUser(idUser);

                if (devices.Find(d => d.Id == device.Id) is null) return StatusCode(404, new { message = "Dispositivo no encontrado" });

                User userFound = await new Luser().GetUserById(device.User.Id);

                if (userFound is null) return StatusCode(404, new { message = "Usuario no encontrado" });

                device.User = userFound;

                device.Validar();

                await new Ldevice().UpdatePlaceNameDevice(device);

                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete]
        [Route("api/device/")]
        public async Task<IActionResult> DeleteDevice(Device device)
        {
            try
            {

                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.NameIdentifier) is null)
                    return Unauthorized();

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devices = await new Ldevice().GetAllDevicesByUser(idUser);

                Device deviceFound = devices.Find(d => d.Id == device.Id);

                if (deviceFound is null) return StatusCode(404, new { message = "Dispositivo no encontrado" });

                await new Ldevice().Delete(deviceFound);

                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet]
        [Route("api/device/allUserDevices")]
        public async Task<ActionResult> GetAllDevicesByUser()
        {
            try
            {

                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.NameIdentifier) is null)
                    return Unauthorized();

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devices = await new Ldevice().GetAllDevicesByUser(idUser);

                if (devices.Count == 0) throw new Exception("No tiene dispositivos de riegos vinculados aun");

                return Ok(devices);

            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [Route("api/device/deviceSelected")]
        [HttpPost]
        public async Task<IActionResult> SelectDevice([FromBody] Device device)
        {
            try
            {

                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.NameIdentifier) is null)
                    return Unauthorized();

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devices = await new Ldevice().GetAllDevicesByUser(idUser);

                if (devices.Find(d => d.Id == device.Id) is null) return StatusCode(404, new { message = "Dispositivo no encontrado" });

                Authentication authentication = new Authentication();

                string jwtAccessTokenSerialized = authentication.GenerateAccessJWTtoken(idUser, device.Id);
                string jwtRefreshTokenSerialized = authentication.GenerateRefreshJWTtoken(idUser, device.Id);

                return Ok(new
                {
                    accessToken = jwtAccessTokenSerialized,
                    refreshToken = jwtRefreshTokenSerialized
                });
            }
            catch (Exception ex)
            {
                return StatusCode(401, new { message = ex.Message });

            }
        }
    }
}
