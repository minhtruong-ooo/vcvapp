using VCV_API.Models.Employee;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeSingleCol>> GetEmployeeSinglesAsync();
    }
}
