/*

	The Treehouse Plugin

	Author: 	Josh McDonald
	Twitter:	@onestepcreative
	Github:		github.com/onestepcreative
	
	This plugin allows was built to be used
	in a CrystalCommerce front-end to display
	shop categories in different ways. 

*/


;(function($, window, document, undefined) {

    'use strict';

    Visualyze.libs.treehouse = {

		name: 'treehouse',
		
		version: '2.1.1',
		
		cache: {},
		
		options: {
			
			trigger: $('#tree-trigger'),
			
			style: 'offcanvas',
			
			title: true,
			
			icons: true,
			
			direction: 'move-left'
			
		},
		
		init: function(scope, settings) {
			
			// Maintain reference to library
		    var self = this;
		    
		    // Make sure scope is jQuery
		    scope = $(scope);
			
			// If custom settings were passed, merge with defaults
		    if(typeof options === 'Object') {
		    	
			    // Recursively merge settings passed with default options
			    //$.extend(true, settings, options);
			    
			    // When settings object is passed, recursively merge with defaults
			    self.settings = $.extend(true, self.options, (settings || method));
		    
		    } else {
			    
			    // Otherwise, just use defaults
			    self.settings = settings;
			    
		    }
		    
		    // Insert browse title if needed
		    self.title(settings.title);
		    
		    // Insert toggle icons based on style
		    self.icons(settings.style)
		    
		    // Only instantiate offcanvas style for medium & below
		    if(mqs.small || mqs.medium) {
			    
				// Start new instance of offcanvas tree
				new OffcanvasTree(scope, settings);    
			    
		    } else {
			    
				// Init category tree instance based on style setting
			    if(settings.style === 'flyout') {
				    
				    // Start new instance of flyout tree
					new FlyoutTree(scope, settings); 
				    
			    } else if(settings.style === 'dropdown') {
			    	
			    	 // Start new instance of dropdown tree
			    	new DropdownTree(scope, settings);
			    
			    } else if(settings.style === 'accordion') {
			    	
			    	 // Start new instance of accordion tree
			    	new AccordionTree(scope, settings);
			    
			    } else {
				    
					// Start new instance of offcanvas tree
					new OffcanvasTree(scope, settings);   
				    
			    }    
			    
		    }
		    
		    
			
		},
		
		title: function(setting) {
			
			// If setting returns false, get out
        	if(!setting) { return false; }
        	
        	// Maintain reference to plugin object
        	var self = this;
        	
        	// Set title text to var for perf
        	var title; 

        	// If setting is a string (custom text)
        	if(typeof setting === 'string') {
	        	
	        	// Set label to setting
	        	title = setting;
	        
        	} else {
	        	
	        	if(viz.buylist) {
		        	
		        	// Set buylist mode label text
		        	title = 'Browse Buylist';
		        	
	        	} else {
		        	
		        	// Set buylist mode label text
		        	title = 'Browse Store';
		        	
	        	}
	        	
        	}
        	
        	// Append the title above the category tree
        	$(self.scope).prepend('<h4 class="title">' + title + '</h4>');	
			
		},
		
		icons: function(style) {
			
			// If setting or style returns false, get out
        	if(!style) { return false; }
        	
        	// Maintain reference to plugin object
        	var self = this;
        	
        	// Store the jQuery scope to var
        	var scope = $(self.scope);
        	
        	// Set tree depths to vars for perf
        	var d1 = scope.find('ul.categories').find('li.depth-1.noleaf').find('> a').find('.icon');
        	var d2 = scope.find('ul.categories').find('li.depth-2.noleaf').find('> a').find('.icon');
        	var d3 = scope.find('ul.categories').find('li.depth-3.noleaf').find('> a').find('.icon');
        	var d4 = scope.find('ul.categories').find('li.depth-4.noleaf').find('> a').find('.icon');
        	var d5 = scope.find('ul.categories').find('li.depth-5.noleaf').find('> a').find('.icon');
        	
        	if(style === 'flyout') {
	        	
	        	// Add right angle arrow to depth-1
	        	d1.addClass('fa-angle-right');
	        	
	        	// Add down angle arrow to all others
	        	d2.addClass('fa-angle-down');
	        	d3.addClass('fa-angle-down');
	        	d4.addClass('fa-angle-down');
	        	d5.addClass('fa-angle-down');	
	        	
        	} else if(style === 'dropdown') {
	        	
	        	// Add down angle arrow to depth-1
	        	d1.addClass('fa-angle-down');
	        	
	        	// Add right angle arrow to depth-2
	        	d2.addClass('fa-angle-right');
	        	
	        	// Add down angle arrow to all others
	        	d3.addClass('fa-angle-down');
	        	d4.addClass('fa-angle-down');
	        	d5.addClass('fa-angle-down');	
	        	
        	} else if(style === 'accordion' || style === 'offcanvas') {
	        	
	        	// Add down angle arrow to all depths
	        	d1.addClass('fa-angle-down');
	        	d2.addClass('fa-angle-down');
	        	d3.addClass('fa-angle-down');
	        	d4.addClass('fa-angle-down');
	        	d5.addClass('fa-angle-down');	
	        	
        	}
			
		}

	};
	
	var FlyoutTree = function(scope, options) {
	
		var self = this;
		
		self.init = function(scope, settings) {
		
			// If style isn't set to offcanvas, get out
			if(settings.style !== 'flyout') { return false; }
			
			// Remove default scrollable class from cat tree
			scope.removeClass('scrollable');
			
			// Add offcanvas class so we can properly style
			scope.addClass('flyout');
			
			// Move category tree from backstage to catcher
			self.reflow();
			
			// Attach any events for offcanvas cat tree
			self.events.attach();
		
		},
		
		self.events = {
		
			attach: function() {
			
				// Reference to nonleaf categories within scope
				var nonleafs 	= scope.find('li.noleaf');
				
				// Store reference to leaf categories in scope
				var leafs 		= scope.find('li.leaf');
				
				// Bind mouse-enter callback to depth-1 list items
				$('li.depth-1.noleaf').on('mouseenter.tree.flyout', self.events.enter);
				
				// Bind mouse-leave callback to depth-1 list items
				$('li.depth-1.noleaf').on('mouseleave.tree.flyout', self.events.leave);
				
				// Bind callback to noleaf direct child anchor click
				nonleafs.on('click.tree.flyout', '> a', self.events.toggle);
			
			},
			
			toggle: function(event) {
			
				// Prevent linking on noleaf categories
				event.preventDefault();
				
				// Assign clicked element to var for perf
				var element = $(event.delegateTarget);
				
				// Reference first placeholder sibling of element
				var subtree = element.find('> .sub-categories');

				// Toggle logic depending on element state
				if(element.is('.active')) {
					
					// If not active, run the open method
					self.events.close(element, subtree);
					
				} else {
					
					// If active, run the close method
					self.events.open(element, subtree);
				
				}
			
			},

			enter: function(event) {
			
				// Assign hovered element to var
				var element = $(event.currentTarget);
				
				// Assign target child sub tree to var
				var subtree = element.find('> .sub-categories');
				
				// Add active class to hovered element
				element.addClass('active');
				
				// Add active class to child sub tree
				subtree.addClass('active');		
				
			},
			
			leave: function(event) {
				
				// Assign hovered element to var
				var element = $(event.currentTarget);
				
				// Assign target child sub tree to var
				var subtree = element.find('> .sub-categories');
				
				// Get all active elements in the cat tree
				var active = scope.find('.active');
				
				// Remove active class from hovered element
				element.removeClass('active');
				
				// Remove active class from sub tree
				subtree.removeClass('active');
				
				// Remove active class from active elements
				active.removeClass('active');	
				
			},

			open: function(element, subtree) {
			
				// @param element (jQuery Object) the events delegate target
				// @param subtree (jQuery Object) elements direct child sub tree
					
				// Get active list item parent element
				var wrap = element.parent();

				// Make copy of the direct child sub categories
				var clone = subtree.clone().addClass('active');
				
				// Reference to all sibling active elements
				var active	= wrap.find('.active');
				
				// Reference to all sibling active elements
				var holders	= wrap.find('.placeholder');
				
				// Reference first placeholder sibling of element
				var holder = element.nextAll('.placeholder:first');
				
				// Slide up the active placeholder & remove class
				holder.slideUp(250, function() {
					
					// Remove active class from siblings + nested
					active.removeClass('active');
					
				});
				
				// Remove all markup from placeholders
				holders.empty();
				
				// Add active class to element
				element.addClass('active');
				
				// Make holder active & append tree copy
				holder.append(clone).slideDown(300);
			
			},
			
			close: function(element, subtree) {
			
				// @param element (jQuery Object) the events delegate target
				// @param subtree (jQuery Object) elements direct child sub tree
					
				// Reference first parent sub-categories of element
				var wrap = element.parent();
				
				// Reference first placeholder sibling of element
				var clone = subtree.clone().addClass('active');
				
				// Reference first placeholder sibling of element
				var holder = element.nextAll('.placeholder:first');
				
				// Remove active class from element
				element.removeClass('active');
				
				// Slide holder up then empty it
				holder.slideUp(250, function() {
					
					// Remove markup from placeholder
					holder.empty();
					
				});
			
			},
			
			off: function() {
				
				scope.off('.tree.flyout');
				
			}
		
		};
		
		self.reflow = function() {
			
			// If window is less than the large breakpoint
			if(mqs.small || mqs.medium) { return false; }
			
			// Kill off all existing click events
			scope.off('click');
			
			// Move tree markup to cat tree catcher
			$('#tree-house').addClass('side-box').append(scope);	
			
		};
		
		self.init(scope, options);
	
	};
	
	var DropdownTree = function(scope, options) {
	
		var self = this;
		
		self.init = function(scope, settings) {
			
			// Remove default scrollable class from cat tree
			scope.removeClass('scrollable');
			
		},

		self.events = {
		
			attach: function() {},
			
			toggle: function(event) {},
			
			enter: function(event) {},
			
			leave: function(event) {},
			
			open: function(element, subtree) {},
			
			close: function(element, subtree) {},
			
			off: function() {},
		
		},
		
		self.reflow = function() {};
		
		self.init(scope, options);
	
	};
	
	var AccordionTree = function(scope, options) {
	
		var self = this;
		
		self.init = function(scope, settings) {
			
			// If style isn't set to offcanvas, get out
			if(settings.style !== 'accordion') { return false; }
			
			// Add offcanvas class so we can properly style
			scope.addClass('accordion');
			
			// Move category tree from backstage to catcher
			self.reflow(scope);
			
			// Attach any events for offcanvas cat tree
			self.events.attach(scope);
			
		},

		self.events = {
		
			attach: function(scope) {
				
				// Get all noleaf list items in tree
				var links = scope.find('li.noleaf');
				
				// Bind event callbacks to noleaf items
				links.on('click.tree.accordion', '> a', self.events.toggle);
				
			},
			
			toggle: function(event) {
				
				event.preventDefault();
				
				// Assign delegate target to var
				var element = $(event.delegateTarget);
				
				// Assign target parent li to var
				var subtree = element.find('> .sub-categories');
				
				// Open/Close tree based on clicked element
				if(element.is('.active')) {
					
					// Close tree if already active
					self.events.close(element, subtree);	
					
				} else {
					
					// Open tree if not already active
					self.events.open(element, subtree);	
					
				}
				
				
			},
			
			open: function(element, subtree) {
				
				// Get active list item parent element
				var wrap = element.parent().find('.active');
				
				// Remove the active class from wrap
				wrap.removeClass('active');
				
				// Add active class to clicked element
				element.addClass('active');
				
				// Add active class to child sub tree
				subtree.addClass('active');	
				
			},
			
			close: function(element, subtree) {
				
				// Remove active class from clicked element
				element.removeClass('active');
				
				// Remove active class from child sub tree
				subtree.removeClass('active');	
				
			},
			
			off: function(scope) {
				
				// Kill all events for flyout tree
				scope.off('.tree.accordion');
				
			},
		
		};

		self.reflow = function(scope) {
			
			// If window is less than the large breakpoint
			if(mqs.small || mqs.medium) { return false; }
			
			// Kill off all existing click events
			scope.off('click');
			
			// Move tree markup to cat tree catcher
			$('#tree-house').addClass('side-box').append(scope);
			
		},
		
		self.init(scope, options);
	
	};

	var OffcanvasTree = function(scope, options) {
	
		var self = this;
		
		self.init = function(scope, settings) {
			
			// Add offcanvas class so we can properly style
			scope.addClass('offcanvas');
			
			// Add data attr to utilize backstage plugin
			settings.trigger.removeClass('hide').attr('data-action', 'backstage-tree');
			
			// Attach any events for offcanvas cat tree
			self.events.attach(scope);
			
		},

		self.events = {
		
			attach: function(scope) {
				
				// Get all noleaf list items in tree
				var links = scope.find('li.noleaf');
				
				// Bind event callbacks to noleaf items
				links.on('click.tree.flyout', '> a', self.events.toggle);
				
			},
			
			toggle: function(event) {
				
				event.preventDefault();
				
				// Assign delegate target to var
				var element = $(event.delegateTarget);
				
				// Assign target parent li to var
				var subtree = element.find('> .sub-categories');
				
				// Open/Close tree based on clicked element
				if(element.is('.active')) {
					
					// Close tree if already active
					self.events.close(element, subtree);	
					
				} else {
					
					// Open tree if not already active
					self.events.open(element, subtree);	
					
				}
				
				
			},
			
			open: function(element, subtree) {
				
				// Get active list item parent element
				var wrap = element.parent().find('.active');
				
				// Remove the active class from wrap
				wrap.removeClass('active');
				
				// Add active class to clicked element
				element.addClass('active');
				
				// Add active class to child sub tree
				subtree.addClass('active');	
				
			},
			
			close: function(element, subtree) {
				
				// Remove active class from clicked element
				element.removeClass('active');
				
				// Remove active class from child sub tree
				subtree.removeClass('active');	
				
			},
			
			off: function(scope) {
				
				// Kill all events for flyout tree
				scope.off('.tree.flyout');
				
			},
		
		};

		self.reflow = function() {},
		
		self.init(scope, options);
	
	};

})(jQuery, this, this.document);