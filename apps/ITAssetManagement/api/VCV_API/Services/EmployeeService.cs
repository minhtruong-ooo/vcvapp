using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.Asset;
using VCV_API.Models.Employee;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<EmployeeSingleCol>> GetEmployeeSinglesAsync()
        {
            var employeess = new List<EmployeeSingleCol>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Employee_GetAllEmployeesSingleColumn";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var employee = new EmployeeSingleCol
                            {
                                EmployeeID = reader.IsDBNull(reader.GetOrdinal("EmployeeID")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("EmployeeID")),
                                EmployeeInfo = reader.IsDBNull(reader.GetOrdinal("EmployeeInfo")) ? null : reader.GetString(reader.GetOrdinal("EmployeeInfo")),
                            };

                            employeess.Add(employee);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }

            return employeess;
        }
    }
}
