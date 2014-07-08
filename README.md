# ngHelperToolbar

This angularjs extension offers the $toolbar service to implement traditional toolbar logic. Works well with the bootstrap navbar and other frontend frameworks. To install the component in your existing angular app follow these steps:

### Install ng-helper-toolbar 
```
bower install ng-helper-toolbar --save
```

### Include the angular module
```javascript
angular.module('appApp', [
    'ngHelperToolbar'
]);
```

### Use the $toolbar service to add menu items
It's possible to add pinned elements which will never be deleted from the toolbar or normal elements which will be only visible when the controller is active you are registered them:

```javascript
$toolbar.addItem('newapp', 'New App', 'fa-plus', 'Register a new application', { permission: 'canCreateApp' }, function() { $scope.openNewAppDialog(); });
```

```javascript
$toolbar.addPinnedItem('newapp', 'New App', 'fa-plus', 'Register a new application', { permission: 'canCreateApp' }, function() { $scope.openNewAppDialog(); });
```

The parameters are defined as follows

1. tag - The unique identifier of the menu entry
2. name - The display name of the menu entry
3. icon - An icon class of a specific font or an image. An image needs to be referenced witht he prefix img, e.g. img:demo.png
4. tooltip - An optional text which can be used as a tooltip
5. visible - This property controls the visibility of an element. It's possible to use the following options: true, false, data which can be used in the visibility callbacks or a function which will be called and needs to return true or false. Every code which will be executed for visibility check should be very fast.
6. action - This property defines what should happen when a user clicks the entry. It's possible to use the following options: a function which will be executed, a location path in the angular app, a absolute URI or a relative URI outside the angular app which needs to be prefixed by ref:.
7. order: The position of the item in the toolbar (The parameter is optional).
8. parent: Normally null, is used for child menus and contains the tag of the parent menu (The parameter is optional). 

## Demo
The ngHelperToolbar module is used in the [applogger.io](https://applogger.io) service as shown here:
![applogger.io](https://applogger.blob.core.windows.net/public/applogger-ngtoolbar.png)


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :)

## License

[MIT License](https://github.com/lukehaas/css-loaders/blob/step2/LICENSE)
