using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;

namespace Logic
{
    public class LuserOfDevice
    {

        public async Task AddUserDevice(Device device, UserOfDevice userOfDevice)
        {

            await new PuserOfDevice().AddUserDevice(device, userOfDevice);

        }

        public async Task UpdateUserDevice(Device device, UserOfDevice userOfDevice)
        {
            await new PuserOfDevice().UpdateUserOfDevice(device, userOfDevice);

        }
        public async Task DeleteUserDevice(Device device, UserOfDevice userOfDevice)
        {
            await new PuserOfDevice().DeleteUserDevice(device, userOfDevice);

        }


    }
}
