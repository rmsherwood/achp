// Behavior for news page slideshow

(function ($) {

  $(document).ready (function () {

    setCarouselDisplay ();

  })

  /*
    Accepts no arguments, sets the display for the two Flickity
    carousels, attaches a news-num-images attribute to each
    gallery item, and returns undefined.
  */
  function setCarouselDisplay () {
    var maxImagesToDisplay = 4; // TODO: move this to a user-set variable in Drupal
    var numImages = getNumImages ();

    getNavGalleryItems ().toArray ().forEach (function (galleryItem) {
      $(galleryItem).attr ('data-news-num-images-to-display', Math.min(maxImagesToDisplay, numImages));
    })

    if (numImages === 0) {
      hideImageCarousel ();
      hideNavCarousel ();
    } else if (numImages === 1) {
      hideNavCarousel (); 
    } else if (numImages > maxImagesToDisplay) {
      addSliderNavButtons ();
    }
  }

  /*
  Accepts no arguments, attaches the nav buttons to
  the navigator carousel, and returns undefined.
  */
  function addSliderNavButtons () {
    getNavCarousel ()
      .prepend ($('<div></div')
        .addClass('carousel-nav-button')
        .addClass('prev')
        .click (function () {
          slideBackThroughNav ()
        }))
      .append ($('<div></div')
        .addClass('carousel-nav-button')
        .addClass('next')
        .click (function () {
          slideForwardThroughNav ()
        }));
    disableNavPrevButton ();
  }

  /*
    Accepts no arguments and returns a number representing
    the percentage points of theslider's transform: translateX 
    value.
  */
  function getSliderPosition () {
    var navSlider = getNavSlider ();
    var leftPosition = parseInt(navSlider.css('left'));

    var transformMatrix = 
      navSlider.css("-webkit-transform") ||
      navSlider.css("-moz-transform")    ||
      navSlider.css("-ms-transform")     ||
      navSlider.css("-o-transform")      ||
      navSlider.css("transform");

    return transformMatrix.split(',')[4] / navSlider.width () * 100 + leftPosition;
  }

  /*
    Accepts one argument, an integer representing the position
    of the navigation carousel; animates the carousel to that
    position; and returns undefined.
  */
  function setSliderPosition (leftPosition) {
    getNavSlider ().animate({
      left: leftPosition
    }, 500)

    var hiddenImagesWidth = getHiddenImagesWidth ();
    var absValLeft = Math.abs(leftPosition);

    if (absValLeft === hiddenImagesWidth) {
      disableNavNextButton ();
    }
    if (absValLeft === 0) {
      disableNavPrevButton ();
    }
    if (absValLeft > 0) {
      enableNavPrevButton ();
    }
    if (absValLeft < hiddenImagesWidth) {
      enableNavNextButton ();
    }
    // getNavSlider ().addClass ('animated');
    // getNavSlider ().css('-webkit-transform', 'translateX(' + percentage + '%)')
    //   .css('-moz-transform', 'translateX (' + percentage + '%)')
    //   .css('-ms-transform', 'translateX(' + percentage + '%)')
    //   .css('-o-transform', 'translateX(' + percentage + '%)')
    //   .css('transform', 'translateX(' + percentage + '%)');
    // console.log('transform: translateX(' + percentage + '%)')
  }

  /*
    Accepts no arguments, moves the navigation slider forward
    by one image, and returns undefined.
  */
  function slideBackThroughNav () {
    var sliderPosition = getSliderPosition ();

    if (sliderPosition >= -25) {
      setSliderPosition (0);
    } else if (sliderPosition < 0) {
      setSliderPosition (sliderPosition + getGalleryItemWidth ());
    }
  }

  /*
    Accepts no arguments, moves the navigation slider back
    by one image, and returns undefined.
  */
  function slideForwardThroughNav () {
    var sliderPosition = getSliderPosition ();    
    var galleryItemWidth = getGalleryItemWidth ();
    var hiddenImagesWidth = getHiddenImagesWidth ();

    if (Math.abs(sliderPosition) < hiddenImagesWidth) {
      setSliderPosition (sliderPosition - galleryItemWidth);
    } else if (Math.abs(sliderPosition) + 25 >= hiddenImagesWidth) {
      setSliderPosition (-galleryItemWidth);
    }
  }

  /*
    Accepts no arguments, adds the disabled class to the
    previous nav button, and returns undefined.
  */
  function disableNavPrevButton () {
    getNavPrevButton ().addClass('disabled');
  }

  /*
    Accepts no arguments, adds the disabled class to the
    next nav button, and returns undefined.
  */
  function disableNavNextButton () {
    getNavNextButton ().addClass('disabled');
  }

  /*
    Accepts no arguments, removes the disabled class 
  from the previous nav button, and returns undefined.
  */
  function enableNavPrevButton () {
    getNavPrevButton ().removeClass('disabled');
  }

  /*
    Accepts no arguments, removes the disabled class 
    from the next nav button, and returns undefined.
  */
  function enableNavNextButton () {
    getNavNextButton ().removeClass('disabled');
  }     

  /*
    Accepts no arguments and returns the number of image
    elements.
  */
  function getNumImages () {
    return getImageElements ().length;
  }

  /*
    Accepts no arguments and returns an integer representing
    the width of all hidden gallery images.
  */
  function getHiddenImagesWidth () {
    return getGalleryItemWidth () * 
      (getNumImages () - $(getNavGalleryItems ()[0]).attr('data-news-num-images-to-display'));
  }

  /*
    Accepts no arguments and returns an integer representing
    the width of one gallery item element.
  */
  function getGalleryItemWidth () {
    return getNavGalleryItems ().width ()
  }

  /*
    Accepts no arguments and returns a jQuery HTML Element
    that represents the navigator carousel's slider element.
  */
  function getNavViewport () {
    return $('.' + getNavViewportClassName (), getNavCarousel ());
  } 

  /*
    Accepts no arguments and returns a jQuery HTML Element
    that represents the navigator carousel's slider element.
  */
  function getNavSlider () {
    return $('.' + getNavSliderClassName (), getNavCarousel ());
  }  

  /*
    Accepts no arguments and returns an Array representing
    the gallery items in the navigator carousel.
  */
  // function getNavGalleryItemsInArray () {
  //   return getNavGalleryItems().toArray ();
  //   return $('.' + getGalleryItemClassName (), getNavCarousel ()).toArray ();
  // }  

  /*
    Accepts no arguments and returns the gallery items in 
    the navigator carousel.
  */
  function getNavGalleryItems () {
    return $('.' + getGalleryItemClassName (), getNavCarousel ());
  }  

  /*
    Accepts no arguments, hides the main image carousel,
    and returns undefined.
  */
  function hideImageCarousel () {
    getImageCarousel ().hide ();
  }

  /*
    Accepts no arguments, hides the navigator carousel,
    and returns undefined.
  */
  function hideNavCarousel () {
    getNavCarousel ().hide ();
  }

  /*
    Accepts no arguments and returns a jQuery HTML Element
    that represents the main image carousel.
  */
  function getImageCarousel () {
    return $('#block-news-image-carousel');
  }

  /*
    Accepts no arguments and returns a jQuery HTML Element
    that represents the navigator carousel.
  */
  function getNavCarousel () {
    return $('#block-carousel-navigator .navigator');
  }
  
  /*
    Accepts no arguments and returns an HTML Collection of
    the images associated with the story.
  */
  
  function getImageElements () {
    return $('.field_news_photo');
  }

  /*
    Accepts no argumetns and returns a jQuery Element
    representing the next navigation button.
  */
  function getNavNextButton () {
    return $('.' + getNavCarouselClassName () + '.next');
  }

  /*
    Accepts no argumetns and returns a jQuery Element
    representing the previous navigation button.
  */
  function getNavPrevButton () {
    return $('.' + getNavCarouselClassName () + '.prev');
  }

  /*
    Accepts no arguments and returns a string representing
    Flickity's slider element.
  */
  function getNavSliderClassName () {
    return 'flickity-slider';
  }

  /*
    Accepts no arguments and returns a string representing
    Flickity.
  */
  function getNavCarouselClassName () {
    return 'carousel-nav-button';
  }

  /*
    Accepts no arguments and returns a string representing
    the gallery items.
  */
  function getGalleryItemClassName () {
    return 'gallery-cell';
  }  

})(jQuery);