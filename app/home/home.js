'use strict';

angular.module('root-app', [])
  .factory('dataTotals', function () {
    let dataTotals = {

      historyTotals: {
        recordedTotal: 0,
        unusedPastTime: 0,
        productive: 0,
        unproductive: 0
      },

      today: {
        unspentPastMins: 0,
        timeLeft: 0,
        records: {
          totalMins: 0,
          productivity: {
            productive: 0,
            unproductive: 0,
            percentage: 0
          },
          list: [
            { name: 'Record 1', cost: 24, category: 'asdasd', productivity: true },
            { name: 'Record 2', cost: 2, category: 'asdasd', productivity: false },
            { name: 'Record 3', cost: 244, category: 'asdasd', productivity: true },
            { name: 'Record 4', cost: 202, category: 'asdasd', productivity: false },
          ],
        },

        plans: {
          totalMins: 0,
          productivity: {
            productive: 0,
            unproductive: 0,
            percentage: 0
          },
          list: [
            { name: 'Plan 1', cost: 241, category: 'Wat', productivity: true },
            { name: 'Plan 2', cost: 122, category: 'Waaat', productivity: false },
            { name: 'Plan 3', cost: 24, category: 'Wat', productivity: true },
            { name: 'Plan 4', cost: 23, category: 'a', productivity: false }
          ],
        }
      },
    };
    let newTime = new Date();
    let passedMins = newTime.getHours() * 60 + newTime.getMinutes();
    let simGet = 0;

    dataTotals.today.unspentPastMins = passedMins - dataTotals.today.records.totalMins;
    dataTotals.today.timeLeft = 1440 - passedMins - dataTotals.today.plans.totalMins;

    if (dataTotals.today.records.productivity.productive !== 0) {
      dataTotals.today.records.productivity.percentage = (dataTotals.today.records.productivity.productive / (dataTotals.today.records.productivity.productive + dataTotals.today.records.productivity.unproductive) * 100).toFixed(1);
    }
    if (dataTotals.today.plans.productivity.productive !== 0) {
      dataTotals.today.plans.productivity.percentage = (dataTotals.today.plans.productivity.productive / (dataTotals.today.plans.productivity.productive + dataTotals.today.plans.productivity.unproductive) * 100).toFixed(1);
    }
    // update the number of passed minutes 
    dataTotals.timeTracker = function () {
      let newTime = new Date();
      passedMins = newTime.getHours() * 60 + newTime.getMinutes();
      dataTotals.today.unspentPastMins = passedMins - dataTotals.today.records.totalMins;
      dataTotals.historyTotals.unusedPastTime = simGet + dataTotals.today.unspentPastMins;
      dataTotals.today.timeLeft = 1440 - passedMins - dataTotals.today.plans.totalMins;
    };

    // POST requests - send POST reqs to update DB and then update local values to reflect changes
    dataTotals.updateRecorded = function (add, name, newMins, category, productivity) {

      // deletions to record list
      if (!add) {

        //  let index =  dataTotals.today.records.list.findIndex(function(){
        //     return {name: name, cost: newMins, category: category, productivity: productivity};
        //   });
        //   console.log(index)

        productivity ? dataTotals.records.productivity.productive-- : dataTotals.records.productivity.unproductive--;
        dataTotals.today.records.totalMins = dataTotals.today.records.totalMins - newMins;
        dataTotals.today.unspentPastMins = dataTotals.today.unspentPastMins + newMins;
        dataTotals.historyTotals.recordedTotal = dataTotals.historyTotals.recordedTotal - newMins;
        // recalculate percentages based off of new values
        dataTotals.today.records.productivity.percentage = (dataTotals.today.records.productivity.productive / (dataTotals.today.records.productivity.productive + dataTotals.today.records.productivity.unproductive) * 100).toFixed(1);
      }
      // additions to record list
      else {
        dataTotals.today.records.list.push({name: name, cost: newMins, category: category, productivity: productivity});
        productivity ? dataTotals.today.records.productivity.productive++ : dataTotals.today.records.productivity.unproductive++;
        dataTotals.today.records.totalMins = dataTotals.today.records.totalMins + newMins;
        dataTotals.today.unspentPastMins = dataTotals.today.unspentPastMins - newMins;
        dataTotals.historyTotals.recordedTotal = dataTotals.historyTotals.recordedTotal + newMins;
        // recalculate percentages based off of new values
        dataTotals.today.records.percentage = (dataTotals.today.records.productivity.productive / (dataTotals.today.records.productivity.productive + dataTotals.today.records.productivity.unproductive) * 100).toFixed(1);
      }
    };

    dataTotals.updatePlanned = function (add, name, newMins, category, productivity) {

      // deletions to planned list
      if (!add) {
        productivity ? dataTotals.today.plans.productivity.productive-- : dataTotals.today.plans.productivity.unproductive--;
        dataTotals.today.plans.totalMins = dataTotals.today.plans.totalMins - newMins;
        dataTotals.today.timeLeft = dataTotals.today.timeLeft + newMins;
        // recalculate percentages based off of new values
        dataTotals.today.plans.productivity.percentage = (dataTotals.today.plans.productivity.productive / (dataTotals.today.plans.productivity.productive + dataTotals.today.plans.productivity.unproductive) * 100).toFixed(1);

      }
      // additions to planned list
      else {
        dataTotals.today.plans.list.push({name: name, cost: newMins, category: category, productivity: productivity});
        productivity ? dataTotals.today.plans.productivity.productive++ : dataTotals.today.plans.productivity.unproductive++;
        dataTotals.today.plans.totalMins = dataTotals.today.plans.totalMins + newMins;
        dataTotals.today.timeLeft = dataTotals.today.timeLeft - newMins;
        // recalculate percentages based off of new values
        dataTotals.today.plans.productivity.percentage = (dataTotals.today.plans.productivity.productive / (dataTotals.today.plans.productivity.productive + (dataTotals.today.plans.productivity.unproductive) * 100).toFixed(1));
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
      else if (tab === 'recordList') {
        vm.listActive = true;
        vm.currentList = vm.data.today.records.list;
      }
      else if (tab === 'plannedList') {
        vm.listActive = true;
        vm.currentList = vm.data.today.plans.list;
      }
    };
    this.modalExit = function () {
      vm.formActive = false;
      vm.listActive = false;
      vm.modalActive = false;
      document.getElementById('modalForm').reset();
    };

    this.formSubmit = function (type, name, minutes, category, productivity) {
      if (type === 'Recorded') {
        dataTotals.updateRecorded(true, name, minutes, category, productivity);
      }
      else {
        console.log('plans')
        dataTotals.updatePlanned(true, name, minutes, category, productivity);
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