(function () {
    'use strict';

    angular
        .module('simoonaApp.Books')
        .controller('booksController', booksController);

    booksController.$inject = [
        '$rootScope',
        'notifySrv',
        'authService',
        'bookRepository',
        'localeSrv'
    ];

    function booksController($rootScope, notifySrv, authService, bookRepository, localeSrv) {
        /*jshint validthis: true */
        var vm = this;

        vm.filter = {
            page: 1,
            search: ''
        };
        vm.offices = {};
        $rootScope.pageTitle = 'books.books';

        vm.hasUpdatePermissions = authService.hasPermissions(['BOOK_ADMINISTRATION']) ||
            authService.hasPermissions(['BOOK_BASIC']);

        vm.takeBook = takeBook;
        vm.returnBook = returnBook;
        vm.changePage = changePage;
        vm.searchFilter = searchFilter;
        vm.toggleOffice = toggleOffice;
        vm.isLoading = true;

        init();

        /////////

        function init() {
            bookRepository.getAllOffices().then(function (response) {
                vm.offices = response;

                if (!!response) {
                    vm.filter.officeId = response[0].id;
                }

                getFilteredBooks(vm.filter);
            });
        }

        function getFilteredBooks(filter) {
            bookRepository.getFilteredBooks(filter).then(function (response) {
                vm.books = response;
                vm.isLoading = false;
            });
        }  

        function takeBook(book) {
            if (!book.pending) {
                var message = localeSrv.formatTranslation('books.successTaken', {one: book.title, two: book.author});

                book.pending = true;

                bookRepository.takeBook(book.id).then(function () {
                    getFilteredBooks(vm.filter);

                    notifySrv.success(message);
                }, function (response) {
                    notifySrv.error(response.data.message);
                });
            }
        }

        function returnBook(book) {
            if (!book.pending) {
                var message = localeSrv.formatTranslation('books.successReturned', {one: book.title, two: book.author});

                book.pending = true;

                bookRepository.returnBook(book.id).then(function () {
                    getFilteredBooks(vm.filter);

                    notifySrv.success(message);
                }, function (response) {
                    notifySrv.error(response.data.message);
                });
            }
        }

        function searchFilter(search) {
            vm.filter.page = 1;
            vm.filter.search = search;

            getFilteredBooks(vm.filter);
        }

        function changePage(page) {
            vm.filter.page = page;

            getFilteredBooks(vm.filter);
        }

        function toggleOffice(office) {
            vm.filter.page = 1;
            vm.filter.officeId = office.id;

            getFilteredBooks(vm.filter);
        }
    }
})();
