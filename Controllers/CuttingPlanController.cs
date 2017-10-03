using AutoMapper;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMachine.Models;
using VipcoMachine.ViewModels;
using VipcoMachine.Services.Interfaces;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/CuttingPlan")]
    public class CuttingPlanController : Controller
    {
        #region PrivateMenbers
        private IRepository<CuttingPlan> repository;
        private IMapper mapper;

        private JsonSerializerSettings DefaultJsonSettings =>
            new JsonSerializerSettings()
            {
                Formatting = Formatting.Indented,
                PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };
        private List<MapType> ConverterTableToViewModel<MapType, TableType>(ICollection<TableType> tables)
        {
            var listData = new List<MapType>();
            foreach (var item in tables)
                listData.Add(this.mapper.Map<TableType, MapType>(item));
            return listData;
        }
        #endregion PrivateMenbers

        #region Constructor

        public CuttingPlanController(IRepository<CuttingPlan> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/CuttingPlan
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Includes
            var Includes = new List<string> { "ProjectCodeDetail.ProjectCodeMaster" };
            return new JsonResult(
                this.ConverterTableToViewModel<CuttingPlanViewModel,CuttingPlan>(await this.repository.GetAllWithInclude2Async(Includes)),
                this.DefaultJsonSettings);
        }

        // GET: api/CuttingPlan/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "ProjectCodeDetail.ProjectCodeMaster"  };
            return new JsonResult(
                this.mapper.Map<CuttingPlan,CuttingPlanViewModel>(await this.repository.GetAsynvWithIncludes(key, "CuttingPlanId", Includes)),
                this.DefaultJsonSettings);
        }

        // GET: api/CuttingPlan/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .Where(x => x.ProjectCodeDetailId == MasterId)
                                           .Include(x => x.ProjectCodeDetail.ProjectCodeMaster);
                                           // .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
            return new JsonResult(
                this.ConverterTableToViewModel<CuttingPlanViewModel,CuttingPlan>(await QueryData.AsNoTracking().ToListAsync()) ,
                this.DefaultJsonSettings);
        }
        #endregion

        #region POST

        // POST: api/CuttingPlan/GetPage
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
                                           .AsQueryable();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                 x.Description.ToLower().Contains(keyword) ||
                                                 x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                 x.ProjectCodeDetail.Description.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "CuttingPlanNo":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.CuttingPlanNo);
                    else
                        QueryData = QueryData.OrderBy(e => e.CuttingPlanNo);
                    break;

                case "Description":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.Description);
                    else
                        QueryData = QueryData.OrderBy(e => e.Description);
                    break;

                case "ProjectCodeString":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                    else
                        QueryData = QueryData.OrderBy(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.CuttingPlanNo);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<CuttingPlanViewModel>
                (Scroll,
                this.ConverterTableToViewModel<CuttingPlanViewModel,CuttingPlan>(await QueryData.AsNoTracking().ToListAsync())),
                this.DefaultJsonSettings);
        }

        // POST: api/CuttingPlan
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]CuttingPlan nCuttingPlan)
        {
            if (nCuttingPlan != null)
            {
                nCuttingPlan.CreateDate = DateTime.Now;
                nCuttingPlan.Creator = nCuttingPlan.Creator ?? "Someone";

                return new JsonResult(await this.repository.AddAsync(nCuttingPlan), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "CuttingPlan not found. " });


        }
        #endregion

        #region PUT
        // PUT: api/CuttingPlan/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]CuttingPlan uCuttingPlan)
        {
            if (uCuttingPlan != null)
            {
                uCuttingPlan.ModifyDate = DateTime.Now;
                uCuttingPlan.Modifyer = uCuttingPlan.Modifyer ?? "Someone";

                return new JsonResult(await this.repository.UpdateAsync(uCuttingPlan, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "CuttingPlan not found. " });
        }
        #endregion

        #region DELETE
        // DELETE: api/CuttingPlan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
