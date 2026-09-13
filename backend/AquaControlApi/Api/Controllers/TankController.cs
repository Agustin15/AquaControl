
using Api.Filters;
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

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpPost]
        [Route("api/tank")]
        public async Task<ActionResult> Add([FromBody] Tank tank)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != tank.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea agregar un nuevo registro de este tanque" });

                List<Tank> tanksOfDevice = await new Ltank().GetAllTanksByDevice(idDevice);

                if (tanksOfDevice.Count == 0) tank.Id = 1;
                else tank.Id = tanksOfDevice.Count + 1;


                await new Ltank().Add(tank);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpPut]
        [Route("api/tank")]
        public async Task<ActionResult> Update([FromBody] Tank tank)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != tank.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea actualizar el registro de este tanque" });

                await new Ltank().Update(tank);

                return Ok(tank);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpDelete]
        [Route("api/tank")]
        public async Task<ActionResult> Delete(Tank tank)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != tank.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea eliminar el registro de este tanque" });

                await new Ltank().Delete(tank);

                return Ok(tank);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
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

                if (tanks == null || tanks.Count == 0) throw new Exception("No hay registros de tanques en el dispositivo de riego");

                return Ok(tanks);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}