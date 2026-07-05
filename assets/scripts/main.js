document.addEventListener("DOMContentLoaded", () => {
  const $loaders = document.querySelectorAll(".navbar-loader");
  $loaders.forEach(($loader) => {
    $loader.classList.remove("loading");
    $loader.classList.add("loaded");

    window.setTimeout(() => {
      $loader.classList.remove("loaded");
      $loader.classList.add("idle");
    }, 250);
  });

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

  document.addEventListener("click", ($event) => {
    const $link = $event.target.closest("a[href]");
    if (!$link || $link.target || $link.origin !== window.location.origin) {
      return;
    }

    $loaders.forEach(($loader) => {
      $loader.classList.remove("idle", "loaded");
      $loader.classList.add("loading");
    });
  });
});
