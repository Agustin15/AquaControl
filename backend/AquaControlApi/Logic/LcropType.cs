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
    public class LcropType
    {
        public async Task<List<CropType>> GetAllCropsTypes()
        {
            return await new PcropType().GetAllCropsTypes();
        }
    }
}
