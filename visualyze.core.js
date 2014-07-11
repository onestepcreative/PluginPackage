/*

	The Visualyze Javascript Core
	
	Author: 	  	Josh McDonald (@onestepceative)
	Copyright: 		Copyright 2014, Visualyze
	
	This file does a lot of the heavy lifting when
	it comes to plugin development. All plugins built on
	top of the core reside in the libs object and are 
	iterated thru during page load to be initialized
	based on the settings it was called with.
	
	This file, as well as others, were taken and modified from 
	the Foundation 5 Framework created by the Team at Zurb

*/

;(function($, window, document, undefined) {

    'use strict';

    window.Visualyze = window.Visualyze || {};
    
    window.viz 		 = window.viz || {};
    
    window.mqs 		 = window.mqs || {};

	
	// Reference to document <head> for window.viz
	var vizhead		= $('head');
	
	// Reference to site-settings meta tag
	var vizsite		= vizhead.find('.site-settings');


    /*
	 * viz is an object that holds clean and simple helper 
	 * methods to help you during development. To check if you're
	 * in buylist mode, simply use viz.buylist for true or false
	*/
    window.viz = {
    
		istouch		: Modernizr.touch,
		
		ismouse		: !Modernizr.touch,

		ismobile	: (/mobile|tablet|ip(ad|hone|od)|android|silk/i).test(window.navigator.userAgent),

    	evtype		: ((document.ontouchstart !== null) ? 'click' : 'touchstart'),
    	
    	buylist		: ($('body').hasClass('buylist')),
    	
    	page 		: $('#page-container'),
    	
    	site		: {
	    	
	    	mode: vizsite.attr('data-mode'),

			user: vizsite.attr('data-user'),
	
			page: vizsite.attr('data-page'),
			
			action: vizsite.attr('data-action'),
	
			template: vizsite.attr('data-template')	
	    	
    	}
    	
	};
	

	/*
	 * MQS is the global media queries object so you can easily
	 * check to see which query you're inside of. Each property can
	 * be called like mqs.medium and will return true or false
	*/
	window.mqs = {
	
		minimum: matchMedia('only screen and (min-width: 20em)').matches,
		
		small: matchMedia('only screen and (max-width: 47.9375em)').matches,
		
		medium: matchMedia('only screen and (min-width: 48em) and (max-width: 64em)').matches,
		
		large: matchMedia('only screen and (min-width: 64.063em) and (max-width: 74.6875em)').matches,
		
		xlarge: matchMedia('only screen and (min-width: 74.75) and (max-width: 90em)').matches,
				
		xxlarge: matchMedia('only screen and (min-width: 90.063) and (max-width: 120em)').matches,
		
		maximum: matchMedia('only screen and (min-width: 120.063em)').matches
				
	};


    /*
	 * Visualyze is the global js core object that stores and
	 * runs any plugin libraries added to the Visualyze.libs object.
	 * It also provides helper methods and patches to use in dev
	*/
    window.Visualyze = {
    
		name: 'Visualyze',
		
		version: '2.5.2',
		
		cache: {},
		
		libs: {},
		
		/*
		 * Handles initializing arguments and what to do with them
		 * @param scope (jQuery Object), scope reference to library
		 * @param libraries (array), libraries added to Visualyze name space
		 * @param method (object), methods that belong to library
		 * @param settings (object), settings passed during library init()
		 * @param response (array), list of initialized libraries
		 * @returns scope, returns init instance to maintain chainability
		*/
		init: function(scope, libraries, method, settings, response) {
			
			var args 		= [scope, method, settings, response];
			
			var responses	= [];
			
			// Check the language direction on the HTML element
			this.rtl = /rtl/i.test($('html').attr('dir'));
			
			// Set the Visualyze global scope
			this.scope = scope || this.scope;
			
			// If libs are defined libs is a string, but not 'reflow'
			if(libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
				
				if(this.libs.hasOwnProperty(libraries)) {
					
					responses.push(this.initLib(libraries, args));
					
				}
				
			} else {
				
				for(var lib in this.libs) {
					
					responses.push(this.initLib(lib, libraries));
					
				}
				
			}
			
			return scope;
			
		},
		
		/*
		 * Runs plugin after settings merge and optional event binding
		 * @param bind (boolean), true will bind events from events.attach in plugins
		 * @param method (string), choose a method to call rather than running init 
		 * @param settings (object), the settings passed during call of plugin
		*/
	    bindings: function(bind, method, settings) {

		    // Reference to Visualyze object
		    var self 	= this;
		    
		    // Determine whether to automatically bind events
		    if(bind) { bind = true; } else { bind = false; }
		    
		    // If method is a string, call it like a function
		    if(typeof method === 'string') {
			    
			    // When method is a string, call the method
			    return this[method].call(this, settings);
			   
		    } else {
			    
			    // When settings object is passed, recursively merge with defaults
			    self.settings = $.extend(true, self.options, (settings || method));
				
				// If bind is false, don't attach events
				if(!bind) { return false; }
				 
			    // Pass bind parameter to bind events
			    self.events.attach(bind);
			    
		    }
		    
		    
	    },
		
		/*
		 * Initialize all libraries added to Visualyze.libs
		 * Merges options argument with settings or default in library
		 * @param lib (object), the library or plugin being initialized
		 * @param args (object), library specific settings that are passed 
		 * @returns function init()
		*/
		initLib: function(lib, args) {
			
			if(this.libs.hasOwnProperty(lib)) {
				
				// Standardized the lib
				this.patch(this.libs[lib]);
				
				// If args exist in lib, run settings merge and init
				if(args && args.hasOwnProperty(lib)) {
					
					// If a settings object exists in the library
					if(typeof this.libs[lib].settings !== 'undefined') {
						
						// Recursively merge the two objects for lib
						$.extend(true, this.libs[lib].settings, args[lib]);
					
					// Else if a defaults object exists in the lib	
					} else if(typeof this.libs[lib].defaults !== 'undefined') {
						
						// Recursively merge the objects for lib
						$.extend(true, this.libs[lib].defaults, args[lib]);
						
					} 
					
					// Call the init() method within the library and forward the args
					return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
					
				}
				
				// Make sure that 'args' is an array before calling apply()
				args = args instanceof Array ? args : new Array(args);
				
				// Call the init() method within the library and forward args
				return this.libs[lib].init.apply(this.libs[lib], args);
				
			}
			
			// If no libs exist, return nothing
			return function() {};
			
		},
		
		/*
		 * Adds default properties to libs within Visualyze.libs
		 * @param lib (object), the library or plugin to provide patch
		*/
		patch: function(lib) {
			
			lib.scope			= this.scope;
			lib.rtl				= this.rtl;
			
			lib['getAction']	= this.utils.getAction;
			lib['dataOptions']	= this.utils.dataOptions;
			lib['bindings']		= this.bindings;
			
		},
		
		/*
		 * Allows other libs to easily inherit methods from Visualyze
		 * @param scope (object), the scope in which inheritance should apply
		 * @param methods (array), method names to inherit from Visualyze
		*/
		inherit: function(scope, methods) {
			
			// called like: this.inherit('str of inheritance libs')
			
			var methodArray = methods.split(' ');
			var i 			= methodArray.length;
			
			// Loop thru inherited properties
			while(i--) {
				
				if(this.utils.hasOwnProperty(methodArray[i])) {
					
					scope[methodArray[i]] = this.utils[methodArray[i]];
					
				}
				
			} 
			
		},
		
		/*
		 * Utilities are different methods and functionalities that
		 * can be inherited by different plugin libraries using the inherit
		 * method. Visualyze.inherit(scope, methods to inherit)
		*/
		utils: {
			
			/*
			 * Get the corresponding content to any data-action trigger
			 * @param element (jQuery), the trigger (data-action) that was clicked
			 * @returns jQuery object of the matching plugin content
			*/
			getAction: function(element) {
				
				var dataAttr = $(element).attr('data-action').split('-');
				
				return (dataAttr.length === 2) ? $('body').find('[data-'+ dataAttr[0] +'="'+ dataAttr[1] +'"]') : false;				
				
			},
			
			/*
			 * Execute function a max of once every N milliseconds
			 * @param func (function), function you want to throttle
			 * @param delay (integer), execution threshold in milliseconds
			 * @returns throttled function
			*/
			throttle: function(func, delay) {
				
				var timer = null;
				
				return function() {
					
					var context = this;
					var args	= arguments;
					
					if(timer == null) {
						
						timer = setTimeout(function() {
							
							func.apply(context, args);
							
							timer = null;
							
						}, delay);
						
					}
					
				};
				
			},
			
			/*
			 * ReExecute function after invokation stops for N seconds
			 * @param func (function), function you want to debounce
			 * @param delay (integer), execution threshold in milliseconds
			 * @param immediate (boolean), call at beginning instead of end
			 * @returns debounced function
			*/
			debounce: function(func, delay, immediate) {
				
				var timeout;
				var result;
				
				return function() {
					
					var context = this;
					var args	= arguments;
					
					var later 	= function() {
						
						timeout = null;
						
						if(!immediate) {
							
							result = func.apply(context, args);
							
						}
						
					};
					
					var callNow = immediate && !timeout;
					
					clearTimeout(timeout);
					
					timeout = setTimeout(later, delay);
					
					if(callNow) { result = func.apply(context, args); }
					
					return result;	
					
				};
				
			},
			
			/*
			 * Function to parse data-attr-* attributes
			 * @param elem (jQuery Obj), element to be parsed
			 * @param attr (string), the data attr name
			 * @returns object
			*/
			dataOptions: function(element, attr) {
				
				var opts = {};
				var arr;
				var ii;
				var p;
				
				var dataOptions = function(element, attr) {
					
					var namespace = Visualyze.global.namespace;
					
					if(namespace.length > 0) {
						
						return element.attr('[data-'+ namespace +']');
						
					}
					
					return element.attr('data-options');
					
				};
				
				var cachedData = dataOptions(element, attr);
				
				if(typeof cachedData === 'object') { return cachedData; }
				
				arr = (cachedData || ':').split(';');
				
				ii 	= arr.length;
				
				while(ii--) {
					
					p = arr[ii].split(':');
					
					if(/true/i.test(p[1])) { p[1] = true; }
					
					if(/false/i.test(p[1])) { p[1] = false; }
					
					if(isnumber(p[1])) {
						
						if(p[1].indexOf('.') === -1) {
							
							p[1] = parseInt(p[1], 10);
							
						} else {
							
							p[1] = parseFloat(p[1]);
							
						}
						
					}
					
					if(p.length === 2 && p[0].length > 0) {
					
						opts[trim(p[0])] = trim(p[1]);
					
					}
					
				}
				
				function isNumber(val) {
					
					return !(isNaN(val - 0) && val !== null && val !== '' && val !== false && val !== true);
					
				}
				
				function trim(str) {
					
					if(typeof str === 'string') {
						
						return $.trim(str);
						
					}
					
					return str;
					
				}
				
				return opts;
				
			},
						
			/*
			 * Performs a callback when an image is fully loaded
			 * @param images (jQuery Object), image(s) to check if loaded
			 * @param callback (function), excecute when image is fully loaded
			*/
			imageLoader: function(images, callback) {
					
				// Maintain reference to imageLoad object
				var self = this;
				
				// Get vars ready for images loop for perf
				var unloaded 	= images.length;
				var i			= 0;
				
				// No images were passed 
				if(unloaded === 0) { 
					
					// run the callback
					callback(images); 
					
				}
				
				images.each(function() {
					
					Visualyze.utils.loaded($(this), function() {
						
						unloaded -= 1;
						
						if(unloaded === 0) {
							
							callback(images);
							
						}
						
					});
					
				});
				
			},
				
			/*
			 * Lets us know when a single image is loaded and can run callback
			 * @param image (DOM node), the image we want to monitor for completion
			 * @param callback (function), optional callback to run on loaded image
			*/
			loaded: function(image, callback) {
				
				// Maintain reference to imageLoad object
				var self = this;
				
				// Function to run when image load complete
				function loaded() {
						
					callback(image[0]);
					
				}
				
				// Function to bind load event to current image
				function bindload() {
					dev.info('bindload', this);
					// 'This' is a reference to the image the method was called on
					this.one('load', loaded);
					dev.info('bindload load', this);
					// Run a random string 'cache buster' for IE fix 
					if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
						
						// Store img src var for perf
						var src = this.attr('src');
						
						// Match special chars in img src
						var param = src.match(/\?/) ? '&' : '?';
						
						// Pin random number to image url to bust
						param += 'random=' + (new Date()).getTime();
						
						// Replace image src with new cache busted one
						this.attr('src', src + param);
						
					}
					
				}
				
				// If no image src exists, loaded() and get out
				if(!image.attr('src')) {
					
					loaded();
					
					return false;
					
				}
				
				if(image[0].complete || image[0].readyState === 4) {
					
					// If image loaded, run callback
					loaded();
					
				} else {
				
					// Otherwise, bind load event to image	
					bindload.call(image);
					
				}	
				
			},
				
			/*
			 * Generates a random alphanumeric string
			 * @param limit (integer), limit the length of string
			 * @returns random string
			*/
			randomString: function(limit) {
				
				if(!this.fidx) { this.fidx = 0 }
				
				this.prefix = this.prefix || [(this.name || 'F'), (+new Date).toString(limit)].join('-');
				
				return this.prefix + (this.fidx++).toString(limit);
				
			}
			
			
		},
	    
    };
    
    /*
	 * Assigns the Visualyze object to Jquery's fn namespace
	 * This allows us to only do this once, but run multiple libraries
	 * Libraries are stored in Visualyze.libs, which is iterated here
	*/
    $.fn.visualyze = function() {
	    
	  var args = Array.prototype.slice.call(arguments, 0);
	  
	  return this.each(function() {
		  
		 Visualyze.init.apply(Visualyze, [this].concat(args));
		 
		 return this; 
		  
	  });
	    
    };

})(jQuery, this, this.document);