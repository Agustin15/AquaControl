using Api.Filters;
using DAL;
using Entities;
using Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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


        [Authorize(AuthenticationSchemes = "Esp32Bearer", Roles = "Administrador,Cliente,Operador,Lector", Policy = ("HasDevice"))]
        [HttpPost]
        [Route("api/alert")]
        public async Task<ActionResult> Add([FromBody] Alert alert)
        {
            int idAlertGenerated = 0;
            try
            {

                string idDevice = User.FindFirst("IdDevice").Value;

                if (idDevice != alert.Device.Id)
                    return StatusCode(403, new { message = "No tiene acceso al dispositivo de riego de donde desea enviar la alerta" });


                alert.Device = await new Ldevice().GetDeviceById(alert.Device.Id);
                alert.UsersOfAlert = new List<UserOfAlert>();

                List<UserOfDevice> usersOfDevice = await new LuserOfDevice().UsersOfDevice(alert.Device.Id);

                List<UserDeviceToken> usersAndHisMobileTokens = new List<UserDeviceToken>();
                List<UserDeviceToken> userDevicesTokens = new List<UserDeviceToken>();

                foreach (UserOfDevice userOfDevice in usersOfDevice)
                {
                    userDevicesTokens = await new LuserDeviceToken().GetUserDevicesTokensByIdUser(userOfDevice.User.Id);

                    if (userDevicesTokens.Count > 0)
                    {
                        UserOfAlert userOfAlert = new UserOfAlert
                        {
                            User = userOfDevice.User,
                            Seen = false,
                        };
                        alert.UsersOfAlert.Add(userOfAlert);

                        userDevicesTokens.ForEach(userDeviceToken => usersAndHisMobileTokens.Add(userDeviceToken));
                    }
                }

                ModelState.Clear();

                if (TryValidateModel(alert)==false)
                    return StatusCode(400, new { message = ModelState.Values.SelectMany(x => x.Errors).ToList().First().ErrorMessage });


                if (usersAndHisMobileTokens.Count == 0)
                    throw new Exception("No se encontraron tokens de dispositivos de usuarios para enviar notificaciones");

                string fcmEnpointApi = Environment.GetEnvironmentVariable("FCM_ENDPOINT_API");

                if (string.IsNullOrEmpty(fcmEnpointApi)) throw new Exception("FCM_ENDPOINT_API no declarado");

                idAlertGenerated = await new Lalert().Add(alert);

                var accessToken = await GenerateTokenFCM.GenerateAccessToken();

                var client = _httpClientFactory.CreateClient();

                foreach (UserDeviceToken userAndHisMobileToken in usersAndHisMobileTokens)
                {
                    var notification = new
                    {
                        message = new
                        {
                            token = userAndHisMobileToken.Token,
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

                return StatusCode(500, new
                {
                    message = ex.Message
                });

            }
        }


        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Administrador,Cliente,Operador,Lector", Policy = ("HasDevice"))]
        [Authorize(Policy = "HasUser")]
        [HttpGet("api/alert/device/{idDevice}/user/{idUser}/pagination/{offset}")]
        public async Task<ActionResult> GetAlertsOffset(string idDevice, int idUser, int offset)
        {
            try
            {


                string idDeviceToken = User.FindFirst("IdDevice").Value;
                int idUserToken = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                if (idDevice != idDeviceToken || idUser != idUserToken)
                    return StatusCode(403, new { message = "No posee accesso a estas alertas" });

                int amount = await new Lalert().GetAmountAlertsByDeviceAndUser(idDevice, idUser);

                if (amount == 0)
                    throw new Exception("No se encontraron alertas para este dispositivo de riego");

                double pages = Math.Ceiling(Convert.ToDouble(amount) / Convert.ToDouble(10));

                List<Alert> alertsOffset = await new Lalert().GetAlertsOffsetByDevice(offset, idDevice, idUser);

                if (alertsOffset.Count == 0)
                    throw new Exception("No se encontraron alertas");

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
