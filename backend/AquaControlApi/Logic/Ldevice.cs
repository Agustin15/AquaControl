using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class Ldevice
    {
        public async Task Add(Device device)
        {
            if (device is null) throw new Exception("Debe indicar una dispositivo a agregar");
            await new Pdevice().Add(device);

        }
        public async Task UpdatePlaceNameDevice(Device device)
        {
            if (device is null) throw new Exception("Debe indicar una dispositivo a actualizar");

            await new Pdevice().UpdatePlaceNameDevice(device);

        }
        public async Task Delete(Device device)
        {
            if (device is null) throw new Exception("Debe indicar una dispositivo a eliminar");

            await new Pdevice().Delete(device);

        }

        public async Task<List<Device>> GetAllDevicesByUser(int idUser)
        {
            List<Device> devices = new List<Device>();

            devices = await new Pdevice().GetAllDevicesByUser(idUser);

            return devices;

        }

    }

}
