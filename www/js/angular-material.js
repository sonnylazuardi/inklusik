/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.0.3
 */
(function(){
angular.module('ngMaterial', [ 'ng', 'ngAnimate', 'material.core', 'material.services.attrBind', 'material.services.compiler', 'material.services.registry', 'material.decorators', 'material.services.aria', "material.components.button","material.components.card","material.components.checkbox","material.components.content","material.components.dialog","material.components.divider","material.components.icon","material.components.linearProgress","material.components.list","material.components.radioButton","material.components.sidenav","material.components.slider","material.components.switch","material.components.tabs","material.components.textField","material.components.toast","material.components.toolbar","material.components.whiteframe"]);
var Constant = {
  KEY_CODE: {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    LEFT_ARROW : 37,
    UP_ARROW : 38,
    RIGHT_ARROW : 39,
    DOWN_ARROW : 40
  }
};

  /**
   * Angular Materials initialization function that validates environment
   * requirements.
   */
  angular.module('material.core',['ng'])
    .run(function validateEnvironment() {

      if (angular.isUndefined( window.Hammer )) {
        throw new Error(
          '$materialSwipe requires HammerJS to be preloaded.'
        );
      }

    });





/*
 * iterator is a list facade to easily support iteration and accessors
 *
 * @param items Array list which this iterator will enumerate
 * @param reloop Boolean enables iterator to consider the list as an endless reloop
 */
function iterator(items, reloop) {
  var trueFn = function() { return true; };

  reloop = !!reloop;
  var _items = items || [ ];

  // Published API
  return {
    items: getItems,
    count: count,

    inRange: inRange,
    contains: contains,
    indexOf: indexOf,
    itemAt: itemAt,

    findBy: findBy,

    add: add,
    remove: remove,

    first: first,
    last: last,
    next: next,
    previous: previous,

    hasPrevious: hasPrevious,
    hasNext: hasNext

  };

  /*
   * Publish copy of the enumerable set
   * @returns {Array|*}
   */
  function getItems() {
    return [].concat(_items);
  }

  /*
   * Determine length of the list
   * @returns {Array.length|*|number}
   */
  function count() {
    return _items.length;
  }

  /*
   * Is the index specified valid
   * @param index
   * @returns {Array.length|*|number|boolean}
   */
  function inRange(index) {
    return _items.length && ( index > -1 ) && (index < _items.length );
  }

  /*
   * Can the iterator proceed to the next item in the list; relative to
   * the specified item.
   *
   * @param item
   * @returns {Array.length|*|number|boolean}
   */
  function hasNext(item) {
    return item ? inRange(indexOf(item) + 1) : false;
  }

  /*
   * Can the iterator proceed to the previous item in the list; relative to
   * the specified item.
   *
   * @param item
   * @returns {Array.length|*|number|boolean}
   */
  function hasPrevious(item) {
    return item ? inRange(indexOf(item) - 1) : false;
  }

  /*
   * Get item at specified index/position
   * @param index
   * @returns {*}
   */
  function itemAt(index) {
    return inRange(index) ? _items[index] : null;
  }

  /*
   * Find all elements matching the key/value pair
   * otherwise return null
   *
   * @param val
   * @param key
   *
   * @return array
   */
  function findBy(key, val) {
    return _items.filter(function(item) {
      return item[key] === val;
    });
  }

  /*
   * Add item to list
   * @param item
   * @param index
   * @returns {*}
   */
  function add(item, index) {
    if ( !item ) return -1;

    if (!angular.isNumber(index)) {
      index = _items.length;
    }

    _items.splice(index, 0, item);

    return indexOf(item);
  }

  /*
   * Remove item from list...
   * @param item
   */
  function remove(item) {
    if ( contains(item) ){
      _items.splice(indexOf(item), 1);
    }
  }

  /*
   * Get the zero-based index of the target item
   * @param item
   * @returns {*}
   */
  function indexOf(item) {
    return _items.indexOf(item);
  }

  /*
   * Boolean existence check
   * @param item
   * @returns {boolean}
   */
  function contains(item) {
    return item && (indexOf(item) > -1);
  }

  /*
   * Find the next item. If reloop is true and at the end of the list, it will 
   * go back to the first item. If given ,the `validate` callback will be used
   * determine whether the next item is valid. If not valid, it will try to find the
   * next item again.
   * @param item
   * @param {optional} validate
   * @returns {*}
   */
  function next(item, validate) {
    validate = validate || trueFn;

    if (contains(item)) {
      var index = indexOf(item) + 1,
      found = inRange(index) ? _items[ index ] : (reloop ? first() : null);

      return validate(found) ? found : next(found, validate);
    }

    return null;
  }

  /*
   * Find the previous item. If reloop is true and at the beginning of the list, it will 
   * go back to the last item. If given ,the `validate` callback will be used
   * determine whether the previous item is valid. If not valid, it will try to find the
   * previous item again.
   * @param item
   * @param {optional} validate
   * @returns {*}
   */
  function previous(item, validate) {
    validate = validate || trueFn;

    if (contains(item)) {
      var index = indexOf(item) - 1,
      found = inRange(index) ? _items[ index ] : (reloop ? last() : null);

      return validate(found) ? found : previous(found, validate);
    }

    return null;
  }

  /*
   * Return first item in the list
   * @returns {*}
   */
  function first() {
    return _items.length ? _items[0] : null;
  }

  /*
   * Return last item in the list...
   * @returns {*}
   */
  function last() {
    return _items.length ? _items[_items.length - 1] : null;
  }

}

var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

/* for nextUid() function below */
var uid = ['0','0','0'];

var Util = {
  now: window.performance ? angular.bind(performance, performance.now) : Date.now,

  /**
   * Checks if the specified element has an ancestor (ancestor being parent, grandparent, etc)
   * with the given attribute defined. 
   *
   * Also pass in an optional `limit` (levels of ancestry to scan), default 4.
   */
  ancestorHasAttribute: function ancestorHasAttribute(element, attrName, limit) {
    limit = limit || 4;
    var current = element;
    while (limit-- && current.length) {
      if (current[0].hasAttribute && current[0].hasAttribute(attrName)) {
        return true;
      }
      current = current.parent();
    }
    return false;
  },

  /**
   * Checks to see if the element or its parents are disabled.
   * @param element DOM element to start scanning for `disabled` attribute
   * @param limit Number of parent levels that should be scanned; defaults to 4
   * @returns {*} Boolean
   */
  isParentDisabled: function isParentDisabled(element, limit) {
    return Util.ancestorHasAttribute(element, 'disabled', limit);
  },

  /**
   * Checks if two elements have the same parent
   */
  elementIsSibling: function elementIsSibling(element, otherElement) {
    return element.parent().length && 
      (element.parent()[0] === otherElement.parent()[0]);
  },

  /**
   * Converts snake_case to camelCase.
   * @param name Name to normalize
   */
  camelCase: function camelCase(name) {
    return name
      .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      });
  },

  /**
   * Selects 'n' words from a string
   * for use in an HTML attribute
   */
  stringFromTextBody: function stringFromTextBody(textBody, numWords) {
    var string = textBody.trim();

    if(string.split(/\s+/).length > numWords){
      string = textBody.split(/\s+/).slice(1, (numWords + 1)).join(" ") + '...';
    }
    return string;
  },

  /**
   * Publish the iterator facade to easily support iteration and accessors
   * @see iterator.js
   */
  iterator: iterator,

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce: function debounce(func, wait, immediate) {
    var timeout;
    return function debounced() {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  },

  // Returns a function that can only be triggered every `delay` milliseconds.
  // In other words, the function will not be called unless it has been more
  // than `delay` milliseconds since the last call.
  throttle: function throttle(func, delay) {
    var recent;
    return function throttled() {
      var context = this;
      var args = arguments;
      var now = Util.now();

      if (!recent || recent - now > delay) {
        func.apply(context, args);
        recent = now;
      }
    };
  },

  /**
   * nextUid, from angular.js.
   * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
   * characters such as '012ABC'. The reason why we are not using simply a number counter is that
   * the number string gets longer over time, and it can also overflow, where as the nextId
   * will grow much slower, it is a string, and it will never overflow.
   *
   * @returns an unique alpha-numeric string
   */
  nextUid: function() {
    var index = uid.length;
    var digit;

    while(index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit == 57 /*'9'*/) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit == 90  /*'Z'*/) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  },

  // Stop watchers and events from firing on a scope without destroying it,
  // by disconnecting it from its parent and its siblings' linked lists.
  disconnectScope: function disconnectScope(scope) {
    if (!scope) return;

    // we can't destroy the root scope or a scope that has been already destroyed
    if (scope.$root === scope) return;
    if (scope.$$destroyed ) return;

    var parent = scope.$parent;
    scope.$$disconnected = true;

    // See Scope.$destroy
    if (parent.$$childHead === scope) parent.$$childHead = scope.$$nextSibling;
    if (parent.$$childTail === scope) parent.$$childTail = scope.$$prevSibling;
    if (scope.$$prevSibling) scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
    if (scope.$$nextSibling) scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;

    scope.$$nextSibling = scope.$$prevSibling = null;

  },

  // Undo the effects of disconnectScope above.
  reconnectScope: function reconnectScope(scope) {
    if (!scope) return;

    // we can't disconnect the root node or scope already disconnected
    if (scope.$root === scope) return;
    if (!scope.$$disconnected) return;

    var child = scope;

    var parent = child.$parent;
    child.$$disconnected = false;
    // See Scope.$new for this logic...
    child.$$prevSibling = parent.$$childTail;
    if (parent.$$childHead) {
      parent.$$childTail.$$nextSibling = child;
      parent.$$childTail = child;
    } else {
      parent.$$childHead = parent.$$childTail = child;
    }
  }

};

/* 
 * Since removing jQuery from the demos, some code that uses `element.focus()` is broken.
 *
 * We need to add `element.focus()`, because it's testable unlike `element[0].focus`.
 *
 * TODO(ajoslin): This should be added in a better place later.
 */
angular.element.prototype.focus = angular.element.prototype.focus || function() {
  if (this.length) {
    this[0].focus();
  }
  return this;
};
angular.element.prototype.blur = angular.element.prototype.blur || function() {
  if (this.length) {
    this[0].blur();
  }
  return this;
};

/**
 * @ngdoc module
 * @name material.components.animate
 * @description
 *
 * Ink and Popup Effects
 */
angular.module('material.animations', [])
  .service('$materialEffects', [ 
    '$rootElement', 
    '$$rAF', 
    '$sniffer',
    '$q',
    MaterialEffects
  ]);

/**
 * @ngdoc service
 * @name $materialEffects
 * @module material.components.animate
 *
 * @description
 * The `$materialEffects` service provides a simple API for various
 * Material Design effects.
 *
 * @returns A `$materialEffects` object with the following properties:
 * - `{function(element,styles,duration)}` `inkBar` - starts ink bar
 * animation on specified DOM element
 * - `{function(element,parentElement,clickElement)}` `popIn` - animated show of element overlayed on parent element
 * - `{function(element,parentElement)}` `popOut` - animated close of popup overlay
 *
 */
function MaterialEffects($rootElement, $$rAF, $sniffer, $q) {

  var webkit = /webkit/i.test($sniffer.vendorPrefix);
  function vendorProperty(name) {
    return webkit ? 
      ('webkit' + name.charAt(0).toUpperCase() + name.substring(1)) :
      name;
  }

  var self;
  // Publish API for effects...
  return self = {
    popIn: popIn,

    /* Constants */
    TRANSITIONEND_EVENT: 'transitionend' + (webkit ? ' webkitTransitionEnd' : ''),
    ANIMATIONEND_EVENT: 'animationend' + (webkit ? ' webkitAnimationEnd' : ''),

    TRANSFORM: vendorProperty('transform'),
    TRANSITION: vendorProperty('transition'),
    TRANSITION_DURATION: vendorProperty('transitionDuration'),
    ANIMATION_PLAY_STATE: vendorProperty('animationPlayState'),
    ANIMATION_DURATION: vendorProperty('animationDuration'),
    ANIMATION_NAME: vendorProperty('animationName'),
    ANIMATION_TIMING: vendorProperty('animationTimingFunction'),
    ANIMATION_DIRECTION: vendorProperty('animationDirection')
  };

  // **********************************************************
  // API Methods
  // **********************************************************
  function popIn(element, parentElement, clickElement) {
    var deferred = $q.defer();
    parentElement.append(element);

    var startPos;
    if (clickElement) {
      var clickRect = clickElement[0].getBoundingClientRect();
      startPos = translateString(
        clickRect.left - element[0].offsetWidth,
        clickRect.top - element[0].offsetHeight, 
        0
      ) + ' scale(0.2)';
    } else {
      startPos = 'translate3d(0,100%,0) scale(0.5)';
    }

    element
      .css(self.TRANSFORM, startPos)
      .css('opacity', 0);
    
    $$rAF(function() {
      $$rAF(function() {
        element
          .addClass('active')
          .css(self.TRANSFORM, '')
          .css('opacity', '')
          .on(self.TRANSITIONEND_EVENT, finished);
      });
    });

    function finished(ev) {
      //Make sure this transitionend didn't bubble up from a child
      if (ev.target === element[0]) {
        element.off(self.TRANSITIONEND_EVENT, finished);
        deferred.resolve();
      }
    }

    return deferred.promise;
  }

  // **********************************************************
  // Utility Methods
  // **********************************************************


  function translateString(x, y, z) {
    return 'translate3d(' + Math.floor(x) + 'px,' + Math.floor(y) + 'px,' + Math.floor(z) + 'px)';
  }

}


(function() {

angular.module('material.animations')

/**
 * noink/nobar/nostretch directive: make any element that has one of
 * these attributes be given a controller, so that other directives can 
 * `require:` these and see if there is a `no<xxx>` parent attribute.
 *
 * @usage
 * <hljs lang="html">
 * <parent noink>
 *   <child detect-no>
 *   </child>
 * </parent>
 * </hljs>
 *
 * <hljs lang="js">
 * myApp.directive('detectNo', function() {
 *   return {
 *     require: ['^?noink', ^?nobar'],
 *     link: function(scope, element, attr, ctrls) {
 *       var noinkCtrl = ctrls[0];
 *       var nobarCtrl = ctrls[1];
 *       if (noInkCtrl) {
 *         alert("the noink flag has been specified on an ancestor!");
 *       }
 *       if (nobarCtrl) {
 *         alert("the nobar flag has been specified on an ancestor!");
 *       }
 *     }
 *   };
 * });
 * </hljs>
 */
.directive({
  noink: attrNoDirective(),
  nobar: attrNoDirective(),
  nostretch: attrNoDirective()
});

function attrNoDirective() {
  return function() {
    return {
      controller: angular.noop
    };
  };
}

})();


angular.module('material.animations')

.directive('inkRipple', [
  '$materialInkRipple',
  InkRippleDirective
])

.factory('$materialInkRipple', [
  '$window',
  '$$rAF',
  '$materialEffects',
  '$timeout',
  InkRippleService
]);

