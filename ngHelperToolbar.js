'use strict';

/**
 * This module contains everything to handle a toolbar with angular js. The basic idea is that the application has
 * a single toolbar somewhere in the application (mostly in the header) and every controller which becomes active
 * is able to define items in this toolbar. The module supports the following features
 *
 * - define toolbar items
 * - define visibility expressions
 * - define enabled expressions
 * - support for child actions, e.g. dropdowns
 * - notifications based on events over the $rootScope
 */
var ngHelperToolbar = angular.module('ngHelperToolbar', []);

/**
 * @ngdoc service
 * @name ngHelperBusy.service:ngHelperToolbar
 * @description
 * # ngHelperToolbar
 */
ngHelperToolbar.service('$toolbar', [ '$rootScope', '$window', '$location', function($rootScope, $window, $location) {
    var self = this;

    // contains the callback registered when something changed
    var updateListener = [];

    // contains the callbacks for visibility checks
    var visibilityChecker = [];

    // this contains the pinned items
    var pinnedItems = [];

    // This array contains all elements of the toolbar currently exists. It's not allowed
    // to modify this collection. The behaviour is not defined. The following item structure will be
    // used:
    //
    // {
    //      tag: "<<unique identifier>>",
    //      name: "<<displayname>>",
    //      iconClass: "<<icon font class||img:imgurl>>",
    //      tooltip: "<<shortdescription for tooltip>>",
    //      order: <<orderOfTheItem>>
    //      visibleHandler: "true|false|string|function",
    //      isVisible: function which can be called
    //      actionHandler: "<<location path|ref:url|function",
    //      items: []
    //      hasChilds: function which can be called,
    //      hasImage: function which can be called,
    //      imageUrl: function which can be called
    // }
    //
    self.items = [];

    // Adds a new item to the menu structure
    self.addItem =  function(tag, name, icon, tooltip, visible, action, order, parent_tag ) {
        addItemInternal(tag, name, icon, tooltip, visible, action, false, order, parent_tag);
    };


    // Adds a new pinned item to the menu structure
    self.addPinnedItem = function(tag, name, icon, tooltip, visible, action, order ) {
        addItemInternal(tag, name, icon, tooltip, visible, action, true, order, null);
    };

    // With the onVisibilityCheck a callback can be registered which will be executed when ever the framework
    // validates if the menu item should be visible or not. The logic behind the callback should be very fast
    // because the function can be performed often. The following signature of the callback is expected
    //
    // callback(item_tag, item_data)
    // The item_tag is the tag you add in the addItem method. The
    self.onVisibilityCheck = function(callback) {
        visibilityChecker.push(callback);
    };

    // With the onUpdate function a callback can be registered to get information when the toolbar is outdated.
    // The callback signature has the following structure:
    //
    // callback()
    //
    self.onUpdate = function(callback) {
        updateListener.push(callback);
    };

    // Notify all update listeners when the toolbar has changed
    $rootScope.$on('toolbar.updated', function() {
        updateListener.forEach(function(listener) {
            listener();
        })
    });

    // When a naviagtion process is started the system removes all items from the toolbar
    // se that the target controller can rebuild the toolbar again
    $rootScope.$on('$routeChangeStart', function() {
        self.items = [];

        pinnedItems.forEach( function(pinnedItem) {
            self.items.push(pinnedItem);
        });
    });

    // After a successfully navigation the system forces a repainting of the toolbar
    // because it could be that no menu entries are registered from the controller. This
    // ensure that no outdated items are in the controller
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.$emit('toolbar.updated');
    });


    // This function add a new item to the menu structure. When the item is added the updated event will
    // be send to the infrastructure so that listener e.g. a navigation controller can wait for this
    // event. Check the onUpdate function for more information.
    //
    // The icon parameter supports the following options
    //
    // * just a string - just a string is used as class for an icon based font
    // * img:url       - using a string with img: prefix defines that the icon is an image url
    //
    // The action parameters supports the follwing options
    //
    // 1. it's a function which will be execute
    // 2. it's a path to a resource in the app
    // 3. it's a relative url, this needs to be prefixed with ref:
    // 4. it's an absolute url means starts with http...
    //
    // The visible parameter support the following options
    //
    // 1. true|false
    // 2. A function which needs to return true or false
    // 3. Data which will be passed to the visibility callback handler
    //
    function addItemInternal(tag, name, icon, tooltip, visible, action, pinned, order, parent_tag ) {

        // ensure the parent_tag is null if not set
        parent_tag = typeof parent_tag !== undefined ? parent_tag : null;
        order = order !== undefined ? order : 0;

        // define the items-collection we want to add to
        var target_items = self.items;

        // find the parent item if set
        if (parent_tag != null) {
            target_items.forEach( function(element) {
                if ( element.tag == parent_tag) {
                    target_items = element.items;
                    return;
                }
            })
        }

        // ensure that we remove item previous item we have in the list with the same
        // tag
        var indexToRemove = undefined;
        target_items.forEach(function(itemPtr) {
            if (itemPtr.tag === tag) {
                indexToRemove = target_items.indexOf(itemPtr);
            }
        });

        if (indexToRemove !== undefined) {
            target_items.splice(indexToRemove, 1);
        }

        // add the menu item
        var toolbarItem = {
            tag: tag,
            name: name,
            iconClass: icon,
            tooltip: tooltip,
            order: order,
            items: [],
            visibleHandler: visible,
            isVisible: function() {
                // option 1 it's just bolean
                if (toolbarItem.visibleHandler === undefined || toolbarItem.visibleHandler == null)
                    return false;
                else if (typeof toolbarItem.visibleHandler == 'boolean' || toolbarItem.visibleHandler instanceof Boolean)
                    return toolbarItem.visibleHandler;
                else if (isFunction(toolbarItem.visibleHandler)) {
                    return toolbarItem.visibleHandler();
                } else {
                    var visible = true;

                    // check the visibility
                    visibilityChecker.forEach( function(checker) {
                        if (!checker(toolbarItem)) {
                            visible = false;
                            return;
                        }
                    });

                    // done
                    return visible;
                }
            },
            actionHandler: action,
            action: function() {

                if (toolbarItem.actionHandler === undefined || toolbarItem.actionHandler == null) {
                    return;
                    // Check if the variable is a string
                } else if (typeof toolbarItem.actionHandler == 'string' || toolbarItem.actionHandler instanceof String) {

                    if (toolbarItem.actionHandler.indexOf('http') == 0) {

                        // Option: The action is a full url, if that we just use the window service to navigate
                        $window.location.href = toolbarItem.actionHandler;

                    } else if (toolbarItem.actionHandler.indexOf('ref:') == 0) {

                            // Option: The action is a relative url, if that we just use the window service to navigate
                            $window.location.href = toolbarItem.actionHandler.substr(5, toolbarItem.actionHandler.length);

                    } else {

                        // Option: The action is a local resource path, if that we just use the location service
                        $location.url(toolbarItem.actionHandler)
                    }
                }
                else
                {
                    // Option: The action is a function as self. if that we just execute the function to
                    // perform the operation
                    toolbarItem.actionHandler();
                }
            },
            hasChilds: function() {
                return (toolbarItem.items.length > 0);
            },
            hasImage: function() {
                return (toolbarItem.iconClass !== null && toolbarItem.iconClass !== undefined && toolbarItem.iconClass.indexOf('img:') == 0 )
            },
            imageUrl: function() {
                if (toolbarItem.hasImage())
                    return toolbarItem.iconClass.substr(4, this.iconClass.length);
                else
                    return "";
            }
        };

        // add to the list
        target_items.push(toolbarItem);

        // save the pinned items
        if (parent_tag == null && pinned) {
            pinnedItems.push(toolbarItem);
        }

        // order the elements
        // just order the array of elements with an order id
        target_items.sort(function(l, r) {
            return l.order - r.order;
        });

        // emit an event
        $rootScope.$emit('toolbar.updated');
    }

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
}]);