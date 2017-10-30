using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VipcoMachine.Helpers;
using VipcoMachine.Models;
using VipcoMachine.Services.Interfaces;
using VipcoMachine.ViewModels;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/OverTimeMaster")]
    public class OverTimeMasterController : Controller
    {
        #region PrivateMenbers
        private IRepository<OverTimeMaster> repository;
        private IRepository<OverTimeDetail> repositoryOverTimeDetail;
        private IRepository<ProjectCodeMaster> repositoryProjectMaster;
        private IRepository<EmployeeGroup> repositoryEmpGroup;
        private IMapper mapper;
        private IHostingEnvironment hostingEnvironment;
        private HelpersClass<OverTimeMaster> helpers;

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
        private IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }
        #endregion PrivateMenbers

        #region Constructor

        public OverTimeMasterController(
                IRepository<OverTimeMaster> repo,
                IRepository<OverTimeDetail> repoOverTimeDetail,
                IRepository<ProjectCodeMaster> repoProjectMaster,
                IRepository<EmployeeGroup> repoEmpGroup,
                IHostingEnvironment hosting,
                IMapper map)
        {
            this.repository = repo;
            this.repositoryOverTimeDetail = repoOverTimeDetail;
            this.repositoryProjectMaster = repoProjectMaster;
            this.repositoryEmpGroup = repoEmpGroup;
            this.hostingEnvironment = hosting;
            this.mapper = map;
            this.helpers = new HelpersClass<OverTimeMaster>();
        }

        #endregion

        #region GET

        // GET: api/OverTimeMaster/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "EmployeeGroup", "ProjectCodeMaster", "ApproveBy", "RequireBy" };
            return new JsonResult(
                      this.ConverterTableToViewModel<OverTimeMasterViewModel, OverTimeMaster>
                      (await this.repository.GetAllWithInclude2Async(Includes)),
                      this.DefaultJsonSettings);
        }

        // GET: api/OverTimeMaster/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "EmployeeGroup", "ProjectCodeMaster", "ApproveBy", "RequireBy" };
            return new JsonResult(
                      this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>
                      (await this.repository.GetAsynvWithIncludes(key, "OverTimeMasterId", Includes)),
                      this.DefaultJsonSettings);
        }

        // GET: api/OverTimeMaster/GetOverTimeMasterHasOverTime
        [HttpGet("GetLastOverTime/{ProjectCodeId}/{GroupCode}")]
        public async Task<IActionResult> GetLastOverTime(int ProjectCodeId,string GroupCode)
        {
            if (ProjectCodeId > 0 && !string.IsNullOrEmpty(GroupCode))
            {
                var LastOverTime = await this.repository.GetAllAsQueryable()
                                                        .OrderByDescending(x => x.OverTimeDate)
                                                        .Include(x => x.ApproveBy)
                                                        .Include(x => x.RequireBy)
                                                        .Include(x => x.ProjectCodeMaster)
                                                        .Include(x => x.EmployeeGroup)
                                                        .FirstOrDefaultAsync(x => x.ProjectCodeMasterId == ProjectCodeId &&
                                                                                  x.GroupCode == GroupCode);
                return new JsonResult(this.mapper.Map<OverTimeMaster,OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "Not found ProjectCodeMasterId or GroupCode." });
        }

        #endregion

        #region POST

        // POST: api/OverTimeMaster/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                    .Include(x => x.ApproveBy)
                                    .Include(x => x.RequireBy)
                                    .Include(x => x.ProjectCodeMaster)
                                    .Include(x => x.EmployeeGroup)
                                    .AsQueryable();
                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.ToLower().Split(null);
                foreach (var keyword in filters)
                {
                    QueryData = QueryData.Where(x => x.EmpRequire.ToLower().Contains(keyword) ||
                                                     x.RequireBy.NameThai.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeMaster.ProjectName.ToLower().Contains(keyword) ||
                                                     x.EmployeeGroup.Description.ToLower().Contains(keyword));
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "RequireBy":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.RequireBy.NameThai);
                        else
                            QueryData = QueryData.OrderBy(e => e.RequireBy.NameThai);
                        break;

                    case "ProjectCode":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.ProjectCodeMaster.ProjectCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.ProjectCodeMaster.ProjectCode);
                        break;
                    case "EmployeeGroup":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.EmployeeGroup.Description);
                        else
                            QueryData = QueryData.OrderBy(e => e.EmployeeGroup.Description);
                        break;

                    default:
                        QueryData = QueryData.OrderByDescending(e => e.OverTimeDate);
                        break;
                }

                QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

                return new JsonResult(new ScrollDataViewModel<OverTimeMaster>
                        (Scroll,
                        this.ConverterTableToViewModel<OverTimeMasterViewModel, OverTimeMaster>(await QueryData.AsNoTracking().ToListAsync())),
                        this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // POST: api/OverTimeMaster
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]OverTimeMaster nOverTimeMaster)
        {
            if (nOverTimeMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                nOverTimeMaster = helpers.AddHourMethod(nOverTimeMaster);

                nOverTimeMaster.CreateDate = DateTime.Now;
                nOverTimeMaster.Creator = nOverTimeMaster.Creator ?? "Someone";

                if (nOverTimeMaster.ProjectCodeMaster != null)
                    nOverTimeMaster.ProjectCodeMaster = null;

                if (nOverTimeMaster.EmployeeGroup != null)
                    nOverTimeMaster.EmployeeGroup = null;

                if (nOverTimeMaster.ApproveBy != null)
                    nOverTimeMaster.ApproveBy = null;

                if (nOverTimeMaster.RequireBy != null)
                    nOverTimeMaster.RequireBy = null;

                if (nOverTimeMaster.OverTimeDetails != null)
                {
                    foreach (var nDetail in nOverTimeMaster.OverTimeDetails)
                    {
                        if (nDetail.OverTimeDetailStatus == null)
                            nDetail.OverTimeDetailStatus = OverTimeDetailStatus.Use;
                        if (nDetail.Employee != null)
                            nDetail.Employee = null;
                        //Set Create
                        nDetail.CreateDate = nOverTimeMaster.CreateDate;
                        nDetail.Creator = nOverTimeMaster.Creator;
                    }
                }

                return new JsonResult(await this.repository.AddAsync(nOverTimeMaster), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "OverTimeMaster not found. " });
        }

        #endregion

        #region PUT
        // PUT: api/OverTimeMaster/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]OverTimeMaster uOverTimeMaster)
        {
            if (uOverTimeMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                uOverTimeMaster = helpers.AddHourMethod(uOverTimeMaster);

                uOverTimeMaster.ModifyDate = DateTime.Now;
                uOverTimeMaster.Modifyer = uOverTimeMaster.Modifyer ?? "Someone";

                if (uOverTimeMaster.ProjectCodeMaster != null)
                    uOverTimeMaster.ProjectCodeMaster = null;

                if (uOverTimeMaster.EmployeeGroup != null)
                    uOverTimeMaster.EmployeeGroup = null;

                if (uOverTimeMaster.ApproveBy != null)
                    uOverTimeMaster.ApproveBy = null;

                if (uOverTimeMaster.RequireBy != null)
                    uOverTimeMaster.RequireBy = null;

                if (uOverTimeMaster.OverTimeDetails != null)
                {
                    foreach (var uDetail in uOverTimeMaster.OverTimeDetails)
                    {
                        if (uDetail.OverTimeDetailStatus == null)
                            uDetail.OverTimeDetailStatus = OverTimeDetailStatus.Use;
                        if (uDetail.Employee != null)
                            uDetail.Employee = null;

                        if (uDetail.OverTimeMasterId > 0)
                        {
                            //ModifyDate
                            uDetail.ModifyDate = uOverTimeMaster.ModifyDate;
                            uDetail.Modifyer = uOverTimeMaster.Modifyer;
                        }
                        else
                        {
                            uDetail.CreateDate = uOverTimeMaster.ModifyDate;
                            uDetail.Creator = uOverTimeMaster.Modifyer;
                        }
                    }
                }

                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uOverTimeMaster, key);

                if (updateComplate != null)
                {
                    // filter
                    Expression<Func<OverTimeDetail, bool>> condition = d => d.OverTimeMasterId == key;
                    var dbOverTimeDetails = this.repositoryOverTimeDetail.FindAll(condition);

                    //Remove OverTimeDetail if edit remove it
                    foreach (var dbOvertimeDetail in dbOverTimeDetails)
                    {
                        if (!uOverTimeMaster.OverTimeDetails.Any(x => x.OverTimeDetailId == dbOvertimeDetail.OverTimeDetailId))
                            await this.repositoryOverTimeDetail.DeleteAsync(dbOvertimeDetail.OverTimeDetailId);
                    }
                    //Update OverTimeDetails
                    foreach (var uOvertime in uOverTimeMaster.OverTimeDetails)
                    {
                        if (uOvertime.OverTimeDetailId > 0)
                            await this.repositoryOverTimeDetail.UpdateAsync(uOvertime, uOvertime.OverTimeDetailId);
                        else
                        {
                            if (uOvertime.OverTimeMasterId < 1)
                                uOvertime.OverTimeMasterId = uOverTimeMaster.OverTimeMasterId;

                            await this.repositoryOverTimeDetail.AddAsync(uOvertime);
                        }
                    }
                }
                return new JsonResult(updateComplate, this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "OverTimeMaster not found. " });
        }
        #endregion

        #region DELETE
        // DELETE: api/TaskMachine/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