function InkRippleDirective($materialInkRipple) {
  return function(scope, element, attr) {
    if (attr.inkRipple == 'checkbox') {
      $materialInkRipple.attachCheckboxBehavior(element);
    } else {
      $materialInkRipple.attachButtonBehavior(element);
    }
  };
}

function InkRippleService($window, $$rAF, $materialEffects, $timeout) {

  // TODO fix this. doesn't support touch AND click devices (eg chrome pixel)
  var hasTouch = !!('ontouchend' in document);
  var POINTERDOWN_EVENT = hasTouch ? 'touchstart' : 'mousedown';
  var POINTERUP_EVENT = hasTouch ? 'touchend touchcancel' : 'mouseup mouseleave';

  return {
    attachButtonBehavior: attachButtonBehavior,
    attachCheckboxBehavior: attachCheckboxBehavior,
    attach: attach
  };

  function attachButtonBehavior(element) {
    return attach(element, {
      mousedown: true,
      center: false,
      animationDuration: 350,
      mousedownPauseTime: 175,
      animationName: 'inkRippleButton',
      animationTimingFunction: 'linear'
    });
  }

  function attachCheckboxBehavior(element) {
    return attach(element, {
      mousedown: true,
      center: true,
      animationDuration: 300,
      mousedownPauseTime: 180,
      animationName: 'inkRippleCheckbox',
      animationTimingFunction: 'linear'
    });
  }

  function attach(element, options) {
    // Parent element with noink attr? Abort.
    if (element.controller('noink')) return angular.noop;

    options = angular.extend({
      mousedown: true,
      hover: true,
      focus: true,
      center: false,
      animationDuration: 300,
      mousedownPauseTime: 150,
      animationName: '',
      animationTimingFunction: 'linear'
    }, options || {});

    var rippleContainer;
    var node = element[0];

    if (options.mousedown) {
      listenPointerDown(true);
    }

    // Publish self-detach method if desired...
    return function detach() {
      listenPointerDown(false);
      if (rippleContainer) {
        rippleContainer.remove();
      }
    };

    function listenPointerDown(shouldListen) {
      element[shouldListen ? 'on' : 'off'](POINTERDOWN_EVENT, onPointerDown);
    }

    function rippleIsAllowed() {
      return !Util.isParentDisabled(element);
    }

    function createRipple(left, top, positionsAreAbsolute) {

      var rippleEl = angular.element('<div class="material-ripple">')
            .css($materialEffects.ANIMATION_DURATION, options.animationDuration + 'ms')
            .css($materialEffects.ANIMATION_NAME, options.animationName)
            .css($materialEffects.ANIMATION_TIMING, options.animationTimingFunction)
            .on($materialEffects.ANIMATIONEND_EVENT, function() {
              rippleEl.remove();
            });

      if (!rippleContainer) {
        rippleContainer = angular.element('<div class="material-ripple-container">');
        element.append(rippleContainer);
      }
      rippleContainer.append(rippleEl);

      var containerWidth = rippleContainer.prop('offsetWidth');

      if (options.center) {
        left = containerWidth / 2;
        top = rippleContainer.prop('offsetHeight') / 2;
      } else if (positionsAreAbsolute) {
        var elementRect = node.getBoundingClientRect();
        left -= elementRect.left;
        top -= elementRect.top;
      }

      var css = {
        'background-color': $window.getComputedStyle(rippleEl[0]).color || 
          $window.getComputedStyle(node).color,
        'border-radius': (containerWidth / 2) + 'px',

        left: (left - containerWidth / 2) + 'px',
        width: containerWidth + 'px',

        top: (top - containerWidth / 2) + 'px',
        height: containerWidth + 'px'
      };
      css[$materialEffects.ANIMATION_DURATION] = options.fadeoutDuration + 'ms';
      rippleEl.css(css);

      return rippleEl;
    }

    function onPointerDown(ev) {
      if (!rippleIsAllowed()) return;

      var rippleEl = createRippleFromEvent(ev);
      var ripplePauseTimeout = $timeout(pauseRipple, options.mousedownPauseTime, false);
      rippleEl.on('$destroy', cancelRipplePause);

      // Stop listening to pointer down for now, until the user lifts their finger/mouse
      listenPointerDown(false);
      element.on(POINTERUP_EVENT, onPointerUp);

      function onPointerUp() {
        cancelRipplePause();
        rippleEl.css($materialEffects.ANIMATION_PLAY_STATE, 'running');
        element.off(POINTERUP_EVENT, onPointerUp);
        listenPointerDown(true);
      }
      function pauseRipple() {
        rippleEl.css($materialEffects.ANIMATION_PLAY_STATE, 'paused');
      }
      function cancelRipplePause() {
        $timeout.cancel(ripplePauseTimeout);
      }

      function createRippleFromEvent(ev) {
        ev = ev.touches ? ev.touches[0] : ev;
        return createRipple(ev.pageX, ev.pageY, true);
      }
    }
  }

}

/**
 * @ngdoc module
 * @name material.components.buttons
 * @description
 *
 * Button
 */
angular.module('material.components.button', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialButton', [
    'ngHrefDirective',
    '$materialInkRipple',
    '$aria',
    MaterialButtonDirective
  ]);

/**
 * @ngdoc directive
 * @name materialButton
 * @order 0
 *
 * @restrict E
 *
 * @description
 * `<material-button>` is a button directive with optional ink ripples (default enabled).
 *
 * @param {boolean=} noink Flag indicates use of ripple ink effects
 * @param {boolean=} disabled Flag indicates if the tab is disabled: not selectable with no ink effects
 * @param {string=} type Optional attribute to specific button types (useful for forms); such as 'submit', etc.
 * @param {string=} ng-href Optional attribute to support both ARIA and link navigation
 * @param {string=} href Optional attribute to support both ARIA and link navigation
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the button's text.
 *
 * @usage
 * <hljs lang="html">
 *  <material-button>Button</material-button>
 *  <br/>
 *  <material-button noink class="material-button-colored">
 *    Button (noInk)
 *  </material-button>
 *  <br/>
 *  <material-button disabled class="material-button-colored">
 *    Colored (disabled)
 *  </material-button>
 * </hljs>
 */
function MaterialButtonDirective(ngHrefDirectives, $materialInkRipple, $aria ) {
  var ngHrefDirective = ngHrefDirectives[0];

  return {
    restrict: 'E',
    compile: function(element, attr) {
      var innerElement;
      var attributesToCopy;

      // Add an inner anchor if the element has a `href` or `ngHref` attribute,
      // so this element can be clicked like a normal `<a>`.
      if (attr.ngHref || attr.href) {
        innerElement = angular.element('<a>');
        attributesToCopy = ['ng-href', 'href', 'rel', 'target'];
      // Otherwise, just add an inner button element (for form submission etc)
      } else {
        innerElement = angular.element('<button>');
        attributesToCopy = ['type', 'disabled', 'ng-disabled', 'form'];
      }

      angular.forEach(attributesToCopy, function(name) {
        var camelCaseName = Util.camelCase(name);
        if (attr.hasOwnProperty(camelCaseName)) {
          innerElement.attr(name, attr[camelCaseName]);
        }
      });

      innerElement
        .addClass('material-button-inner')
        .append(element.contents())
        // Since we're always passing focus to the inner element,
        // add a focus class to the outer element so we can still style
        // it with focus.
        .on('focus', function() {
          element.addClass('focus');
        })
        .on('blur', function() {
          element.removeClass('focus');
        });

      element.
        append(innerElement)
        .attr('tabIndex', -1)
        //Always pass focus to innerElement
        .on('focus', function() {
          innerElement.focus();
        });

      return function postLink(scope, element, attr) {
        $aria.expect(element, 'aria-label', element.text().trim());
        $materialInkRipple.attachButtonBehavior(element);
      };
    }
  };

}

/**
 * @ngdoc module
 * @name material.components.card
 *
 * @description
 * Card components.
 */
angular.module('material.components.card', [
])
  .directive('materialCard', [
    materialCardDirective 
  ]);



/**
 * @ngdoc directive
 * @name materialCard
 * @module material.components.card
 *
 * @restrict E
 *
 * @description
 * The `<material-card>` directive is a container element used within `<material-content>` containers.
 *
 * Cards have constant width and variable heights; where the maximum height is limited to what can
 * fit within a single view on a platform, but it can temporarily expand as needed
 *
 * @usage
 * <hljs lang="html">
 * <material-card>
 *  <img src="/img/washedout.png" class="material-card-image">
 *  <h2>Paracosm</h2>
 *  <p>
 *    The titles of Washed Out's breakthrough song and the first single from Paracosm share the * two most important words in Ernest Greene's musical language: feel it. It's a simple request, as well...
 *  </p>
 * </material-card>
 * </hljs>
 *
 */
function materialCardDirective() {
  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.checkbox
 * @description Checkbox module!
 */
angular.module('material.components.checkbox', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialCheckbox', [ 
    'inputDirective',
    '$materialInkRipple',
    '$aria',
    MaterialCheckboxDirective
  ]);

/**
 * @ngdoc directive
 * @name materialCheckbox
 * @module material.components.checkbox
 * @restrict E
 *
 * @description
 * The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ngTrueValue The value to which the expression should be set when selected.
 * @param {expression=} ngFalseValue The value to which the expression should be set when not selected.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} noink Use of attribute indicates use of ripple ink effects
 * @param {boolean=} disabled Use of attribute indicates the switch is disabled: no ink effects and not selectable
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the checkbox's text.
 *
 * @usage
 * <hljs lang="html">
 * <material-checkbox ng-model="isChecked" aria-label="Finished?">
 *   Finished ?
 * </material-checkbox>
 *
 * <material-checkbox noink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </material-checkbox>
 *
 * <material-checkbox disabled ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </material-checkbox>
 *
 * </hljs>
 *
 */
function MaterialCheckboxDirective(inputDirectives, $materialInkRipple, $aria) {
  var inputDirective = inputDirectives[0];

  var CHECKED_CSS = 'material-checked';

  return {
    restrict: 'E',
    transclude: true,
    require: '?ngModel',
    template: 
      '<div class="material-container" ink-ripple="checkbox">' +
        '<div class="material-icon"></div>' +
      '</div>' +
      '<div ng-transclude class="material-label"></div>',
    link: postLink
  };

  // **********************************************************
  // Private Methods
  // **********************************************************

  function postLink(scope, element, attr, ngModelCtrl) {
    var checked = false;

    // Create a mock ngModel if the user doesn't provide one
    ngModelCtrl = ngModelCtrl || {
      $setViewValue: function(value) {
        this.$viewValue = value;
      },
      $parsers: [],
      $formatters: []
    };

    // Reuse the original input[type=checkbox] directive from Angular core.
    // This is a bit hacky as we need our own event listener and own render 
    // function.
    attr.type = 'checkbox';
    attr.tabIndex = 0;
    inputDirective.link(scope, {
      on: angular.noop,
      0: {}
    }, attr, [ngModelCtrl]);

    // We can't chain element.attr here because of a bug with jqLite
    element.attr('aria-checked', checked);
    element.attr('role', attr.type);
    element.attr('tabIndex', attr.tabIndex);
    element.on('click', listener);
    element.on('keypress', keypressHandler);
    ngModelCtrl.$render = render;

    $aria.expect(element, 'aria-label', element.text());

    function keypressHandler(ev) {
      if(ev.which === Constant.KEY_CODE.SPACE) {
        ev.preventDefault();
        listener(ev);
      }
    }
    function listener(ev) {
      if (element[0].hasAttribute('disabled')) return;

      scope.$apply(function() {
        checked = !checked;
        ngModelCtrl.$setViewValue(checked, ev && ev.type);
        ngModelCtrl.$render();
      });
    }

    function render() {
      checked = ngModelCtrl.$viewValue;
      element.attr('aria-checked', checked);
      if(checked) {
        element.addClass(CHECKED_CSS);
      } else {
        element.removeClass(CHECKED_CSS);
      }
    }
  }

}



/**
 * @ngdoc module
 * @name material.components.content
 *
 * @description
 * Scrollable content
 */
angular.module('material.components.content', [
  'material.services.registry'
])
  .directive('materialContent', [
    materialContentDirective
  ]);

/**
 * @ngdoc directive
 * @name materialContent
 * @module material.components.content
 *
 * @restrict E
 *
 * @description
 * The `<material-content>` directive is a container element useful for scrollable content
 *
 * @usage
 * <hljs lang="html">
 *  <material-content class="material-content-padding">
 *      Lorem ipsum dolor sit amet, ne quod novum mei.
 *  </material-content>
 * </hljs>
 *
 */
