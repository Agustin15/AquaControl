using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class Alert
    {
        private int id;
        private Tank tank;
        private string message;
        private DateTime datetimeAlert;
        private bool state = false;

        public int Id
        {
            set { id = value; }
            get { return id; }
        }

        public Tank Tank
        {
            set { tank = value; }
            get { return tank; }
        }

        public string Message
        {
            set { message = value; }
            get { return message; }
        }

        public DateTime DatetimeAlert
        {
            set { datetimeAlert = value; }
            get { return datetimeAlert; }
        }

        public bool State
        {
            set { state = value; }
            get { return state; }
        }
        public void Validar()
        {

            if (Tank is null)
                throw new Exception("Debe indicar un tanque");

            if (String.IsNullOrEmpty(Message))
                throw new Exception("Mensaje no puede estar vacio");

        }

        public Alert() { }

        public Alert(int id, Tank tank, string message, bool state)
        {
            Id = id;
            Tank = tank;
            Message = message;
            State = state;

        }




    }

}
