const joker = document.getElementById("joker");

let angle = 0;

function moveJoker(){
    angle += 0.05;
    const x = Math.sin(angle) * 30;  // left-right movement
    const y = Math.cos(angle) * 20;  // up-down movement
    joker.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(moveJoker);
}

moveJoker();