function materialContentDirective() {
  return {
    restrict: 'E',
    controller: angular.noop,
    link: function($scope, $element, $attr) {
      $scope.$broadcast('$materialContentLoaded', $element);
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.dialog
 */
angular.module('material.components.dialog', [
  'material.animations',
  'material.services.compiler',
  'material.services.aria'
])
  .directive('materialDialog', [
    '$$rAF',
    MaterialDialogDirective
  ])
  .factory('$materialDialog', [
    '$timeout',
    '$materialCompiler',
    '$rootElement',
    '$rootScope',
    '$materialEffects',
    '$animate',
    '$aria',
    MaterialDialogService
  ]);

function MaterialDialogDirective($$rAF) {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      $$rAF(function() {
        var content = element[0].querySelector('.dialog-content');
        if (content && content.scrollHeight > content.clientHeight) {
          element.addClass('dialog-content-overflow');
        }
      });
    }
  };
}

/**
 * @ngdoc service
 * @name $materialDialog
 * @module material.components.dialog
 *
 * @description
 *
 * The $materialDialog service opens a dialog over top of the app. 
 *
 * The `$materialDialog` service can be used as a function, which when called will open a
 * dialog. Note: the dialog is always given an isolate scope.
 *
 * It takes one argument, `options`, which is defined below.
 *
 * Note: the dialog's template must have an outer `<material-dialog>` element. 
 * Inside, use an element with class `dialog-content` for the dialog's content, and use
 * an element with class `dialog-actions` for the dialog's actions.  
 *
 * When opened, the `dialog-actions` area will attempt to focus the first button found with 
 * class `dialog-close`. If no button with `dialog-close` class is found, it will focus the
 * last button in the `dialog-actions` area.
 *
 * @usage
 * <hljs lang="html">
 * <div ng-controller="MyController">
 *   <material-button ng-click="openDialog($event)">
 *     Open a Dialog from this button!
 *   </material-button>
 * </div>
 * </hljs>
 * <hljs lang="js">
 * var app = angular.module('app', ['ngMaterial']);
 * app.controller('MyController', function($scope, $materialDialog) {
 *   $scope.openDialog = function($event) {
 *     var hideDialog = $materialDialog({
 *       template: '<material-dialog>Hello!</material-dialog>',
 *       targetEvent: $event
 *     });
 *   };
 * });
 * </hljs>
 *
 * @returns {function} `hideDialog` - A function that hides the dialog.
 *
 * @paramType Options
 * @param {string=} templateUrl The url of a template that will be used as the content
 * of the dialog. 
 * @param {string=} template Same as templateUrl, except this is an actual template string.
 * @param {DOMClickEvent=} targetEvent A click's event object. When passed in as an option, 
 * the location of the click will be used as the starting point for the opening animation
 * of the the dialog.
 * @param {boolean=} hasBackdrop Whether there should be an opaque backdrop behind the dialog.
 *   Default true.
 * @param {boolean=} clickOutsideToClose Whether the user can click outside the dialog to
 *   close it. Default true.
 * @param {boolean=} escapeToClose Whether the user can press escape to close the dialog.
 *   Default true.
 * @param {string=} controller The controller to associate with the dialog. The controller
 * will be injected with the local `$hideDialog`, which is a function used to hide the dialog.
 * @param {object=} locals An object containing key/value pairs. The keys will be used as names
 * of values to inject into the controller. For example, `locals: {three: 3}` would inject
 * `three` into the controller, with the value 3.
 * @param {object=} resolve Similar to locals, except it takes promises as values, and the
 * toast will not open until all of the promises resolve.
 * @param {string=} controllerAs An alias to assign the controller to on the scope.
 * @param {element=} appendTo The element to append the dialog to. Defaults to appending
 *   to the root element of the application.
 */
function MaterialDialogService($timeout, $materialCompiler, $rootElement, $rootScope, $materialEffects, $animate, $aria) {
  var recentDialog;
  var dialogParent = $rootElement.find('body');
  if ( !dialogParent.length ) {
    dialogParent = $rootElement;
  }

  return showDialog;

  function showDialog(options) {
    options = angular.extend({
      appendTo: dialogParent,
      hasBackdrop: true, // should have an opaque backdrop
      clickOutsideToClose: true, // should have a clickable backdrop to close
      escapeToClose: true,
      // targetEvent: used to find the location to start the dialog from
      targetEvent: null,
      transformTemplate: function(template) {
        return '<div class="material-dialog-container">' + template + '</div>';
      }
      // Also supports all options from $materialCompiler.compile
    }, options || {});

    // Incase the user provides a raw dom element, always wrap it in jqLite
    options.appendTo = angular.element(options.appendTo); 

    // Close the old dialog
    recentDialog && recentDialog.then(function(destroyDialog) {
      destroyDialog();
    });

    recentDialog = $materialCompiler.compile(options).then(function(compileData) {
      // Controller will be passed a `$hideDialog` function
      compileData.locals.$hideDialog = destroyDialog;

      var scope = $rootScope.$new(true);
      var element = compileData.link(scope); 
      var popInTarget = options.targetEvent && options.targetEvent.target && 
        angular.element(options.targetEvent.target);
      var closeButton = findCloseButton();
      var backdrop;

      configureAria(element.find('material-dialog'));

      if (options.hasBackdrop) {
        backdrop = angular.element('<material-backdrop class="opaque ng-enter">');
        $animate.enter(backdrop, options.appendTo, null);
      }

      $materialEffects.popIn(element, options.appendTo, popInTarget)
        .then(function() {

          if (options.escapeToClose) {
            $rootElement.on('keyup', onRootElementKeyup);
          }
          if (options.clickOutsideToClose) {
            element.on('click', dialogClickOutside);
          }
          closeButton.focus();

        });

      return destroyDialog;

      function findCloseButton() {
        //If no element with class dialog-close, try to find the last 
        //button child in dialog-actions and assume it is a close button
        var closeButton = element[0].querySelector('.dialog-close');
        if (!closeButton) {
          var actionButtons = element[0].querySelectorAll('.dialog-actions button');
          closeButton = actionButtons[ actionButtons.length - 1 ];
        }
        return angular.element(closeButton);
      }
      function destroyDialog() {
        if (destroyDialog.called) return;
        destroyDialog.called = true;

        if (backdrop) {
          $animate.leave(backdrop);
        }
        if (options.escapeToClose) {
          $rootElement.off('keyup', onRootElementKeyup);
        }
        if (options.clickOutsideToClose) {
          element.off('click', dialogClickOutside);
        }
        $animate.leave(element).then(function() {
          element.remove();
          scope.$destroy();
          scope = null;
          element = null;

          if(popInTarget !== null) {
            popInTarget.focus();
          }
        });
      }
      function onRootElementKeyup(e) {
        if (e.keyCode === Constant.KEY_CODE.ESCAPE) {
          $timeout(destroyDialog);
        }
      }
      function dialogClickOutside(e) {
        // Only close if we click the flex container outside the backdrop
        if (e.target === element[0]) {
          $timeout(destroyDialog);
        }
      }
    });

    /**
     * Inject ARIA-specific attributes appropriate for Dialogs
     */
    function configureAria(element) {
      element.attr({
        'role': 'dialog'
      });

      var dialogContent = element.find('.dialog-content');
      if(dialogContent.length === 0){
        dialogContent = element;
      }
      var defaultText = Util.stringFromTextBody(dialogContent.text(), 3);
      $aria.expect(element, 'aria-label', defaultText);
    }

    return recentDialog;
  }
}

/**
 * @ngdoc module
 * @name material.components.textField
 * @description
 * Form
 */
angular.module('material.components.textField', [])
  .directive('materialInputGroup', [
    materialInputGroupDirective
  ])
  .directive('materialInput', [
    materialInputDirective
  ]);

/**
 * @ngdoc directive
 * @name materialInputGroup
 * @module material.components.textField
 * @restrict E
 * @description
 * Use the `<material-input-group>` directive as the grouping parent of a `<material-input>` element.
 *
 * @usage 
 * <hljs lang="html">
 * <material-input-group>
 *   <material-input type="text" ng-model="myText"></material-input>
 * </material-input-group>
 * </hljs>
 */
function materialInputGroupDirective() {
  return {
    restrict: 'CE',
    controller: ['$element', function($element) {
      this.setFocused = function(isFocused) {
        $element.toggleClass('material-input-focused', !!isFocused);
      };
      this.setHasValue = function(hasValue) {
        $element.toggleClass('material-input-has-value', !!hasValue);
      };
    }]
  };
}

/**
 * @ngdoc directive
 * @name materialInput
 * @module material.components.textField
 *
 * @restrict E
 *
 * @description
 * Use the `<material-input>` directive as elements within a `<material-input-group>` container
 *
 * @usage
 * <hljs lang="html">
 * <material-input-group>
 *   <material-input type="text" ng-model="user.fullName"></material-input>
 *   <material-input type="text" ng-model="user.email"></material-input>
 * </material-input-group>
 * </hljs>
 */
function materialInputDirective() {
  return {
    restrict: 'E',
    replace: true,
    template: '<input>',
    require: ['^?materialInputGroup', '?ngModel'],
    link: function(scope, element, attr, ctrls) {
      var inputGroupCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      if (!inputGroupCtrl) {
        return;
      }

      // When the input value changes, check if it "has" a value, and 
      // set the appropriate class on the input group
      if (ngModelCtrl) {
        ngModelCtrl.$viewChangeListeners.push(function() {
          inputGroupCtrl.setHasValue(!!ngModelCtrl.$viewValue);
        });
        ngModelCtrl.$render = function() {
          inputGroupCtrl.setHasValue(!!ngModelCtrl.$viewValue);
        };
      }
      element.on('input', function() {
        inputGroupCtrl.setHasValue(!!element.val());
      });

      // When the input focuses, add the focused class to the group
      element.on('focus', function(e) {
        inputGroupCtrl.setFocused(true);
      });
      // When the input blurs, remove the focused class from the group
      element.on('blur', function(e) {
        inputGroupCtrl.setFocused(false);
      });

      scope.$on('$destroy', function() {
        inputGroupCtrl.setFocused(false);
        inputGroupCtrl.setHasValue(false);
      });
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.icon
 * @description
 * Icon
 */
angular.module('material.components.icon', [])
  .directive('materialIcon', [
    materialIconDirective
  ]);

/**
 * @ngdoc directive
 * @name materialIcon
 * @module material.components.icon
 *
 * @restrict E
 *
 * @description
 * The `<material-icon>` directive is an element useful for SVG icons
 *
 * @usage
 * <hljs lang="html">
 *  <material-icon icon="/img/icons/ic_access_time_24px.svg">
 *  </material-icon>
 * </hljs>
 *
 */
function materialIconDirective() {
  return {
    restrict: 'E',
    template: '<object class="material-icon"></object>',
    compile: function(element, attr) {
      var object = angular.element(element[0].children[0]);
      if(angular.isDefined(attr.icon)) {
        object.attr('data', attr.icon);
      }
    }
  };
}

/**
 * @ngdoc module
 * @name material.components.list
 * @description
 * List module
 */
angular.module('material.components.list', [])

.directive('materialList', [
  materialListDirective
])
.directive('materialItem', [
  materialItemDirective
]);

/**
 * @ngdoc directive
 * @name materialList
 * @module material.components.list
 *
 * @restrict E
 *
 * @description
 * The `<material-list>` directive is a list container for 1..n `<material-item>` tags.
 *
 * @usage
 * <hljs lang="html">
 * <material-list>
 *  <material-item ng-repeat="item in todos">
 *    <div class="material-tile-left">
 *      <img ng-src="{{item.face}}" class="face" alt="{{item.who}}">
 *    </div>
 *    <div class="material-tile-content">
 *      <h2>{{item.what}}</h2>
 *      <h3>{{item.who}}</h3>
 *      <p>
 *        {{item.notes}}
 *      </p>
 *    </div>
 *
 *  </material-item>
 * </material-list>
 * </hljs>
 *
 */
function materialListDirective() {
  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $element.attr({
        'role' : 'list'
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name materialItem
 * @module material.components.list
 *
 * @restrict E
 *
 * @description
 * The `<material-item>` directive is a container intended for row items in a `<material-list>` container.
 *
 * @usage
 * <hljs lang="html">
 *  <material-list>
 *    <material-item>
 *            Item content in list
 *    </material-item>
 *  </material-list>
 * </hljs>
 *
 */
function materialItemDirective() {
  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $element.attr({
        'role' : 'listitem'
      });
    }
  };
}


/**
 * @ngdoc module
 * @name material.components.radioButton
 * @description radioButton module!
 */
angular.module('material.components.radioButton', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialRadioGroup', [
    materialRadioGroupDirective
  ])
  .directive('materialRadioButton', [
    '$aria',
    materialRadioButtonDirective
  ]);

/**
 * @ngdoc directive
 * @module material.components.radioButton
 * @name materialRadioGroup
 *
 * @order 0
 * @restrict E
 *
 * @description
 * The `<material-radio-group>` directive identifies a grouping
 * container for the 1..n grouped material radio buttons; specified using nested
 * `<material-radio-button>` tags.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {boolean=} noink Use of attribute indicates flag to disable ink ripple effects.
 *
 * @usage
 * <hljs lang="html">
 * <material-radio-group ng-model="selected">
 *
 *   <material-radio-button
 *        ng-repeat="d in colorOptions"
 *        ng-value="d.value" aria-label="{{ d.label }}">
 *
 *          {{ d.label }}
 *
 *   </material-radio-button>
 *
 * </material-radio-group>
 * </hljs>
 *
 */
function materialRadioGroupDirective() {
  RadioGroupController.prototype = createRadioGroupControllerProto();

  return {
    restrict: 'E',
    controller: ['$element', RadioGroupController],
    require: ['materialRadioGroup', '?ngModel'],
    link: link
  };

  function link(scope, element, attr, ctrls) {
    var rgCtrl = ctrls[0],
      ngModelCtrl = ctrls[1] || {
        $setViewValue: angular.noop
      };

    function keydownListener(ev) {
      if (ev.which === Constant.KEY_CODE.LEFT_ARROW || ev.which === Constant.KEY_CODE.UP_ARROW) {
        ev.preventDefault();
        rgCtrl.selectPrevious();
      }
      else if (ev.which === Constant.KEY_CODE.RIGHT_ARROW || ev.which === Constant.KEY_CODE.DOWN_ARROW) {
        ev.preventDefault();
        rgCtrl.selectNext();
      }
    }

    rgCtrl.init(ngModelCtrl);

    element.attr({
      'role': 'radiogroup',
      'tabIndex': '0'
    })
    .on('keydown', keydownListener);
  }

  function RadioGroupController($element) {
    this._radioButtonRenderFns = [];
    this.$element = $element;
  }

  function createRadioGroupControllerProto() {
    return {
      init: function(ngModelCtrl) {
        this._ngModelCtrl = ngModelCtrl;
        this._ngModelCtrl.$render = angular.bind(this, this.render);
      },
      add: function(rbRender) {
        this._radioButtonRenderFns.push(rbRender);
      },
      remove: function(rbRender) {
        var index = this._radioButtonRenderFns.indexOf(rbRender);
        if (index !== -1) {
          this._radioButtonRenderFns.splice(index, 1);
        }
      },
      render: function() {
        this._radioButtonRenderFns.forEach(function(rbRender) {
          rbRender();
        });
      },
      setViewValue: function(value, eventType) {
        this._ngModelCtrl.$setViewValue(value, eventType);
        // update the other radio buttons as well
        this.render();
      },
      getViewValue: function() {
        return this._ngModelCtrl.$viewValue;
      },
      selectNext: function() {
        return changeSelectedButton(this.$element, 1);
      },
      selectPrevious : function() {
        return changeSelectedButton(this.$element, -1);
      },
      setActiveDescendant: function (radioId) {
        this.$element.attr('aria-activedescendant', radioId);
      }
    };
  }
  /**
   * Change the radio group's selected button by a given increment.
   * If no button is selected, select the first button.
   */
  function changeSelectedButton(parent, selectionIncrement) {
    // Coerce all child radio buttons into an array
    var buttons = Array.prototype.slice.call(
      parent[0].querySelectorAll('material-radio-button')
    );

    if (buttons.length) {
      var selected = parent[0].querySelector('material-radio-button.material-checked');
      var target = buttons[buttons.indexOf(selected) + selectionIncrement] || buttons[0];
      // Activate radioButton's click listener (triggerHandler won't create a real click event)
      angular.element(target).triggerHandler('click');
    }
  }

}

/**
 * @ngdoc directive
 * @module material.components.radioButton
 * @name materialRadioButton
 *
 * @order 1
 * @restrict E
 *
 * @description
 * The `<material-radio-button>`directive is the child directive required to be used within `<material-radioo-group>` elements.
 *
 * While similar to the `<input type="radio" ng-model="" value="">` directive,
 * the `<material-radio-button>` directive provides material ink effects, ARIA support, and
 * supports use within named radio groups.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 * @param {string} ngValue Angular expression which sets the value to which the expression should
 *    be set when selected.*
 * @param {string} value The value to which the expression should be set when selected.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the radio button's text.
 *
 * @usage
 * <hljs lang="html">
 *
 * <material-radio-button value="1" aria-label="Label 1">
 *   Label 1
 * </material-radio-button>
 *
 * <material-radio-button ng-model="color" ng-value="specialValue" aria-label="Green">
 *   Green
 * </material-radio-button>
 *
 * </hljs>
 *
 */
function materialRadioButtonDirective($aria) {

  var CHECKED_CSS = 'material-checked';

  return {
    restrict: 'E',
    require: '^materialRadioGroup',
    transclude: true,
    template: '<div class="material-container" ink-ripple="checkbox">' +
                '<div class="material-off"></div>' +
                '<div class="material-on"></div>' +
              '</div>' +
              '<div ng-transclude class="material-label"></div>',
    link: link
  };

  function link(scope, element, attr, rgCtrl) {
    var lastChecked;

    configureAria(element, scope);

    rgCtrl.add(render);
    attr.$observe('value', render);

    element
      .on('click', listener)
      .on('$destroy', function() {
        rgCtrl.remove(render);
      });

    function listener(ev) {
      if (element[0].hasAttribute('disabled')) return;

      scope.$apply(function() {
        rgCtrl.setViewValue(attr.value, ev && ev.type);
      });
    }

    function render() {
      var checked = (rgCtrl.getViewValue() === attr.value);
      if (checked === lastChecked) {
        return;
      }
      lastChecked = checked;
      element.attr('aria-checked', checked);
      if (checked) {
        element.addClass(CHECKED_CSS);
        rgCtrl.setActiveDescendant(element.attr('id'));
      } else {
        element.removeClass(CHECKED_CSS);
      }
    }
    /**
     * Inject ARIA-specific attributes appropriate for each radio button
     */
    function configureAria( element, scope ){
      scope.ariaId = buildAriaID();

      element.attr({
        'id' :  scope.ariaId,
        'role' : 'radio',
        'aria-checked' : 'false'
      });

      $aria.expect(element, 'aria-label', element.text());

      /**
       * Build a unique ID for each radio button that will be used with aria-activedescendant.
       * Preserve existing ID if already specified.
       * @returns {*|string}
       */
      function buildAriaID() {
        return attr.id || ( 'radio' + "_" + Util.nextUid() );
      }
    }
  }
}



/**
 * @ngdoc module
 * @name material.components.sidenav
 *
 * @description
 * A Sidenav QP component.
 */
angular.module('material.components.sidenav', [
  'material.services.registry'
])
  .factory('$materialSidenav', [
    '$materialComponentRegistry', 
    materialSidenavService 
  ])
  .directive('materialSidenav', [
    '$timeout',
    materialSidenavDirective 
  ])
  .controller('$materialSidenavController', [
    '$scope',
    '$element',
    '$attrs',
    '$timeout',
    '$materialSidenav',
    '$materialComponentRegistry',
    materialSidenavController 
  ]);
  
/**
 * @private
 * @ngdoc object
 * @name materialSidenavController
 * @module material.components.sidenav
 *
 * @description
 * The controller for materialSidenav components.
 */
function materialSidenavController($scope, $element, $attrs, $timeout, $materialSidenav, $materialComponentRegistry) {

  var self = this;

  $materialComponentRegistry.register(this, $attrs.componentId);

  this.isOpen = function() {
    return !!$scope.isOpen;
  };

  /**
   * Toggle the side menu to open or close depending on its current state.
   */
  this.toggle = function() {
    $scope.isOpen = !$scope.isOpen;
  };

  /**
   * Open the side menu
   */
  this.open = function() {
    $scope.isOpen = true;
  };

  /**
   * Close the side menu
   */
  this.close = function() {
    $scope.isOpen = false;
  };
}

/**
 * @private
 * @ngdoc service
 * @name $materialSidenav
 * @module material.components.sidenav
 *
 * @description
 * $materialSidenav makes it easy to interact with multiple sidenavs
 * in an app.
 *
 * @usage
 *
 * ```javascript
 * // Toggle the given sidenav
 * $materialSidenav(componentId).toggle();
 *
 * // Open the given sidenav
 * $materialSidenav(componentId).open();
 *
 * // Close the given sidenav
 * $materialSidenav(componentId).close();
 * ```
 */
function materialSidenavService($materialComponentRegistry) {
  return function(handle) {
    var instance = $materialComponentRegistry.get(handle);
    if(!instance) {
      $materialComponentRegistry.notFoundError(handle);
    }

    return {
      isOpen: function() {
        if (!instance) { return; }
        return instance.isOpen();
      },
      /**
       * Toggle the given sidenav
       * @param handle the specific sidenav to toggle
       */
      toggle: function() {
        if(!instance) { return; }
        instance.toggle();
      },
      /**
       * Open the given sidenav
       * @param handle the specific sidenav to open
       */
      open: function(handle) {
        if(!instance) { return; }
        instance.open();
      },
      /**
       * Close the given sidenav
       * @param handle the specific sidenav to close
       */
      close: function(handle) {
        if(!instance) { return; }
        instance.close();
      }
    };
  };
}

/**
 * @ngdoc directive
 * @name materialSidenav
 * @module material.components.sidenav
 * @restrict E
 *
 * @description
 *
 * A Sidenav component that can be opened and closed programatically.
 *
 * When used properly with a layout, it will seamleslly stay open on medium
 * and larger screens, while being hidden by default on mobile devices.
 *
 * @usage
 * <hljs lang="html">
 * <div layout="horizontal" ng-controller="MyController">
 *   <material-sidenav component-id="left" class="material-sidenav-left">
 *     Left Nav!
 *   </material-sidenav>
 *
 *   <material-content>
 *     Center Content
 *     <material-button ng-click="openLeftMenu()">
 *       Open Left Menu
 *     </material-button>
 *   </material-content>
 *
 *   <material-sidenav component-id="right" class="material-sidenav-right">
 *     Right Nav!
 *   </material-sidenav>
 * </div>
 * </hljs>
 *
 * <hljs lang="js">
 * var app = angular.module('myApp', ['ngMaterial']);
 * app.controller('MainController', function($scope, $materialSidenav) {
 *   $scope.openLeftMenu = function() {
 *     $materialSidenav('left').toggle();
 *   };
 * });
 * </hljs>
 */
function materialSidenavDirective($timeout) {
  return {
    restrict: 'E',
    scope: {},
    controller: '$materialSidenavController',
    link: function($scope, $element, $attr, sidenavCtrl) {
      var backdrop = angular.element('<material-backdrop class="material-sidenav-backdrop">');

      $scope.$watch('isOpen', onShowHideSide);

      /**
       * Toggle the SideNav view and attach/detach listeners
       * @param isOpen
       */
      function onShowHideSide(isOpen) {
        var parent = $element.parent();

        $element.toggleClass('open', !!isOpen);

        if (isOpen) {
          parent.append(backdrop);
          backdrop.on('click', close);
          parent.on('keydown', onKeyDown);
        } else {
          backdrop.remove();
          backdrop.off('click', close);
          parent.off('keydown', onKeyDown);
        }
      }

      /**
       * Auto-close sideNav when the `escape` key is pressed.
       * @param evt
       */
      function onKeyDown(evt) {
        if(evt.which === Constant.KEY_CODE.ESCAPE){
          close();

          evt.preventDefault();
          evt.stopPropagation();
        }
      }

      /**
        * With backdrop `clicks` or `escape` key-press, immediately
       * apply the CSS close transition... Then notify the controller
       * to close() and perform its own actions.
       */
      function close() {

        onShowHideSide( false );

        $timeout(function(){
          sidenavCtrl.close();
        });
      }

    }
  };
}

/**
 * @ngdoc module
 * @name material.components.slider
 */
angular.module('material.components.slider', [
  'material.animations',
  'material.services.aria'
])
.directive('materialSlider', [
  SliderDirective
]);

/**
 * @ngdoc directive
 * @name materialSlider
 * @module material.components.slider
 * @restrict E
 * @description
 * The `<material-slider>` component allows the user to choose from a range of
 * values.
 *
 * It has two modes: 'normal' mode, where the user slides between a wide range
 * of values, and 'discrete' mode, where the user slides between only a few
 * select values.
 *
 * To enable discrete mode, add the `discrete` attribute to a slider,
 * and use the `step` attribute to change the distance between
 * values the user is allowed to pick.
 *
 * @usage
 * <h4>Normal Mode</h4>
 * <hljs lang="html">
 * <material-slider ng-model="myValue" min="5" max="500">
 * </material-slider>
 * </hljs>
 * <h4>Discrete Mode</h4>
 * <hljs lang="html">
 * <material-slider discrete ng-model="myDiscreteValue" step="10" min="10" max="130">
 * </material-slider>
 * </hljs>
 *
 * @param {boolean=} discrete Whether to enable discrete mode.
 * @param {number=} step The distance between values the user is allowed to pick. Default 1.
 * @param {number=} min The minimum value the user is allowed to pick. Default 0.
 * @param {number=} max The maximum value the user is allowed to pick. Default 100.
 */
function SliderDirective() {
  return {
    scope: {},
    require: ['?ngModel', 'materialSlider'],
    controller: [
      '$scope',
      '$element',
      '$attrs',
      '$$rAF',
      '$window',
      '$materialEffects',
      '$aria',
      SliderController
    ],
    template:
      '<div class="slider-track-container">' +
        '<div class="slider-track"></div>' +
        '<div class="slider-track slider-track-fill"></div>' +
        '<div class="slider-track-ticks"></div>' +
      '</div>' +
      '<div class="slider-thumb-container">' +
        '<div class="slider-thumb"></div>' +
        '<div class="slider-focus-thumb"></div>' +
        '<div class="slider-focus-ring"></div>' +
        '<div class="slider-sign">' +
          '<span class="slider-thumb-text" ng-bind="modelValue"></span>' +
        '</div>' +
        '<div class="slider-disabled-thumb"></div>' +
      '</div>',
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var ngModelCtrl = ctrls[0] || {
      // Mock ngModelController if it doesn't exist to give us
      // the minimum functionality needed
      $setViewValue: function(val) {
        this.$viewValue = val;
        this.$viewChangeListeners.forEach(function(cb) { cb(); });
      },
      $parsers: [],
      $formatters: [],
      $viewChangeListeners: []
    };

    var sliderCtrl = ctrls[1];
    sliderCtrl.init(ngModelCtrl);
  }
}

/**
 * We use a controller for all the logic so that we can expose a few
 * things to unit tests
 */
function SliderController(scope, element, attr, $$rAF, $window, $materialEffects, $aria) {

  this.init = function init(ngModelCtrl) {
    var thumb = angular.element(element[0].querySelector('.slider-thumb'));
    var thumbContainer = thumb.parent();
    var trackContainer = angular.element(element[0].querySelector('.slider-track-container'));
    var activeTrack = angular.element(element[0].querySelector('.slider-track-fill'));
    var tickContainer = angular.element(element[0].querySelector('.slider-track-ticks'));

    // Default values, overridable by attrs
    attr.min ? attr.$observe('min', updateMin) : updateMin(0);
    attr.max ? attr.$observe('max', updateMax) : updateMax(100);
    attr.step ? attr.$observe('step', updateStep) : updateStep(1);

    // We have to manually stop the $watch on ngDisabled because it exists
    // on the parent scope, and won't be automatically destroyed when
    // the component is destroyed.
    var stopDisabledWatch = angular.noop;
    if (attr.ngDisabled) {
      stopDisabledWatch = scope.$parent.$watch(attr.ngDisabled, updateAriaDisabled);
    } else {
      updateAriaDisabled(!!attr.disabled);
    }

    $aria.expect(element, 'aria-label');
    element.attr('tabIndex', 0);
    element.attr('role', 'slider');
    element.on('keydown', keydownListener);

    var hammertime = new Hammer(element[0], {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]
      ]
    });
    hammertime.on('hammer.input', onInput);
    hammertime.on('panstart', onPanStart);
    hammertime.on('pan', onPan);
    hammertime.on('panend', onPanEnd);

    // On resize, recalculate the slider's dimensions and re-render
    var updateAll = $$rAF.debounce(function() {
      refreshSliderDimensions();
      ngModelRender();
      redrawTicks();
    });
    updateAll();
    angular.element($window).on('resize', updateAll);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', updateAll);
      hammertime.destroy();
      stopDisabledWatch();
    });

    ngModelCtrl.$render = ngModelRender;
    ngModelCtrl.$viewChangeListeners.push(ngModelRender);
    ngModelCtrl.$formatters.push(minMaxValidator);
    ngModelCtrl.$formatters.push(stepValidator);

    /**
     * Attributes
     */
    var min;
    var max;
    var step;
    function updateMin(value) {
      min = parseFloat(value);
      element.attr('aria-valuemin', value);
    }
    function updateMax(value) {
      max = parseFloat(value);
      element.attr('aria-valuemax', value);
    }
    function updateStep(value) {
      step = parseFloat(value);
      redrawTicks();
    }
    function updateAriaDisabled(isDisabled) {
      element.attr('aria-disabled', !!isDisabled);
    }

    // Draw the ticks with canvas.
    // The alternative to drawing ticks with canvas is to draw one element for each tick,
    // which could quickly become a performance bottleneck.
    var tickCanvas, tickCtx;
    function redrawTicks() {
      if (!angular.isDefined(attr.discrete)) return;

      var numSteps = Math.floor( (max - min) / step );
      if (!tickCanvas) {
        tickCanvas = angular.element('<canvas style="position:absolute;">');
        tickCtx = tickCanvas[0].getContext('2d');
        tickCtx.fillStyle = 'black';
        tickContainer.append(tickCanvas);
      }
      var dimensions = getSliderDimensions();
      tickCanvas[0].width = dimensions.width;
      tickCanvas[0].height = dimensions.height;

      var distance;
      for (var i = 0; i <= numSteps; i++) {
        distance = Math.floor(dimensions.width * (i / numSteps));
        tickCtx.fillRect(distance - 1, 0, 2, dimensions.height);
      }
    }


    /**
     * Refreshing Dimensions
     */
    var sliderDimensions = {};
    var throttledRefreshDimensions = Util.throttle(refreshSliderDimensions, 5000);
    refreshSliderDimensions();
    function refreshSliderDimensions() {
      sliderDimensions = trackContainer[0].getBoundingClientRect();
    }
    function getSliderDimensions() {
      throttledRefreshDimensions();
      return sliderDimensions;
    }

    /**
     * left/right arrow listener
     */
    function keydownListener(ev) {
      var changeAmount;
      if (ev.which === Constant.KEY_CODE.LEFT_ARROW) {
        changeAmount = -step;
      } else if (ev.which === Constant.KEY_CODE.RIGHT_ARROW) {
        changeAmount = step;
      }
      if (changeAmount) {
        if (ev.metaKey || ev.ctrlKey || ev.altKey) {
          changeAmount *= 4;
        }
        ev.preventDefault();
        ev.stopPropagation();
        scope.$evalAsync(function() {
          setModelValue(ngModelCtrl.$viewValue + changeAmount);
        });
      }
    }

    /**
     * ngModel setters and validators
     */
    function setModelValue(value) {
      ngModelCtrl.$setViewValue( minMaxValidator(stepValidator(value)) );
    }
    function ngModelRender() {
      var percent = (ngModelCtrl.$viewValue - min) / (max - min);
      scope.modelValue = ngModelCtrl.$viewValue;
      element.attr('aria-valuenow', ngModelCtrl.$viewValue);
      setSliderPercent(percent);
    }

    function minMaxValidator(value) {
      if (angular.isNumber(value)) {
        return Math.max(min, Math.min(max, value));
      }
    }
    function stepValidator(value) {
      if (angular.isNumber(value)) {
        return Math.round(value / step) * step;
      }
    }

    /**
     * @param percent 0-1
     */
    function setSliderPercent(percent) {
      activeTrack.css('width', (percent * 100) + '%');
      thumbContainer.css(
        $materialEffects.TRANSFORM,
        'translate3d(' + getSliderDimensions().width * percent + 'px,0,0)'
      );
      element.toggleClass('slider-min', percent === 0);
    }


    /**
     * Slide listeners
     */
    var isSliding = false;
    var isDiscrete = angular.isDefined(attr.discrete);

    function onInput(ev) {
      if (!isSliding && ev.eventType === Hammer.INPUT_START &&
          !element[0].hasAttribute('disabled')) {

        isSliding = true;

        element.addClass('active');
        element[0].focus();
        refreshSliderDimensions();

        onPan(ev);

        ev.srcEvent.stopPropagation();

      } else if (isSliding && ev.eventType === Hammer.INPUT_END) {

        if ( isDiscrete ) onPanEnd(ev);
        isSliding = false;

        element.removeClass('panning active');
      }
    }
    function onPanStart() {
      if (!isSliding) return;
      element.addClass('panning');
    }
    function onPan(ev) {
      if (!isSliding) return;

      // While panning discrete, update only the
      // visual positioning but not the model value.

      if ( isDiscrete ) adjustThumbPosition( ev.center.x );
      else              doSlide( ev.center.x );

      ev.preventDefault();
      ev.srcEvent.stopPropagation();
    }

    function onPanEnd(ev) {
      if ( isDiscrete ) {
        // Convert exact to closest discrete value.
        // Slide animate the thumb... and then update the model value.

        var exactVal = percentToValue( positionToPercent( ev.center.x ));
        var closestVal = minMaxValidator( stepValidator(exactVal) );

        setSliderPercent( valueToPercent(closestVal));
        $$rAF(function(){
          setModelValue( closestVal );
        });

        ev.preventDefault();
        ev.srcEvent.stopPropagation();
      }
    }

    /**
     * Expose for testing
     */
    this._onInput = onInput;
    this._onPanStart = onPanStart;
    this._onPan = onPan;

    /**
     * Slide the UI by changing the model value
     * @param x
     */
    function doSlide( x ) {
      scope.$evalAsync( function() {
        setModelValue( percentToValue( positionToPercent(x) ));
      });
    }

    /**
     * Slide the UI without changing the model (while dragging/panning)
     * @param x
     */
    function adjustThumbPosition( x ) {
      setSliderPercent( positionToPercent(x) );
    }

    /**
     * Convert horizontal position on slider to percentage value of offset from beginning...
     * @param x
     * @returns {number}
     */
    function positionToPercent( x ) {
      return (x - sliderDimensions.left) / (sliderDimensions.width);
    }

    /**
     * Convert percentage offset on slide to equivalent model value
     * @param percent
     * @returns {*}
     */
    function percentToValue( percent ) {
      return (min + percent * (max - min));
    }

    function valueToPercent( val ) {
      return (val - min)/(max - min);
    }

  };
}

