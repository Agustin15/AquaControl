using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class Connection
    {
        static string cnn = Environment.GetEnvironmentVariable("STRING_CONNECTION");

        public static string Cnn
        {
            get { return cnn; }
        }

    }

}
