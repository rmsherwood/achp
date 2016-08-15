/*
  Implements event calendar feature.
*/

(function ($) {

  $(document).ready (function () {

    var instance = new FeatureInstance ();
    $('#block-eventsmeetings').append(instance.getInstanceElement ());

  });

  /*
  Accepts no arguments, returns an array of all Event objects.
  */
  function getAllEvents () {
    return [
      { 
        title: 'Section 106 Training',
        start_date: '2015-08-04 15:00', 
        end_date: '2015-08-04 17:00',
        location: 'ACHP Headquarters, Room 337 401 F St NW, Washington DC, 20001',
        description: 'Learn about Section 106',
        url: '/node/3'
      },
      { 
        title: 'Annual Native American Summit',
        start_date: '2016-08-06 14:00',
        end_date: '2016-08-09 17:00',
        location: 'ACHP Headquarters, Room 337 401 F St NW, Washington DC, 20001',
        description: 'Learn about Native American issues',
        url: '/node/4'
      },
      { 
        title: 'Directory Staff Committee Meeting',
        start_date: '2016-08-30 12:00',
        end_date: '2016-09-07 18:00',
        location: 'ACHP Headquarters, Room 337 401 F St NW, Washington DC, 20001',
        description: 'Meeting for staff members.',
        url: '/node/5'        
      }
    ]
  }  

  // I. Defining the feature instance
  /*
  */
  function FeatureInstance () {
    this._instanceElement = createInstanceElement ();
    var bodyElement = this.getBodyElement ();
    this._calendar = new Calendar (bodyElement);
    this._grid = new Grid (bodyElement);
  }

  /*
  Accepts no arguments and returns a jQuery Element representing
  a feature instance.
  */
  function createInstanceElement () {
    var classPrefix = getFeatureClassPrefix ();

    return $('<div></div>')
      .addClass(classPrefix)
      .append ($('<div></div>')
        .addClass(classPrefix + '_header')
        .append ($('<h2></h2>')
          .addClass(classPrefix + '_title')))
      .append ($('<div></div>')
        .addClass(classPrefix + '_body'))
      .append($('<div></div>')
        .addClass(classPrefix + '_footer')
        .append($('<button></button>')
          .addClass(classPrefix + '_full_calendar_button')
          .text('View the full calendar')));
  }

  /*
  */
  FeatureInstance.prototype.getCalendar = function () {
    return this._calendar;
  }

  /*
  */
  FeatureInstance.prototype.getGrid = function () {
    return this._grid;
  } 

  /*
  */
  FeatureInstance.prototype.getInstanceElement = function() {
    return this._instanceElement;
  }

  /*
  Accepts a Moment object, displays the the events matching that 
  date, and returns undefined.
  */
  FeatureInstance.prototype.showEvents = function (date) {
    // TODO: n parameter should be Drupal setting
    this.getGrid ().displayEvents (getNEventsAfterDate (3, date));
  }

  /*
  Accepts one argument, a Moment object, filters through all events to
  determine which ones occur on that date, and returns an Event array
  containing the events that do.
  */
  function filterEvents (date) {
    return getAllEvents ().filter (function (event) { return eventHasDate (event, date); });
  }

  /*
  Accepts two parameters:

  * n, an integer
  * date, a string

  Returns an Event array of the next n events that end on or after date.
  */
  function getNEventsAfterDate (n, date) {
    return getAllEvents()
      .sort(function (event1, event2) {
        return moment(event1.start_date).isSameOrAfter(event2.start_date);
      }).filter (function (event) {
        return moment(event.end_date).isSameOrAfter(date);
      }).slice (0, n);
  }

  /*
  Accepts two arguments:

  * event, an Event object
  * date, a string

  Returns true iff event occurs on same day as given date.
  */
  function eventHasDay (event, date) {
    return moment (event.date).isSame (date, 'day');
  }

  /*
  Accepts no arguments, and returns this instance's body
  element as a jQuery HTML Element.
  */
  FeatureInstance.prototype.getBodyElement = function () {
    return $('.' + instanceBodyClassName (), this.getInstanceElement());
  }

  /*
  Accepts no arguments and returns the instance's body class 
  name as a string.  
  */
  function instanceBodyClassName () {
    return getFeatureClassPrefix () + '_body';
  }  

  /*
  Accepts no arguments and returns a string that represents 
  the standard prefix for feature classes.
  */
  function getFeatureClassPrefix () {
    return getModuleClassPrefix () + '_feature';
  } 

  // II. Defining the calendar component class

  /*
  */
  function Calendar (containerElement) {
    var self = this;
    // Create component element 
    var componentElement = createCalendarComponentElement ();
    var events = _.chain (getAllEvents ())
        .map (function (event) { return getDaysBetween(event.start_date, event.end_date); })
        .flatten ()
        .uniq ()
        .map (function (date) { return { date: date }; })
        .value ();

    // Embed CLNDR element
    componentElement.clndr({
      events: events,
      clickEvents: {
        click: self.onClick
      }
    });


    // Attach component element to container
    containerElement.append (componentElement);
    // customizeCalendarComponentElement (containerElement);
  }

  /*
  Accepts two arguments, strings representing dates. Returns an Array
  of strings representing all the days between startDate and endDate,
  inclusive.
  */
  function getDaysBetween (startDate, endDate) {
    var format = 'YYYY MM DD';
    var dates = [moment(startDate).format(format)];
    for (var date = moment(startDate); date.isBefore(endDate); date.add(1, 'days')) {
      dates.push(date.format(format));
    }
    dates.push(moment(endDate).format(format));
    return dates;
  }

  /*
  */
  function createCalendarComponentElement () {
    var classPrefix = getCalendarClassPrefix ();

    return $('<div></div>')
      .addClass(classPrefix)
      .append ($('<div></div>')
        .addClass(classPrefix + '_header')
        .append ($('<h3></h3>')
          .addClass(classPrefix + '_title')
          .text('Calendar!')))
      .append ($('<div></div>')
        .addClass(classPrefix + '_body')
        .append($('<div></div>')
          .addClass(classPrefix + '_container')));
  }

  /*
  Accepts one argument: target, a CLNDR Target object; and handles click events on
  the embedded CLNDR object.
  */
  Calendar.prototype.onClick = function (target) {
    return;
  }

  /*
  Accepts no arguments and returns a string that
  represents the standard prefix for calendar classes.
  */
  function getCalendarClassPrefix () {
    return getModuleClassPrefix () + '_calendar';
  } 

  // III. Defining the grid component class

  /*
  */
  function Grid (containerElement) {
    this._componentElement = createGridComponentElement ();
    containerElement.append(this._componentElement);
  }

  /*
  Accepts no arguments; returns the Grid object's 
  component element as a jQuery HTML Element.
  */
  Grid.prototype.getComponentElement = function () {
    return this._componentElement;
  }

  /*
  */
  function createGridComponentElement () {
    var classPrefix = getGridClassPrefix ();    

    return $('<div></div>')
      .addClass(classPrefix)
      .append ($('<div></div>')
        .addClass(classPrefix + '_header')
        .append ($('<h3></h3>')
          .addClass(classPrefix + '_title')
          .text('Upcoming Events & Meetings')))
      .append ($('<div></div>')
        .addClass(getGridBodyClassName ()));
  }

  /*
  Accepts one argument: events, an array of Event objects;
  creates card elements to represent those events; displays
  them; and returns undefined.
  */
  Grid.prototype.displayEvents = function (events) {
    getGridBodyElement().empty().append(events.map (createCardElement));
  }

  /*
  Accepts one argument: event, an Event object; and returns
  a jQuery Element representing that event.
  */
  function createCardElement (event) {
    var classPrefix = getGridClassPrefix () + '_card';  

    return $('<div></div>')
      .addClass(classPrefix)
      .append ($('<div></div>')
        .addClass(classPrefix + '_header')
        .append ($('<h4></h4>')
          .addClass(classPrefix + '_title')
          .text(event.title)))
      .append ($('<div></div>')
        .addClass(classPrefix + '_body')
        .append ($('<div></div>')
          .addClass(classPrefix + '_date'))
          .text (moment (event.start_date).isSame (event.end_date, 'day') ?
            moment(event.start_date).format('MMM Do YYYY hh:mm a') + 'to' + moment(event.end_date).format('hh:mm a') :
            moment(event.start_date).format('MMM Do YYYY hh:mm a') + 'to' + moment(event.end_date).format('MMM Do YYYY hh:mm a') 
            )
        .append ($('<div></div>')
          .addClass(classPrefix + '_location')
          .text(event.location)))
      .append($('<div></div>')
        .addClass(classPrefix + '_footer')
        .append ($('<div></div>')
          .addClass(classPrefix + '_read_more')
          .append($('<a></a>')
            .attr('href', event.url)
            .text('READ MORE')))
        .append ($('<div></div>')
          .addClass(classPrefix + '_google_calendar')));
  }

  /*
  Accepts no arguments, and returns the component's body
  element as a jQuery HTML Element.
  */
  function getGridBodyElement () {
    return $('.' + gridBodyClassName (), getComponentElement());
  }

  /*
  Accepts no arguments, and returns a string indicating
  the grid body class name.
  */
  function getGridBodyClassName () {
    return getGridClassPrefix () + '_body';
  }

  /*
  */
  function getGridClassPrefix () {
    return getModuleClassPrefix () + '_grid';
  }


  // IV. Auxiliary functions

  /*
    Accepts no arguments and returns a string that
    represents the standard prefix for all classes
    defined by this module.
  */
  function getModuleClassPrefix () {
    return 'event_calendar';
  } 


}(jQuery));