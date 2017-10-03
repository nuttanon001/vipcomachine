using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class TaskMachineViewModel : TaskMachine
    {
        public string MachineString { get; set; }
        public string JobCardDetailString { get; set; }
        public string EmployeeString { get; set; }
    }
}
