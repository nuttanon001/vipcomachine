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
    [Route("api/EmployeeGroup")]
    public class EmployeeGroupController : Controller
    {
        #region PrivateMenbers

        private IRepository<EmployeeGroup> repository;
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

        public EmployeeGroupController(IRepository<EmployeeGroup> repo,IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion Constructor

        #region GET

        // GET: api/EmployeeGroup
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(),this.DefaultJsonSettings);
        }

        // GET: api/EmployeeGroup/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(string key)
        {
            return new JsonResult(await this.repository.GetAsync(key),this.DefaultJsonSettings);
        }

        #endregion GET

        #region POST

        // POST: api/EmployeeGroup/GetPage
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .AsQueryable();

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.GroupCode.ToLower().Contains(keyword) ||
                                                 x.Description.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "GroupCode":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.GroupCode);
                    else
                        QueryData = QueryData.OrderBy(e => e.GroupCode);
                    break;

                case "Description":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.Description);
                    else
                        QueryData = QueryData.OrderBy(e => e.Description);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.Description);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<EmployeeGroup>
                (Scroll,await QueryData.AsNoTracking().ToListAsync()),this.DefaultJsonSettings);
        }

        // POST: api/EmployeeGroup
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]EmployeeGroup nEmployeeGroup)
        {
            if (nEmployeeGroup != null)
            {
                if (nEmployeeGroup.OverTimeMasters != null)
                    nEmployeeGroup.OverTimeMasters = null;

                return new JsonResult(await this.repository.AddAsync(nEmployeeGroup), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "EmployeeGroup not found. " });
        }
        #endregion POST

        #region PUT

        // PUT: api/EmployeeGroup/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(string key, [FromBody]EmployeeGroup uEmployeeGroup)
        {
            if (uEmployeeGroup != null)
            {
                if (uEmployeeGroup.OverTimeMasters != null)
                    uEmployeeGroup.OverTimeMasters = null;

                return new JsonResult(await this.repository.UpdateAsync(uEmployeeGroup, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "EmployeeGroup not found. " });
        }

        #endregion PUT

        #region DELETE

        // DELETE: api/EmployeeGroup/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }

        #endregion DELETE
    }
}