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
    public class WaterTankLogAndIrrigateCausativeController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet]
        [Route("api/waterTankLogAndIrrigateCausative/tank/{idTank}/lastWeek")]
        public async Task<ActionResult> GetWaterTankLogsWithIrrigateCausativeLastWeek(int idTank)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                List<WaterTankLogAndIrrigateCausative> waterTankLogsAndIrrigateCausative =
                    await new LwaterTankLogAndIrrigateCausative().GetWaterTankLogsAndIrrigateCausativeLastWeek(idTank, idDevice);

                if (waterTankLogsAndIrrigateCausative == null || waterTankLogsAndIrrigateCausative.Count == 0)
                    throw new Exception("No se encontraron registros de nivel de tanque esta semana");

                return Ok(waterTankLogsAndIrrigateCausative);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}