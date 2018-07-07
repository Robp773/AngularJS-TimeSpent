'use strict';

angular.module('root-app', [])
  .factory('totals', function () {
    let totals = {};
    let newTime = new Date();
    let passedMins = newTime.getHours() * 60 + newTime.getMinutes();

    // MOCK DATA - eventually make GET requests to get initial values
    // -----------------------
    totals.plannedMins = 14;
    totals.recordedMins = 45;
    totals.unspentPastMins = passedMins - totals.recordedMins;
    totals.timeLeft = 1440 - passedMins - totals.plannedMins;
    // -----------------------

    // update the number of passed minutes 
    totals.timeTracker = function () {
      let newTime = new Date();
      passedMins = newTime.getHours() * 60 + newTime.getMinutes();
      totals.unspentPastMins = passedMins - totals.recordedMins;
      totals.timeLeft = 1440 - passedMins - totals.plannedMins;
    };

    // POST requests - send POST reqs to update DB and then update local values to reflect changes (totals.passedMins/timeLeft)
    totals.updateRecorded = function (newMins) {

      // deletions to record list
      if (newMins < 0) {
        totals.recordedMins = totals.recordedMins - newMins;
        totals.unspentPastMins = totals.unspentPastMins + newMins;
      }
      // additions to record list
      else {
        totals.recordedMins = totals.recordedMins + newMins;
        totals.unspentPastMins = totals.unspentPastMins - newMins;
      }
    };

    totals.updatePlanned = function (newMins) {

      // deletions to planned list
      if (newMins < 0) {
        totals.plannedMins = totals.plannedMins - newMins;
        totals.timeLeft = totals.timeLeft + newMins;
      }
      // additions to planned list
      else {
        totals.plannedMins = totals.plannedMins + newMins;
        totals.timeLeft = totals.timeLeft - newMins;
      }
    };
    return totals;
  })
  .controller('ModalCtrl', function (totals) {
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

    this.formSubmit = function (title, minutes) {
      if (title === 'Recorded') {
        totals.updateRecorded(minutes);
      }
      else {
        totals.updatePlanned(minutes);
      }
      document.getElementById('modalForm').reset();
    };
  })

  .controller('BannerCtrl', function ($interval) {
    let vm = this;
    vm.date = new Date();
    $interval(function () {
      vm.date = new Date();
    }, 1000);
  })

  .controller('TotalsCtrl', function ($interval, totals) {
    let vm = this;
    vm.data = totals;

    // this.test = function (mins) {
    //   totals.updateRecorded(mins);
    //   totals.updatePlanned(mins);
    // };

    $interval(function () {
      totals.timeTracker();
    }, 1000);

  })

  .directive('modalForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'modalForm.html'
    };
  });