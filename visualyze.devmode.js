/*

	I built this quick console helper to give me an easier
	way to display different types of messages to the console
	while I'm developing. I chose not to use the default console
	method styles, because often times I don't need the extra data 
	that comes along with them. This also provides a good way to 
	easily turn off console statements that are used within the
	"dev" namespace. Usage:
	
	To activate these tools:
	DEV_MODE = TRUE
	
	
	
	Simple helper methods:
	dev.mode()			- check to see if tools are available
	dev.check()			- quickly check the state of a boolean value
	
	
	
	Available console methods:
	dev.log()			- your default console.log statement
	dev.info()			- logs bright blue text	
	dev.warn()			- logs dull yellow text
	dev.error()			- logs bright red text
	dev.start()			- logs bright green text...
	dev.end()			- ...logs bright red text
	
	
	
	Just for shorter syntax:
	dev.group()			- nested block of console statements
	dev.groupEnd()		- closes most recently opened group
	dev.profile()		- turns on the js profiler
	dev.profileEnd()	- turns off the js profiler

*/



DEV_MODE = true; // Must be 'true' to use tools



window.dev = {

    log: function(msg, obj) {
        
        if(dev.enabled()) {
        
        	if(arguments.length === 2) {
	        	
	        	if(typeof msg === 'string') {
		        	
		        	console.log(' ' + msg + ':', obj);
		        	
	        	} else {
		        	
		        	console.log(' ', obj);
		        	
	        	}
	        	
        	} else {
	        	
	        	obj = msg;
	        	
	        	console.log(obj);
	        	
        	}

		}
        
    },

    info: function(msg, obj) {
        
        obj = (obj) ? obj : '';
        
    	if(dev.enabled()) console.log('%c ' + msg, 'color: #00F;', obj);    
        
    },
    
    warn: function(msg, obj) {
        
        obj = (obj) ? obj : '';
        
    	if(dev.enabled()) console.log('%c ' + msg, 'color: Gold;', obj);    
        
    },
    
    error: function(msg, obj) { 
    	
    	obj = (obj) ? obj : '';
    	
    	if(dev.enabled()) console.log('%c ' + msg, 'color: #F00;', obj);
    	
    },
    
    start: function(msg, obj) {
        
        obj = (obj) ? obj : '';
        
    	if(dev.enabled()) console.log('%c ...Started... ' + msg, 'color: LightGreen; font-weight:bold;', obj);    
        
    },
    
    end: function(msg, obj) {
        
        obj = (obj) ? obj : '';
        
    	if(dev.enabled()) console.log('%c ...Ended... ' + msg, 'color: #F00; font-weight:bold;', obj);    
        
    },
    
    group: function(title) {
        
        obj = (obj) ? obj : '';
        
    	if(dev.enabled()) console.group(title);    
        
    },
    
    groupEnd: function() {
        
        obj = (obj) ? obj : '';
        
    	if(dev.enabled()) console.groupEnd();    
        
    },
    
    profile: function(title) {
        
    	if(dev.enabled()) {
    	
    		(title) ? console.profile(title) : console.profile();
    		
    	}    
        
    },
    
    profileEnd: function(title) {
        
    	if(dev.enabled()) {
	    	
	    	(title) ? console.profileEnd('End Profile: ' + title) : console.profileEnd('End Profile');	
	    	
    	}    
        
    },
    
    check: function(state, msg) {
	    
		if(dev.enabled()) console.log('%c ' + state + ':', 'color: Fuchsia; font-weight:bold', msg);
	    
    },
    
	mode: function(msg) {
	
		if(dev.enabled()) {
	
			console.log('%c DEV MODE IS ON', 'color: #0F0; font-weight:bold');
	
		} else {
	
			console.log('%c DEV MODE IS OFF', 'color: #F00; font-weight:bold');
	
		}
	
	},

    enabled: function() { return (window.console && DEV_MODE) ? true : false; }
    
};
