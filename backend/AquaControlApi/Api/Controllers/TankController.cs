
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    public class TankController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        [Route("api/tank")]
        public async Task<ActionResult> Add([FromBody] Tank tank)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                Device deviceFound = await new Ldevice().GetDeviceById(idDevice);

                if (deviceFound is null) return StatusCode(404, new { message = "Dispositivo no encontado" });
                tank.Device = deviceFound;

                List<Tank> tanksOfDevice = await new Ltank().GetAllTanksByDevice(idDevice);

                if (tanksOfDevice.Count == 0) tank.Id = 1;
                else tank.Id = tanksOfDevice.Count + 1;


                tank.Validar();

                await new Ltank().Add(tank);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut]
        [Route("api/tank")]
        public async Task<ActionResult> Update([FromBody] Tank tank)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                Device deviceFound = await new Ldevice().GetDeviceById(idDevice);

                if (deviceFound is null) return StatusCode(404, new { message = "Dispositivo no encontado" });

                tank.Device = deviceFound;

                tank.Validar();

                await new Ltank().Update(tank);

                return Ok(tank);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpDelete]
        [Route("api/tank")]
        public async Task<ActionResult> Delete(Tank tank)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                Tank tankFound = await new Ltank().GetTankOfDeviceById(tank.Id, idDevice);

                if (tankFound is null) throw new Exception("Tanque no encontrado");

                await new Ltank().Delete(tankFound);

                return Ok(tank);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet]
        [Route("api/tank")]
        public async Task<ActionResult> GetAllTanksByDevice()
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                List<Tank> tanks = await new Ltank().GetAllTanksByDevice(idDevice);

                if (tanks == null || tanks.Count == 0) throw new Exception("No hay registros de tanques en el dispositivo");

                return Ok(tanks);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}