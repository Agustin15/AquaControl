using Api.Model;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    public class WaterPlantLogController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Esp32Bearer")]
        [HttpPost]
        [Route("api/waterPlantLog/")]
        public async Task<ActionResult> Add([FromBody] WaterPlantLog waterPlantLog)
        {
            try
            {
                Plant plantFound = await new Lplant().GetPlantOfDeviceById(waterPlantLog.Plant.Id, waterPlantLog.Plant.Device.Id);

                if (plantFound is null) return StatusCode(404, new { message = "No se encontro este registro de planta en el dispositivo" });

                Tank tankFound = await new Ltank().GetTankOfDeviceById(waterPlantLog.Plant.Id, waterPlantLog.Plant.Device.Id);

                if (tankFound is null) return StatusCode(404, new { message = "No se encontro este registro de tanque en el dispositivo" });

                waterPlantLog.Tank = tankFound;
                waterPlantLog.Plant = plantFound;

                waterPlantLog.Validar();

                int idGenerated = await new LwaterPlantLog().Add(waterPlantLog);

                return StatusCode(201, new { idGenerated = idGenerated });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Esp32Bearer")]
        [HttpPut("api/waterPlantLog/")]
        public async Task<ActionResult> UpdateStateWaterPlantLog([FromBody] WaterPlantLog waterPlantLog)
        {
            try
            {
                Plant plantFound = await new Lplant().GetPlantOfDeviceById(waterPlantLog.Plant.Id, waterPlantLog.Plant.Device.Id);

                if (plantFound is null) return StatusCode(404, new { message = "No se encontro este registro de planta en el dispositivo" });

                Tank tankFound = await new Ltank().GetTankOfDeviceById(waterPlantLog.Plant.Id, waterPlantLog.Plant.Device.Id);

                if (tankFound is null) return StatusCode(404, new { message = "No se encontro este registro de tanque en el dispositivo" });

                waterPlantLog.Tank = tankFound;
                waterPlantLog.Plant = plantFound;

                waterPlantLog.Validar();

                await new LwaterPlantLog().UpdateStateWaterPlantLog(waterPlantLog);

                return Ok(waterPlantLog);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("api/waterPlantLog/tank/{idTank}/plant/{idPlant}/lastWaterPlantLog")]
        public async Task<ActionResult> GetLastWaterPlantLog(int idTank, int idPlant)
        {

            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                WaterPlantLog waterPlantLog = await new LwaterPlantLog().GetLastWaterPlantLog(idPlant, idTank, idDevice);

                if (waterPlantLog is null)
                    throw new Exception("No hay registro de un ultimo riego aun en este dispositivo");

                return Ok(waterPlantLog);

            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("api/waterPlantLog/tank/{idTank}/plant/{idPlant}/pagination/{offset}")]
        public async Task<ActionResult> GetAllWaterPlantLogs(int idTank, int idPlant, int offset)
        {

            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                int amount = await new LwaterPlantLog().GetAmountWaterPlantLogs(idTank, idPlant, idDevice);

                if (amount == 0) throw new Exception("No se encontraron registros riegos aun");

                int pages = (int)Math.Ceiling(Convert.ToDecimal(amount) / 5);

                List<WaterPlantLog> waterPlantLogs = await new LwaterPlantLog().GetWaterPlantLogsOffset(idTank, idPlant, idDevice, offset);

                if (waterPlantLogs.Count == 0)
                    throw new Exception("No se encontraron registros de riegos aun");

                return Ok(new
                {
                    pages = pages,
                    waterPlantLogs = waterPlantLogs
                });
            }

            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }

        }
    }
}