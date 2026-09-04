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
        public async Task UpdateAlertState(Alert alert)
        {
            if (alert is null) throw new Exception("Debe indicar una alerta a actualizar");
            await new Palert().UpdateAlertState(alert);

        }

        public async Task Delete(Alert alert)
        {
            if (alert is null) throw new Exception("Debe indicar una alerta a eliminar");
            await new Palert().Delete(alert);

        }

        public async Task<int> GetAmountAlerts(int idDevice)
        {

            int amount = await new Palert().GetAmountAlertsByDevice(idDevice);

            return amount;
        }
        public async Task<List<Alert>> GetAlertsOffsetByDevice(int offset, int idDevice)
        {

            List<Alert> alertsOffset = new List<Alert>();

            alertsOffset = await new Palert().GetAlertsByDeviceOffset(offset, idDevice);
            alertsOffset = await new Palert().GetAlertsByDeviceOffset(offset, idDevice);

            return alertsOffset;
        }

    }

}
