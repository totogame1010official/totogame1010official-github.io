function animateImage(img) {
  let x = 100, y = 100;
  let dx = 2, dy = 1.5;

  function move() {
    x += dx;
    y += dy;

    if (x <= 0 || x + img.width >= window.innerWidth) dx = -dx;
    if (y <= 0 || y + img.height >= window.innerHeight) dy = -dy;

    img.style.left = x + "px";
    img.style.top = y + "px";

    requestAnimationFrame(move);
  }

  move();
}
