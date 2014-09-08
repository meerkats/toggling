var toggle = angular.module('toggle', []);

/**
 * @ngdoc service
 * @name toggle.service:toggleService
 * @description
 * Service maintains the current state of a `key` across
 * all toggle related directives.
 */
toggle.service('toggleService', [function () {
    var visibility = {};
    return {
        toggle: function (key, override) {
            return (visibility[key] = typeof override === "undefined" ?
                    !visibility[key] : override);
        },
        isActive: function (key) {
            return visibility[key || '_'];
        }
    };
}]);

/**
 * @ngdoc directive
 * @name toggle.directive:toggle
 * @restrict A
 *
 * @description
 * Updates toggle `key` state on user interaction
 *
 * @param {string=} `key` to toggle on interaction
 */
toggle.directive('toggle', ['toggleService', function (toggleService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            var toggle = attr.ngToggle || attr.toggle;
            element.bind('click', function () {
                $scope.$apply(function () {
                    toggleService.toggle(toggle);
                });
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name toggle.directive:toggleOn
 * @restrict A
 *
 * @description
 * Updates toggle `key` state on user interaction
 *
 * @param {string=} `key` to toggle on interaction
 */
toggle.directive('toggleOn', ['toggleService', function (toggleService) {
    var groups = {};
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            var toggle = attr.ngToggleOn || attr.toggleOn;
            var group = attr.ngToggleGroup || attr.toggleGroup;
            var toggle_class = attr.ngToggleClass || attr.toggleClass || 'ng-toggle--active';
            element.addClass('ng-toggle');
            if (group && typeof groups[group] === "undefined") {
                groups[group] = null;
                element.addClass('ng-toggle-group--' + group);
            }
            $scope.$watch(function () { return toggleService.isActive(toggle); }, function (is_active) {
                if (typeof is_active === "undefined") {
                    return;
                }
                if (is_active === true  && groups[group] !== toggle) {
                    toggleService.toggle(groups[group], false);
                    groups[group] = toggle;
                }
                element.toggleClass(toggle_class, is_active);
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name toggle.directive:toggleActive
 * @restrict A
 *
 * @description
 * Sets default toggle state to active.
 */
toggle.directive('toggleActive', ['toggleService', function (toggleService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            var toggle = attr.ngToggleOn || attr.toggleOn;
            toggleService.toggle(toggle, true);
        }
    };
}]);
