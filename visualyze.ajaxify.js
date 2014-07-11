/*

	The Ajaxify Plugin (Taylored for Tably)

	Author: 	Josh McDonald
	Twitter:	@onestepcreative
	Github:		github.com/onestepcreative
	
	This plugin allows you to make an Ajax
	request to get 'html' and parse it to the
	page with simple data attributes. 

*/


;(function($, window, document, undefined) {

	'use strict';
	
	Visualyze.libs.ajaxify = {

		name	: 'ajaxify',
		
		version	: '2.1.3',
		
		init: function(scope, settings) {

			var self 	= this;
			var options = {};

			if(typeof settings === 'object') {

				$.extend(true, options, settings);
			
			} else if(typeof settings === 'string') {

				options.url = settings;
				
			}

			// Create new instance
			new Ajaxify(scope, options);
		},
		
	};
	
	var Ajaxify = function(elem, settings) {

		var self = this;
		
		self.options = {
		
			scoped		: 'body',
		
			// default ajax options
			url			: null,
			data		: null,
			type		: 'GET',
			dataType	: 'html',
			
			// the elements to handle
			elem		: '.ajaxify',
			replace 	: false,
			loader		: null,
			
			// callbacks to handle data	
			before		: null,
			success		: null,
			failure		: null,
			carry		: true,
			
			// local storage options
			cached 		: false,
			key			: settings.url,
			duration	: 3,
			
			// animation options
			effect		: 'flash',
			speed		: 500,

			// data cleaning options
			clean 		: {
				
				links 	: true,
				images 	: true
				
			}
			
		};
		
		// Merge default options with options passed
		$.extend(true, self.options, settings);
		
		self.init = function() {
		
			// Create new event when ajaxify starts
			$(window).trigger('ajaxify.start');
			
			// If no url is provided, get out
			if(self.options.url === null) { return; }
			
			// Get cache data from localStorage if it exists
			var _cache = self.cache.get(self.options.key);
			
			// Get the cache ttl stamp from localStorage
			var _ttl = self.cache.get(self.options.key + '_ttl');

			// If cache data
			if(_cache) {
				
				// If success option is set
				if(typeof self.options.success === 'function') {
					
					// Run success callback on cached data
					self.options.success(_cache);
					
				} else {
					
					// Parse cached data with default callback
					self.parse(_cache);
					
				}
				
			} else {
				
				// Make ajax request for data & parse it
				self.request();
				
			}		

		},
		
		self.request = function() {
			
			// Create new event when the ajax request starts
			$(window).trigger('ajaxify.requestStart');
			
			// Build oobject of only ajax settings
			var ajaxOpts = {
				url			: self.options.url,
				type 		: self.options.type,
				dataType	: self.options.dataType,
				beforeSend	: self.options.before,
				success 	: self.options.success,
				fail		: self.options.fail,
			}
			
			// Create a defferred object from Ajax call
			var ajaxified = $.ajax(ajaxOpts);
			
			// The done callback handles callbacks when ajax is complete
			ajaxified.done(function(response) {
				
				var data = (response.results) ? response.results[0] : response;
				
				// If response is empty, trigger custom event & exit
				if(!response.results[0]) {
					
					// Fire new event when the ajax request is done
					$(window).trigger('ajaxify.responseError', {
						
						name: 'responseError',
						msg : 'The ajax response was empty. Please try again.',
						desc: 'Make sure the URL is typed correctly, and can be accessed from your browser.'
						
					});

					return false;
					
				}

				
				
				//data = data.replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '');
				
				// Get rid of extra spaces and line breaks
				data = data.replace(/(\r\n|\n|\r)/gm, '');
				
				// If caching set to true	
				if(self.options.cached) {
					
					// Store cache in localStorage with options
					self.cache.set(self.options.key, data);
					
				}
				
				// Only run success methods if they are set in options
				if(typeof success === 'function') {
					
					// Run the success callback provided in iotions
					success(data);
					
				} else {
					
					//dev.info('data', data);
					
					// Run the ajaxify parse method
					self.parse(data);
					
				}
				
			});
			
			// The fail callback handles callbacks when ajax fails
			ajaxified.fail(function(response, statusText) {
				
				// Create new event when the ajax request starts
				$(window).trigger('ajaxify.requestFailed');
				
				// Only run failure methods if they are set in options
				if(typeof failure !== 'function') { return; }
				
				// Run the failure callback provided in options
				fail(response, statusText);
				
			});
			
		},
		
		self.cache = {
		
			set: function(key, data) {
				
				// If caching is set to false, get out
				if(!self.options.cached) { return; }
				
				// Set a time(in hours) to hold the cache
				var ttl = localStorage.getItem(key + '_ttl');
				
				dev.log('ttl', ttl);
				
				// Create a json string before caching
				var data = JSON.stringify(data);
				
				// Run a try / catch to catch exceptions
				try {
					
					// Set data to the localStorage cache
					localStorage.setItem(key, data);
					
				} catch(e) {
					
					// Remove incomplete data from cache
					localStorage.removeItem(key);
					
					// Remove cache copy with a _ttl stamp
					localStorage.removeItem(key + '_ttl');
					
					// If cache error is setup, run it
					if(self.options.cacheError) {
						
						// Call the error callback method set in options
						self.options.cacheError(e, key, data);
						
					}
					
				}
				
				// If no ttl is set, or it is expired
				if(!ttl || ttl === 'expired') {
					
					// Setup a cache copy with a timestamp, to reference later
					localStorage.setItem(key + '_ttl', +new Date() + 1000 * 60 * 60 * self.options.duration);
					
				}
                
                return data;
                
			},
			
			get: function(key) {
				
				// If caching is set to false, get out
				if(!self.options.cached) { return; }
				
				// Lookup the cache by key option in localStorage
	            var _cache = localStorage.getItem(key);
	            
	            // Time remaining before our cache expires
	            var ttl = localStorage.getItem(key + '_ttl');
	            
	            // If the cache data is expired, get rid of it
	            if(ttl && ttl < +new Date()) {
	                
	                // Remove the cache data from localStorage
	                self.cache.destroy(key);
	                
	                // Set ttl to expired
	                ttl = 'expired';
	                
	            }
	            
	            // Parse the cache JSON string before returning
	            _cache = JSON.parse(_cache);
	            
	            return _cache;
			},
			
			destroy: function(key) {
				
				// Destroy the cache data from localStorage
                localStorage.removeItem(key);
                
                // Destroy the cache copy with timestamp
                localStorage.removeItem(key + '_ttl');
				
			}
			
		},
		
		self.clean = {
			
			links: function(data) {
				
				// PERF: use nativ for loop, not .each()
				
				if(!self.options.clean.links) { return; }
				
				// Setup base url to create links
				var base = Visualyze.urlBuilder(self.options.url);
				
				// Make sure data is a jQuery object
				var data = self.isJquery(data);
				
				// Get all the links from data
				var links = data.find('a');
				
				// Loop through all found links
				links.each(function() {
					
					// A single link from data
					var link = $(this);
					
					// The single link's hrefs
					var lurl = link.attr('href');
					
					// The single link's target
					var ltar = link.attr('target');
					
					// Make sure link's href is a string
					if(typeof lurl === 'string') {
						
						// If link is not already absolute
						if(lurl.substring(0, 4) !== 'http') {
							
							// Build new absolute link
							var abso = base + lurl;
							
							// Set absolute href to link
							link.attr('href', abso);
							
						}
					
					}
					
				});
				
				return data;

			},
			
			images: function(data) {
			
				if(!self.options.clean.images) { return; }
			
				// PERF: use nativ for loop, not .each()
				
				// Setup base url to create img src
				var base = Visualyze.urlBuilder(self.options.url);
				
				// Make sure data is a jQuery object
				var data = self.isJquery(data);
				
				// Get all the images from data
				var images = data.find('img');
				
				// Loop through all found images
				images.each(function() {
				
					// A single image from data
					var img = $(this);
					
					// The single link's hrefs
					var iurl = img.attr('src');
					
					// Make sure link's href is a string
					if(typeof iurl === 'string') {
						
						// If link is not already absolute
						if(iurl.substring(0, 4) !== 'http') {
							
							// Build new absolute link
							var abso = base + iurl;
							
							// Set absolute href to link
							img.attr('src', abso);
							
						}
					
					}
					
				});
				
				return data;
				
			}
			
		},
		
		self.parse = function(data) {
			
			// Make sure data is a jQuery object
			var data = self.isJquery(data);
			
			// If clean links option is true
			if(self.options.clean.links) {
				
				// Clean all links inside of data
				data = self.clean.links(data);
				
			}
			
			// If clean images option is true
			if(self.options.clean.images) {
				
				// Clean all images inside of data
				data = self.clean.images(data);
				
			}
			
			// Get all elements on the page to append to
			var elems 	= $(self.options.scoped).find(self.options.elem);
			
			// Cache the element array length for better perf
			var count 	= elems.length;
			
			// Cache the iterator for better perf
			var i 		= 0;
			
			// Loop through all 'elems' found on the page
			for(i; i < count; i++) {
				
				// The element to append data to
				var recieve = $(elems[i]);
				
				// Elements store in the 'data-ajaxify' attr
				var ajaxify = recieve.attr('data-ajaxify');
				
				// Element to append to the page
				var arrive	= data.find(ajaxify);
				

				// If the 'arrive' element wasn't found, custom event & exit
				if(arrive.length === 0) { 
					
					// Fire new event when the ajax request is done
					$(window).trigger('error.ajaxify', {
						
						name: 'elementNotFound',
						msg : 'There was a problem loading this content. Please try again.',
						desc: 'The element from "data-ajaxify" could not be located in the ajax response. Check spelling and selector type.'
						
					});

					return false;
					
				}
				
				// If effect option is set to 'flash'				
				if(self.options.effect === 'flash') {
					
					// Show data on the page with now animation
					self.effects.flash(recieve, arrive);
					
				}
				
				// If effect option is set to 'fade'
				if(self.options.effect === 'fade') {
					
					// Fade in the content to the page
					self.effects.fade(recieve, arrive);
					
				}
				
				// Append the ajax flag				
				if(!recieve.attr('data-ajaxified', 'true')) { recieve.attr('data-ajaxified', 'true') };

			}
			
			$(function() {		
				
				// Fire custom event when plugin is done & doc is ready
				$(window).trigger('ajaxify.contentParsed');
			
			});
			
		},
		
		self.domStore = function(key, value) {
			
			
			
		}

		self.effects = {
			
			flash: function(recieving, arriving) {
				
				// If the replace option is set to true
				if(self.options.replace) {
					
					// Replace content with new content
					recieving.html(arriving);
					
				} else {
					
					// Append new content to elem
					arriving.appendTo(recieving);
					
				}
				
			},
			
			fade: function(recieving, arriving) {
				
				// Hide the content so we can fade it
				arriving.hide();
				
				// If the replace option is set to true
				if(self.options.replace) {
					
					// Replace content with new content, fade in
					recieving.html(arriving.fadeIn(self.options.speed));
					
				} else {
					
					// Append new content to elem, fade in
					arriving.appendTo(recieving).fadeIn(self.options.speed);
					
				}
				
			}	
			
		},

		self.isJquery = function(data) {
			
			// If data is already a jQuery object
			if(data instanceof jQuery) {
				
				// Do nothing different
				data = data;
				
			} else {
				
				// Convert to jQuery object
				data = $(data);
				
			}
			
			return data;
			
		}
		
		self.init();		
		
	};
	
})(jQuery, this, this.document);