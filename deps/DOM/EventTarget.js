/*
http://www.w3.org/TR/domcore/#eventtarget

interface EventTarget {
  void addEventListener(DOMString type, EventListener? callback, optional boolean capture = false);
  void removeEventListener(DOMString type, EventListener? callback, optional boolean capture = false);
  boolean dispatchEvent(Event event);
};

callback interface EventListener {
  void handleEvent(Event event);
};
 */

define(function(require) {
	var WebIDL = require("WebIDL"),
		IDLBoolean = require("WebIDL/types/Boolean"),
		IDLDOMString = require("WebIDL/types/DOMString"),
		eventManager;

	function EventManager() {
		//The database of registered events
		var register = [];

		function registerObject(obj) {
			var container = {
				owner: obj,
				listeners: {}
			};
			register.push(container);
			return container.listeners;
		}

		this.getListeners = function(obj) {
			for(var i = register.length - 1; i >= 0; i--) {
				if(obj === register[i].owner) {
					return register[i].listeners;
				}
			}
			return registerObject(obj);
		};
	}

	function checkAccess(object) {
        //Check that no one has stolen the method
        if (!(object instanceof EventTarget)) {
            throw new TypeError('Illegal invocation');
        }
    }

	eventManager = new EventManager();

	function EventTarget() {}

	EventTarget.prototype.addEventListener = function(type, listener, capture) {
		var listeners;
		checkAccess(this);
		type = IDLDOMString(type);
		capture = IDLBoolean(capture);
		listeners = eventManager.getListeners(this);
		if(listeners[type] === undefined) {
			listeners[type] = [];
		}

		if(listeners[type].indexOf(listener) === -1) {
			listeners[type].push(listener);
		}
	};

	EventTarget.prototype.dispatchEvent = function(event) {
		var listeners, listenerArray;
		checkAccess(this);
		if(!(event instanceof Event)){
			throw new TypeError("Not an Event");
		}
		listeners = eventManager.getListeners(this),
		listenerArray = listeners[event.type];

		if(listenerArray !== undefined) {
			for(var i = 0, l = listenerArray.length; i < l; i++) {
				listenerArray[i](event);
			}
		}
	};

	EventTarget.prototype.removeEventListener = function(type, listener, capture) {
		var listeners, index;
		checkAccess(this);
		listeners = eventManager.getListeners(this),
		index = listeners[type].indexOf(listener);
		if(index !== -1) {
			listeners[type].splice(index, 1);
		}
	};

	WebIDL.exportInterface(EventTarget, "EventTarget");

	return EventTarget;
});