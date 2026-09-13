using Api.Filters;
using DAL;
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
        [Authorize(AuthenticationSchemes = "Esp32Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpPost]
        [Route("api/waterTankLog/")]
        public async Task<ActionResult> Add([FromBody] WaterTankLog waterTankLog)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != waterTankLog.Tank.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea agregar el monitoreo de nivel de agua del tanque" });

                await new LwaterTankLog().Add(waterTankLog);

                return StatusCode(201, true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [HttpGet]
        [Route("api/waterTankLog/tank/{idTank}/lastWeek")]
        public async Task<ActionResult> GetHumidityPlantLogsLastWeek(int idTank)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                List<WaterTankLog> waterTankLogs = await new LwaterTankLog().GetWaterTankLogsLastWeek(idTank, idDevice);

                if (waterTankLogs.Count == 0)
                    throw new Exception("No se encontraron registros sobre niveles de agua del tanque en esta semana");

                return Ok(waterTankLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}