angular.module('toggle', [])

/**
 * @ngdoc controller
 * @name toggle.controller:ToggleGroupController
 * @description
 * Groups toggles for consistent behaviour.
 */
.controller('ToggleGroupController', ['$scope', function ($scope) {
    $scope.always_on = false;
}])

/**
 * @ngdoc service
 * @name toggle.service:ToggleService
 * @description
 * Service maintains the current state of a `key` across
 * all toggle related directives.
 */
.service('ToggleService', [function () {
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
}])

/**
 * @ngdoc directive
 * @name toggle.directive:toggleAlwaysOn
 * @restrict A
 *
 * @description
 * Ensures a specific group can never be deactivated.
 */
.directive('toggleAlwaysOn', [function () {
    return {
        restrict: 'A',
        controller: 'ToggleGroupController',
        link: function (scope, element, attr) {
            scope.always_on = true;
        }
    };
}])

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
.directive('toggle', ['ToggleService', function (ToggleService) {
    return {
        restrict: 'A',
        controller: 'ToggleGroupController',
        link: function (scope, element, attr) {
            var toggle = attr.ngToggle || attr.toggle;
            var toggle_class = attr.ngToggleClass || attr.toggleClass || 'ng-toggle--active';
            element.bind('click', function () {
                scope.$apply(function () {
                    if (scope.always_on && ToggleService.isActive(toggle)) {
                        return;
                    }
                    ToggleService.toggle(toggle);
                });
            });
            scope.$watch(function () { return ToggleService.isActive(toggle); }, function (is_active) {
                if (typeof is_active === "undefined") {
                    return;
                }
                element.toggleClass(toggle_class, is_active);
            });
        }
    };
}])

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
.directive('toggleOn', ['ToggleService', function (ToggleService) {
    var groups = {};
    return {
        restrict: 'A',
        controller: 'ToggleGroupController',
        link: function (scope, element, attr) {
            var toggle = attr.ngToggleOn || attr.toggleOn;
            var group = attr.ngToggleGroup || attr.toggleGroup;
            var toggle_class = attr.ngToggleClass || attr.toggleClass || 'ng-toggle--active';
            element.addClass('ng-toggle');
            if (group && typeof groups[group] === "undefined") {
                groups[group] = null;
                element.addClass('ng-toggle-group--' + group);
            }
            scope.$watch(function () { return ToggleService.isActive(toggle); }, function (is_active) {
                if (typeof is_active === "undefined") {
                    return;
                }
                if (group && groups[group] === toggle && scope.always_on) {
                    return;
                }
                if (is_active === true  && groups[group] !== toggle) {
                    ToggleService.toggle(groups[group], false);
                    groups[group] = toggle;
                }
                element.toggleClass(toggle_class, is_active);
            });
        }
    };
}])

/**
 * @ngdoc directive
 * @name toggle.directive:toggleActive
 * @restrict A
 *
 * @description
 * Sets default toggle state to active.
 */
.directive('toggleActive', ['ToggleService', function (ToggleService) {
    return {
        restrict: 'A',
        controller: 'ToggleGroupController',
        link: function (scope, element, attr) {
            var toggle = attr.ngToggleOn || attr.toggleOn;
            ToggleService.toggle(toggle, true);
        }
    };
}]);
