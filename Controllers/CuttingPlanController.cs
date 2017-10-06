using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VipcoMachine.Models;
using VipcoMachine.Services.Interfaces;
using VipcoMachine.ViewModels;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/CuttingPlan")]
    public class CuttingPlanController : Controller
    {
        #region PrivateMenbers

        private IRepository<CuttingPlan> repository;
        private IRepository<ProjectCodeMaster> repositoryProMaster;
        private IRepository<ProjectCodeDetail> repositoryProDetail;
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

        public CuttingPlanController(
            IRepository<CuttingPlan> repo,
            IRepository<ProjectCodeMaster> repoProMaster,
            IRepository<ProjectCodeDetail> repoProDetail,
            IMapper map)
        {
            this.repository = repo;
            this.repositoryProMaster = repoProMaster;
            this.repositoryProDetail = repoProDetail;
            this.mapper = map;
        }

        #endregion Constructor

        #region GET

        // GET: api/CuttingPlan
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Includes
            var Includes = new List<string> { "ProjectCodeDetail.ProjectCodeMaster" };
            return new JsonResult(
                this.ConverterTableToViewModel<CuttingPlanViewModel, CuttingPlan>(await this.repository.GetAllWithInclude2Async(Includes)),
                this.DefaultJsonSettings);
        }

        // GET: api/CuttingPlan/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "ProjectCodeDetail.ProjectCodeMaster" };
            return new JsonResult(
                this.mapper.Map<CuttingPlan, CuttingPlanViewModel>(await this.repository.GetAsynvWithIncludes(key, "CuttingPlanId", Includes)),
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
                this.ConverterTableToViewModel<CuttingPlanViewModel, CuttingPlan>(await QueryData.AsNoTracking().ToListAsync()),
                this.DefaultJsonSettings);
        }

        #endregion GET

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
                this.ConverterTableToViewModel<CuttingPlanViewModel, CuttingPlan>(await QueryData.AsNoTracking().ToListAsync())),
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

        // POST: api/CuttingPlan/ImportData/UserName
        [HttpPost("ImportData/{UserName}")]
        public async Task<IActionResult> CuttingPlanImportData(
            [FromBody] IEnumerable<CuttingImportViewModel> ImportDatas,
            string UserName = "")
        {
            string Message = "";
            try
            {
                if (ImportDatas != null)
                {
                    var date = DateTime.Now;

                    foreach (var Jobs in ImportDatas.GroupBy(x => x.JobNo.Trim()))
                    {
                        var PMaster = await this.repositoryProMaster.GetAllAsQueryable()
                                                                .Where(x => x.ProjectCode.Trim().ToLower()
                                                                            .Equals(Jobs.Key.Trim().ToLower()))
                                                                .Include(x => x.ProjectCodeDetails)
                                                                    .ThenInclude(z => z.CuttingPlans)
                                                                        .ThenInclude(y => y.Material)
                                                                .FirstOrDefaultAsync();

                        if (PMaster != null)
                        {
                            foreach (var JDetails in Jobs.GroupBy(x => x.Level23.Trim()))
                            {
                                // Condtion Check Level2/3
                                Expression<Func<ProjectCodeDetail, bool>> dWhere =
                                    d => d.ProjectCodeDetailCode.Trim().ToLower().Equals(JDetails.Key.Trim().ToLower());

                                if (await this.repositoryProDetail.AnyDataAsync(dWhere))
                                {

                                }
                                // if don't have add all data in this level2/3
                                else
                                {
                                    // Insert ProjectDetail
                                    var nProDetail = new ProjectCodeDetail()
                                    {
                                        CreateDate = date,
                                        Creator = UserName,
                                        Description = "Did not has description yet.",
                                        ProjectCodeDetailCode = JDetails.Key,
                                        ProjectCodeMasterId =
                                    };

                                    foreach (var Import in JDetails)
                                    {
                                        // Insert CuttingPlan and Material
                                        nProDetail.CuttingPlans.Add(
                                            new CuttingPlan()
                                            {
                                                CreateDate = date,
                                                Creator = UserName,
                                                CuttingPlanNo = Import.CuttingPlan,
                                                Description = "Did not has description yet",
                                                Quantity = double.TryParse(Import.Quantity, out double qty) ? qty : 0,
                                                TypeCuttingPlan = 1,
                                                Material = string.IsNullOrEmpty(Import.MaterialSize) ? null :
                                                    new Material()
                                                    {
                                                        CreateDate = date,
                                                        Creator = UserName,
                                                        Grade = Import.MaterialGrade,
                                                        Size = Import.MaterialSize,
                                                        Name = "Did not has name yet"
                                                    }
                                            });
                                    }
                                }
                            }
                        }
                        // if don't have add all data in this job
                        else
                        {
                            // Insert ProjectMaster
                            var nProMaster = new ProjectCodeMaster()
                            {
                                CreateDate = date,
                                Creator = UserName,
                                ProjectCode = Jobs.Key,
                                ProjectName = "Did not has name yet.",
                                StartDate = date,
                            };
                            // Insert all ProjectDetail ,CuttingPlan and Material
                            foreach (var JDetails in Jobs.GroupBy(x => x.Level23))
                            {
                                // Insert ProjectDetail
                                var nProDetail = new ProjectCodeDetail()
                                {
                                    CreateDate = date,
                                    Creator = UserName,
                                    Description = "Did not has description yet.",
                                    ProjectCodeDetailCode = JDetails.Key
                                };

                                foreach (var Import in JDetails)
                                {
                                    // Insert CuttingPlan and Material
                                    nProDetail.CuttingPlans.Add(
                                        new CuttingPlan()
                                        {
                                            CreateDate = date,
                                            Creator = UserName,
                                            CuttingPlanNo = Import.CuttingPlan,
                                            Description = "Did not has description yet",
                                            Quantity = double.TryParse(Import.Quantity, out double qty) ? qty : 0,
                                            TypeCuttingPlan = 1,
                                            Material = string.IsNullOrEmpty(Import.MaterialSize) ? null :
                                                new Material()
                                                {
                                                    CreateDate = date,
                                                    Creator = UserName,
                                                    Grade = Import.MaterialGrade,
                                                    Size = Import.MaterialSize,
                                                    Name = "Did not has name yet"
                                                }
                                        });
                                }

                                nProMaster.ProjectCodeDetails.Add(nProDetail);
                            }
                            // Insert ProjectMaster to DataBase
                            await this.repositoryProMaster.AddAsync(nProMaster);
                        }
                    }

                    // alway return true
                    return new JsonResult(true, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Message = Message });
        }

        #endregion POST

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

        #endregion PUT

        #region DELETE

        // DELETE: api/CuttingPlan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }

        #endregion DELETE
    }
}