using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using Entities;

namespace Logic
{
    public class LuserOfAlert
    {
        public async Task UpdateAlertUserState(Alert alert,UserOfAlert userOfAlert) {

            await new PuserOfAlert().UpdateAlertUserState(alert,userOfAlert);

        }
    }
}
