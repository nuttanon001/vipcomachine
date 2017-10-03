using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class Material
    {
        [Key]
        public int MaterialId { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        public double? Width { get; set; }
        public double? Length { get; set; }
        public double? Thickness { get; set; }
        public double? Weight { get; set; }
        public double? SquareMeter { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
