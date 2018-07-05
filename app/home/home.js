'use strict';

angular.module('root-app', [])



  .controller('ModalCtrl', function () {
    let vm = this;
    this.btnClick = function (tab) {
      if (tab === 'records') {
        vm.recordActive = true;
        vm.title = 'Records';
        vm.name = 'Record';
        vm.verb = 'Recorded';
      }
      else {
        vm.plansActive = true;
        vm.title = 'Plans';
        vm.name = 'Plan';
        vm.verb = 'Planned';
      }
    };
    this.modalExit = function () {
      vm.recordActive = false;
      vm.plansActive = false;
      document.getElementById('modalForm').reset();
    };
  })

  .controller('BannerCtrl', function ($interval, $rootScope) {
    let vm = this;
    let timeWait;
    // vm.time = getTime;

    $interval(function () {
      let date = new Date();
      let minutes, hours, period;
      // convert into 12 hour clock
      if (date.getHours() > 12) {
        hours = date.getHours() - 12;
        period = 'PM';
      }
      else {
        hours = date.getHours();
        period = 'AM';
      }
      if (date.getMinutes() < 10) {
        minutes = `0${date.getMinutes()}`;
      }
      else {
        minutes = date.getMinutes();
      }
      let time = `${hours}:${minutes}`;
      // create variable to count the exact number of seconds until the next minute. 
      timeWait = (60 - date.getSeconds()) * 1000;
      $rootScope.timeObj = { currentTime: time, timePeriod: period, timeWait: timeWait };
    }, timeWait);
  })

  .directive('modalForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'modalForm.html'
    };
  });




