﻿using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class MaterialViewModel: Material
    {
        public string ClassificationString { get; set; }
        public string GradeString { get; set; }
    }
}
