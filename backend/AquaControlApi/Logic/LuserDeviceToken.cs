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
            UserDeviceToken userDeviceToken = null;

            userDeviceToken = await new PuserDeviceToken().GetUserDeviceTokenById(idUserDevice);

            return userDeviceToken;

        }

        public async Task<List<UserDeviceToken>> GetUserDevicesTokensByIdUser(int idUser)
        {

            List<UserDeviceToken> tokens = new List<UserDeviceToken>();

            tokens = await new PuserDeviceToken().GetUserDevicesTokensByIdUser(idUser);

            return tokens;

        }
    }
}
