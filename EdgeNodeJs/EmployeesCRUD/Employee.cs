using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Spatial;
using System.ComponentModel.DataAnnotations;

namespace EmployeesCRUD
{
    public partial class Employee
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Occupation { get; set; }

        public int? Salary { get; set; }

        [StringLength(50)]
        public string City { get; set; }
    }
}
