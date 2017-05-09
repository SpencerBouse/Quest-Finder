(function() {
    'use strict';

    angular
        .module('routing')
        .controller('profileController', function(API,$location) {
        	const vm = this;

          if(localStorage.getItem('token')){
              let currentUser = API.getInfo(localStorage.getItem('token'))
              currentUser.then(res=>{
                vm.user = res.data.data
                if(!res.data.type)$location.path('login');
                if(!vm.user.imgsource)vm.user.imgsource = 'https://sorted.org.nz/themes/sorted/assets/images/user-icon-grey.svg'
                if(!vm.user.description) vm.user.description = 'No User Description'
              })
          }else{
            $location.path('login');
          }

          vm.editProfile = function(){
            $location.path('home/editProfile');
          }

        });

})();
