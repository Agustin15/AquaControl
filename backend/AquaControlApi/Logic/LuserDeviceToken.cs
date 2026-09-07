using DAL;
using Entities;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class LuserDeviceToken
    {
        public async Task Add(UserDeviceToken userDeviceToken)
        {

            if (userDeviceToken is null) throw new Exception("Debe indicar un token de dispositivo movil a agregar");

            await new PuserDeviceToken().Add(userDeviceToken);

        }

        public async Task Update(UserDeviceToken userDeviceToken)
        {

            if (userDeviceToken is null) throw new Exception("Debe indicar un token de dispositivo movil a actualizar");

            await new PuserDeviceToken().Update(userDeviceToken);

        }

        public async Task<UserDeviceToken> GetUserDeviceTokenById(string idUserDevice)
        {
            return await new PuserDeviceToken().GetUserDeviceTokenById(idUserDevice);

        }

        public async Task<List<UserDeviceToken>> GetUserDevicesTokensByIdUser(int idUser)
        {
            return await new PuserDeviceToken().GetUserDevicesTokensByIdUser(idUser);

        }
    }
}
