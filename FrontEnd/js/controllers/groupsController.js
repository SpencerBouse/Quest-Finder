(function() {
    'use strict';

    angular.module('routing').controller('groupsController', function(API, $location, $scope) {
        const vm = this;
        vm.user
        vm.currentGroup
        if (localStorage.getItem('token')) {
            let currentUser = API.getInfo(localStorage.getItem('token'))
            currentUser.then(res => {
                vm.user = res.data.data
                if (!res.data.type)
                    $location.path('login');
                vm.currentGroup = vm.user.groups[0]
                vm.select(vm.user.groups[0])
                if(!vm.user.groups[0]){
                  vm.message ="No groups, go to find groups tab to find group"
                  vm.showvar = false
                }else{
                  vm.message=''
                  vm.showvar = true
                }
            })
        } else {
            $location.path('login');
        }

        vm.getGroup = function(index) {
            vm.currentGroup = vm.user.groups[index]
        }

        vm.select = function(item) {
            this.selected = item;
        };

        vm.isActive = function(item) {
            return this.selected === item;
        };

    });

})();
