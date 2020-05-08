using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Core.Models;
using vega.Core;
using System.Collections.Generic;
using System.Linq;

namespace vega.Controllers
{
    [Route("/api/vehicles")]
    public class VehiclesController : Controller
    {
        private readonly IMapper mapper;
        private readonly IVehicleRepository repository;
        private readonly IUnitOfWork unitOfWork;
        public VehiclesController(IMapper mapper, IVehicleRepository repository, IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody]SaveVehicleResource vehicleResource)
        {
            //Validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //Map SavevehicleResource to Vehicle
            var vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdate = DateTime.Now;

            //Add to DB
            repository.Add(vehicle);
            await unitOfWork.CompleteAsync();

            //Map Vehicle to VehicleResource
            vehicle = await repository.getVehicle(vehicle.Id);
            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody]SaveVehicleResource vehicleResource)
        {
            //Validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //Find from DataBase
            var vehicle = await repository.getVehicle(id);

            if (vehicle == null)
                return NotFound();

            //Map vehicleResource to Vehicle
            mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
            vehicle.LastUpdate = DateTime.Now;

            //Save in DB
            await unitOfWork.CompleteAsync();

            //Map back Vehicle to VehicleResource
            vehicle = await repository.getVehicle(vehicle.Id);
            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await repository.getVehicle(id, includeReleted: false);

            if (vehicle == null)
                return NotFound();

            repository.Remove(vehicle);
            await unitOfWork.CompleteAsync();

            return Ok(id);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getVehicle(int id)
        {
            var vehicle = await repository.getVehicle(id);

            if (vehicle == null)
                return NotFound();

            var vehicleFeature = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(vehicleFeature);
        }

        [HttpGet]
        public async Task<QueryResultResource<VehicleResource>> getVehicles(VehicleQueryResource queryResource)
        {
            var filter = mapper.Map<VehicleQueryResource, VehicleQuery>(queryResource);

            var queryResult = await repository.getVehicles(filter);

            return mapper.Map<QueryResult<Vehicle>, QueryResultResource<VehicleResource>>(queryResult);
        }
    }
}