/**
 * @ngdoc module
 * @name material.components.switch
 */

angular.module('material.components.switch', [
  'material.components.checkbox',
  'material.components.radioButton'
])

.directive('materialSwitch', [
  'materialCheckboxDirective',
  'materialRadioButtonDirective',
  MaterialSwitch
]);

/**
 * @ngdoc directive
 * @module material.components.switch
 * @name materialSwitch
 * @restrict E
 *
 * The switch directive is used very much like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ngTrueValue The value to which the expression should be set when selected.
 * @param {expression=} ngFalseValue The value to which the expression should be set when not selected.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} noink Use of attribute indicates use of ripple ink effects.
 * @param {boolean=} disabled Use of attribute indicates the switch is disabled: no ink effects and not selectable
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the switch's text.
 *
 * @usage
 * <hljs lang="html">
 * <material-switch ng-model="isActive" aria-label="Finished?">
 *   Finished ?
 * </material-switch>
 *
 * <material-switch noink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </material-switch>
 *
 * <material-switch disabled ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </material-switch>
 *
 * </hljs>
 */
function MaterialSwitch(checkboxDirectives, radioButtonDirectives) {
  var checkboxDirective = checkboxDirectives[0];
  var radioButtonDirective = radioButtonDirectives[0];

  return {
    restrict: 'E',
    transclude: true,
    template:
      '<div class="material-switch-bar"></div>' +
      '<div class="material-switch-thumb">' +
        radioButtonDirective.template +
      '</div>',
    require: '?ngModel',
    compile: compile
  };

  function compile(element, attr) {
    
    var thumb = angular.element(element[0].querySelector('.material-switch-thumb'));
    //Copy down disabled attributes for checkboxDirective to use
    thumb.attr('disabled', attr.disabled);
    thumb.attr('ngDisabled', attr.ngDisabled);

    return function postLink(scope, element, attr, ngModelCtrl) {
      checkboxDirective.link(scope, thumb, attr, ngModelCtrl);
    };
  }
}

