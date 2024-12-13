$(document).ready(function() {
  $(".dropdown").hover(
    function() { // Mouse enters the trigger element (dropdown-toggle)
      $(this).find(".dropdown-menu").slideDown(); // Slide down the dropdown menu
    },
    function() { // Mouse leaves the trigger element or the dropdown menu itself
      var currentMenu = $(this).find(".dropdown-menu"); // Store reference to the current dropdown menu

      // Check if the mouse is hovering over the dropdown menu before hiding it
      if (!currentMenu.is(":hover")) {
        currentMenu.slideUp(); // Slide up the dropdown menu only if not hovering over it
      }
    }
  );
});