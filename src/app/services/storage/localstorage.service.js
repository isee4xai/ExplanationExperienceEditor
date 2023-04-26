angular
    .module('app')
    .factory('localStorageService', localStorageService);

localStorageService.$inject = ['$window'];

function localStorageService($window) {
    var service = {
        ok: !!$window.localStorage,
        save: save,
        load: load,
        remove: remove,
        update:update
    }; 
    return service;

    function save(path, data) {
        try { data = JSON.stringify(data); } catch (e) {}
        $window.localStorage[path] = data;
    }

    function load(path) {
        var data = $window.localStorage[path];
        try { data = JSON.parse(data); } catch (e) {}
        return data;
    }

    function remove(path) {
        delete $window.localStorage[path];
    }

    function update(path, data){
        try { data = JSON.stringify(data); } catch (e) {}
        $window.localStorage[path] = data;
    }
}