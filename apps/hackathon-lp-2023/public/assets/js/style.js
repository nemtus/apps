//drawer
jQuery(".drawer-icon").on("click", function (e) {
    e.preventDefault();
    jQuery(".drawer-icon").toggleClass("is-active");
    jQuery(".drawer-content").toggleClass("is-active");
    jQuery(".drawer-background").toggleClass("is-active");
  
    return false;
  });

  // ふわっと
$(window).scroll(function () {
  fadeAnime();
});
function fadeAnime() {
  $(".fuwa").each(function () {
    let target = ($(this).offset().top -= 50);
    let scroll = $(window).scrollTop();
    let windowHeight = $(window).height();

    if (scroll > target - windowHeight + 200) {
      $(this).addClass("fadeUp");
    } else {
      $(this).removeClass("fadeUp");
    }
  });
}