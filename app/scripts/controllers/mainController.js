/*************************************
Controlador principal de la app 
*************************************/

(function (){
	'use strict';

	function MainController ()
	{
		var vm = this;

		vm.home = 'Hello World AngularJS';
		vm.page1 = 'Pagina 1';
		vm.page2 = 'Pagina 2';
	}

	angular
		.module('app')
			.controller('mainController', ['$scope', MainController]);
})();