/**
 * @ngdoc module
 * @name material.components.tabs
 * @description
 *
 * Tabs
 */
angular.module('material.components.tabs', [
  'material.animations',
  'material.components.swipe'
]);


/**
 * Conditionally configure ink bar animations when the
 * tab selection changes. If `nobar` then do not show the
 * bar nor animate.
 */
angular.module('material.components.tabs')

.directive('materialTabsInkBar', [
  '$materialEffects',
  '$window',
  '$$rAF',
  '$timeout',
  MaterialTabInkDirective
]);

function MaterialTabInkDirective($materialEffects, $window, $$rAF, $timeout) {

  return {
    restrict: 'E',
    require: ['^?nobar', '^materialTabs'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var nobar = ctrls[0];
    var tabsCtrl = ctrls[1];

    if (nobar) return;

    var debouncedUpdateBar = $$rAF.debounce(updateBar);

    scope.$watch(tabsCtrl.selected, updateBar);
    scope.$on('$materialTabsChanged', debouncedUpdateBar);
    scope.$on('$materialTabsPaginationChanged', debouncedUpdateBar);
    angular.element($window).on('resize', onWindowResize);

    function onWindowResize() {
      debouncedUpdateBar();
      $timeout(debouncedUpdateBar, 100, false);
    }

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', onWindowResize);
    });

    function updateBar() {
      var selectedElement = tabsCtrl.selected() && tabsCtrl.selected().element;

      if (!selectedElement || tabsCtrl.count() < 2) {
        element.css({
          display : 'none',
          width : '0px'
        });
      } else {
        var width = selectedElement.prop('offsetWidth');
        var left = selectedElement.prop('offsetLeft') + (tabsCtrl.$$pagingOffset || 0);

        element.css({
          display : width > 0 ? 'block' : 'none',
          width: width + 'px'
        });
        element.css($materialEffects.TRANSFORM, 'translate3d(' + left + 'px,0,0)');
      }
    }

  }

}


angular.module('material.components.tabs')

.directive('materialTabsPagination', [
  '$materialEffects',
  '$window',
  '$$rAF',
  '$$q',
  '$timeout',
  TabPaginationDirective
]);

function TabPaginationDirective($materialEffects, $window, $$rAF, $$q, $timeout) {

  // TODO allow configuration of TAB_MIN_WIDTH
  // Must match tab min-width rule in _tabs.scss
  var TAB_MIN_WIDTH = 8 * 12; 
  // Must match (2 * width of paginators) in scss
  var PAGINATORS_WIDTH = (8 * 4) * 2;

  return {
    restrict: 'A',
    require: '^materialTabs',
    link: postLink
  };

  function postLink(scope, element, attr, tabsCtrl) {

    var tabsParent = element.children();
    var state = scope.pagination = {
      page: -1,
      active: false,
      clickNext: function() { userChangePage(+1); },
      clickPrevious: function() { userChangePage(-1); }
    };

    var debouncedUpdatePagination = $$rAF.debounce(updatePagination);

    scope.$on('$materialTabsChanged', debouncedUpdatePagination);
    angular.element($window).on('resize', debouncedUpdatePagination);

    // Listen to focus events bubbling up from material-tab elements
    tabsParent.on('focusin', onTabsFocusIn);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', debouncedUpdatePagination);
      tabsParent.off('focusin', onTabsFocusIn);
    });

    scope.$watch(tabsCtrl.selected, onSelectedTabChange);

    // Allows pagination through focus change.
    function onTabsFocusIn(ev) {
      if (!state.active) return;

      var tab = angular.element(ev.target).controller('materialTab');
      var pageIndex = getPageForTab(tab);
      if (pageIndex !== state.page) {
        // If the focused element is on a new page, don't focus yet.
        tab.element.blur();
        // Go to the new page, wait for the page transition to end, then focus.
        setPage(pageIndex).then(function() {
          tab.element.focus();
        });
      }
    }

    function onSelectedTabChange(selectedTab) {
      if (!selectedTab) return;

      if (state.active) {
        var selectedTabPage = getPageForTab(selectedTab);
        setPage(selectedTabPage);
      } else {
        debouncedUpdatePagination();
      }
    }

    // Called when page is changed by a user action (click)
    function userChangePage(increment) {
      var newPage = state.page + increment;
      var newTab;
      if (!tabsCtrl.selected() || getPageForTab(tabsCtrl.selected()) !== newPage) {
        var startIndex;
        if (increment < 0) {
          // If going backward, select the previous available tab, starting from
          // the first item on the page after newPage.
          startIndex = (newPage + 1) * state.itemsPerPage;
          newTab = tabsCtrl.previous( tabsCtrl.itemAt(startIndex) );
        } else {
          // If going forward, select the next available tab, starting with the
          // last item before newPage.
          startIndex = (newPage * state.itemsPerPage) - 1;
          newTab = tabsCtrl.next( tabsCtrl.itemAt(startIndex) );
        }
      }
      setPage(newPage).then(function() {
        newTab && newTab.element.focus();
      });
      newTab && tabsCtrl.select(newTab);
    }

    function updatePagination() {
      var tabs = element.find('material-tab');
      var tabsWidth = element.parent().prop('clientWidth') - PAGINATORS_WIDTH;

      var needPagination = tabsWidth && TAB_MIN_WIDTH * tabsCtrl.count() > tabsWidth;
      var paginationToggled = needPagination !== state.active;

      state.active = needPagination;

      if (needPagination) {

        state.pagesCount = Math.ceil((TAB_MIN_WIDTH * tabsCtrl.count()) / tabsWidth);
        state.itemsPerPage = Math.max(1, Math.floor(tabsCtrl.count() / state.pagesCount));
        state.tabWidth = tabsWidth / state.itemsPerPage;
        
        tabsParent.css('width', state.tabWidth * tabsCtrl.count() + 'px');
        tabs.css('width', state.tabWidth + 'px');

        var selectedTabPage = getPageForTab(tabsCtrl.selected());
        setPage(selectedTabPage);

      } else {

        if (paginationToggled) {
          $timeout(function() {
            tabsParent.css('width', '');
            tabs.css('width', '');
            slideTabButtons(0);
            state.page = -1;
          });
        }

      }
    }

    function slideTabButtons(x) {
      if (tabsCtrl.pagingOffset === x) {
        // Resolve instantly if no change
        return $$q.when();
      }

      var deferred = $$q.defer();

      tabsCtrl.$$pagingOffset = x;
      tabsParent.css($materialEffects.TRANSFORM, 'translate3d(' + x + 'px,0,0)');
      tabsParent.on($materialEffects.TRANSITIONEND_EVENT, onTabsParentTransitionEnd);

      return deferred.promise;

      function onTabsParentTransitionEnd(ev) {
        // Make sure this event didn't bubble up from an animation in a child element.
        if (ev.target === tabsParent[0]) {
          tabsParent.off($materialEffects.TRANSITIONEND_EVENT, onTabsParentTransitionEnd);
          deferred.resolve();
        }
      }
    }

    function getPageForTab(tab) {
      var tabIndex = tabsCtrl.indexOf(tab);
      if (tabIndex === -1) return 0;

      return Math.floor(tabIndex / state.itemsPerPage);
    }

    function setPage(page) {
      if (page === state.page) return;

      var lastPage = state.pagesCount;

      if (page < 0) page = 0;
      if (page > lastPage) page = lastPage;

      state.hasPrev = page > 0;
      state.hasNext = ((page + 1) * state.itemsPerPage) < tabsCtrl.count();

      state.page = page;

      $timeout(function() {
        scope.$broadcast('$materialTabsPaginationChanged');
      });

      return slideTabButtons(-page * state.itemsPerPage * state.tabWidth);
    }
  }

}


angular.module('material.components.tabs')

.controller('$materialTab', [
  '$scope',
  '$element',
  '$compile',
  '$animate',
  '$materialSwipe',
  TabItemController
]);

function TabItemController(scope, element, $compile, $animate, $materialSwipe) {
  var self = this;

  var detachSwipe = angular.noop;
  var attachSwipe = function() { return detachSwipe };
  var eventTypes = "swipeleft swiperight" ;
  var configureSwipe = $materialSwipe( scope, eventTypes );

  // special callback assigned by TabsController
  self.$$onSwipe = angular.noop;

  // Properties
  self.contentContainer = angular.element('<div class="tab-content ng-hide">');
  self.element = element;

  // Methods
  self.isDisabled = isDisabled;
  self.onAdd = onAdd;
  self.onRemove = onRemove;
  self.onSelect = onSelect;
  self.onDeselect = onDeselect;


  function isDisabled() {
    return element[0].hasAttribute('disabled');
  }
  
  /**
   * Add the tab's content to the DOM container area in the tabs,
   * @param contentArea the contentArea to add the content of the tab to
   */
  function onAdd(contentArea) {
    if (self.content.length) {

      self.contentContainer.append(self.content);
      self.contentScope = scope.$parent.$new();
      contentArea.append(self.contentContainer);

      $compile(self.contentContainer)(self.contentScope);

      Util.disconnectScope(self.contentScope);

      // For internal tab views we only use the `$materialSwipe`
      // so we can easily attach()/detach() when the tab view is active/inactive

      attachSwipe = configureSwipe( self.contentContainer, function(ev) {
        self.$$onSwipe(ev.type);
      }, true );
    }
  }


  /**
   * Usually called when a Tab is programmatically removed; such
   * as in an ng-repeat
   */
  function onRemove() {
    $animate.leave(self.contentContainer).then(function()
    {
      self.contentScope && self.contentScope.$destroy();
      self.contentScope = null;
    });
  }

  function onSelect() {
    // Resume watchers and events firing when tab is selected
    Util.reconnectScope(self.contentScope);
    detachSwipe = attachSwipe();

    element.addClass('active');
    element.attr('aria-selected', true);
    element.attr('tabIndex', 0);
    $animate.removeClass(self.contentContainer, 'ng-hide');

    scope.onSelect();
  }

  function onDeselect() {
    // Stop watchers & events from firing while tab is deselected
    Util.disconnectScope(self.contentScope);
    detachSwipe();

    element.removeClass('active');
    element.attr('aria-selected', false);
    // Only allow tabbing to the active tab
    element.attr('tabIndex', -1);
    $animate.addClass(self.contentContainer, 'ng-hide');

    scope.onDeselect();
  }

}


