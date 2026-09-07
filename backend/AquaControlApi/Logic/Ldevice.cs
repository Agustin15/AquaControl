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
        public async Task Update(Device device)
        {
            if (device is null) throw new Exception("Debe indicar una dispositivo a actualizar");

            await new Pdevice().Update(device);

        }
        public async Task Delete(Device device)
        {
            if (device is null) throw new Exception("Debe indicar una dispositivo a eliminar");

            await new Pdevice().Delete(device);

        }

        public async Task DeleteUserOfDevice(Device device, User user)
        {
            await new Pdevice().DeleteUserDevice(device, user);

        }

        public async Task<List<Device>> GetDevicesByIdUser(int idUser)
        {
            List<Device> devices = new List<Device>();

            devices = await new Pdevice().GetDevicesByIdUser(idUser);

            return devices;

        }

        public async Task<Device> GetDeviceById(int idDevice)
        {
            return await new Pdevice().GetDeviceById(idDevice);
        }

    }

}
