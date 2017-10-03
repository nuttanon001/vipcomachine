﻿using AutoMapper;
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
    [Route("api/ProjectCodeDetail")]
    public class ProjectCodeDetailController : Controller
    {
        #region PrivateMenbers
        private IRepository<ProjectCodeDetail> repository;
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

        public ProjectCodeDetailController(IRepository<ProjectCodeDetail> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion
        #region GET
        // GET: api/ProjectCodeDetail
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "ProjectCodeMaster" };

            return new JsonResult(
                  this.ConverterTableToViewModel<ProjectCodeDetailViewModel, ProjectCodeDetail>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);

            //return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/ProjectCodeDetail/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "ProjectCodeMaster" };
            return new JsonResult(
               this.mapper.Map<ProjectCodeDetail, ProjectCodeDetailViewModel>(await this.repository.GetAsynvWithIncludes(key, "ProjectCodeDetailId", Includes)),
               this.DefaultJsonSettings);
            //return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        // GET: api/ProjectCodeDetail/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Where(x => x.ProjectCodeMasterId == MasterId)
                                .Include(x => x.ProjectCodeMaster);
            return new JsonResult(
                this.ConverterTableToViewModel<ProjectCodeDetailViewModel, ProjectCodeDetail>(await QueryData.AsNoTracking().ToListAsync()),
                this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/ProjectCodeDetail
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ProjectCodeDetail nProjectCodeDetail)
        {
            nProjectCodeDetail.CreateDate = DateTime.Now;
            nProjectCodeDetail.Creator = nProjectCodeDetail.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nProjectCodeDetail), this.DefaultJsonSettings);
        }
        #endregion

        #region PUT
        // PUT: api/ProjectCodeDetail/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]ProjectCodeDetail uProjectCodeDetail)
        {
            uProjectCodeDetail.ModifyDate = DateTime.Now;
            uProjectCodeDetail.Modifyer = uProjectCodeDetail.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uProjectCodeDetail, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/ProjectCodeDetail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
