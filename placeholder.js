(function(win, doc) {

  var mock = doc.createElement('input'),
      isEnabled = !('placeholder' in mock) && typeof mock.placeholder !== 'string';

  if (!isEnabled) {
    var inputs = doc.getElementsByTagName('input');
        textareas = doc.getElementsByTagName('textarea');

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
      var style, styleNode = {}, regex = new RegExp('text-security');
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

    function each(arr, func) {
      var i = arr.length;
      while (i--) {
        func(arr[i]);
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
      var styles = getAllStyles(el);
      styles['position'] = 'absolute';
      styles['z-index'] = 0;

      insertBefore(el.parentNode, createElement('label', {
        innerHTML: getPlaceholderFor(el),
        for: el.id || el.name || '',
        className: '__placeholder',
        style: styles
      }));
    };

    function checkPlaceholder(el) {
      if (el.value) {
        if (!hasClass(el, '__placeholded-valued')) {
          addClass(el, '__placeholded-valued');
        }
      } else {
        removeClass(el, '__placeholded-valued');
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
        addEvent(el, 'blur', checkPlaceholder);
        // addEvent(el, 'focus', hidePlaceholder);
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