angular.module('material.components.tabs')

.directive('materialTab', [
  '$materialInkRipple', 
  '$compile',
  '$aria',
  MaterialTabDirective
]);

/**
 * @ngdoc directive
 * @name materialTab
 * @module material.components.tabs
 * @order 1
 *
 * @restrict E
 *
 * @description
 * `<material-tab>` is the nested directive used [within `<material-tabs>`] to specify each tab with a **label** and optional *view content*.
 *
 * If the `label` attribute is not specified, then an optional `<material-tab-label>` tag can be used to specified more
 * complex tab header markup. If neither the **label** nor the **material-tab-label** are specified, then the nested
 * markup of the `<material-tab>` is used as the tab header markup.
 *
 * If a tab **label** has been identified, then any **non-**`<material-tab-label>` markup
 * will be considered tab content and will be transcluded to the internal `<div class="tabs-content">` container.
 *
 * This container is used by the TabsController to show/hide the active tab's content view. This synchronization is
 * automatically managed by the internal TabsController whenever the tab selection changes. Selection changes can
 * be initiated via data binding changes, programmatic invocation, or user gestures.
 *
 * @param {string=} label Optional attribute to specify a simple string as the tab label
 * @param {boolean=} active Flag indicates if the tab is currently selected; normally the `<material-tabs selected="">`; attribute is used instead.
 * @param {boolean=} ngDisabled Flag indicates if the tab is disabled: not selectable with no ink effects
 * @param {expression=} deselected Expression to be evaluated after the tab has been de-selected.
 * @param {expression=} selected Expression to be evaluated after the tab has been selected.
 *
 *
 * @usage
 *
 * <hljs lang="html">
 * <material-tab label="" disabled="" selected="" deselected="" >
 *   <h3>My Tab content</h3>
 * </material-tab>
 *
 * <material-tab >
 *   <material-tab-label>
 *     <h3>My Tab content</h3>
 *   </material-tab-label>
 *   <p>
 *     Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
 *     totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
 *     dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
 *     sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 *   </p>
 * </material-tab>
 * </hljs>
 *
 */
function MaterialTabDirective($materialInkRipple, $compile, $aria) {
  return {
    restrict: 'E',
    require: ['materialTab', '^materialTabs'],
    controller: '$materialTab',
    scope: {
      onSelect: '&',
      onDeselect: '&',
      label: '@'
    },
    compile: compile
  };

  function compile(element, attr) {
    var tabLabel = element.find('material-tab-label');

    // If a tab label element is found, remove it for later re-use.
    if (tabLabel.length) {
      tabLabel.remove();
    // Otherwise, try to use attr.label as the label
    } else if (angular.isDefined(attr.label)) {
      tabLabel = angular.element('<material-tab-label>').html(attr.label);
    // If nothing is found, use the tab's content as the label
    } else {
      tabLabel = angular.element('<material-tab-label>')
        .append(element.contents().remove());
    }

    // Everything that's left as a child is the tab's content.
    var tabContent = element.contents().remove();

    return function postLink(scope, element, attr, ctrls) {

      var tabItemCtrl = ctrls[0]; // Controller for THIS tabItemCtrl
      var tabsCtrl = ctrls[1]; // Controller for ALL tabs

      transcludeTabContent();

      var detachRippleFn = $materialInkRipple.attachButtonBehavior(element);
      tabsCtrl.add(tabItemCtrl);
      scope.$on('$destroy', function() {
        detachRippleFn();
        tabsCtrl.remove(tabItemCtrl);
      });

      if (!angular.isDefined(attr.ngClick)) element.on('click', defaultClickListener);
      element.on('keydown', keydownListener);

      if (angular.isNumber(scope.$parent.$index)) watchNgRepeatIndex();
      if (angular.isDefined(attr.active)) watchActiveAttribute();
      watchDisabled();

      configureAria();

      function transcludeTabContent() {
        // Clone the label we found earlier, and $compile and append it
        var label = tabLabel.clone();
        element.append(label);
        $compile(label)(scope.$parent);

        // Clone the content we found earlier, and mark it for later placement into
        // the proper content area.
        tabItemCtrl.content = tabContent.clone();
      }

      //defaultClickListener isn't applied if the user provides an ngClick expression.
      function defaultClickListener() {
        scope.$apply(function() {
          tabsCtrl.select(tabItemCtrl);
          tabItemCtrl.element.focus();
        });
      }
      function keydownListener(ev) {
        if (ev.which == Constant.KEY_CODE.SPACE ) {
          // Fire the click handler to do normal selection if space is pressed
          element.triggerHandler('click');
          ev.preventDefault();

        } else if (ev.which === Constant.KEY_CODE.LEFT_ARROW) {
          var previous = tabsCtrl.previous(tabItemCtrl);
          previous && previous.element.focus();

        } else if (ev.which === Constant.KEY_CODE.RIGHT_ARROW) {
          var next = tabsCtrl.next(tabItemCtrl);
          next && next.element.focus();
        }
      }

      // If tabItemCtrl is part of an ngRepeat, move the tabItemCtrl in our internal array
      // when its $index changes
      function watchNgRepeatIndex() {
        // The tabItemCtrl has an isolate scope, so we watch the $index on the parent.
        scope.$watch('$parent.$index', function $indexWatchAction(newIndex) {
          tabsCtrl.move(tabItemCtrl, newIndex);
        });
      }

      function watchActiveAttribute() {
        var unwatch = scope.$parent.$watch('!!(' + attr.active + ')', activeWatchAction);
        scope.$on('$destroy', unwatch);
        
        function activeWatchAction(isActive) {
          var isSelected = tabsCtrl.selected() === tabItemCtrl;

          if (isActive && !isSelected) {
            tabsCtrl.select(tabItemCtrl);
          } else if (!isActive && isSelected) {
            tabsCtrl.deselect(tabItemCtrl);
          }
        }
      }

      function watchDisabled() {
        scope.$watch(tabItemCtrl.isDisabled, disabledWatchAction);
        
        function disabledWatchAction(isDisabled) {
          element.attr('aria-disabled', isDisabled);

          // Auto select `next` tab when disabled
          var isSelected = (tabsCtrl.selected() === tabItemCtrl);
          if (isSelected && isDisabled) {
            tabsCtrl.select(tabsCtrl.next() || tabsCtrl.previous());
          }

        }
      }

      function configureAria() {
        // Link together the content area and tabItemCtrl with an id
        var tabId = attr.id || Util.nextUid();
        var tabContentId = 'content_' + tabId;
        element.attr({
          id: tabId,
          role: 'tabItemCtrl',
          tabIndex: '-1', //this is also set on select/deselect in tabItemCtrl
          'aria-controls': tabContentId
        });
        tabItemCtrl.contentContainer.attr({
          id: tabContentId,
          role: 'tabpanel',
          'aria-labelledby': tabId
        });

        $aria.expect(element, 'aria-label', element.text());
      }

    };

  }

}


angular.module('material.components.tabs')

.controller('$materialTabs', [
  '$scope', 
  '$element',
  MaterialTabsController
]);

function MaterialTabsController(scope, element) {

  var tabsList = Util.iterator([], false);
  var self = this;

  // Properties
  self.element = element;
  // The section containing the tab content elements
  self.contentArea = angular.element(element[0].querySelector('.tabs-content'));

  // Methods from iterator
  self.inRange = tabsList.inRange;
  self.indexOf = tabsList.indexOf;
  self.itemAt = tabsList.itemAt;
  self.count = tabsList.count;
  
  self.selected = selected;
  self.add = add;
  self.remove = remove;
  self.move = move;
  self.select = select;
  self.deselect = deselect;

  self.next = next;
  self.previous = previous;

  self.swipe = swipe;

  // Get the selected tab
  function selected() {
    return self.itemAt(scope.selectedIndex);
  }

  // Add a new tab.
  // Returns a method to remove the tab from the list.
  function add(tab, index) {

    tabsList.add(tab, index);
    tab.onAdd(self.contentArea);

    // Register swipe feature
    tab.$$onSwipe = swipe;

    // Select the new tab if we don't have a selectedIndex, or if the
    // selectedIndex we've been waiting for is this tab
    if (scope.selectedIndex === -1 || scope.selectedIndex === self.indexOf(tab)) {
      self.select(tab);
    }
    scope.$broadcast('$materialTabsChanged');
  }

  function remove(tab) {
    if (!tabsList.contains(tab)) return;

    if (self.selected() === tab) {
      if (tabsList.count() > 1) {
        self.select(self.previous() || self.next());
      } else {
        self.deselect(tab);
      }
    }

    tabsList.remove(tab);
    tab.onRemove();

    scope.$broadcast('$materialTabsChanged');
  }

  // Move a tab (used when ng-repeat order changes)
  function move(tab, toIndex) {
    var isSelected = self.selected() === tab;

    tabsList.remove(tab);
    tabsList.add(tab, toIndex);
    if (isSelected) self.select(tab);

    scope.$broadcast('$materialTabsChanged');
  }

  function select(tab) {
    if (!tab || tab.isSelected || tab.isDisabled()) return;
    if (!tabsList.contains(tab)) return;

    self.deselect(self.selected());

    scope.selectedIndex = self.indexOf(tab);
    tab.isSelected = true;
    tab.onSelect();
  }
  function deselect(tab) {
    if (!tab || !tab.isSelected) return;
    if (!tabsList.contains(tab)) return;

    scope.selectedIndex = -1;
    tab.isSelected = false;
    tab.onDeselect();
  }

  function next(tab, filterFn) {
    return tabsList.next(tab || self.selected(), filterFn || isTabEnabled);
  }
  function previous(tab, filterFn) {
    return tabsList.previous(tab || self.selected(), filterFn || isTabEnabled);
  }

  function isTabEnabled(tab) {
    return tab && !tab.isDisabled();
  }

  /*
   * attach a swipe listen
   * if it's not selected, abort
   * check the direction
   *   if it is right
   *   it pan right
   *     Now select
   */

  function swipe(direction) {
    if ( !self.selected() ) return;

    // check the direction
    switch(direction) {

      case "swiperight":  // if it is right
      case "panright"  :  // it pan right
        // Now do this...
        self.select( self.previous() );
        break;

      case "swipeleft":
      case "panleft"  :
        self.select( self.next() );
        break;
    }

  }

}

angular.module('material.components.tabs')

/**
 * @ngdoc directive
 * @name materialTabs
 * @module material.components.tabs
 * @order 0
 *
 * @restrict E
 *
 * @description
 * The `<material-tabs>` directive serves as the container for 1..n `<material-tab>` child directives to produces a Tabs components.
 * In turn, the nested `<material-tab>` directive is used to specify a tab label for the **header button** and a [optional] tab view
 * content that will be associated with each tab button.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <material-tabs>
 *    <material-tab label="Tab #1"></material-tab>
 *    <material-tab label="Tab #2"></material-tab>
 *    <material-tab label="Tab #3"></material-tab>
 *  <material-tabs>
 *  </hljs>
 *
 * Tabs supports three (3) usage scenarios:
 *
 *  1. Tabs (buttons only)
 *  2. Tabs with internal view content
 *  3. Tabs with external view content
 *
 * **Tab-only** support is useful when tab buttons are used for custom navigation regardless of any other components, content, or views.
 * **Tabs with internal views** are the traditional usages where each tab has associated view content and the view switching is managed internally by the Tabs component.
 * **Tabs with external view content** is often useful when content associated with each tab is independently managed and data-binding notifications announce tab selection changes.
 *
 * > As a performance bonus, if the tab content is managed internally then the non-active (non-visible) tab contents are temporarily disconnected from the `$scope.$digest()` processes; which restricts and optimizes DOM updates to only the currently active tab.
 *
 * Additional features also include:
 *
 * *  Content can include any markup.
 * *  If a tab is disabled while active/selected, then the next tab will be auto-selected.
 * *  If the currently active tab is the last tab, then next() action will select the first tab.
 * *  Any markup (other than **`<material-tab>`** tags) will be transcluded into the tab header area BEFORE the tab buttons.
 *
 * @param {integer=} selected Index of the active/selected tab
 * @param {boolean=} noink Flag indicates use of ripple ink effects
 * @param {boolean=} nobar Flag indicates use of ink bar effects
 * @param {string=}  align-tabs Attribute to indicate position of tab buttons: bottom or top; default is `top`
 *
 * @usage
 * <hljs lang="html">
 * <material-tabs selected="selectedIndex" >
 *   <img ng-src="/img/angular.png" class="centered">
 *
 *   <material-tab
 *      ng-repeat="tab in tabs | orderBy:predicate:reversed"
 *      on-select="onTabSelected(tab)"
 *      on-deselect="announceDeselected(tab)"
 *      disabled="tab.disabled" >
 *
 *       <material-tab-label>
 *           {{tab.title}}
 *           <img src="/img/removeTab.png"
 *                ng-click="removeTab(tab)"
 *                class="delete" >
 *       </material-tab-label>
 *
 *       {{tab.content}}
 *
 *   </material-tab>
 *
 * </material-tabs>
 * </hljs>
 *
 */
.directive('materialTabs', [
  '$parse',
  TabsDirective
]);

function TabsDirective($parse) {
  return {
    restrict: 'E',
    controller: '$materialTabs',
    require: 'materialTabs',
    transclude: true,
    scope: {
      selectedIndex: '=?selected'
    },
    template: 
      '<section class="tabs-header" ' +
        'ng-class="{\'tab-paginating\': pagination.active}">' +

        '<div class="tab-paginator prev" ' +
          'ng-if="pagination.active && pagination.hasPrev" ' +
          'ng-click="pagination.clickPrevious()">' +
        '</div>' +

        // overflow: hidden container when paginating
        '<div class="tabs-header-items-container" material-tabs-pagination>' +
          // flex container for <material-tab> elements
          '<div class="tabs-header-items" ng-transclude></div>' +
          '<material-tabs-ink-bar></material-tabs-ink-bar>' +
        '</div>' +

        '<div class="tab-paginator next" ' +
          'ng-if="pagination.active && pagination.hasNext" ' +
          'ng-click="pagination.clickNext()">' +
        '</div>' +

      '</section>' +
      '<section class="tabs-content"></section>',
    link: postLink
  };

  function postLink(scope, element, attr, tabsCtrl) {

    configureAria();
    watchSelected();

    function configureAria() {
      element.attr({
        role: 'tablist'
      });
    }

    function watchSelected() {
      scope.$watch('selectedIndex', function watchSelectedIndex(newIndex, oldIndex) {
        // Note: if the user provides an invalid newIndex, all tabs will be deselected
        // and the associated view will be hidden.
        tabsCtrl.deselect( tabsCtrl.itemAt(oldIndex) );

        if (tabsCtrl.inRange(newIndex)) {
          var newTab = tabsCtrl.itemAt(newIndex);

          // If the newTab is disabled, find an enabled one to go to.
          if (newTab && newTab.isDisabled()) {
            newTab = newIndex > oldIndex ?
              tabsCtrl.next(newTab) :
              tabsCtrl.previous(newTab);
          }
          tabsCtrl.select(newTab);

        }
      });
    }

  }
}

