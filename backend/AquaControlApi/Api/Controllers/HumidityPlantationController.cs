using Api.Filters;
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
    public class HumidityPlantationLogController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "Esp32Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpPost]
        [Route("api/humidityPlantationLog")]
        public async Task<ActionResult> Add([FromBody] HumidityPlantationLog humidityPlantationLog)
        {
            try
            {
    
                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != humidityPlantationLog.Plantation.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea agregar el monitoreo de humedad" });

                await new LhumidityPlantationLog().Add(humidityPlantationLog);
                return StatusCode(201, true);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDevice")]
        [HttpGet]
        [Route("api/humidityPlantationLog/plantation/{idPlantation}/lastWeek")]
        public async Task<ActionResult> GetHumidityPlantationLogsLastWeek(int idPlantation)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                List<HumidityPlantationLog> humidityPlantationLogs = await new LhumidityPlantationLog().GetHumidityPlantationLogsLastWeek(idPlantation, idDevice);

                if (humidityPlantationLogs.Count == 0)
                    throw new Exception("No se encontraron registros sobre monitoreos de humedad en este dia");

                return Ok(humidityPlantationLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}