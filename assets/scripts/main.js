document.addEventListener("DOMContentLoaded", () => {
  const $navbarBurgers = document.querySelectorAll(".navbar-burger");
  $navbarBurgers.forEach(($el) => {
    $el.addEventListener("click", ($event) => {
      // get the target from the "data-target" attribute
      const target = $el.dataset.target;
      const $target = document.getElementById(target);

      $el.classList.toggle("is-active");
      $target.classList.toggle("is-active");

      $event.stopImmediatePropagation();
    });
  });
    
  document.addEventListener("click", () => {
    $navbarBurgers.forEach(($el) => {
      // get the target from the "data-target" attribute
      const target = $el.dataset.target;
      const $target = document.getElementById(target);

      $el.classList.remove("is-active");
      $target.classList.remove("is-active");
    });
  });
});