/**
 * @ngdoc module
 * @name material.components.toast
 * @description
 * Toast
 */
angular.module('material.components.toast', ['material.services.compiler', 'material.components.swipe'])
  .directive('materialToast', [
    QpToastDirective
  ])
  .factory('$materialToast', [
    '$timeout',
    '$rootScope',
    '$materialCompiler',
    '$materialSwipe',
    '$rootElement',
    '$animate',
    QpToastService
  ]);

function QpToastDirective() {
  return {
    restrict: 'E'
  };
}

/**
 * @ngdoc service
 * @name $materialToast
 * @module material.components.toast
 *
 * @description
 * Open a toast notification on any position on the screen, with an optional
 * duration.
 *
 * Only one toast notification may ever be active at any time. If a new toast is
 * shown while a different toast is active, the old toast will be automatically
 * hidden.
 *
 * `$materialToast` takes one argument, options, which is defined below.
 *
 * @usage
 * <hljs lang="html">
 * <div ng-controller="MyController">
 *   <material-button ng-click="openToast()">
 *     Open a Toast!
 *   </material-button>
 * </div>
 * </hljs>
 * <hljs lang="js">
 * var app = angular.module('app', ['ngMaterial']);
 * app.controller('MyController', function($scope, $materialToast) {
 *   $scope.openToast = function($event) {
 *     var hideToast = $materialToast({
 *       template: '<material-toast>Hello!</material-toast>',
 *       duration: 3000
 *     });
 *   };
 * });
 * </hljs>
 *
 * @returns {function} `hideToast` - A function that hides the toast.
 *
 * @paramType Options
 * @param {string=} templateUrl The url of an html template file that will
 * be used as the content of the toast. Restrictions: the template must
 * have an outer `material-toast` element.
 * @param {string=} template Same as templateUrl, except this is an actual
 * template string.
 * @param {number=} duration How many milliseconds the toast should stay
 * active before automatically closing.  Set to 0 to disable duration.
 * Default: 3000.
 * @param {string=} position Where to place the toast. Available: any combination
 * of 'bottom', 'left', 'top', 'right', 'fit'. Default: 'bottom left'.
 * @param {string=} controller The controller to associate with this toast.
 * The controller will be injected the local `$hideToast`, which is a function
 * used to hide the toast.
 * @param {string=} locals An object containing key/value pairs. The keys will
 * be used as names of values to inject into the controller. For example,
 * `locals: {three: 3}` would inject `three` into the controller with the value
 * of 3.
 * @param {object=} resolve Similar to locals, except it takes promises as values
 * and the toast will not open until the promises resolve.
 * @param {string=} controllerAs An alias to assign the controller to on the scope.
 */
function QpToastService($timeout, $rootScope, $materialCompiler, $materialSwipe, $rootElement, $animate) {
  var recentToast;
  function toastOpenClass(position) {
    return 'material-toast-open-' +
      (position.indexOf('top') > -1 ? 'top' : 'bottom');
  }

  // If the $rootElement is the document (<html> element), be sure to append it to the
  // body instead.
  var toastParent = $rootElement.find('body');
  if ( !toastParent.length ) {
    toastParent = $rootElement;
  }

  return showToast;

  /**
   * TODO fully document this
   * Supports all options from $materialPopup, in addition to `duration` and `position`
   */
  function showToast(options) {
    options = angular.extend({
      // How long to keep the toast up, milliseconds
      duration: 3000,
      // [unimplemented] Whether to disable swiping
      swipeDisabled: false,
      // Supports any combination of these class names: 'bottom top left right fit'.
      // Default: 'bottom left'
      position: 'bottom left'
    }, options || {});

    recentToast && recentToast.then(function(destroy) { destroy(); });

    recentToast = $materialCompiler.compile(options).then(function(compileData) {
      // Controller will be passed a `$hideToast` function
      compileData.locals.$hideToast = destroy;

      var delayTimeout;
      var scope = $rootScope.$new();
      var element = compileData.link(scope);
      var toastParentClass = toastOpenClass(options.position);
      var configureSwipe = $materialSwipe(scope, "swiperight swipeleft");

      element.addClass(options.position);
      toastParent.addClass(toastParentClass);

      $animate
        .enter(element, toastParent).then(function() {
          if (options.duration) {
            delayTimeout = $timeout(destroy, options.duration);
          }
        });

      //Add swipeleft/swiperight class to element so it can animate correctly

      configureSwipe(element, function onSwipe(ev) {
        element.addClass(ev.type);
        $timeout(destroy);
      });

      return destroy;

      // ******************************
      // Internal methods
      // ******************************

      function destroy() {
        if (destroy.called) return;
        destroy.called = true;

        toastParent.removeClass(toastParentClass);
        $timeout.cancel(delayTimeout);
        $animate.leave(element).then(function() {
          scope.$destroy();
        });
      }
    });

    return recentToast;
  }
}

/**
 * @ngdoc module
 * @name material.components.toolbar
 */
angular.module('material.components.toolbar', [
  'material.components.content',
  'material.animations'
])
  .directive('materialToolbar', [
    '$$rAF',
    '$materialEffects',
    materialToolbarDirective
  ]);

/**
 * @ngdoc directive
 * @name materialToolbar
 * @restrict E
 * @description
 * `material-toolbar` is used to place a toolbar in your app.
 *
 * Toolbars are usually used above a content area to display the title of the
 * current page, and show relevant action buttons for that page.
 *
 * You can change the height of the toolbar by adding either the
 * `material-medium-tall` or `material-tall` class to the toolbar.
 *
 * @usage
 * <hljs lang="html">
 * <div layout="vertical" layout-fill>
 *   <material-toolbar>
 *
 *     <div class="material-toolbar-tools">
 *       <span>My App's Title</span>
 *
 *       <!-- fill up the space between left and right area -->
 *       <span flex></span>
 *
 *       <material-button>
 *         Right Bar Button
 *       </material-button>
 *     </div>
 *
 *   </material-toolbar>
 *   <material-content>
 *     Hello!
 *   </material-content>
 * </div>
 * </hljs>
 *
 * @param {boolean=} scrollShrink Whether the header should shrink away as 
 * the user scrolls down, and reveal itself as the user scrolls up. 
 * Note: for scrollShrink to work, the toolbar must be a sibling of a 
 * `material-content` element, placed before it. See the scroll shrink demo.
 *
 *
 * @param {number=} shrinkSpeedFactor How much to change the speed of the toolbar's
 * shrinking by. For example, if 0.25 is given then the toolbar will shrink
 * at one fourth the rate at which the user scrolls down. Default 0.5.
 */ 
function materialToolbarDirective($$rAF, $materialEffects) {

  return {
    restrict: 'E',
    controller: angular.noop,
    link: function(scope, element, attr) {

      if (angular.isDefined(attr.scrollShrink)) {
        setupScrollShrink();
      }

      function setupScrollShrink() {
        // Current "y" position of scroll
        var y = 0;
        // Store the last scroll top position
        var prevScrollTop = 0;

        var shrinkSpeedFactor = attr.shrinkSpeedFactor || 0.5;

        var toolbarHeight;
        var contentElement;

        var debouncedContentScroll = $$rAF.debounce(onContentScroll);
        var debouncedUpdateHeight = Util.debounce(updateToolbarHeight, 5 * 1000);

        // Wait for $materialContentLoaded event from materialContent directive.
        // If the materialContent element is a sibling of our toolbar, hook it up
        // to scroll events.
        scope.$on('$materialContentLoaded', onMaterialContentLoad);

        function onMaterialContentLoad($event, newContentEl) {
          if (Util.elementIsSibling(element, newContentEl)) {
            // unhook old content event listener if exists
            if (contentElement) {
              contentElement.off('scroll', debouncedContentScroll);
            }

            newContentEl.on('scroll', debouncedContentScroll);
            newContentEl.attr('scroll-shrink', 'true');

            contentElement = newContentEl;
            $$rAF(updateToolbarHeight);
          }
        }

        function updateToolbarHeight() {
          toolbarHeight = element.prop('offsetHeight');
          // Add a negative margin-top the size of the toolbar to the content el.
          // The content will start transformed down the toolbarHeight amount,
          // so everything looks normal.
          //
          // As the user scrolls down, the content will be transformed up slowly
          // to put the content underneath where the toolbar was.
          contentElement.css(
            'margin-top', 
            (-toolbarHeight * shrinkSpeedFactor) + 'px'
          );
          onContentScroll();
        }

        function onContentScroll(e) {
          var scrollTop = e ? e.target.scrollTop : prevScrollTop;

          debouncedUpdateHeight();

          y = Math.min(
            toolbarHeight / shrinkSpeedFactor, 
            Math.max(0, y + scrollTop - prevScrollTop)
          );

          element.css(
            $materialEffects.TRANSFORM, 
            'translate3d(0,' + (-y * shrinkSpeedFactor) + 'px,0)'
          );
          contentElement.css(
            $materialEffects.TRANSFORM, 
            'translate3d(0,' + ((toolbarHeight - y) * shrinkSpeedFactor) + 'px,0)'
          );

          prevScrollTop = scrollTop;
        }

      }

    }
  };

}

angular.module('material.components.whiteframe', []);

/**
 * @ngdoc module
 * @name material.components.divider
 * @description Divider module!
 */
angular.module('material.components.divider', [
  'material.animations',
  'material.services.aria'
])
  .directive('materialDivider', MaterialDividerDirective);

function MaterialDividerController(){}

/**
 * @ngdoc directive
 * @name materialDivider
 * @module material.components.divider
 * @restrict E
 *
 * @description
 * Dividers group and separate content within lists and page layouts using strong visual and spatial distinctions. This divider is a thin rule, lightweight enough to not distract the user from content.
 *
 * @param {boolean=} inset Add this attribute to activate the inset divider style.
 * @usage
 * <hljs lang="html">
 * <material-divider></material-divider>
 *
 * <material-divider inset></material-divider>
 * </hljs>
 *
 */
function MaterialDividerDirective() {
  return {
    restrict: 'E',
    controller: [MaterialDividerController]
  };
}

/**
 * @ngdoc module
 * @name material.components.linearProgress
 * @description Linear Progress module!
 */
angular.module('material.components.linearProgress', [
  'material.animations',
  'material.services.aria'
])
.directive('materialLinearProgress', [
  '$$rAF', 
  '$materialEffects',
  MaterialLinearProgressDirective
]);

/**
 * @ngdoc directive
 * @name materialLinearProgress
 * @module material.components.linearProgress
 * @restrict E
 *
 * @description
 * The linear progress directive is used to make loading content in your app as delightful and painless as possible by minimizing the amount of visual change a user sees before they can view and interact with content. Each operation should only be represented by one activity indicator—for example, one refresh operation should not display both a refresh bar and an activity circle.
 *
 * For operations where the percentage of the operation completed can be determined, use a determinate indicator. They give users a quick sense of how long an operation will take.
 *
 * For operations where the user is asked to wait a moment while something finishes up, and it’s not necessary to expose what's happening behind the scenes and how long it will take, use an indeterminate indicator.
 *
 * @param {string} mode Select from one of four modes: determinate, indeterminate, buffer or query.
 * @param {number=} value In determinate and buffer modes, this number represents the percentage of the primary progress bar. Default: 0
 * @param {number=} secondaryValue In the buffer mode, this number represents the precentage of the secondary progress bar. Default: 0
 *
 * @usage
 * <hljs lang="html">
 * <material-linear-progress mode="determinate" value="..."></material-linear-progress>
 *
 * <material-linear-progress mode="determinate" ng-value="..."></material-linear-progress>
 *
 * <material-linear-progress mode="indeterminate"></material-linear-progress>
 *
 * <material-linear-progress mode="buffer" value="..." secondaryValue="..."></material-linear-progress>
 *
 * <material-linear-progress mode="query"></material-linear-progress>
 * </hljs>
 */
function MaterialLinearProgressDirective($$rAF, $materialEffects) {

  return {
    restrict: 'E',
    template: '<div class="container">' +
      '<div class="dashed"></div>' +
      '<div class="bar bar1"></div>' +
      '<div class="bar bar2"></div>' +
      '</div>',
    compile: compile
  };
  
  function compile(tElement, tAttrs, transclude) {
    tElement.attr('aria-valuemin', 0);
    tElement.attr('aria-valuemax', 100);
    tElement.attr('role', 'progressbar');

    return postLink;
  }
  function postLink(scope, element, attr) {
    var bar1Style = element[0].querySelector('.bar1').style,
      bar2Style = element[0].querySelector('.bar2').style,
      container = angular.element(element[0].querySelector('.container'));

    attr.$observe('value', function(value) {
      if (attr.mode == 'query') {
        return;
      }

      var clamped = clamp(value);
      element.attr('aria-valuenow', clamped);
      bar2Style[$materialEffects.TRANSFORM] = linearProgressTransforms[clamped];
    });

    attr.$observe('secondaryvalue', function(value) {
      bar1Style[$materialEffects.TRANSFORM] = linearProgressTransforms[clamp(value)];
    });

    $$rAF(function() {
      container.addClass('ready');
    });
  }

  function clamp(value) {
    if (value > 100) {
      return 100;
    }

    if (value < 0) {
      return 0;
    }

    return Math.ceil(value || 0);
  }
}


// **********************************************************
// Private Methods
// **********************************************************
var linearProgressTransforms = (function() {
  var values = new Array(101);
  for(var i = 0; i < 101; i++){
    values[i] = makeTransform(i);
  }

  return values;

  function makeTransform(value){
    var scale = value/100;
    var translateX = (value-100)/2;
    return 'translateX(' + translateX.toString() + '%) scale(' + scale.toString() + ', 1)';
  }
})();

