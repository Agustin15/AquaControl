using DAL;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;


namespace Api.Controllers
{

    [ApiController]
    public class AlertController : ControllerBase
    {
        private IHttpClientFactory _httpClientFactory;

        public AlertController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [Authorize(AuthenticationSchemes = "Esp32Bearer")]
        [HttpPost]
        [Route("api/alert")]
        public async Task<ActionResult> Add([FromBody] Alert alert)
        {
            int idAlertGenerated = 0;
            try
            {
                if (!User.Identity.IsAuthenticated || User.FindFirst("IdDevice") is null)
                    return Unauthorized();

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (!ModelState.IsValid) return StatusCode(400, new { message = ModelState.Values.First().Errors.First().ErrorMessage });

                if (idDevice != alert.Device.Id)
                    throw new Exception("El dispositivo vinculado a la alerta es distinto al dispositivo actual");

                List<UserDeviceToken> userDevicesTokens = await new LuserDeviceToken().GetUserDevicesTokensByIdUser(alert.Device.User.Id);

                if (userDevicesTokens.Count == 0)
                    throw new Exception("No se encontraron tokens de dispositivos de usuarios para enviar notificaciones");

                string fcmEnpointApi = Environment.GetEnvironmentVariable("FCM_ENDPOINT_API");

                if (String.IsNullOrEmpty(fcmEnpointApi)) throw new Exception("FCM_ENDPOINT_API no declarado");

                idAlertGenerated = await new Lalert().Add(alert);

                var accessToken = await GenerateTokenFCM.GenerateAccessToken();

                var client = _httpClientFactory.CreateClient();
                var requestMessage = new HttpRequestMessage(HttpMethod.Post, fcmEnpointApi);
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                foreach (UserDeviceToken userDeviceToken in userDevicesTokens)
                {
                    var notification = new
                    {
                        message = new
                        {
                            token = userDeviceToken.Token,
                            notification = new { title = alert.Title, body = alert.Message },
                            data = new { alertType = alert.Type }
                        }
                    };

                    requestMessage.Content = new StringContent(JsonSerializer.Serialize(notification), Encoding.UTF8);
                    await client.SendAsync(requestMessage);

                }

                return StatusCode(201, true);

            }
            catch (Exception ex)
            {
                if (idAlertGenerated != 0)
                {
                    alert.Id = idAlertGenerated;
                    await new Lalert().Delete(alert);
                }

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

                if (!ModelState.IsValid) return StatusCode(400, new { message = ModelState.Values.First().Errors.First().ErrorMessage });

                if (idDevice != alert.Device.Id)
                    throw new Exception("El dispositivo vinculado a la alerta es distinto al dispositivo actual");

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
