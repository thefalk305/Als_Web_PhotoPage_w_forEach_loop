# Als_Web_PhotoPage_w_forEach_loop

PhotoPage1.html was rewritten to make use of:

1. Child .html files that contain code common to all the web pages.  This includes the Top nav menu and the common footer.

2. Scripts that create:
  A: 'gallery-data.js' from the original gallery.html (build-gallery-data.js).
  B: 'flip-card's html from 'gallery-data.js'.
  C. Replace the 'Back to Top Scroll Button' and 'Dynamic Clock' inline scripts (scripts.js).

Additional flip-card's (images) can be added to the PhotoPage by adding new objects to the gallery-data.js file.  Just follow the object format already shown.  There is no need to modify index.html.  You can still add flip-card elements directly to index.html but using the gallery-data.js file is easier and cleaner.

