using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    public class HumidityPlantLogController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "Esp32Bearer")]
        [HttpPost]
        [Route("api/humidityPlantLog/")]
        public async Task<ActionResult> Add([FromBody] HumidityPlantLog humidityPlantLog)
        {
            try
            {

                Plant plantFound = await new Lplant().GetPlantOfDeviceById(humidityPlantLog.Plant.Id, humidityPlantLog.Plant.Device.Id);

                if (plantFound is null) return StatusCode(404, new { message = "No hay registro de esta planta en este dispositivo" });

                humidityPlantLog.Plant = plantFound;

                humidityPlantLog.Validar();

                await new LhumidityPlantLog().Add(humidityPlantLog);
                return StatusCode(201, true);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet]
        [Route("api/humidityPlantLog/plant/{idPlant}/lastWeek")]
        public async Task<ActionResult> GetHumidityPlantLogsOffset(int idPlant)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                List<HumidityPlantLog> humidityPlantLogs = await new LhumidityPlantLog().GetHumidityPlantLogLastWeek(idPlant, idDevice);

                if (humidityPlantLogs.Count == 0)
                    throw new Exception("No se encontraron registros sobre monitoreos de humedad en este dia");

                return Ok(humidityPlantLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}