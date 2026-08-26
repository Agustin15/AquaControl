using DAL;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logic
{
    public class Lplant
    {
        public async Task Add(Plant plant)
        {
            if (plant is null) throw new Exception("Debe indicar una planta a agregar");

            await new Pplant().Add(plant);
        }

        public async Task Update(Plant plant)
        {

            if (plant is null) throw new Exception("Debe indicar una planta a actualizar");

            await new Pplant().Update(plant);

        }

        public async Task Delete(Plant plant)
        {
            if (plant is null) throw new Exception("Debe indicar una planta a eliminar");

            await new Pplant().Delete(plant);

        }

        public async Task<List<Plant>> GetAllPlantsByDevice(int idDevice)
        {

            List<Plant> listPlants = new List<Plant>();

            listPlants = await new Pplant().GetAllPlantsByDevice(idDevice);

            return listPlants;

        }

    }

}
