using MQTTnet;
using MQTTnet.Formatter;
using MQTTnet.Protocol;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DAL
{
    public class MqttClient
    {
        private static MqttClient instance;
        private IMqttClient mqttClient;

        private MqttClient()
        {
            var mqttFactory = new MqttClientFactory();
            mqttClient = mqttFactory.CreateMqttClient();

        }

        //creamos propiedad que retorna la instancia de clase
        //en el caso de que no exista la crea por primera vez, si ya existe solo la retorna, asi solo tenderemos una
        //la hacemos static para acceder a ella ya no el constructor es privado

        public static MqttClient Instance
        {
            get
            {
                if (instance == null) instance = new MqttClient();
                return instance;
            }
        }

        public async Task Connect()
        {
            try
            {
                string urlBroker = Environment.GetEnvironmentVariable("URL_MQTT_BROKER");
                string usernameBroker = Environment.GetEnvironmentVariable("BROKER_USERNAME");
                string passwordBroker = Environment.GetEnvironmentVariable("BROKER_PASSWORD");

                MqttClientOptions mqttClientOptions = new MqttClientOptionsBuilder().WithConnectionUri(urlBroker).
                WithCredentials(usernameBroker, Encoding.UTF8.GetBytes(passwordBroker)).Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public async Task<Boolean> PublishMessage(string topic, object payload)
        {
            try
            {
                if (!mqttClient.IsConnected) await Connect();

                var applicationMessage = new MqttApplicationMessageBuilder()
                    .WithTopic(topic)
                    .WithPayload(JsonSerializer.Serialize(payload))
                    .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.ExactlyOnce)
                    .WithRetainFlag(false).Build();

                var result = await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

                return result.IsSuccess;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
