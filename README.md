# angular-toggle

A set of directives to manage element state toggling through user interactions. Generalized from the need for hamburger navigation toggle on mobile.

## Usage

Include `angular-toggle` module inside your application

```javascript
var app = angular.module('app', ['angular-toggle']);
```

then add required directive markup

```html
<button toggle="a">Toggle A</button>
<button toggle="b">Toggle B</button>
<div toggle-on="a" toggle-active toggle-group="group">
  Content A
</div>
<div toggle-on="b" toggle-group="group">
  Content B
</div>
```

This example markup will allow each button to toggle one element, while ensuring only one element in an active state at once. I also sets the first `div` to be active on initialization.

## Options

- `toggle-group` - Group together related elements so only one is toggled at a time
- `toggle-class` - Customize the `class` element which is used (default: `ng-toggle--active`)
- `toggle-active` - Set toggle key active on init (default state is inactive)

## To do

1. Add support for custom interactions (hover, tap, etc.)
1. Add support for AngularJS animations
