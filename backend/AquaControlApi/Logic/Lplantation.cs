using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class Lplantation
    {
        public async Task Add(Plantation plantation)
        {
            if (plantation is null) throw new Exception("Debe indicar una planta a agregar");

            await new Pplantation().Add(plantation);
        }

        public async Task Update(Plantation plantation)
        {

            if (plantation is null) throw new Exception("Debe indicar una planta a actualizar");

            await new Pplantation().Update(plantation);

        }

        public async Task Delete(Plantation plantation)
        {
            if (plantation is null) throw new Exception("Debe indicar una planta a eliminar");

            await new Pplantation().Delete(plantation);

        }

        public async Task<List<Plantation>> GetAllPlantationsByDevice(int idDevice)
        {
            return await new Pplantation().GetAllPlantationsByDevice(idDevice);

        }

    }

}
