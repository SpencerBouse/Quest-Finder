(function() {
    'use strict';

    angular
        .module('routing')
        .factory('API', function($http) {

            return {
                makelogin: (data) => {
                  return $http({
                      method: 'POST',
                      data: data,
                      url: 'http://localhost:3001/signin'
                    })
                },
                login: (data) => {
                  return $http({
                      method: 'POST',
                      data: data,
                      url: 'http://localhost:3001/authenticate'
                    })
                },
                getInfo: (token) => {
                  return $http({
                      method: 'GET',
                      headers: {"authorization": token},
                      url: 'http://localhost:3001/me'
                    })
                },
                saveProfile: (data) => {
                  return $http({
                      method: 'POST',
                      data: data,
                      url: 'http://localhost:3001/save'
                    })
                }
            };
        });

})();