(function() {

  /**
   * @ngdoc module
   * @name material.components.swipe
   * @description Swipe module!
   */
  angular.module('material.components.swipe',['ng'])

    /**
     * @ngdoc directive
     * @module material.components.swipe
     * @name $materialSwipe
     *
     *  This service allows directives to easily attach swipe and pan listeners to
     *  the specified element.
     *
     * @private
     */
    .factory("$materialSwipe", function() {

      // match expected API functionality
      var attachNoop = function(){ return angular.noop; };

      /**
       * SwipeService constructor pre-captures scope and customized event types
       *
       * @param scope
       * @param eventTypes
       * @returns {*}
       * @constructor
       */
      return function SwipeService(scope, eventTypes) {
        if ( !eventTypes ) eventTypes = "swipeleft swiperight";

        // publish configureFor() method for specific element instance
        return function configureFor(element, onSwipeCallback, attachLater ) {
          var hammertime = new Hammer(element[0], {
            recognizers : addRecognizers([], eventTypes )
          });

          // Attach swipe listeners now
          if ( !attachLater ) attachSwipe();

          // auto-disconnect during destroy
          scope.$on('$destroy', function() {
            hammertime.destroy();
          });

          return attachSwipe;

          // **********************
          // Internal methods
          // **********************

          /**
           * Delegate swipe event to callback function
           * and ensure $digest is triggered.
           *
           * @param ev HammerEvent
           */
          function swipeHandler(ev) {

            // Prevent triggering parent hammer listeners
            ev.srcEvent.stopPropagation();

            if ( angular.isFunction(onSwipeCallback) ) {
              scope.$apply(function() {
                onSwipeCallback(ev);
              });
            }
          }

          /**
           * Enable listeners and return detach() fn
           */
          function attachSwipe() {
            hammertime.on(eventTypes, swipeHandler );

            return function detachSwipe() {
              hammertime.off( eventTypes );
            };
          }

          /**
           * Add optional recognizers such as panleft, panright
           */
          function addRecognizers(list, events) {
            var hasPanning = (events.indexOf("pan") > -1);
            var hasSwipe   = (events.indexOf("swipe") > -1);

            if (hasPanning) {
              list.push([ Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL } ]);
            }
            if (hasSwipe) {
              list.push([ Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL } ]);
            }

            return list;
          }

        };
      };
    })

    /**
     * @ngdoc directive
     * @module material.components.swipe
     * @name materialSwipeLeft
     *
     * @order 0
     * @restrict A
     *
     * @description
     * The `<div  material-swipe-left="<expression" >` directive identifies an element on which
     * HammerJS horizontal swipe left and pan left support will be active. The swipe/pan action
     * can result in custom activity trigger by evaluating `<expression>`.
     *
     * @param {boolean=} noPan Use of attribute indicates flag to disable detection of `panleft` activity
     *
     * @usage
     * <hljs lang="html">
     *
     * <div class="animate-switch-container"
     *      ng-switch on="data.selectedIndex"
     *      material-swipe-left="data.selectedIndex+=1;"
     *      material-swipe-right="data.selectedIndex-=1;" >
     *
     * </div>
     * </hljs>
     *
     */
    .directive("materialSwipeLeft", ['$parse', '$materialSwipe',
      function MaterialSwipeLeft($parse, $materialSwipe) {
        return {
          restrict: 'A',
          link :  swipePostLink( $parse, $materialSwipe, "SwipeLeft" )
        };
      }])

    /**
     * @ngdoc directive
     * @module material.components.swipe
     * @name materialSwipeRight
     *
     * @order 1
     * @restrict A
     *
     * @description
     * The `<div  material-swipe-right="<expression" >` directive identifies functionality
     * that attaches HammerJS horizontal swipe right and pan right support to an element. The swipe/pan action
     * can result in activity trigger by evaluating `<expression>`
     *
     * @param {boolean=} noPan Use of attribute indicates flag to disable detection of `panright` activity
     *
     * @usage
     * <hljs lang="html">
     *
     * <div class="animate-switch-container"
     *      ng-switch on="data.selectedIndex"
     *      material-swipe-left="data.selectedIndex+=1;"
     *      material-swipe-right="data.selectedIndex-=1;" >
     *
     * </div>
     * </hljs>
     *
     */
    .directive( "materialSwipeRight", ['$parse', '$materialSwipe',
      function MaterialSwipeRight($parse, $materialSwipe) {
        return {
          restrict: 'A',
          link: swipePostLink( $parse, $materialSwipe, "SwipeRight" )
        };
      }
    ]);

    /**
     * Factory to build PostLink function specific to Swipe or Pan direction
     *
     * @param $parse
     * @param $materialSwipe
     * @param name
     * @returns {Function}
     */
    function swipePostLink($parse, $materialSwipe, name ) {

      return function(scope, element, attrs) {
        var direction = name.toLowerCase();
        var directiveName= "material" + name;

        var parentGetter = $parse(attrs[directiveName]) || angular.noop;
        var configureSwipe = $materialSwipe(scope, direction);
        var requestSwipe = function(locals) {
          // build function to request scope-specific swipe response
          parentGetter(scope, locals)
        };

        configureSwipe( element, function onHandleSwipe(ev) {
          if ( ev.type == direction ) {
            requestSwipe();
          }
        });

      }
    }

})();




angular.module('material.decorators', [])
.config(['$provide', function($provide) {
  $provide.decorator('$$rAF', ['$delegate', '$rootScope', rAFDecorator]);

  function rAFDecorator($$rAF, $rootScope) {

    /**
     * Use this to debounce events that come in often.
     * The debounced function will always use the *last* invocation before the
     * coming frame.
     *
     * For example, window resize events that fire many times a second:
     * If we set to use an raf-debounced callback on window resize, then
     * our callback will only be fired once per frame, with the last resize
     * event that happened before that frame.
     *
     * @param {function} callback function to debounce
     */
    $$rAF.debounce = function(cb) {
      var queueArgs, alreadyQueued, queueCb, context;
      return function debounced() {
        queueArgs = arguments;
        context = this;
        queueCb = cb;
        if (!alreadyQueued) {
          alreadyQueued = true;
          $$rAF(function() {
            queueCb.apply(context, queueArgs);
            alreadyQueued = false;
          });
        }
      };
    };

    return $$rAF;
  }
}]);

angular.module('material.services.aria', [])

.service('$aria', [
  '$log',
  AriaService
]);

function AriaService($log) {
  var messageTemplate = 'ARIA: Attribute "%s", required for accessibility, is missing on "%s"';
  var defaultValueTemplate = 'Default value was set: %s="%s".';

  return {
    expect : expectAttribute,
  };

  /**
   * Check if expected ARIA has been specified on the target element
   * @param element
   * @param attrName
   * @param defaultValue
   */
  function expectAttribute(element, attrName, defaultValue) {

    var node = element[0];
    if (!node.hasAttribute(attrName)) {
      var hasDefault = angular.isDefined(defaultValue) && defaultValue.length;

      if (hasDefault) {
        defaultValue = String(defaultValue).trim();
        // $log.warn(messageTemplate + ' ' + defaultValueTemplate,
        //           attrName, getTagString(node), attrName, defaultValue);
        element.attr(attrName, defaultValue);
      } else {
        $log.warn(messageTemplate, attrName, getTagString(node));
        $log.warn(node);
      }
    }
  }


  /**
   * Gets the tag definition from a node's outerHTML
   * @example getTagString(
   *   '<material-button foo="bar">Hello</material-button>'
   * ) // => '<material-button foo="bar">'
   */
  function getTagString(node) {
    var html = node.outerHTML;
    var closingIndex = html.indexOf('>');
    return html.substring(0, closingIndex + 1);
  }
}

angular.module('material.services.attrBind', [
])
  .factory('$attrBind', [
    '$parse', 
    '$interpolate', 
    MaterialAttrBind 
  ]);

/**
 *  This service allows directives to easily databind attributes to private scope properties.
 *
 * @private
 */
function MaterialAttrBind($parse, $interpolate) {
  var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;

  return function (scope, attrs, bindDefinition, bindDefaults) {
    angular.forEach(bindDefinition || {}, function (definition, scopeName) {
      //Adapted from angular.js $compile
      var match = definition.match(LOCAL_REGEXP) || [],
        attrName = match[3] || scopeName,
        mode = match[1], // @, =, or &
        parentGet,
        unWatchFn;

      switch (mode) {
        case '@':   // One-way binding from attribute into scope

          attrs.$observe(attrName, function (value) {
            scope[scopeName] = value;
          });
          attrs.$$observers[attrName].$$scope = scope;

          if (!bypassWithDefaults(attrName, scopeName)) {
            // we trigger an interpolation to ensure
            // the value is there for use immediately
            scope[scopeName] = $interpolate(attrs[attrName])(scope);
          }
          break;

        case '=':   // Two-way binding...

          if (!bypassWithDefaults(attrName, scopeName)) {
            // Immediate evaluation
            scope[scopeName] = (attrs[attrName] === "") ? true : scope.$eval(attrs[attrName]);

            // Data-bind attribute to scope (incoming) and
            // auto-release watcher when scope is destroyed

            unWatchFn = scope.$watch(attrs[attrName], function (value) {
              scope[scopeName] = value;
            });
            scope.$on('$destroy', unWatchFn);
          }

          break;

        case '&':   // execute an attribute-defined expression in the context of the parent scope

          if (!bypassWithDefaults(attrName, scopeName, angular.noop)) {
            /* jshint -W044 */
            if (attrs[attrName] && attrs[attrName].match(RegExp(scopeName + '\(.*?\)'))) {
              throw new Error('& expression binding "' + scopeName + '" looks like it will recursively call "' +
                attrs[attrName] + '" and cause a stack overflow! Please choose a different scopeName.');
            }

            parentGet = $parse(attrs[attrName]);
            scope[scopeName] = function (locals) {
              return parentGet(scope, locals);
            };
          }

          break;
      }
    });

    /**
     * Optional fallback value if attribute is not specified on element
     * @param scopeName
     */
    function bypassWithDefaults(attrName, scopeName, defaultVal) {
      if (!angular.isDefined(attrs[attrName])) {
        var hasDefault = bindDefaults && bindDefaults.hasOwnProperty(scopeName);
        scope[scopeName] = hasDefault ? bindDefaults[scopeName] : defaultVal;
        return true;
      }
      return false;
    }

  };
}

angular.module('material.services.compiler', [
])
  .service('$materialCompiler', [
    '$q',
    '$http',
    '$injector',
    '$compile',
    '$controller',
    '$templateCache',
    materialCompilerService
  ]);

function materialCompilerService($q, $http, $injector, $compile, $controller, $templateCache) {

  /**
   * @ngdoc service
   * @name $materialCompiler
   * @module material.services.compiler
   *
   * @description
   * The $materialCompiler service is an abstraction of angular's compiler, that allows the developer
   * to easily compile an element with a templateUrl, controller, and locals.
   */

   /**
    * @ngdoc method
    * @name $materialCompiler#compile
    * @param {object} options An options object, with the following properties:
    *
    *    - `controller` â€“ `{(string=|function()=}` â€“ Controller fn that should be associated with
    *      newly created scope or the name of a {@link angular.Module#controller registered
    *      controller} if passed as a string.
    *    - `controllerAs` â€“ `{string=}` â€“ A controller alias name. If present the controller will be
    *      published to scope under the `controllerAs` name.
    *    - `template` â€“ `{string=}` â€“ html template as a string or a function that
    *      returns an html template as a string which should be used by {@link
    *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
    *      This property takes precedence over `templateUrl`.
    *
    *    - `templateUrl` â€“ `{string=}` â€“ path or function that returns a path to an html
    *      template that should be used by {@link ngRoute.directive:ngView ngView}.
    *
    *    - `transformTemplate` â€“ `{function=} â€“ a function which can be used to transform
    *      the templateUrl or template provided after it is fetched.  It will be given one
    *      parameter, the template, and should return a transformed template.
    *
    *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
    *      be injected into the controller. If any of these dependencies are promises, the compiler
    *      will wait for them all to be resolved or one to be rejected before the controller is
    *      instantiated.
    *
    *      - `key` â€“ `{string}`: a name of a dependency to be injected into the controller.
    *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
    *        Otherwise if function, then it is {@link api/AUTO.$injector#invoke injected}
    *        and the return value is treated as the dependency. If the result is a promise, it is
    *        resolved before its value is injected into the controller.
    *
    * @returns {object=} promise A promsie which will be resolved with a `compileData` object,
    * with the following properties:
    *
    *   - `{element}` â€“ `element` â€“ an uncompiled angular element compiled using the provided template.
    *   
    *   - `{function(scope)}`  â€“ `link` â€“ A link function, which, when called, will compile
    *     the elmeent and instantiate options.controller.
    *
    *   - `{object}` â€“ `locals` â€“ The locals which will be passed into the controller once `link` is
    *     called.
    *
    * @usage
    * $materialCompiler.compile({
    *   templateUrl: 'modal.html',
    *   controller: 'ModalCtrl',
    *   locals: {
    *     modal: myModalInstance;
    *   }
    * }).then(function(compileData) {
    *   compileData.element; // modal.html's template in an element
    *   compileData.link(myScope); //attach controller & scope to element
    * });
    */
  this.compile = function(options) {
    var templateUrl = options.templateUrl;
    var template = options.template || '';
    var controller = options.controller;
    var controllerAs = options.controllerAs;
    var resolve = options.resolve || {};
    var locals = options.locals || {};
    var transformTemplate = options.transformTemplate || angular.identity;

    // Take resolve values and invoke them.  
    // Resolves can either be a string (value: 'MyRegisteredAngularConst'),
    // or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
    angular.forEach(resolve, function(value, key) {
      if (angular.isString(value)) {
        resolve[key] = $injector.get(value);
      } else {
        resolve[key] = $injector.invoke(value);
      }
    });
    //Add the locals, which are just straight values to inject
    //eg locals: { three: 3 }, will inject three into the controller
    angular.extend(resolve, locals);

    if (templateUrl) {
      resolve.$template = $http.get(templateUrl, {cache: $templateCache})
        .then(function(response) {
          return response.data;
        });
    } else {
      resolve.$template = $q.when(template);
    }

    // Wait for all the resolves to finish if they are promises
    return $q.all(resolve).then(function(locals) {

      var template = transformTemplate(locals.$template);
      var element = angular.element('<div>').html(template).contents();
      var linkFn = $compile(element);

      //Return a linking function that can be used later when the element is ready
      return {
        locals: locals,
        element: element,
        link: function link(scope) {
          locals.$scope = scope;

          //Instantiate controller if it exists, because we have scope
          if (controller) {
            var ctrl = $controller(controller, locals);
            //See angular-route source for this logic
            element.data('$ngControllerController', ctrl);
            element.children().data('$ngControllerController', ctrl);

            if (controllerAs) {
              scope[controllerAs] = ctrl;
            }
          }

          return linkFn(scope);
        }
      };
    });
  };
}

/**
 * @ngdoc overview
 * @name material.services.registry
 *
 * @description
 * A component registry system for accessing various component instances in an app.
 */
angular.module('material.services.registry', [
])
  .factory('$materialComponentRegistry', [
    '$log', 
    materialComponentRegistry 
  ]);

/**
 * @ngdoc service
 * @name material.services.registry.service:$materialComponentRegistry
 *
 * @description
 * $materialComponentRegistry enables the user to interact with multiple instances of
 * certain complex components in a running app.
 */
function materialComponentRegistry($log) {
  var instances = [];

  return {
    /**
     * Used to print an error when an instance for a handle isn't found.
     */
    notFoundError: function(handle) {
      $log.error('No instance found for handle', handle);
    },
    /**
     * Return all registered instances as an array.
     */
    getInstances: function() {
      return instances;
    },

    /**
     * Get a registered instance.
     * @param handle the String handle to look up for a registered instance.
     */
    get: function(handle) {
      var i, j, instance;
      for(i = 0, j = instances.length; i < j; i++) {
        instance = instances[i];
        if(instance.$$materialHandle === handle) {
          return instance;
        }
      }
      return null;
    },

    /**
     * Register an instance.
     * @param instance the instance to register
     * @param handle the handle to identify the instance under.
     */
    register: function(instance, handle) {
      instance.$$materialHandle = handle;
      instances.push(instance);

      return function deregister() {
        var index = instances.indexOf(instance);
        if (index !== -1) {
          instances.splice(index, 1);
        }
      };
    }
  }
}


})();