using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class Lalert
    {
        public async Task<int> Add(Alert alert)
        {
            if (alert is null) throw new Exception("Debe indicar una alerta a agregar");
            int idGenerated = await new Palert().Add(alert);

            return idGenerated;
        }

        public async Task Delete(Alert alert)
        {
            if (alert is null) throw new Exception("Debe indicar una alerta a eliminar");
            await new Palert().Delete(alert);

        }

        public async Task<Alert> GetAlertById(int idAlert)
        {
            return await new Palert().GetAlertById(idAlert);

        }


        public async Task<int> GetAmountAlertsByDeviceAndUser(int idDevice, int idUser)
        {

            int amount = await new Palert().GetAmountAlertsByDeviceAndUser(idDevice, idUser);

            return amount;
        }
        public async Task<List<Alert>> GetAlertsOffsetByDevice(int offset, int idDevice, int idUser)
        {

            List<Alert> alertsOffset = new List<Alert>();

            alertsOffset = await new Palert().GetAlertsByDeviceAndUserOffset(offset, idDevice, idUser);

            return alertsOffset;
        }

    }

}
