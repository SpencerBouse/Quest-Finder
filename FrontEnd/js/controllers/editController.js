(function() {
    'use strict';

    angular
        .module('routing')
        .controller('editController', function(API,$location) {
        	const vm = this;

          if(localStorage.getItem('token')){
              let currentUser = API.getInfo(localStorage.getItem('token'))
              currentUser.then(res=>{
                vm.user = res.data.data
                if(!res.data.type)$location.path('login');
              })
          }else{
            $location.path('login');
          }

          vm.saveProfile = function(){
            vm.user.groups=[]
            console.log(vm.user)
            let updateUser = API.saveProfile(vm.user)
            updateUser.then(res=>{
              if(res.data.type){
                $location.path('home/Profile')
              }else{
                console.log(res.data.data)
              }
            })
          }
        });

})();
