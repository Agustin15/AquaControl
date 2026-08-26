using Api.Model;
using DAL;
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

                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != waterPlantLog.Plant.Device.Id || idDevice != waterPlantLog.Tank.Device.Id)
                    throw new Exception("Solo se puede dar de alta monitoreos de riegos que pertenezcan al dispositivo que se esta usando");

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
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != waterPlantLog.Plant.Device.Id || idDevice != waterPlantLog.Tank.Device.Id)
                    throw new Exception("Solo se puede actualizar monitoreos de riegos que pertenezcan al dispositivo que se esta usando");

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

                if (amount == 0) throw new Exception("No se han realizado riegos aun");

                int pages = (int)Math.Ceiling(Convert.ToDecimal(amount) / 5);

                List<WaterPlantLog> waterPlantLogs = await new LwaterPlantLog().GetWaterPlantLogsOffset(idTank, idPlant, idDevice, offset);

                if (waterPlantLogs.Count == 0)
                    throw new Exception("No se han realizado riegos aun");

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