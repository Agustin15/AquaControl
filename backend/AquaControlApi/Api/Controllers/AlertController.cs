using Api.Filters;
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
using System.Net.Http.Headers;
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

        [Authorize(AuthenticationSchemes = "Esp32Bearer", Policy = "HasIdDevice")]
        [ValidateModelFilter]
        [HttpPost]
        [Route("api/alert")]
        public async Task<ActionResult> Add([FromBody] Alert alert)
        {
            int idAlertGenerated = 0;
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);

                if (idDevice != alert.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego de donde desea enviar la alerta" });

                List<UserDeviceToken> usersDevicesTokens = new List<UserDeviceToken>();
                List<UserDeviceToken> userDevicesTokens = new List<UserDeviceToken>();

                foreach (UserOfAlert userOfAlert in alert.UsersOfAlert)
                {
                    userOfAlert.Seen = false;
                    userDevicesTokens = await new LuserDeviceToken().GetUserDevicesTokensByIdUser(userOfAlert.User.Id);

                    foreach (UserDeviceToken userDeviceToken in userDevicesTokens)
                    {
                        usersDevicesTokens.Add(userDeviceToken);
                    }

                }


                if (usersDevicesTokens.Count == 0)
                    throw new Exception("No se encontraron tokens de dispositivos de usuarios para enviar notificaciones");

                string fcmEnpointApi = Environment.GetEnvironmentVariable("FCM_ENDPOINT_API");

                if (String.IsNullOrEmpty(fcmEnpointApi)) throw new Exception("FCM_ENDPOINT_API no declarado");

                idAlertGenerated = await new Lalert().Add(alert);

                var accessToken = await GenerateTokenFCM.GenerateAccessToken();

                var client = _httpClientFactory.CreateClient();

                foreach (UserDeviceToken userDeviceToken in usersDevicesTokens)
                {
                    var notification = new
                    {
                        message = new
                        {
                            token = userDeviceToken.Token,
                            notification = new { title = alert.Title, body = alert.Message },
                            data = new { idAlert = idAlertGenerated.ToString(), alertType = alert.Type?.ToString() }
                        }
                    };

                    using var requestMessage = new HttpRequestMessage(HttpMethod.Post, fcmEnpointApi);
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    requestMessage.Content = new StringContent(JsonSerializer.Serialize(notification), Encoding.UTF8);

                    HttpResponseMessage responseMessage = await client.SendAsync(requestMessage);

                    if (responseMessage.IsSuccessStatusCode == false)
                    {
                        throw new Exception("Algo salio mal al enviar la alerta");
                    }
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


        [Authorize(AuthenticationSchemes = "Bearer", Policy = "HasIdDeviceAndUser")]
        [HttpGet("api/alert/pagination/{offset}")]
        public async Task<ActionResult> GetAlertsOffset(int offset)
        {
            try
            {

                int idDevice = Convert.ToInt32(User.FindFirst("IdDevice").Value);
                int idUser = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                int amount = await new Lalert().GetAmountAlertsByDeviceAndUser(idDevice, idUser);

                if (amount == 0)
                    throw new Exception("No se encontraron alertas para este dispositivo de riego");

                double pages = Math.Ceiling(Convert.ToDouble(amount) / Convert.ToDouble(10));

                List<Alert> alertsOffset = await new Lalert().GetAlertsOffsetByDevice(offset, idDevice, idUser);

                if (alertsOffset.Count == 0)
                    throw new Exception("No se encontraron alertas en este dispositivo de riego");

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
