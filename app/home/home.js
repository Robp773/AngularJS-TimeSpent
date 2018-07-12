'use strict';

angular.module('root-app', [])
  .factory('dataTotals', function () {
    let dataTotals = {
      plannedMins: 0,
      recordedMins: 0,
      unspentPastMins: 0,
      productivity: {
        recorded: {
          productive: 0,
          unproductive: 0,
          percentage: 0
        },
        planned: {
          productive: 0,
          unproductive: 0,
          percentage: 0
        }
      },
      historyTotals: {
        recordedTotal: 0,
        unusedPastTime: 0,
        productive: 0,
        unproductive: 0
      }
    };
    let newTime = new Date();
    let passedMins = newTime.getHours() * 60 + newTime.getMinutes();
    let simGet = 0;

    dataTotals.unspentPastMins = passedMins - dataTotals.recordedMins;
    dataTotals.timeLeft = 1440 - passedMins - dataTotals.plannedMins;

    if (dataTotals.productivity.recorded.productive !== 0) {
      dataTotals.productivity.recorded.percentage = (dataTotals.productivity.recorded.productive / (dataTotals.productivity.recorded.productive + dataTotals.productivity.recorded.unproductive) * 100).toFixed(1);
    }
    if (dataTotals.productivity.planned.productive !== 0) {
      dataTotals.productivity.planned.percentage = (dataTotals.productivity.planned.productive / (dataTotals.productivity.planned.productive + dataTotals.productivity.planned.unproductive) * 100).toFixed(1);
    }
    // update the number of passed minutes 
    dataTotals.timeTracker = function () {
      let newTime = new Date();
      passedMins = newTime.getHours() * 60 + newTime.getMinutes();
      dataTotals.unspentPastMins = passedMins - dataTotals.recordedMins;
      dataTotals.historyTotals.unusedPastTime = simGet + dataTotals.unspentPastMins;
      dataTotals.timeLeft = 1440 - passedMins - dataTotals.plannedMins;
    };

    // POST requests - send POST reqs to update DB and then update local values to reflect changes
    dataTotals.updateRecorded = function (newMins, productivity) {

      // deletions to record list
      if (newMins < 0) {
        productivity ? dataTotals.productivity.recorded.productive-- : dataTotals.productivity.recorded.unproductive--;
        dataTotals.recordedMins = dataTotals.recordedMins - newMins;
        dataTotals.unspentPastMins = dataTotals.unspentPastMins + newMins;
        dataTotals.historyTotals.recordedTotal = dataTotals.historyTotals.recordedTotal - newMins;
        // recalculate percentages based off of new values
        dataTotals.productivity.recorded.percentage = (dataTotals.productivity.recorded.productive / (dataTotals.productivity.recorded.productive + dataTotals.productivity.recorded.unproductive) * 100).toFixed(1);
      }
      // additions to record list
      else {
        productivity ? dataTotals.productivity.recorded.productive++ : dataTotals.productivity.recorded.unproductive++;
        dataTotals.recordedMins = dataTotals.recordedMins + newMins;
        dataTotals.unspentPastMins = dataTotals.unspentPastMins - newMins;
        dataTotals.historyTotals.recordedTotal = dataTotals.historyTotals.recordedTotal + newMins;
        // recalculate percentages based off of new values
        dataTotals.productivity.recorded.percentage = (dataTotals.productivity.recorded.productive / (dataTotals.productivity.recorded.productive + dataTotals.productivity.recorded.unproductive) * 100).toFixed(1);
      }
    };

    dataTotals.updatePlanned = function (newMins, productivity) {

      // deletions to planned list
      if (newMins < 0) {
        productivity ? dataTotals.productivity.planned.productive-- : dataTotals.productivity.planned.unproductive--;
        dataTotals.plannedMins = dataTotals.plannedMins - newMins;
        dataTotals.timeLeft = dataTotals.timeLeft + newMins;
        // recalculate percentages based off of new values
        dataTotals.productivity.planned.percentage = (dataTotals.productivity.planned.productive / (dataTotals.productivity.planned.productive + dataTotals.productivity.planned.unproductive) * 100).toFixed(1);

      }
      // additions to planned list
      else {
        productivity ? dataTotals.productivity.planned.productive++ : dataTotals.productivity.planned.unproductive++;
        dataTotals.plannedMins = dataTotals.plannedMins + newMins;
        dataTotals.timeLeft = dataTotals.timeLeft - newMins;
        // recalculate percentages based off of new values
        dataTotals.productivity.planned.percentage = (dataTotals.productivity.planned.productive / (dataTotals.productivity.planned.productive + dataTotals.productivity.planned.unproductive) * 100).toFixed(1);
      }
    };
    return dataTotals;
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

    this.btnClick = function (tab) {
      vm.modalActive = true;
      if (tab === 'recordsAdd') {
        vm.formActive = true;
        vm.title = 'Records';
        vm.name = 'Record';
        vm.verb = 'Recorded';
      }
      else if (tab === 'plansAdd') {
        vm.formActive = true;
        vm.title = 'Plans';
        vm.name = 'Plan';
        vm.verb = 'Planned';
      }
      else if (tab === 'recordsList') {
        vm.listActive = true;

        // vm.dataset = data.records
      }
      else if (tab === 'plansList') {
        vm.listActive = true;
        // vm.dataset = data.records
      }
      console.log(vm.formActive)

    };
    this.modalExit = function () {
      vm.formActive = false;
      vm.listActive = false;
      vm.modalActive = false;


      document.getElementById('modalForm').reset();
    };

    this.formSubmit = function (type, minutes, productivity) {
      if (type === 'Recorded') {
        dataTotals.updateRecorded(minutes, productivity);
      }
      else {
        dataTotals.updatePlanned(minutes, productivity);
      }
      document.getElementById('modalForm').reset();
      vm.productivity = false;
    };

    $interval(function () {
      dataTotals.timeTracker();
    }, 1000);

  })

  .directive('modalForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'modalForm.html'
    };
  })
  .directive('modalList', function () {
    return {
      restrict: 'E',
      templateUrl: 'modalList.html'
    };
  });