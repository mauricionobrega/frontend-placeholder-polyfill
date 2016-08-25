(function(win, doc) {

  var mock = doc.createElement('input'),
      isDisabled = !('placeholder' in mock) && typeof mock.placeholder !== 'string';

  if (!isDisabled) {
    var inputs = doc.getElementsByTagName('input');
        textareas = doc.getElementsByTagName('textarea'),
        disregardStylesForPlaceholder = 'text-security|color|user-select';

    // POLLYFILL FOR MANIPULATE CLASSES ================================================================================
    var hasClass, addClass, removeClass;
    if ('classList' in doc.documentElement) {
      hasClass = function (el, className) { return el.classList.contains(className); };
      addClass = function (el, className) { el.classList.add(className); };
      removeClass = function (el, className) { el.classList.remove(className); };
    } else {
      hasClass = function (el, className) {
        return new RegExp('\\b'+ className+'\\b').test(el.className);
      };
      addClass = function (el, className) {
        if (!hasClass(el, className)) {
          el.className += ' ' + className;
        }
      };
      removeClass = function (el, className) {
        el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
      };
    };

    function getAllStyles(el) {
      if (!el) {return []}; // ELEMENT DOES NOT EXIST, EMPTY LIST.
      var style, styleNode = {}, regex = new RegExp(disregardStylesForPlaceholder);
      if (win.getComputedStyle) { // MODERN BROWSERS
        style = win.getComputedStyle(el, null);
        for (var i = 0; i < style.length; i++) {
          var key = style[i];
          if( !(regex).test(key) ) {
            styleNode[key] = style.getPropertyValue(style[i]);
          }
        }
      } else if (elem.currentStyle) { // IE
        style = elem.currentStyle;
        for (var name in style) {
          var key = style[i];
          if( !(regex).test(name) ) {
            styleNode[name] = style[name];
          }
        }
      } else { // ANCIENT BROWSER...
        style = elem.style;
        for (var i = 0; i < style.length; i++) {
          var key = style[i];
          if( !(regex).test(key) ) {
            styleNode[key] = style[style[i]];
          }
        }
      }
      return styleNode;
    };

    function addEvent(obj, event, callback) {
      if (obj.addEventListener) {
        obj.addEventListener(event, function(evt) {
          callback(evt.srcElement || evt.target, evt);
        }, false);
      } else if (obj.attachEvent) {
        obj.attachEvent('on' + event, function(evt) {
          callback(evt.srcElement || evt.target, evt);
        });
      }
    };

    function each(arr, callback) {
      var i = arr.length;
      while (i--) {
        callback(arr[i]);
      }
    };

    function setStyle(el, props) {
      for (var i in props) {
        if (props.hasOwnProperty(i)) {
          el.style[i] = props[i];
        }
      }
    };

    function createElement(tag, props) {
      var el = doc.createElement(tag);
      for (var i in props) {
        if (props.hasOwnProperty(i)) {
          if (i === 'style') {
            setStyle(el, props[i]);
          } else if (i === 'innerHTML') {
            el.innerHTML = props[i];
          } else if(i === 'className') {
            el.className = props[i];
          } else {
            el.setAttribute(i, props[i]);
          }
        }
      }
      return el;
    };

    function getPlaceholderFor(el) {
      return el.getAttribute('placeholder') || (el.attributes.placeholder && el.attributes.placeholder.nodeValue) || '';
    };

    function insertBefore(parentNode, placeholder) {
      parentNode.appendChild(placeholder);
      parentNode.insertBefore(placeholder, parentNode.firstChild);
    };

    function drawPlaceholder(el) {
      var styles = getAllStyles(el),
          wrapper = el.parentNode,
          oldLabel = wrapper.querySelector('.__placeholder'),
          textLabel, label;
      styles['position'] = 'absolute';
      styles['z-index'] = 0;

      if (oldLabel) {
        wrapper.removeChild(oldLabel)
      };

      textLabel = createElement('span', {
        innerHTML: getPlaceholderFor(el),
        unselectable: 'on'
      });

      label = createElement('label', {
        unselectable: 'on',
        for: el.id || el.name || '',
        className: '__placeholder',
        style: styles
      });

      insertBefore(label, textLabel);
      insertBefore(wrapper, label);
    };

    function blurPlaceholder(el, event) {
      removeClass(el, '__focus');
      removeClass(el.parentNode.querySelector('.__placeholder'), '__focus');
      checkPlaceholder(el, event)
    };

    function checkPlaceholder(el, event) {
      var placeholder = el.parentNode.querySelector('.__placeholder');
      if (el.value) {
        if (!hasClass(el, '__valued')) {
          addClass(el, '__valued');
        }
      } else {
        if (event && event.type !== 'blur') {
          addClass(placeholder, '__focus');
        }
        removeClass(el, '__valued');
      }
    };

    function hidePlaceholder(el, event) {
      var placeholder = el.parentNode.querySelector('.__placeholder');
      addClass(el, '__focus');
      addClass(placeholder, '__focus');
      if (el.value) {
        if (!hasClass(el, '__valued')) {
          addClass(el, '__valued');
        }
      }
    };

    function polyfillElement(el) {
      if (el.hasAttribute('placeholder')) {

        drawPlaceholder(el);
        checkPlaceholder(el);
        if (!hasClass(el, '__placeholded')) {
          addClass(el, '__placeholded');
        }

        // TESTING
        el.placeholder = '';

        // CREATE EVENTS FOR ELEMENTS
        addEvent(el, 'keyup', checkPlaceholder);
        addEvent(el, 'keyDown', checkPlaceholder);
        addEvent(el, 'blur', blurPlaceholder);
        addEvent(el, 'focus', hidePlaceholder);

        if (el.type.toUpperCase() === 'TEXTAREA') {
          addEvent(el, 'mouseup', drawPlaceholder);
        };

        // addEvent(el, 'click', hidePlaceholder);
        // addEvent(placeholder, 'click', hidePlaceholder);
        // addEvent(win, 'resize', redrawPlaceholder);
      };
    };

    function getElementsInDocument() {
      var all = [], i = inputs.length, t = textareas.length;
      while (i--) {
        all.push(inputs[i]);
      }
      while (t--) {
        all.push(textareas[t]);
      }
      return all;
    };

    doc.placeholderPolyfill = function(elms) {
      each(elms || getElementsInDocument(), polyfillElement);
    };

    // RUN AUTOMATICALLY
    doc.placeholderPolyfill();
  }

}(window, document));
