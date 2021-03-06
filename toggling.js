angular.module('toggling', [])

/**
 * @ngdoc controller
 * @name toggle.controller:ToggleGroupController
 * @description
 * Groups toggles for consistent behaviour.
 */
.controller('ToggleGroupController', ['$scope', function ($scope) {
    $scope.always_on = false;
    $scope.active_class = 'ng-toggle--active';
}])

/**
 * @ngdoc service
 * @name toggle.service:ToggleService
 * @description
 * Service maintains the current state of a `key` across
 * all toggle related directives.
 */
.service('ToggleService', ['$rootScope', function ($rootScope) {
    var visibility = {};
    function setVisibility(key, override) {
        return typeof override === 'undefined' ? !visibility[key] : override;
    }
    return {
        toggle: function (key, override) {
            if (!key) {
                return false;
            }
            visibility[key] = setVisibility(key, override);
            $rootScope.$broadcast('toggle', {
                key: key,
                visible: visibility[key]
            });
            return visibility[key];
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
        link: function (scope) {
            scope.always_on = true;
        }
    };
}])

/**
 * @ngdoc directive
 * @name toggle.directive:toggleClass
 * @restrict A
 *
 * @description
 * Overrides `ng-toggle--active` with a custom class.
 */
.directive('toggleClass', [function () {
    return {
        restrict: 'A',
        controller: 'ToggleGroupController',
        link: function (scope, element, attr) {
            scope.active_class = attr.ngToggleClass || attr.toggleClass;
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
            var toggle_class = attr.ngToggleClass || attr.toggleClass;
            element.bind('click', function (e) {
                attr.hasOwnProperty('togglePreventDefault') && e.preventDefault();
                scope.$apply(function () {
                    if (scope.always_on && ToggleService.isActive(toggle)) {
                        return;
                    }
                    ToggleService.toggle(toggle);
                });
            });
            scope.$watch(function () { return ToggleService.isActive(toggle); }, function (is_active) {
                if (typeof is_active === 'undefined') {
                    return;
                }
                element.toggleClass(toggle_class || scope.active_class, is_active);
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
            var toggle_class = attr.ngToggleClass || attr.toggleClass;
            element.addClass('ng-toggle');
            if (group && typeof groups[group] === 'undefined') {
                groups[group] = null;
                element.addClass('ng-toggle-group--' + group);
            }
            scope.$watch(function () { return ToggleService.isActive(toggle); }, function (is_active) {
                if (typeof is_active === 'undefined') {
                    return;
                }
                if (group && groups[group] === toggle && scope.always_on) {
                    return;
                }
                if (is_active === true  && groups[group] !== toggle) {
                    ToggleService.toggle(groups[group], false);
                    groups[group] = toggle;
                }
                element.toggleClass(toggle_class || scope.active_class, is_active);
            });
        }
    };
}])

/**
 * @ngdoc directive
 * @name toggle.directive:toggleOnChange
 * @restrict A
 *
 * @description
 * Calls a function after the toggle has changes start
 *
 * @param {string=} `action` to call on interaction
 */
.directive('toggleOnChange', [function () {
    return {
        restrict: 'A',
        scope: {
            action: '=toggleOnChange'
        },
        controller: 'ToggleGroupController',
        link: function (scope) {
            scope.$on('toggle', function (e, data) {
                if (typeof scope.action === 'function') {
                    scope.action(data.key, data.visible);
                }
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
