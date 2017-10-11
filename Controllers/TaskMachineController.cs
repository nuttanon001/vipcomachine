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
using VipcoMachine.Helpers;
using VipcoMachine.ViewModels;
using VipcoMachine.Services.Interfaces;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/TaskMachine")]
    public class TaskMachineController : Controller
    {
        #region PrivateMenbers
        private IRepository<TaskMachine> repository;
        private IRepository<TaskMachineHasOverTime> repositoryOverTime;
        private IRepository<JobCardDetail> repositoryJobDetail;
        private IRepository<JobCardMaster> repositoryJobMaster;
        private IMapper mapper;
        private HelpersClass<TaskMachine> helpers;

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
        private async Task<bool> UpdateJobCard(int JobCardDetailId,string Create, JobCardDetailStatus Status = JobCardDetailStatus.Task)
        {
            var Includes = new List<string> { "JobCardDetails" };
            var jobCardDetail = await this.repositoryJobDetail.GetAsync(JobCardDetailId);
            if (jobCardDetail != null)
            {
                jobCardDetail.JobCardDetailStatus = Status;
                jobCardDetail.ModifyDate = DateTime.Now;
                jobCardDetail.Modifyer = Create;

                if (await this.repositoryJobDetail.UpdateAsync(jobCardDetail,jobCardDetail.JobCardDetailId) != null)
                {
                    if (jobCardDetail.JobCardMasterId != null)
                    {
                        var jobCardMaster = await this.repositoryJobMaster.GetAsynvWithIncludes(jobCardDetail.JobCardMasterId.Value, "JobCardMasterId", Includes);
                        if (!jobCardMaster.JobCardDetails.Any(x => x.JobCardDetailStatus == JobCardDetailStatus.Wait))
                        {
                            jobCardMaster.JobCardMasterStatus = JobCardMasterStatus.Complete;
                            jobCardMaster.ModifyDate = DateTime.Now;
                            jobCardMaster.Modifyer = Create;

                            await this.repositoryJobMaster.UpdateAsync(jobCardMaster, jobCardMaster.JobCardMasterId);
                        }
                        else
                        {
                            if (jobCardMaster.JobCardMasterStatus == JobCardMasterStatus.Complete)
                            {
                                jobCardMaster.JobCardMasterStatus = JobCardMasterStatus.Wait;
                                jobCardMaster.ModifyDate = DateTime.Now;
                                jobCardMaster.Modifyer = Create;

                                await this.repositoryJobMaster.UpdateAsync(jobCardMaster, jobCardMaster.JobCardMasterId);
                            }
                        }
                    }

                    return true;
                }
            }

            return false;
        }

        #endregion PrivateMenbers

        #region Constructor

        public TaskMachineController(
                IRepository<TaskMachine> repo,
                IRepository<TaskMachineHasOverTime> repoOverTime,
                IRepository<JobCardMaster> repoMaster,
                IRepository<JobCardDetail> repoDetail,
                IMapper map)
        {
            this.repository = repo;
            this.repositoryOverTime = repoOverTime;
            this.repositoryJobMaster = repoMaster;
            this.repositoryJobDetail = repoDetail;
            this.mapper = map;
            this.helpers = new HelpersClass<TaskMachine>();
        }

        #endregion

        #region GET

        // GET: api/TaskMachine/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "Machine" , "JobCardDetail" , "Employee" };
            return new JsonResult(
                      this.ConverterTableToViewModel<TaskMachineViewModel, TaskMachine>(await this.repository.GetAllWithInclude2Async(Includes)),
                      this.DefaultJsonSettings);
            //return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/TaskMachine/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "Machine", "JobCardDetail.CuttingPlan", "Employee" };
            return new JsonResult(
                      this.mapper.Map<TaskMachine, TaskMachineViewModel>(await this.repository.GetAsynvWithIncludes(key, "TaskMachineId", Includes)),
                      this.DefaultJsonSettings);
            // return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        #endregion

        #region POST

        // POST: api/TaskMachine/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                    .Include(x => x.Machine)
                                    .Include(x => x.Employee)
                                    .Include(x => x.JobCardDetail.CuttingPlan)
                                    .AsQueryable();
                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.ToLower().Split(null);
                foreach (var keyword in filters)
                {
                    QueryData = QueryData.Where(x => x.Description.ToLower().Contains(keyword) ||
                                                     x.TaskMachineName.ToLower().Contains(keyword) ||
                                                     x.JobCardDetail.CuttingPlan.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                     x.Machine.MachineCode.ToLower().Contains(keyword));
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "MachineCode":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.Machine.MachineCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.Machine.MachineCode);
                        break;

                    case "CuttingPlanNo":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.JobCardDetail.CuttingPlan.CuttingPlanNo);
                        else
                            QueryData = QueryData.OrderBy(e => e.JobCardDetail.CuttingPlan.CuttingPlanNo);
                        break;
                    case "TaskMachineName":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.TaskMachineName);
                        else
                            QueryData = QueryData.OrderBy(e => e.TaskMachineName);
                        break;

                    default:
                        QueryData = QueryData.OrderByDescending(e => e.PlannedStartDate);
                        break;
                }

                QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

                return new JsonResult(new ScrollDataViewModel<TaskMachine>
                        (Scroll,
                        this.ConverterTableToViewModel<TaskMachineViewModel,TaskMachine>(await QueryData.AsNoTracking().ToListAsync())),
                        this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // POST: api/TaskMachine
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TaskMachine nTaskMachine)
        {
            if (nTaskMachine != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                nTaskMachine = helpers.AddHourMethod(nTaskMachine);

                nTaskMachine.CreateDate = DateTime.Now;
                nTaskMachine.Creator = nTaskMachine.Creator ?? "Someone";

                var helperEdit = new HelpersClass<TaskMachineHasOverTime>();

                if (nTaskMachine.TaskMachineHasOverTimes != null)
                {
                    foreach (var nDetail in nTaskMachine.TaskMachineHasOverTimes)
                    {
                        var tempDetail = helperEdit.AddHourMethod(nDetail);
                        //Update date
                        nDetail.OverTimeStart = tempDetail.OverTimeStart;
                        nDetail.OverTimeEnd = tempDetail.OverTimeEnd;
                        //Set Create
                        nDetail.CreateDate = nTaskMachine.CreateDate;
                        nDetail.Creator = nTaskMachine.Creator;
                    }
                }

                var InsertComplate = await this.repository.AddAsync(nTaskMachine);
                if (InsertComplate != null)
                {
                    if (InsertComplate.JobCardDetailId > 0)
                    {
                        await this.UpdateJobCard(InsertComplate.JobCardDetailId, InsertComplate.Creator);
                    }
                }

                return new JsonResult(InsertComplate, this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "TaskMachine not found. " });
        }

        #endregion

        #region PUT
        // PUT: api/TaskMachine/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]TaskMachine uTaskMachine)
        {
            if (uTaskMachine != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                uTaskMachine = helpers.AddHourMethod(uTaskMachine);

                uTaskMachine.ModifyDate = DateTime.Now;
                uTaskMachine.Modifyer = uTaskMachine.Modifyer ?? "Someone";

                var helperEdit = new HelpersClass<TaskMachineHasOverTime>();

                if (uTaskMachine.TaskMachineHasOverTimes != null)
                {
                    foreach (var overTime in uTaskMachine.TaskMachineHasOverTimes)
                    {
                        var tempDetail = helperEdit.AddHourMethod(overTime);
                        //Update date
                        overTime.OverTimeStart = tempDetail.OverTimeStart;
                        overTime.OverTimeEnd = tempDetail.OverTimeEnd;

                        if (overTime.OverTimeId > 0)
                        {
                            //ModifyDate
                            overTime.ModifyDate = uTaskMachine.ModifyDate;
                            overTime.Modifyer = uTaskMachine.Modifyer;
                        }
                        else
                        {
                            overTime.CreateDate = uTaskMachine.ModifyDate;
                            overTime.Creator = uTaskMachine.Modifyer;
                        }
                    }
                }
                var beforUpdate = await this.repository.GetAsync(key);
                if (beforUpdate != null)
                {
                    if (beforUpdate.JobCardDetailId > 0 && uTaskMachine.JobCardDetailId > 0)
                    {
                        if (beforUpdate.JobCardDetailId != uTaskMachine.JobCardDetailId)
                        {
                            await this.UpdateJobCard(beforUpdate.JobCardDetailId, uTaskMachine.Modifyer,JobCardDetailStatus.Wait);
                        }
                    }
                }

                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uTaskMachine, key);

                if (updateComplate != null)
                {
                    if (updateComplate.JobCardDetailId > 0)
                    {
                        await this.UpdateJobCard(updateComplate.JobCardDetailId, updateComplate.Modifyer);
                    }

                    // filter
                    Expression<Func<TaskMachineHasOverTime, bool>> condition = m => m.TaskMachineId == key;
                    var dbOvertimes = this.repositoryOverTime.FindAll(condition);

                    //Remove TaskMachineHasOverTime if edit remove it
                    foreach (var dbOvertime in dbOvertimes)
                    {
                        if (!uTaskMachine.TaskMachineHasOverTimes.Any(x => x.OverTimeId == dbOvertime.OverTimeId))
                            await this.repositoryOverTime.DeleteAsync(dbOvertime.OverTimeId);
                    }
                    //Update ProjectCodeDetails
                    foreach (var uOvertime in uTaskMachine.TaskMachineHasOverTimes)
                    {
                        if (uOvertime.OverTimeId > 0)
                            await this.repositoryOverTime.UpdateAsync(uOvertime, uOvertime.OverTimeId);
                        else
                        {
                            if (uOvertime.TaskMachineId < 1)
                                uOvertime.TaskMachineId = uTaskMachine.TaskMachineId;

                            await this.repositoryOverTime.AddAsync(uOvertime);
                        }
                    }
                }
                return new JsonResult(updateComplate, this.DefaultJsonSettings);
                //return new JsonResult(await this.repository.UpdateAsync(uTaskMachine, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "TaskMachine not found. " });
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

        #region TEST

        private IActionResult TestScheduler()
        {

            return NotFound(new { Error = "" });
        }

        #endregion
    }
}
