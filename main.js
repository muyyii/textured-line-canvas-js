// https://twitter.com/zovirl/status/1324155476863459329?s=21

//---- Setting up straightforward canvas
const canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d");

let w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;

c.imageSmoothingEnabled = false; 

c.fillStyle = "#000";
c.fillRect(0,0, w, h);

let textureMap = new Image();
textureMap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACRklEQVRYhe2VPWgTYRjHf0lTQw2BowRUsHBdgpMgGAmHtGRIKwXBr4Idqu0mmIBj3R1KJyEWqoOGZigiFMGlpUM0w3FouxRduvSGQgmEcjTWmn4Qh/O95i7JXdTidD84Xp7n7uX/fN37BpZ3J+sAumoAoClPATBUDYC3l1QADvoWAJgYHALg47cNAAav3cSNT58/oFd05Jjccg257u6Qq+cut/SvltddxeWYTGhorQrAz/cxAOL5FwBoZ64DMFY2/TdG5oCTzJ08OfvFZj//kQBwFdcrOsF/ydxJ11SVrqmqzedZgb2Bd+aXA+aSwL46Gcs8stkPR7KuQXlV4FRmQHA8HW3yeVZATHU7hkfvdCQueu7kv1Rgtbze9p1XBQIvl27XZUUitbNPsbeH1M6+tbnY28OcesWyJSVpnQ+SkgTg9dqMa3D3ps+7vg/JimSJ6arBGyCej7IxUQVqlmghnSW7Z/5qhbQ5eMI+7G8uZPfmkauwIKirBuIBWHn2HX4HIRCCIvvxlZzNBvOkPOhboHvzqGNxgMDy7mRdVw2bYFIKAzB/q8ISKVsgQlywGC65Cni1ICjEhWhSCjP+VUczarag4CRzSUlaTysO+0NY54sHwXg+yuzWtiWuGTUeX7zQ9KGkJCmks1Y7cpGE1QKn4B+1oHj/Qd3pnN3atoKYf5UhF0lYAwf23i+GS65D6PkXNIqJSjQGcqxqkE40CQtE5pHSqKtQOwJ3hzNNFWik3VUrcDuEOtl/qrfh3+AH4AfgB+Dj4+PzC7evLNqIHdYjAAAAAElFTkSuQmCC";

c.imageSmoothingEnabled = 0;
c.drawImage(textureMap, 10, 10);
c.drawImage(textureMap, 10, 50, 200, 200);

//---- There sure are better ways to approach this but mine will use imageData.
//---- following this line algorith cause I'm too lazy to think my own 
//---- https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

/*
window.addEventListener('mousemove', e => {
  
  mx = e.offsetX | 450;
  my = e.offsetY | 500;
    
  c.fillRect(mx, my, 40, 40);
   //line(400, 200, mx, my);
});
*/

let drag,click;

document.onmouseup = function(e){
	drag = click = false;
}

document.onmousedown = function(e){
	click = true;
}

document.onmousemove = function(e) {
	var event = e || window.event;
  	mx = event.clientX;
  	my = event.clientY;
  	c.fillStyle = "#fff";
	calc = Math.sqrt((400-mx)*(400-mx)+(150-my)*(150-my)) 
	if(click){
		if(calc<145)bLine(400, 150, mx, my);
	}
}

// let favColor = "#0099cc";
function bLine(x0, y0, x1, y1){
  let dx = Math.abs(x1-x0);
  let dy = -Math.abs(y1-y0);
  
  let sx = x0<x1 ? 1 : -1;
  let sy = y0<y1 ? 1 : -1;
  
  let err = dx+dy;  /* error value e_xy */
  
  while (true){     /* loop */
    c.fillStyle = "#cc0000";
    c.fillRect(x0, y0, 1, 1);
    
    if (x0 == x1 && y0 == y1) break;
    
    e2 = 2*err;
    if (e2 >= dy){ /* e_xy+e_x > 0 */
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx){ /* e_xy+e_y < 0 */
      err += dx;
      y0 += sy;
    }
  }     
}

function getArcCoord(x,y,r,angle){
  fx = x + Math.cos(angle)*r;
  fy = y - Math.sin(angle)*r;
  
  return {x:fx, y:fy};
}

for(let i=0; i<=20; i++){
	
	let arc = (2*3.1415)/20;
	let angle = i*arc;
	let xf = Math.round(130 + Math.cos(angle)*20);
	let yf = Math.round(300 - Math.sin(angle)*20);
	bLine(130, 300, xf, yf);
}

//bLine(130, 300, 130, 300+20);
//final = getArcCoord(30, 200, 20, 0.02);




