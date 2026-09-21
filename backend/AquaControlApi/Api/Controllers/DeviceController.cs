using Api.Filters;
using Api.Model;
using CloudinaryDotNet.Actions;
using DAL;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]

    public class DeviceController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador")]
        [ValidateModelFilter]
        [Route("api/device")]
        [HttpPost]
        public async Task<IActionResult> AddDevice([FromBody] Device device)
        {
            try
            {
                await new Ldevice().Add(device);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador,Operador", Policy = ("HasUser"))]
        [Authorize(Policy = "HasRole")]
        [ValidateModelFilter]
        [HttpPut]
        [Route("api/device")]
        public async Task<IActionResult> UpdateDevice([FromBody] Device device)
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                bool isOperator = User.FindAll(ClaimTypes.Role).ToList().Exists(claimRole => claimRole.Value == "Operador");

                if (isOperator && !device.UsersOfDevice.Exists(ud => ud.User.Id == idUser))
                    return StatusCode(403, new { message = "No tiene accesso a este dipositivo de riego" });


                await new Ldevice().Update(device);

                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador")]
        [ValidateModelFilter]
        [HttpDelete]
        [Route("api/device")]
        public async Task<IActionResult> DeleteDevice(Device device)
        {
            try
            {
                await new Ldevice().Delete(device);
                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }


        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador,Cliente", Policy = "HasUser")]
        [Authorize(Policy = "HasRole")]
        [HttpGet]
        [Route("api/device/allUserDevices/user/{idUser}")]
        public async Task<ActionResult> GetDevicesByIdUser(int idUser)
        {
            try
            {

                int idUserToken = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                bool isClient = User.FindAll(ClaimTypes.Role).ToList().Exists(claimRole => claimRole.Value == "Cliente");

                if (isClient && idUser != idUserToken) return StatusCode(403, new { message = "No tiene accesso a este usuario" });

                List<Device> devices = await new Ldevice().GetDevicesByIdUser(idUser);

                if (devices.Count == 0) throw new Exception("No tiene dispositivos de riegos vinculados aun");

                return Ok(devices);

            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Cliente,Operador,Lector", Policy = "HasUser")]
        [ValidateModelFilter]
        [Route("api/device/deviceSelected")]
        [HttpPost]
        public async Task<IActionResult> SelectDevice([FromBody] Device device)
        {
            try
            {

                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                if (!device.UsersOfDevice.Exists(ud => ud.User.Id == idUser))
                    return StatusCode(403, new { message = "No tiene accesso a este dipositivo de riego" });

                UserOfDevice userOfDeviceFound = device.UsersOfDevice.Find(ud => ud.User.Id == idUser);

                Authentication authentication = new Authentication();

                string jwtAccessTokenSerialized = authentication.GenerateAccessJWTtoken(userOfDeviceFound.User, device.Id, userOfDeviceFound.Role);
                string jwtRefreshTokenSerialized = authentication.GenerateRefreshJWTtoken(userOfDeviceFound.User, device.Id, userOfDeviceFound.Role);

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
