

document.addEventListener("keydown", (e) => {
    if(e.key == "w"){
        console.log(window.innerWidth);
    }
});

function startAnimation(){
    document.querySelectorAll(".start").forEach((start, idx) => {
        setTimeout(() => {
            if(start.classList.contains("hero-phone-container")){
                start.style.transform = "translateX(-50%) translateY(0px)";
                start.style.top = "40px";
            } else {
                start.style.transform = "translateY(0px)";
            }
            start.style.opacity = "1";
        }, idx * 400);
    });
}
startAnimation();

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.style.position = "relative";
          entry.target.style.top = "0px";
          entry.target.style.opacity = "1";

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
});
document.querySelectorAll(".scroll-target").forEach(target => {
    observer.observe(target);
});

document.querySelector(".con-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    fetch(form.action, {
    method: form.method,
    body: data,
    headers: { 'Accept': 'application/json' }
    }).then(response => {
    if (response.ok) {
        document.querySelector(".set-thank-modal").style.opacity = "1";
        document.querySelector(".set-thank-modal").style.pointerEvents = "auto";
        form.reset();
    } else {
        console.error("NOT OKAY");
    }
    });
});

if(localStorage.getItem("userId")){
    document.querySelector(".btn-header").setAttribute("href", "/quiz.html?report=true");
    document.querySelector(".btn-header").textContent = "View Results";
}