(function() {
    'use strict';

    angular
        .module('routing')
        .controller('findController', function(API,$location) {
        	const vm = this;
          vm.message=''
          vm.validGroup

          if(localStorage.getItem('token')){
              let currentUser = API.getInfo(localStorage.getItem('token'))
              currentUser.then(res=>{
                vm.user = res.data.data
                if(!res.data.type)$location.path('login');
              })
          }else{
            $location.path('login');
          }

          vm.setAllTrue = function(){
            let setAll = API.setallUsers()
          }

          vm.startSearch = function(){
            if(!vm.user.player){
              vm.message = 'Please fill in all fields'
            }else if (!(vm.user.characterName && vm.user.role && vm.user.race && (vm.user.skype || vm.user.discord))) {
              vm.message = 'Please fill out Profile Page'
            }else{
              vm.message=''
              var group =[]
              let counterone = 0
              let countertwo = 0
              vm.user.groups = []
              let start = API.startSearch(vm.user)
              start.then(response=>{
                if(response.data.data.player === 'dungeonMaster'){
                  counterone = 3
                  countertwo = 0
                }else{
                  counterone = 2
                  countertwo = 1
                }
                var p1 = new Promise(function(resolve, reject){
                  var i
                  for(i=0;i<counterone;i++){
                    let getPlayers = API.getPlayer(vm.user)
                    getPlayers.then(res=>{
                      if(res.data.type){
                        group.push(res.data.data)
                        vm.messagesucc = 'Group found, continue to groups tab to see groups.'
                        vm.message = ''
                        vm.validGroup = true
                      }else{
                        vm.messagesucc = ''
                        vm.message = res.data.data
                        vm.validGroup = false
                      }
                    })
                  }
                  resolve('one')
                })
                var p2 = new Promise(function(resolve, reject){
                  var e
                  for(e=0;e<countertwo;e++){
                    let getDm = API.getDm(response.data)
                    getDm.then(res=>{
                      if(res.data.type){
                        group.push(res.data.data)
                        vm.message = ''
                        vm.messagesucc = 'Group found, continue to groups tab to see groups.'
                        vm.validGroup = true
                      }else{
                        vm.message = res.data.data
                        vm.messagesucc = ''
                        vm.validGroup = false
                      }
                    })
                  }
                  resolve('two')
                })
                var p3 = new Promise(function(resolve,reject){
                  setTimeout(function(){
                    resolve('three')
                  },700)
                })
                Promise.all([p1,p2,p3]).then(val=>
                  vm.saveGroup(group)
                )
              })

            }
          }
          vm.saveGroup = function(group){
            if(vm.validGroup){
              group.push(vm.user)
              let groupSave = API.groupSave(group, vm.user)
              groupSave.then(res=>{
                console.log(res)
              })
            }
          }
        });

})();
