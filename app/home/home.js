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
            { name: 'Record 1', cost: 24, category: 'Routine', productivity: true },
            { name: 'Record 2', cost: 2, category: 'Problem', productivity: false },
            { name: 'Record 3', cost: 244, category: 'Project', productivity: true },
            { name: 'Record 4', cost: 202, category: 'Project', productivity: false },
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
            { name: 'Plan 1', cost: 241, category: 'One Time', productivity: true },
            { name: 'Plan 2', cost: 122, category: 'Problem', productivity: false },
            { name: 'Plan 3', cost: 24, category: 'Project', productivity: true },
            { name: 'Plan 4', cost: 23, category: 'Other', productivity: false }
          ],
        }
      },
    };

    let newTime = new Date();
    let passedMins = newTime.getHours() * 60 + newTime.getMinutes();
    let simGet = 0;

    // update the number of passed minutes 
    dataTotals.timeTracker = function () {
      let newTime = new Date();
      passedMins = newTime.getHours() * 60 + newTime.getMinutes();
      dataTotals.today.unspentPastMins = passedMins - dataTotals.today.records.totalMins;
      dataTotals.historyTotals.unusedPastTime = simGet + dataTotals.today.unspentPastMins;
      dataTotals.today.timeLeft = 1440 - passedMins - dataTotals.today.plans.totalMins;
    };

    dataTotals.recalculate = function (list) {
      let listType = list;

      dataTotals.today[listType].totalMins = 0;
      dataTotals.today[listType].productivity.productive = 0;
      dataTotals.today[listType].productivity.unproductive = 0;

      dataTotals.today[listType].list.map(function (item) {
        // cost
        dataTotals.today[listType].totalMins = dataTotals.today[listType].totalMins + item.cost;
        // productivity
        if (item.productivity) {
          dataTotals.today[listType].productivity.productive++;
        }
        else {
          dataTotals.today[listType].productivity.unproductive++;
        }
      });
      dataTotals.today.unspentPastMins = passedMins - dataTotals.today.records.totalMins;
      dataTotals.today[listType].productivity.percentage = (dataTotals.today.records.productivity.productive / (dataTotals.today.records.productivity.productive + dataTotals.today.records.productivity.unproductive) * 100).toFixed(1);
    };

    dataTotals.addItem = function (listType, name, newMins, category, productivity) {
      dataTotals.today[listType].list.push({ name: name, cost: newMins, category: category, productivity: productivity });
      dataTotals.recalculate(listType);
    };

    dataTotals.editItem = function (listType, index, newData) {
      dataTotals.today[listType].list.splice(index, 1, newData);
      dataTotals.recalculate(listType);
    };


    dataTotals.deleteItem = function (listType, index) {
      dataTotals.today[listType].list.splice(index, 1);
      dataTotals.recalculate(listType);
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

    vm.init = function () {
      dataTotals.recalculate('records');
      dataTotals.recalculate('plans');
    };

    vm.init();

    this.btnClick = function (tab) {
      vm.modalActive = true;
      if (tab === 'recordsAdd') {
        vm.formActive = true;
        vm.listType = 'records';
        vm.title = 'Records';
        vm.name = 'Record';
        vm.verb = 'Recorded';
      }

      else if (tab === 'plansAdd') {
        vm.formActive = true;
        vm.title = 'Plans';
        vm.name = 'Plan';
        vm.listType = 'plans';
        vm.verb = 'Planned';
      }

      else if (tab === 'recordList') {
        vm.listType = 'records';
        vm.title = 'Records';
        vm.name = 'Record';
        vm.verb = 'Recorded';
        vm.listActive = true;
        vm.currentList = vm.data.today.records.list;
      }
      else if (tab === 'plannedList') {
        vm.listType = 'plans';
        vm.title = 'Plans';
        vm.name = 'Plan';
        vm.verb = 'Planned';
        vm.listActive = true;
        vm.currentList = vm.data.today.plans.list;
      }

    };
    this.modalExit = function () {
      vm.formActive = false;
      vm.listActive = false;
      vm.modalActive = false;
      // temporary fix for values not populating form when user tries to edit same element twice
      vm.nameVal = '';
      vm.minutes = null;
      vm.category = 'Select';
      vm.productivity = false;
      document.getElementById('modalForm').reset();
    };

    this.formSubmit = function (name, minutes, category, productivity) {
      dataTotals.addItem(vm.listType, name, minutes, category, productivity);

      document.getElementById('modalForm').reset();
      vm.productivity = false;
    };

    this.editItem = function (name, cost, category, productivity) {

      vm.editing = true;
      // preset form values to the selected list item
      vm.nameVal = name;
      vm.minutes = cost;
      vm.category = category;
      vm.productivity = productivity;
      vm.formActive = true;
      vm.listActive = false;

      // get the index number of the list item being accessed
      vm.editIndex = vm.data.today[vm.listType].list.findIndex(function (element) {
        let compareObj = { name: element.name, cost: element.cost, category: element.category, productivity: element.productivity };
        return JSON.stringify(compareObj) === JSON.stringify({ name: name, cost: cost, category: category, productivity: productivity });
      });
    };

    this.submitEdit = function () {

      dataTotals.editItem(vm.listType, vm.editIndex, { name: vm.nameVal, cost: vm.minutes, category: vm.category, productivity: vm.productivity });

      vm.editing = false;
      vm.formActive = false;
      vm.listActive = true;
    };

    this.deleteItem = function (listItem) {

      vm.deleteIndex = vm.data.today[vm.listType].list.findIndex(function (element) {
        let compareObj = { name: element.name, cost: element.cost, category: element.category, productivity: element.productivity };
        return JSON.stringify(compareObj) === JSON.stringify(listItem);
      });

      dataTotals.deleteItem(vm.listType, vm.deleteIndex);
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