using DAL;
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
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (!ModelState.IsValid) return StatusCode(400, new { message = ModelState.Values.First().Errors.First().ErrorMessage });

                if (idDevice != humidityPlantLog.Plant.Device.Id)
                    throw new Exception("Solo se puede dar de alta monitoreos de humedad de planta que pertenezcan a este dispositivo");

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