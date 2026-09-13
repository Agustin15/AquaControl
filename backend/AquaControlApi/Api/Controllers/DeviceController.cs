using Api.Filters;
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

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador", Policy = "HasUser")]
        [ValidateModelFilter]
        [Route("api/device")]
        [HttpPost]
        public async Task<IActionResult> AddDevice([FromBody] Device device)
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                if (device.Users.Count == 0 || device.Users.First().Id != idUser)
                    return StatusCode(400, new { message = "El usuario asociado al dispositivo de riego es distinto al usuario logueado" });

                await new Ldevice().Add(device);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador", Policy = "HasUser")]
        [ValidateModelFilter]
        [HttpPut]
        [Route("api/device")]
        public async Task<IActionResult> UpdateDevice([FromBody] Device device)
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devicesUser = await new Ldevice().GetDevicesByIdUser(idUser);

                if (devicesUser.Count == 0 || !devicesUser.Exists(d => d.Id == device.Id))
                    return StatusCode(403, new { message = "No tiene accesso a este dipositivo de riego" });

                await new Ldevice().Update(device);

                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador", Policy = "HasUser")]
        [ValidateModelFilter]
        [HttpDelete]
        [Route("api/device")]
        public async Task<IActionResult> DeleteDevice(Device device)
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devicesUser = await new Ldevice().GetDevicesByIdUser(idUser);

                if (devicesUser.Count == 0 || !devicesUser.Exists(d => d.Id == device.Id))
                    return StatusCode(403, new { message = "No tiene accesso a este dipositivo de riego" });

                await new Ldevice().Delete(device);

                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador", Policy = "HasIdDeviceAndUser")]
        [ValidateModelFilter]
        [HttpDelete]
        [Route("api/device/userDevice")]
        public async Task<IActionResult> DeleteUserOfDevice([FromBody] User user)
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                Device device = await new Ldevice().GetDeviceById(idDevice);

                if (device is null) return StatusCode(404, new { message = "Dispositivo no encontrado" });

                if (device.Users.Find(user => user.Id == idUser) == null) return StatusCode(403, new { message = "No tiene accesso a este dispositivo" });

                await new Ldevice().DeleteUserOfDevice(device, user);

                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasUser")]
        [HttpGet]
        [Route("api/device/allUserDevices")]
        public async Task<ActionResult> GetDevicesByIdUser()
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devices = await new Ldevice().GetDevicesByIdUser(idUser);

                if (devices.Count == 0) throw new Exception("No tiene dispositivos de riegos vinculados aun");

                return Ok(devices);

            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasUser")]
        [ValidateModelFilter]
        [Route("api/device/deviceSelected")]
        [HttpPost]
        public async Task<IActionResult> SelectDevice([FromBody] Device device)
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                List<Device> devicesUser = await new Ldevice().GetDevicesByIdUser(idUser);

                if (devicesUser.Count == 0 || !devicesUser.Exists(d => d.Id == device.Id))
                    return StatusCode(403, new { message = "No tiene accesso a este dipositivo de riego" });


                Device deviceFound = devicesUser.Find(d => d.Id == device.Id);
                User userFound = deviceFound.Users.Find(u => u.Id == idUser);

                Authentication authentication = new Authentication();

                string jwtAccessTokenSerialized = authentication.GenerateAccessJWTtoken(userFound, device.Id);
                string jwtRefreshTokenSerialized = authentication.GenerateRefreshJWTtoken(userFound, device.Id);

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
