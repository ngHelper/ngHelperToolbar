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

### Build view and controller logic around the $toolbar service
Currently the toolbar service is delivered without any view directives or some view related business logic. This can be implemented from the consumer in an existing navigation controller for instance. The following markup shows a simple example how to render the $toolbar.items collection which is assigned to a controller variable on the local $scope: 

```html
<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    <ul class="nav navbar-nav navbar-right">
        <li class="nav-action" ng-repeat="item in toolbarItems" ng-class="{dropdown: item.hasChilds() }" ng-show="item.isVisible()">
            <!-- The menu entry when the item has childs -->
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" ng-show="item.hasChilds()" style="padding-top:8px;">
                <img ng-src="{{item.imageUrl()}}" class="menu-avatar"/>
                <span>{{item.name}}</span>
                <b class="caret"></b>
            </a>

            <!-- The menu entry when the item has no childs -->
            <a ng-click="item.action()" ng-show="!item.hasChilds()">
                <i class="fa {{item.iconClass}} fa-2x"></i>
                <span>{{item.name}}</span>
            </a>

            <!-- The generated dropdown when the item has childs -->
            <ul class="dropdown-menu" ng-show="item.hasChilds()">
                <li ng-repeat="subitem in item.items" ng-show="subitem.isVisible()">
                    <a ng-click="subitem.action()">
                        <i class="fa {{subitem.iconClass}}" style="width: 14px; height: 13px; margin-right: 5px;"></i>
                        <span>{{subitem.name}}</span>
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</div>
```

As visible every menu item has a couple of methods: 

1. itm.isVisible() - Evaluates if a specific item is visible or not. This function returns true or false and can perform a reavaluation of the items visibility but normally it lives from the cached values.
2. item.action() - The function which should be called when ever a user clicks on the toolbar item, This function performs the defined action during registration.
3. item.hasChilds() - This function evaluates if the item has other sub items and can be used to render dropdown menus or tree structures
4. item.hasImage() - This function checks if the item has an image or a font class as icon. If the item has an image the img tag should be used instead of an i-tag.
5. item.imageUrl() - This function returns the image url removed by the img: prefix. 

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
