using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class Employee
    {
        [Key]
        public string EmpCode { get; set; }
        [StringLength(20)]
        public string Title { get; set; }
        [StringLength(100)]
        [Required]
        public string NameThai { get; set; }
        [StringLength(100)]
        public string NameEng { get; set; }
        [StringLength(100)]

        public string GroupCode { get; set; }
        [StringLength(100)]

        public string GroupName { get; set; }

        public TypeEmployee? TypeEmployee { get; set; }

        //FK
        public ICollection<User> Users { get; set; }
        public ICollection<MachineHasOperator> MachineHasOperators { get; set; }
        public ICollection<TaskMachine> TaskMachines { get; set; }
    }
    public enum TypeEmployee
    {
        พนักงานตามโครงการ = 1,
        พนักงานประจำรายชั่วโมง = 2,
        พนักงานประจำรายเดือน = 3,
        พนักงานทดลองงาน = 4
    }

    public enum TitleEmployee
    {
        นาย,นางสาว,นาง
    }
}
