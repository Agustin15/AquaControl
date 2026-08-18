using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    public class WaterTankLogController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "Esp32Bearer")]
        [HttpPost]
        [Route("api/waterTankLog/")]
        public async Task<ActionResult> Add([FromBody] WaterTankLog waterTankLog)
        {
            try
            {

                if (waterTankLog is null) return StatusCode(400, new { message = "Debe indicar un registro de agua sobre un tanque para agregar" });

                Tank tankFound = await new Ltank().GetTankOfDeviceById(waterTankLog.Tank.Id, waterTankLog.Tank.Device.Id);

                if (tankFound is null) return StatusCode(404, new { message = "No se encontro registro de este tanque en el dispositivo" });

                waterTankLog.Tank = tankFound;

                waterTankLog.Validar();

                await new LwaterTankLog().Add(waterTankLog);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}