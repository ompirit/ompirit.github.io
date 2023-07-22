function ready() {
  // Add active class to the current button (highlight it)
  var header = document.getElementById("navbarSupportedContent");
  var btns = header.getElementsByClassName("nav-item");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  const sections = document.querySelectorAll("section");
  const navLi = document.querySelectorAll("nav .navigation ul li");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLi.forEach((li) => {
      li.classList.remove("active");
      if (li.classList.contains(current)) {
        li.classList.add("active");
      }
    });
  });
}


function toggleClassOnClick() {
  const div = document.getElementById("navbarSupportedContent");

  if (div.classList.contains("show")) {
    div.classList.remove("show");
  } else {
    div.classList.add("show");
  }
}

const button = document.getElementById("toggleButton");
button.addEventListener("click", toggleClassOnClick);


document.addEventListener("DOMContentLoaded", ready);
