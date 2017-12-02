using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class NoTaskMachineViewModel:NoTaskMachine
    {
        public string AssignedByString { get; set; }
        public string GroupCodeString { get; set; }
    }
}
