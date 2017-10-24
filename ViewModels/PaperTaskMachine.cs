using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class PaperTaskMachine
    {
        public string PaperNo { get; set; }
        public string CuttingNo { get; set; }
        public string JobNo { get; set; }
        public string Material { get; set; }
        public string Quantity { get; set; }
        public string MachineNo { get; set; }
        public string Assigned { get; set; }
        public string PStart { get; set; }
        public string PEnd { get; set; }
        public string AStart { get; set; }
        public string AEnd { get; set; }
    }
}
