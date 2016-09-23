// Instantiate our data store for search
var searchStore = new SearchStore();

// ===================================================
// AccountStore Constructor
// ===================================================
function SearchStore() {
    var self = this;


    // Private API routes
    // ----------------------
    var _api = {
        getOrgs: '/SearchApi/GetFilteredData'
    };

    // ----------------------------
    self.getFilteredGroups = function (filter) {
        return $.get(_api.getOrgs, { filter });
    };

    self.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

}
