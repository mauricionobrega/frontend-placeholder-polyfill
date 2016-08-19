(function(win, doc) {

  var mock = doc.createElement('input'),
      isEnabled = !('placeholder' in mock) && typeof mock.placeholder !== 'string'

  if (!isEnabled) { console.log('executed');
    var inputs = document.getElementsByTagName('input');
        textareas = document.getElementsByTagName('textarea');

    // function getStyle(el, prop) {
    //   var strValue = '';
    //   if (window.getComputedStyle) {
    //     strValue = getComputedStyle(el).getPropertyValue(prop);
    //   } else if (el.currentStyle) { // IE
    //     try {
    //       strValue = el.currentStyle[prop];
    //     } catch (e) {}
    //   }
    //   return strValue;
    // };

    function getAllStyles(el) {
      if (!el) {return []}; // Element does not exist, empty list.
      var style, styleNode = {};
      if (window.getComputedStyle) { /* Modern browsers */
        style = window.getComputedStyle(el, null);
        for (var i=0; i<style.length; i++) {
          styleNode[style[i]] = style.getPropertyValue(style[i]);
        }
      } else if (elem.currentStyle) { /* IE */
        style = elem.currentStyle;
        for (var name in style) {
          styleNode[name] = style[name];
        }
      } else { /* Ancient browser..*/
        style = elem.style;
        for (var i=0; i<style.length; i++) {
          styleNode[style[i]] = style[style[i]];
        }
      } console.log(styleNode);
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
  		var el = document.createElement(tag);
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
      getAllStyles(el);

      insertBefore(el.parentNode, createElement('label', {
				innerHTML: getPlaceholderFor(el),
        for: el.id || el.name || '',
        style: getAllStyles(el)
        // style: {
				// 	position: 'absolute',
				// 	display: 'none',
        //   display: 'block',
				// 	margin: '0',
				// 	padding: '0',
				// 	cursor: 'text'
				// }
			}));
    };

    function polyfillElement(el) {
      if (el.hasAttribute('placeholder')) {
        drawPlaceholder(el);


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

    document.placeholderPolyfill = function(elms) {
      each(elms || getElementsInDocument(), polyfillElement);
    };

    // Run automatically
    document.placeholderPolyfill();

  }

}(window, document));
