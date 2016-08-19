(function(win, doc) {

  var mock = doc.createElement('input'),
      isEnabled = !('placeholder' in mock) && typeof mock.placeholder !== 'string'

  if (!isEnabled) {
    var inputs = doc.getElementsByTagName('input');
        textareas = doc.getElementsByTagName('textarea');

    function getAllStyles(el) {
      if (!el) {return []}; // ELEMENT DOES NOT EXIST, EMPTY LIST.
      var style, styleNode = {};
      if (win.getComputedStyle) { // MODERN BROWSERS
        style = win.getComputedStyle(el, null);
        for (var i = 0; i < style.length; i++) {
          styleNode[style[i]] = style.getPropertyValue(style[i]);
        }
      } else if (elem.currentStyle) { // IE
        style = elem.currentStyle;
        for (var name in style) {
          styleNode[name] = style[name];
        }
      } else { // ANCIENT BROWSER...
        style = elem.style;
        for (var i = 0; i < style.length; i++) {
          styleNode[style[i]] = style[style[i]];
        }
      }
      return styleNode;
    }

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
    }

    function drawPlaceholder(el) {
      var styles = getAllStyles(el);
      styles['position'] = 'absolute';
      styles['z-index'] = 0;

      insertBefore(el.parentNode, createElement('label', {
				innerHTML: getPlaceholderFor(el),
        for: el.id || el.name || '',
        style: styles
			}));
    };

    function checkPlaceholder(el) { console.log(el);
			// if (elem.value) {
      //   var nofocus = true;
      //   if (event && event.type ){
      //     nofocus = event.type === 'blur';
      //   }
      //   hidePlaceholder(event, nofocus);
			// } else {
			// 	showPlaceholder();
			// }
		}

    function polyfillElement(el) {
      if (el.hasAttribute('placeholder')) {
        drawPlaceholder(el);
        checkPlaceholder(el);

        // CREATE EVENTS FOR ELEMENTS
        // addEvent(elem, 'keyup', checkPlaceholder);
        // addEvent(elem, 'keyDown', checkPlaceholder);
        // addEvent(elem, 'blur', checkPlaceholder);
        // addEvent(elem, 'focus', hidePlaceholder);
        // addEvent(elem, 'click', hidePlaceholder);
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
