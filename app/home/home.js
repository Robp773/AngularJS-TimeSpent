'use strict';

angular.module('root-app', [])
  .factory('dataTotals', function () {
    let dataTotals = {
      plannedMins: 0,
      recordedMins: 0,
      unspentPastMins: 0,
      historyTotals: {
        recordedTotal: 0,
        plannedTotal: 0,
        unusedPastTime: 0
      }
    };
    let newTime = new Date();
    let passedMins = newTime.getHours() * 60 + newTime.getMinutes();
    let simGet = 0;

    dataTotals.unspentPastMins = passedMins - dataTotals.recordedMins;
    dataTotals.timeLeft = 1440 - passedMins - dataTotals.plannedMins;

    // update the number of passed minutes 
    dataTotals.timeTracker = function () {
      let newTime = new Date();
      passedMins = newTime.getHours() * 60 + newTime.getMinutes();
      dataTotals.unspentPastMins = passedMins - dataTotals.recordedMins;
      dataTotals.historyTotals.unusedPastTime = simGet + dataTotals.unspentPastMins;
      dataTotals.timeLeft = 1440 - passedMins - dataTotals.plannedMins;
    };

    // POST requests - send POST reqs to update DB and then update local values to reflect changes (dataTotals.passedMins/timeLeft)
    dataTotals.updateRecorded = function (newMins) {

      // deletions to record list
      if (newMins < 0) {
        dataTotals.recordedMins = dataTotals.recordedMins - newMins;
        dataTotals.unspentPastMins = dataTotals.unspentPastMins + newMins;
        dataTotals.historyTotals.recordedTotal = dataTotals.historyTotals.recordedTotal - newMins;
      }
      // additions to record list
      else {
        dataTotals.recordedMins = dataTotals.recordedMins + newMins;
        dataTotals.unspentPastMins = dataTotals.unspentPastMins - newMins;
        dataTotals.historyTotals.recordedTotal = dataTotals.historyTotals.recordedTotal + newMins;
      }
    };

    dataTotals.updatePlanned = function (newMins) {

      // deletions to planned list
      if (newMins < 0) {
        dataTotals.plannedMins = dataTotals.plannedMins - newMins;
        dataTotals.timeLeft = dataTotals.timeLeft + newMins;
        dataTotals.historyTotals.plannedTotal = dataTotals.historyTotals.plannedTotal - newMins;
      }
      // additions to planned list
      else {
        dataTotals.plannedMins = dataTotals.plannedMins + newMins;
        dataTotals.timeLeft = dataTotals.timeLeft - newMins;
        dataTotals.historyTotals.plannedTotal = dataTotals.historyTotals.plannedTotal + newMins;
      }
    };
    return dataTotals;
  })
  .controller('ModalCtrl', function (dataTotals) {
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
        dataTotals.updateRecorded(minutes);
      }
      else {
        dataTotals.updatePlanned(minutes);
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

  .controller('TotalsCtrl', function ($interval, dataTotals) {
    let vm = this;
    vm.data = dataTotals;
    console.log(vm.data);

    // this.test = function (mins) {
    //   dataTotals.updateRecorded(mins);
    //   dataTotals.updatePlanned(mins);
    // };

    $interval(function () {
      dataTotals.timeTracker();
    }, 1000);

  })

  .directive('modalForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'modalForm.html'
    };
  });