﻿using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
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
    [Route("api/JobCardMaster")]
    public class JobCardMasterController : Controller
    {
        #region PrivateMenbers

        private IRepository<JobCardMaster> repository;
        private IRepository<JobCardMasterHasAttach> repositoryHasAttach;
        private IRepository<JobCardDetail> repositoryDetail;
        private IRepository<UnitsMeasure> repositoryUom;
        private IRepository<CuttingPlan> repositoryCut;
        private IRepository<AttachFile> repositoryAtt;
        private IMapper mapper;
        private IHostingEnvironment appEnvironment;
        private HelpersClass<JobCardMaster> helpers;

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

        public JobCardMasterController(
            IRepository<JobCardMaster> repo,
            IRepository<JobCardMasterHasAttach> repoHasAttach,
            IRepository<JobCardDetail> repoDetail,
            IRepository<UnitsMeasure> repoUom,
            IRepository<CuttingPlan> repoCut,
            IRepository<AttachFile> repoAtt,
            IMapper map,
            IHostingEnvironment app)
        {
            this.repository = repo;
            this.repositoryHasAttach = repoHasAttach;
            this.repositoryDetail = repoDetail;
            this.repositoryUom = repoUom;
            this.repositoryCut = repoCut;
            this.repositoryAtt = repoAtt;
            this.appEnvironment = app;
            this.mapper = map;
            this.helpers = new HelpersClass<JobCardMaster>();
        }

        #endregion Constructor

        #region GET

        // GET: api/JobCardMaster/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            //return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
            var Includes = new List<string> { "EmployeeRequire", "EmployeeWrite", "TypeMachine", "ProjectCodeDetail.ProjectCodeMaster" };
            return new JsonResult(
                  this.ConverterTableToViewModel<JobCardMasterViewModel, JobCardMaster>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);
        }

        // GET: api/JobCardMaster/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            //return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
            var Includes = new List<string> { "EmployeeRequire", "EmployeeWrite", "TypeMachine", "ProjectCodeDetail.ProjectCodeMaster" };
            return new JsonResult(
               this.mapper.Map<JobCardMaster, JobCardMasterViewModel>(await this.repository.GetAsynvWithIncludes(key, "JobCardMasterId", Includes)),
               this.DefaultJsonSettings);
        }

        #endregion GET

        #region POST

        // POST: api/JobCardMaster/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                    .Include(x => x.EmployeeRequire)
                                    .Include(x => x.EmployeeWrite)
                                    .Include(x => x.TypeMachine)
                                    .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
                                    .AsQueryable();
                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.ToLower().Split(null);

                foreach (var keyword in filters)
                {
                    QueryData = QueryData.Where(x => x.Description.ToLower().Contains(keyword) ||
                                                     x.JobCardMasterNo.ToLower().Contains(keyword) ||
                                                     x.EmployeeRequire.NameThai.ToLower().Contains(keyword) ||
                                                     x.EmpRequire.ToLower().Contains(keyword) ||
                                                     x.EmployeeWrite.NameThai.ToLower().Contains(keyword) ||
                                                     x.EmpWrite.ToLower().Contains(keyword) ||
                                                     x.Remark.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword));
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "JobCardMasterNo":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.JobCardMasterNo);
                        else
                            QueryData = QueryData.OrderBy(e => e.JobCardMasterNo);
                        break;

                    case "ProjectDetailString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                        break;

                    case "EmployeeRequireString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.EmployeeRequire.NameThai);
                        else
                            QueryData = QueryData.OrderBy(e => e.EmployeeRequire.NameThai);
                        break;

                    case "JobCardDate":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.JobCardDate);
                        else
                            QueryData = QueryData.OrderBy(e => e.JobCardDate);
                        break;

                    default:
                        QueryData = QueryData.OrderByDescending(e => e.JobCardDate);
                        break;
                }

                QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

                return new JsonResult(new ScrollDataViewModel<JobCardMaster>
                    (Scroll,
                    this.ConverterTableToViewModel<JobCardMasterViewModel, JobCardMaster>(await QueryData.AsNoTracking().ToListAsync())
                    ), this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // POST: api/JobCardMaster
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]JobCardMaster nJobCardMaster)
        {
            if (nJobCardMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                nJobCardMaster = helpers.AddHourMethod(nJobCardMaster);

                nJobCardMaster.JobCardMasterStatus = JobCardMasterStatus.Wait;
                nJobCardMaster.CreateDate = DateTime.Now;
                nJobCardMaster.Creator = nJobCardMaster.Creator ?? "Someone";

                if (nJobCardMaster.JobCardDetails != null)
                {
                    foreach (var nDetail in nJobCardMaster.JobCardDetails)
                    {
                        nDetail.JobCardDetailStatus = JobCardDetailStatus.Wait;
                        nDetail.CreateDate = nJobCardMaster.CreateDate;
                        nDetail.Creator = nJobCardMaster.Creator;
                        // Insert UnitMeasure
                        if (nDetail.UnitMeasureId < 1 && nDetail.UnitsMeasure != null)
                        {
                            nDetail.UnitsMeasure.CreateDate = nJobCardMaster.CreateDate;
                            nDetail.UnitsMeasure.Creator = nJobCardMaster.Creator;
                        }
                        else
                            nDetail.UnitsMeasure = null;
                        // Insert CuttingPlan
                        if (nDetail.CuttingPlanId < 1 && nDetail.CuttingPlan != null)
                        {
                            nDetail.CuttingPlan.CreateDate = nJobCardMaster.CreateDate;
                            nDetail.CuttingPlan.Creator = nJobCardMaster.Creator;
                        }
                        else
                            nDetail.CuttingPlan = null;
                    }
                }

                return new JsonResult(await this.repository.AddAsync(nJobCardMaster), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "JobCardMaster not found. " });
        }

        #endregion POST

        #region PUT

        // PUT: api/JobCardMaster/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]JobCardMaster uJobCardMaster)
        {
            if (uJobCardMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                uJobCardMaster = helpers.AddHourMethod(uJobCardMaster);

                uJobCardMaster.ModifyDate = DateTime.Now;
                uJobCardMaster.Modifyer = uJobCardMaster.Modifyer ?? "Someone";

                if (uJobCardMaster.JobCardDetails != null)
                {
                    foreach (var uDetail in uJobCardMaster.JobCardDetails)
                    {
                        if (uDetail.JobCardDetailId > 0)
                        {
                            uDetail.ModifyDate = uJobCardMaster.ModifyDate;
                            uDetail.Modifyer = uJobCardMaster.Modifyer;
                        }
                        else
                        {
                            uDetail.CreateDate = uJobCardMaster.ModifyDate;
                            uDetail.Creator = uJobCardMaster.Modifyer;
                            uDetail.JobCardDetailStatus = JobCardDetailStatus.Wait;
                        }

                        // Insert UnitMeasure
                        if (uDetail.UnitMeasureId < 1 && uDetail.UnitsMeasure != null)
                        {
                            var nUnitMeasure = VipcoMachine.Helpers.CloneObject.Clone<UnitsMeasure>(uDetail.UnitsMeasure);
                            if (nUnitMeasure != null)
                            {
                                nUnitMeasure.CreateDate = uJobCardMaster.ModifyDate;
                                nUnitMeasure.Creator = uJobCardMaster.Modifyer;

                                nUnitMeasure = await this.repositoryUom.AddAsync(nUnitMeasure);
                                uDetail.UnitMeasureId = nUnitMeasure.UnitMeasureId;
                            }
                        }

                        if (uDetail.CuttingPlanId < 1 && uDetail.CuttingPlan != null)
                        {
                            var nCuttingPlan = VipcoMachine.Helpers.CloneObject.Clone<CuttingPlan>(uDetail.CuttingPlan);
                            if (nCuttingPlan != null)
                            {
                                nCuttingPlan.CreateDate = uJobCardMaster.ModifyDate;
                                nCuttingPlan.Creator = uJobCardMaster.Modifyer;

                                nCuttingPlan = await this.repositoryCut.AddAsync(nCuttingPlan);
                                uDetail.CuttingPlanId = nCuttingPlan.CuttingPlanId;
                            }
                        }

                        uDetail.CuttingPlan = null;
                        uDetail.UnitsMeasure = null;
                    }
                }

                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uJobCardMaster, key);

                if (updateComplate != null)
                {
                    // filter
                    Expression<Func<JobCardDetail, bool>> condition = m => m.JobCardMasterId == key;
                    var dbDetails = this.repositoryDetail.FindAll(condition);

                    //Remove Jo if edit remove it
                    foreach (var dbDetail in dbDetails)
                    {
                        if (!uJobCardMaster.JobCardDetails.Any(x => x.JobCardDetailId == dbDetail.JobCardDetailId))
                            await this.repositoryDetail.DeleteAsync(dbDetail.JobCardDetailId);
                    }
                    //Update JobCardDetail or New JobCardDetail
                    foreach (var uDetail in uJobCardMaster.JobCardDetails)
                    {
                        if (uDetail.JobCardDetailId > 0)
                            await this.repositoryDetail.UpdateAsync(uDetail, uDetail.JobCardDetailId);
                        else
                        {
                            if (uDetail.JobCardDetailId < 1)
                                uDetail.JobCardMasterId = uJobCardMaster.JobCardMasterId;

                            await this.repositoryDetail.AddAsync(uDetail);
                        }
                    }
                }
                return new JsonResult(updateComplate, this.DefaultJsonSettings);

                //return new JsonResult(await this.repository.UpdateAsync(uJobCardMaster, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "ProjectMaster not found. " });
        }

        #endregion PUT

        #region DELETE

        // DELETE: api/JobCardMaster/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }

        #endregion DELETE

        #region Attach

        // GET: api/JobCardMaster/GetAttach/5
        [HttpGet("GetAttach/{JobCardMasterId}")]
        public async Task<IActionResult> GetAttach(int JobCardMasterId)
        {
            var Query = this.repositoryHasAttach.GetAllAsQueryable()
                            .Where(x => x.JobCardMasterId == JobCardMasterId)
                            .Include(x => x.AttachFile);

            return new JsonResult(await Query.Select(x => x.AttachFile).AsNoTracking().ToListAsync(), this.DefaultJsonSettings);
        }

        // POST: api/JobCardMaster/PostAttach/5/Someone
        [HttpPost("PostAttach/{JobCardMasterId}/{CreateBy}")]
        public async Task<IActionResult> PostAttac(int JobCardMasterId, string CreateBy, IEnumerable<IFormFile> files)
        {
            string Message = "";
            try
            {
                long size = files.Sum(f => f.Length);

                // full path to file in temp location
                var filePath1 = Path.GetTempFileName();

                foreach (var formFile in files)
                {
                    string FileName = Path.GetFileName(formFile.FileName).ToLower();
                    // create file name for file
                    string FileNameForRef = $"{DateTime.Now.ToString("ddMMyyhhmmssfff")}{ Path.GetExtension(FileName).ToLower()}";
                    // full path to file in temp location
                    var filePath = Path.Combine(this.appEnvironment.WebRootPath + "\\files", FileNameForRef);

                    if (formFile.Length > 0)
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                            await formFile.CopyToAsync(stream);
                    }

                    var returnData = await this.repositoryAtt.AddAsync(new AttachFile()
                    {
                        FileAddress = $"/files/{FileNameForRef}",
                        FileName = FileName,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone"
                    });

                    await this.repositoryHasAttach.AddAsync(new JobCardMasterHasAttach()
                    {
                        AttachFileId = returnData.AttachFileId,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone",
                        JobCardMasterId = JobCardMasterId
                    });
                }

                return Ok(new { count = 1, size, filePath1 });

            }
            catch (Exception ex)
            {
                Message = ex.ToString();
            }

            return NotFound(new { Error = "Not found " + Message });
        }

        // DELETE: api/TrainingCousre/DeleteAttach/5
        [HttpDelete("DeleteAttach/{AttachFileId}")]
        public async Task<IActionResult> DeleteAttach(int AttachFileId)
        {
            if (AttachFileId > 0)
            {
                var AttachFile = await this.repositoryAtt.GetAsync(AttachFileId);
                if (AttachFile != null)
                {
                    var filePath = Path.Combine(this.appEnvironment.WebRootPath + AttachFile.FileAddress);
                    FileInfo delFile = new FileInfo(filePath);

                    if (delFile.Exists)
                        delFile.Delete();
                    // Condition
                    Expression<Func<JobCardMasterHasAttach, bool>> condition = c => c.AttachFileId == AttachFile.AttachFileId;
                    var JobMasterHasAttach = this.repositoryHasAttach.FindAsync(condition).Result;
                    if (JobMasterHasAttach != null)
                        this.repositoryHasAttach.Delete(JobMasterHasAttach.JobMasterHasAttachId);
                    // remove attach
                    return new JsonResult(await this.repositoryAtt.DeleteAsync(AttachFile.AttachFileId), this.DefaultJsonSettings);
                }
            }

            return NotFound(new { Error = "Not found attach file." });
        }


        #endregion
    }
}