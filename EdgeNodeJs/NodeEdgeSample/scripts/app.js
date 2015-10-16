(function(){
    var app = angular.module('edgeCrudApp', []);

	app.controller('EdgeCrudController', function(edgeCrudSvc){
		var vm = this;
		
		function getAllEmployeees(){
			edgeCrudSvc.getEmployees().then(function(result){
				vm.employees = result;
			},function(error){
				console.log(error);
			});
		}
		
		vm.addOrEdit = function(){
			vm.employee.Salary = parseInt(vm.employee.Salary);
			if (vm.employee.Id){
				edgeCrudSvc.editEmployee(vm.employee).then(function(result){
					resetForm();
					getAllEmployeees();
				}, function(error){
					console.log("Error while updating an employee");
					console.log(error);
				});				
			}
			else{
			edgeCrudSvc.addEmployee(vm.employee).then(function(result){
				resetForm();
				getAllEmployeees();
			}, function(error){
				console.log("Error while inserting an employee");
				console.log(error);
			});
			}
		};
		
		vm.reset = function(){
			resetForm();
		};
		
		function resetForm(){
			vm.employee = {};
			vm.addEditEmployee.$setPristine();
		}
		
		vm.edit = function(emp){
			vm.employee = emp;
		}
		
		vm.delete = function(emp){
			deleteEmp(emp);
		};
		
		function deleteEmp(employee){
			console.log("About to delete");
			edgeCrudSvc.delEmployee(employee).then(function(result){
				getAllEmployeees();
			}, function(error){
				console.log("Error while deleting employee " + employee.Id);
				console.log(error);
			})
		}
		
		getAllEmployeees();
	});
	
	app.factory('edgeCrudSvc', function($http){
		var baseUrl = '/api/employees';
		
		function getEmployees(){
			return $http.get(baseUrl).then(
				function(result){
					return result.data;
				}, function(error){
					return error;
				});
		}
		
		function addEmployee(newEmployee){
            return $http.post(baseUrl, newEmployee)
                .then(function (result) {
                    return result.data;
                }, function (error) {
                    return error;
                });
        }
		
		function editEmployee(employee){
            return $http.put(baseUrl + '/' + employee.Id, employee)
                .then(function (result) {
                    return result.data;
                }, function (error) {
                    return error;
                });
        }
		
		function delEmployee(employee){
			console.log('Client: deleting');
            return $http.delete(baseUrl + '/' + employee.Id)
                .then(function (result) {
                    return result.data;
                }, function (error) {
                    return error;
                });
        }
				
		return {
			getEmployees: getEmployees,
			addEmployee: addEmployee,
			editEmployee: editEmployee,
			delEmployee: delEmployee
		};		
	});
}());