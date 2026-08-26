using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class Ltank
    {

        public async Task Add(Tank tank)
        {
            if (tank is null) throw new Exception("Debe indicar un tanque a agregar");

            await new Ptank().Add(tank);

        }

        public async Task Update(Tank tank)
        {
            if (tank is null) throw new Exception("Debe indicar un tanque a actualizar");

            await new Ptank().Update(tank);

        }

        public async Task Delete(Tank tank)
        {
            if (tank is null) throw new Exception("Debe indicar un tanque a eliminar");

            await new Ptank().Delete(tank);

        }

        public async Task<List<Tank>> GetAllTanksByDevice(int idDevice)
        {

            List<Tank> listTanks = new List<Tank>();

            listTanks = await new Ptank().GetAllTanksByDevice(idDevice);

            return listTanks;


        }

    }

}
