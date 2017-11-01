using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
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
        [HttpGet("GetLastOverTime/{ProjectCodeId}/{GroupCode}/{CurrentId}")]
        public async Task<IActionResult> GetLastOverTime(int ProjectCodeId,string GroupCode,int CurrentId)
        {
            if (ProjectCodeId > 0 && !string.IsNullOrEmpty(GroupCode))
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                                .Where(x => x.OverTimeStatus != OverTimeStatus.Cancel)
                                                .OrderByDescending(x => x.OverTimeDate)
                                                .Include(x => x.ApproveBy)
                                                .Include(x => x.RequireBy)
                                                .Include(x => x.ProjectCodeMaster)
                                                .Include(x => x.EmployeeGroup).AsQueryable();

                if (CurrentId > 0)
                    QueryData = QueryData.Where(x => x.OverTimeMasterId != CurrentId);

                var LastOverTime = await QueryData.FirstOrDefaultAsync(x => x.ProjectCodeMasterId == ProjectCodeId && x.GroupCode == GroupCode);

                if (LastOverTime != null)
                    return new JsonResult(this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "Not found ProjectCodeMasterId ,GroupCode or LastOverTime." });
        }

        #endregion

        #region POST
        // POST: api/OverTimeMaster/OverTimeSchedule
        [HttpPost("OverTimeSchedule")]
        public async Task<IActionResult> OverTimeSchedule([FromBody] OptionOverTimeSchedule Scehdule)
        {
            string Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                                .Include(x => x.ApproveBy)
                                                .Include(x => x.RequireBy)
                                                .Include(x => x.ProjectCodeMaster)
                                                .Include(x => x.EmployeeGroup)
                                                .AsQueryable();
                int TotalRow;

                if (Scehdule != null)
                {
                    if (!string.IsNullOrEmpty(Scehdule.Filter))
                    {
                        // Filter
                        var filters = string.IsNullOrEmpty(Scehdule.Filter) ? new string[] { "" }
                                            : Scehdule.Filter.ToLower().Split(null);
                        foreach (var keyword in filters)
                        {
                            QueryData = QueryData.Where(x => x.EmpRequire.ToLower().Contains(keyword) ||
                                                             x.RequireBy.NameThai.ToLower().Contains(keyword) ||
                                                             x.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword) ||
                                                             x.ProjectCodeMaster.ProjectName.ToLower().Contains(keyword) ||
                                                             x.EmployeeGroup.Description.ToLower().Contains(keyword));
                        }
                    }

                    // Option ProjectCodeMaster
                    if (Scehdule.ProjectMasterId.HasValue)
                    {
                        QueryData = QueryData.Where(x => x.ProjectCodeMasterId == Scehdule.ProjectMasterId);
                    }
                    // Option GroupCode
                    if (!string.IsNullOrEmpty(Scehdule.GroupCode))
                    {
                        QueryData = QueryData.Where(x => x.GroupCode == Scehdule.GroupCode);
                    }
                    // Option SDate
                    if (Scehdule.SDate.HasValue)
                    {
                    }

                    // Option EDate
                    if (Scehdule.EDate.HasValue)
                    {
                    }

                    // Option Status
                    if (Scehdule.Status.HasValue)
                    {
                        if (Scehdule.Status == 1)
                            QueryData = QueryData.Where(x => x.OverTimeStatus == OverTimeStatus.Required);
                        else if (Scehdule.Status == 2)
                            QueryData = QueryData.Where(x => x.OverTimeStatus == OverTimeStatus.WaitActual);
                        else
                            QueryData = QueryData.Where(x => x.OverTimeStatus != OverTimeStatus.Cancel);
                    }
                    else
                    {
                        QueryData = QueryData.Where(x => x.OverTimeStatus == OverTimeStatus.Required);
                    }

                    TotalRow = await QueryData.CountAsync();

                    // Option Skip and Task
                    if (Scehdule.Skip.HasValue && Scehdule.Take.HasValue)
                        QueryData = QueryData.Skip(Scehdule.Skip ?? 0).Take(Scehdule.Take ?? 4);
                    else
                        QueryData = QueryData.Skip(0).Take(10);
                }
                else
                {
                    TotalRow = await QueryData.CountAsync();
                }

                var GetData = await QueryData.ToListAsync();
                if (GetData.Any())
                {
                    List<string> Columns = new List<string>();

                    var MinDate = GetData.Min(x => x.OverTimeDate);
                    var MaxDate = GetData.Max(x => x.OverTimeDate);

                    if (MinDate == null && MaxDate == null)
                    {
                        return NotFound(new { Error = "Data not found" });
                    }

                    foreach (DateTime day in EachDay(MinDate, MaxDate))
                    {
                        Columns.Add(day.Date.ToString("dd/MM/yy"));
                    }

                    var DataTable = new List<IDictionary<String, Object>>();

                    foreach (var Data in GetData.OrderBy(x => x.ProjectCodeMaster.ProjectCode).ThenBy(x => x.EmployeeGroup.Description))
                    {
                        var JobNumber = $"{Data?.ProjectCodeMaster?.ProjectCode}/{Data?.ProjectCodeMaster.ProjectName}";
                        IDictionary<String, Object> rowData;
                        bool update = false;
                        if (DataTable.Any(x => (string)x["JobNumber"] == JobNumber))
                        {
                            var FirstData = DataTable.FirstOrDefault(x => (string)x["JobNumber"] == JobNumber);
                            if (FirstData != null)
                            {
                                rowData = FirstData;
                                update = true;
                            }
                            else
                                rowData = new ExpandoObject();
                        }
                        else
                            rowData = new ExpandoObject();

                        // Data is 1:Plan,2:Actual,3:PlanAndActual
                        // For Plan
                        if (Data.OverTimeDate != null)
                        {
                            //var key = columnNames.Where(y => y.Contains(dateString)).FirstOrDefault();
                            //if (((IDictionary<String, Object>)data).Keys.Any(x => x == key))
                            //    ((IDictionary<String, Object>)data)[key] += $"#{item.TransportId}";
                            //else
                            //    ((IDictionary<String, Object>)data).Add(key, $"{item.TransportId}");
                            var Key = Data.OverTimeDate.ToString("dd/MM/yy");
                            if (rowData.Any(x => x.Key == Key))
                            {
                                var ListMaster = (List<OverTimeMaster>)rowData[Key];
                                ListMaster.Add(new OverTimeMaster
                                {
                                    OverTimeMasterId = Data.OverTimeMasterId,
                                    GroupCode = Data.EmployeeGroup.Description,
                                });

                                rowData[Key] = ListMaster;
                            }
                            else // add new
                            {
                                var Master = new OverTimeMaster()
                                {
                                    OverTimeMasterId = Data.OverTimeMasterId,
                                    GroupCode = Data.EmployeeGroup.Description,
                                };
                                rowData.Add(Key, new List<OverTimeMaster>() {Master});
                            }
                        }

                        if (!update)
                        {
                            rowData.Add("JobNumber", JobNumber);
                            DataTable.Add(rowData);
                        }
                    }

                    return new JsonResult(new
                    {
                        TotalRow = TotalRow,
                        Columns = Columns,
                        DataTable = DataTable
                    }, this.DefaultJsonSettings);
                }

            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

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
                    case "RequireString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.RequireBy.NameThai);
                        else
                            QueryData = QueryData.OrderBy(e => e.RequireBy.NameThai);
                        break;

                    case "ProjectMasterString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.ProjectCodeMaster.ProjectCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.ProjectCodeMaster.ProjectCode);
                        break;
                    case "GroupString":
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

                if (uOverTimeMaster.Creator == uOverTimeMaster.Modifyer)
                {
                    if (uOverTimeMaster.OverTimeStatus == OverTimeStatus.WaitActual &&
                        !string.IsNullOrEmpty(uOverTimeMaster.InfoActual))
                    {
                        uOverTimeMaster.OverTimeStatus = OverTimeStatus.Complate;
                    }
                }

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
