(function(win, doc) {

  var mock = doc.createElement('input'),
      isEnabled = 'placeholder' in mock && typeof mock.placeholder === 'string';

  if (isEnabled) { console.log('executed');
    var inputs = document.getElementsByTagName('input');
        textareas = document.getElementsByTagName('textarea');

    function each(arr, func) {
			var i = arr.length;
			while (i--) {
        func(arr[i]);
			}
  	};

  	function setStyle(elem, props) {
  		for (var i in props) {
  			if (props.hasOwnProperty(i)) {
  				elem.style[i] = props[i];
  			}
  		}
  	};

    function createElement(tag, props) {
  		var elem = document.createElement(tag);
  		for (var i in props) {
  			if (props.hasOwnProperty(i)) {
  				if (i === 'style') {
  					setStyle(elem, props[i]);
  				} else if (i === 'innerHTML') {
  					elem.innerHTML = props[i];
  				} else {
  					elem.setAttribute(i, props[i]);
  				}
  			}
  		}
  		return elem;
  	};

    function getPlaceholderFor(elem) {
  		return elem.getAttribute('placeholder') || (elem.attributes.placeholder && elem.attributes.placeholder.nodeValue) || '';
  	};

    function insertBefore(parentNode, placeholder) {
      parentNode.appendChild(placeholder);
      parentNode.insertBefore(placeholder, parentNode.firstChild);
    }

    function drawPlaceholder(el) {
      insertBefore(el.parentNode, createElement('label', {
				innerHTML: getPlaceholderFor(el),
        for: el.id || el.name || '',
				style: {
					position: 'absolute',
					display: 'none',
          display: 'block',
					margin: '0',
					padding: '0',
					cursor: 'text'
				}
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
