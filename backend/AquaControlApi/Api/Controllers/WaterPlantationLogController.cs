using Api.Filters;
using Api.Model;
using CloudinaryDotNet.Actions;
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
    public class WaterPlantationLogController : ControllerBase
    {

        [Authorize(AuthenticationSchemes = "Esp32Bearer", Policy = "HasDevice")]
        [ValidateModelFilter]
        [HttpPost]
        [Route("api/waterPlantationLog")]
        public async Task<ActionResult> Add([FromBody] WaterPlantationLog waterPlantationLog)
        {
            try
            {

                string idDevice = User.FindFirst("IdDevice").Value;

                if (idDevice != waterPlantationLog.Plantation.Device.Id || idDevice != waterPlantationLog.Tank.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea agregar el registro de riego" });

                int idGenerated = await new LwaterPlantationLog().Add(waterPlantationLog);

                return StatusCode(201, new { idGenerated = idGenerated });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Esp32Bearer", Policy = "HasDevice")]
        [ValidateModelFilter]
        [HttpPut("api/waterPlantationLog")]
        public async Task<ActionResult> UpdateStateWaterPlantationLog([FromBody] WaterPlantationLog waterPlantationLog)
        {
            try
            {

                string idDevice = User.FindFirst("IdDevice").Value;

                if (idDevice != waterPlantationLog.Plantation.Device.Id || idDevice != waterPlantationLog.Tank.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego donde desea actualizar el registro de riego" });

                await new LwaterPlantationLog().UpdateWaterPlantationLogFinished(waterPlantationLog);

                return Ok(waterPlantationLog);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador,Operador,Lector", Policy = "HasDevice")]
        [HttpGet("api/waterPlantationLog/tank/{idTank}/plantation/{idPlantation}/device/{idDevice}/lastWaterPlantationLog")]
        public async Task<ActionResult> GetLastWaterPlantLog(int idTank, int idPlantation, string idDevice)
        {

            try
            {

                string idDeviceToken = User.FindFirst("IdDevice").Value;

                if (idDevice != idDeviceToken)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego" });

                WaterPlantationLog waterPlantationLog = await new LwaterPlantationLog().GetLastWaterPlantationLog(idPlantation, idTank, idDevice);

                if (waterPlantationLog is null)
                    throw new Exception("No hay registro de un ultimo riego aun");

                return Ok(waterPlantationLog);

            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador,Operador,Lector", Policy = "HasDevice")]
        [HttpGet("api/waterPlantationLog/tank/{idTank}/plantation/{idPlantation}/device/{idDevice}/pagination/{offset}")]
        public async Task<ActionResult> GetAllWaterPlantLogs(int idTank, int idPlantation, string idDevice, int offset)
        {

            try
            {

                string idDeviceToken = User.FindFirst("IdDevice").Value;

                if (idDevice != idDeviceToken)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego" });

                int amount = await new LwaterPlantationLog().GetAmountWaterPlantationLogs(idTank, idPlantation, idDevice);

                if (amount == 0) throw new Exception("No se han realizado riegos aun");

                int pages = (int)Math.Ceiling(Convert.ToDecimal(amount) / 5);

                List<WaterPlantationLog> waterPlantationLogs = await new LwaterPlantationLog().GetWaterPlantationLogsOffset(idTank, idPlantation, idDevice, offset);

                if (waterPlantationLogs.Count == 0)
                    throw new Exception("No se han realizado riegos aun");

                return Ok(new
                {
                    pages = pages,
                    waterPlantationLogs = waterPlantationLogs
                });
            }

            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }

        }
    }
}