/*

	The Backstage Plugin

	Author: 	Josh McDonald
	Twitter:	@onestepcreative
	Github:		github.com/onestepcreative
	
	This plugin allows you to make to create simple 
	off-canvas content / menus with an easy combination 
	of classes and data attributes. 

*/

;(function($, window, document, undefined) {

	'use strict';

	Visualyze.libs.backstage = {
		
		name: 'backstage',
		
		version: '2.0.1',
		
		init: function(scope, method, settings) {
			
			// This method should be re-worked to use the new bindings method
			
			var self = this;

			self.events.attach(self);
				
						
		},
		
		events: {
		
			attach: function(scope) {
				
				var self = scope;
				
				$('[data-action]').on('click', self.events.open);
				
				$('.backstage-surface').on('click', self.events.close);
				
			},
			
			open: function(e) {
			
				e.preventDefault();

				var target		= $(e.currentTarget).attr('data-action');
				
				dev.log(e.currentTarget);
				
				// The content DOM lookup needs to be re-written to use the new core functionality I wrote
				
				var backstage 	= $('.backstage-container');
				var surface		= $('.backstage-surface');
				var bsname 		= target.replace(/backstage-/, '');
				var bsnode 		= $('[data-backstage="' + bsname + '"]');

				var classes		= bsnode.attr('class');
				var animate		= classes.match(/(move)+(-\w+){1}/)[0];
				
				bsnode.addClass('active');
				
				$('body').addClass('site-' +  animate).addClass('backstage-active');
				//$('body').addClass('site-' + animate);

			},
			
			close: function(e) {
			
				e.preventDefault();

				if(!$('body').hasClass('backstage-active')) { return false };
				
				var backstage 	= $('.backstage-container');
				var active		= $('.backstage.active');
				var classes 	= $('.backstage.active').attr('class');
				var animate 	= classes.match(/(move)+(-\w+){1}/)[0];
				
				//backstage.find('.backstage.active').removeClass('active');
				
				$('body').removeClass('site-' +  animate).removeClass('backstage-active');
				
				active.removeClass('active');
				
				//$('body').removeClass(animate);
				
			}
			
		}

	}


})(jQuery, this, this.document);


