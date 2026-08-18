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
    public class AlertController : ControllerBase
    {
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost]
        [Route("api/alert")]
        public async Task<ActionResult> Add([FromBody] Alert alert)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                Tank tankFound = await new Ltank().GetTankOfDeviceById(alert.Tank.Id, idDevice);

                if (tankFound is null) return StatusCode(404, new { message = "No se encontro el registro de este tanque en el dispositivo" });

                alert.Tank = tankFound;
                alert.Validar();

                await new Lalert().Add(alert);

                return StatusCode(201, true);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });

            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut("api/alert")]
        public async Task<ActionResult> UpdateAlertState([FromBody] Alert alert)
        {
            try
            {

                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                Tank tankFound = await new Ltank().GetTankOfDeviceById(alert.Tank.Id, idDevice);

                if (tankFound is null) return StatusCode(404, new { message = "No se encontro el registro de este tanque en el dispositivo" });

                alert.Tank = tankFound;
                alert.Validar();

                await new Lalert().UpdateAlertState(alert);

                return Ok(alert);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("api/alert/pagination/{offset}")]
        public async Task<ActionResult> GetAlertsOffset(int offset)
        {
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst(ClaimTypes.SerialNumber) is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);

                int amount = await new Lalert().GetAmountAlerts(idDevice);

                if (amount == 0)
                    throw new Exception("No se encontraron alertas en este dispositivo");

                double pages = Math.Ceiling(Convert.ToDouble(amount) / Convert.ToDouble(10));

                List<Alert> alertsOffset = await new Lalert().GetAlertsOffsetByDevice(offset, idDevice);

                if (alertsOffset.Count == 0)
                    throw new Exception("No se encontraron alertas en este dispositivo");

                var result = new { pages = pages, alerts = alertsOffset };

                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(404, new { message = ex.Message });
            }
        }
    }
}
