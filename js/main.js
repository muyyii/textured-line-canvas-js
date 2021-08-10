// https://twitter.com/zovirl/status/1324155476863459329?s=21

let canvas, c, w, h;
let loaded = false;
let textureData;
let colores = false;
let loadedImg = false;
let spLine = {x1:12, y1:12, x2:30, y2:17};
let buttons = [{x:85, y:135},{x:197, y:166}];
let drag,click;
let spiral = {x:130, y:300};


window.onload = (event) => {
	loaded = true;
	
	//---- Setting up straightforward canvas
	canvas = document.getElementById("canvas");
	c = canvas.getContext("2d");

	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;

	c.imageSmoothingEnabled = false; 

	c.fillStyle = "#000";
	c.fillRect(0,0, w, h);
	c.drawImage(textureMap, 10, 10);
	
	textureData = c.getImageData(10, 10, 32, 32);
	
	bLine(spLine.x1 + 10, spLine.y1 + 10, spLine.x2 + 10, spLine.y2 + 10);
	
	c.drawImage(canvas, 10, 10, 32, 32, 10, 60, 200, 200);
	
	loadedImg = true;
	
	drawButtons();
	drawSpiral();
};

function getLineColors(x0, y0, x1, y1){
	let data = [];
	let r,g,b;
	let dx = Math.abs(x1-x0);
  	let dy = -Math.abs(y1-y0);

	let sx = x0<x1 ? 1 : -1;
	let sy = y0<y1 ? 1 : -1;

	let err = dx+dy;  /* error value e_xy */
	while (true){     /* loop */

		r = textureData.data[y0 * (32 * 4)+ x0 * 4];
		g = textureData.data[y0 * (32 * 4)+ x0 * 4 + 1];
		b = textureData.data[y0 * (32 * 4)+ x0 * 4 + 2];

		data.push({r,g,b});

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

	return data;
}

function drawRapido(x,colData){
	c.fillStyle = "#000";
	c.fillRect(300+x,90,10,10*32);
	for(let i=0; i<colData.length; i++){
		r = colData[i].r;
		g = colData[i].g;
		b = colData[i].b;
		c.fillStyle = "rgb("+ r +"," + g + ","+ b +")";
		c.fillRect(300+x,90+10*i,10, 10);
	}
}

function paintBack(){
	c.fillStyle = "#000";
	c.fillRect(0,0,270, 220);
	c.drawImage(textureMap, 10, 10);
	bLine(spLine.x1 + 10, spLine.y1 + 10, spLine.x2 + 10, spLine.y2 + 10);
	c.drawImage(canvas, 10, 10, 32, 32, 10, 60, 200, 200);
}

//---- There sure are better ways to approach this but mine will use imageData.
//---- following this line algorith cause I'm too lazy to think my own 
//---- https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

function dCircle(x, y, r){
	c.fillStyle = "#55bbff";
	c.beginPath();
	c.arc(x, y, r, 0, Math.PI*2, false);
	c.fill();
}

function drawButtons(){
	for(let i=0; i<buttons.length; i++){
		dCircle(buttons[i].x, buttons[i].y, 10);
	}
}

function checkDist(x1, y1, x2, y2, r){
	// Check radial distance betwen 2 points and a range
	let distance = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	if(distance < r) return true;
	else return false;
}

function getCoordFromArea(xi, yi, xl, yl, resx, resy, x, y){
	let xd = xl - xi;
	let yd = yl - yi;
	let xx = x - xi;
	let yy = y - yi;
	let xn = Math.floor(resx*xx/xd)
	let yn = Math.floor(resy*yy/yd)
	return {x:xn, y:yn}
}

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
	if(click){
		for(let i=0; i<buttons.length;i++){
			if(checkDist(buttons[i].x, buttons[i].y, mx, my, 10)) drag=i+1;
		}
		if(drag){
			buttons[drag-1].x = mx;
			buttons[drag-1].y = my;
			if(mx > 10 && mx < 210 && my > 60 && my < 260){
				if(drag-1==0){
					let transform = getCoordFromArea(10, 60, 210, 260, 32, 32, mx, my);
					spLine.x1 = transform.x;
					spLine.y1 = transform.y;
				}else{
					let transform = getCoordFromArea(10, 60, 210, 260, 32, 32, mx, my);
					spLine.x2 = transform.x;
					spLine.y2 = transform.y;
				}
			}
		}
		if(loadedImg) {
			paintBack();
			colores = getLineColors(spLine.x1, spLine.y1, spLine.x2, spLine.y2);
			drawRapido(0, colores);
			if(checkDist(400, 150, mx, my, 145))bLine(400, 150, mx, my, colores);
		
			if(checkDist(spiral.x, spiral.y, mx, my, 30)){
				spiral.x = mx;
				spiral.y = my;
				drawSpiral(colores);
			}
		}
		drawButtons();
	}
}

function bLine(x0, y0, x1, y1, cData = false){
	let dx = Math.abs(x1-x0);
	let dy = -Math.abs(y1-y0);
	let sx = x0<x1 ? 1 : -1;
	let sy = y0<y1 ? 1 : -1;

	let distance = Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1))

	let err = dx+dy;  /* error value e_xy */
  
  while (true){     /* loop */
	  if(cData){
		  let newDist = Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));
		  newDist = distance - newDist; 
		  let i = Math.round(newDist * (cData.length-1)/distance);
		  r = cData[i].r;
		  g = cData[i].g;
		  b = cData[i].b;
		  c.fillStyle = "rgb("+ r +"," + g + ","+ b +")";
		  c.fillRect(x0, y0, 1, 1);

	  }else{
	      c.fillStyle = "#cc0000";
		  c.fillRect(x0, y0, 1, 1);
	  }

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
  
  return {x:Math.round(fx), y:Math.round(fy)};
}

function component(){

}

function drawSpiral(cData){
	for(let i=0; i<=20; i++){
		let arc = (2*3.1415)/20;
		let angle = i*arc;
		let final = getArcCoord(spiral.x, spiral.y, 20, angle)
		bLine(spiral.x, spiral.y, final.x, final.y, cData);
	}
}

