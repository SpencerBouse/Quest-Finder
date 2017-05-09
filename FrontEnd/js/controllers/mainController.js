(function() {
    'use strict';

    angular
        .module('routing')
        .controller('mainController', function(API,$location) {
        	const vm = this;

          vm.createlogin = function(){
            if(!vm.user)vm.message="Please fill all fields"
            let newuser = API.makelogin(vm.user)
              newuser.then(res=>{
                console.log(res.data)
                if(res.data.type){
                  localStorage.setItem('token',res.data.token);
                  $location.path('/home/profile')
                }
                else{
                  vm.message = res.data.data
                }
              })
            vm.user=""
          },
          vm.login = function(){
            let userlogin = API.login(vm.user)
              userlogin.then(res=>{
                if(res.data.type){
                  localStorage.setItem('token',res.data.token);
                  $location.path('/home/profile')
                }
                else{
                  vm.message = res.data.data
                }
              })
            vm.user=""
          },
          vm.logout = function(){
            localStorage.removeItem('token');
            $location.path('/login')
          }

        });

})();
