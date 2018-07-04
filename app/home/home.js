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

  .directive('modalForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'modalForm.html'
    };
  });




