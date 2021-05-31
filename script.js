const canvas = document.querySelector('canvas');
const largeLink = document.querySelector('.btn-large a');
	canvas.width = 800; 
    canvas.height = 400;
	let image = new Image;
	let ball   = new Image;
	
	let ctx = canvas.getContext('2d');
    image.src = './images/2.jpg';
	
	function largeSize () {
		console.log('hello');
		image.src = largeLink.href;
		return false;
	};
    
	
	window.onload = function(){		
		trackTransforms(ctx);
		
		function redraw(){
			// This has nothing do with resizing. It just draws the image, lines and the balls.
	
			// Clear the entire canvas
			var p1 = ctx.transformedPoint(0,0);
			var p2 = ctx.transformedPoint(canvas.width,canvas.height);
			ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
	
			// Alternatively:
			// ctx.save();
			// ctx.setTransform(1,0,0,1,0,0);
			// ctx.clearRect(0,0,canvas.width,canvas.height);
			// ctx.restore();
	
			ctx.drawImage(image,200,5); // The Smiling guy
		}
		redraw();
		
		let lastX=canvas.width/2;
        let lastY=canvas.height/2;
		var dragStart,dragged;

		canvas.addEventListener('mousedown',function(e){
			document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
//offsetX & offsetY come with the event object & return the x & y co-ordinate of pointer respectivly
			lastX = e.offsetX || (e.pageX - canvas.offsetLeft);
//PageX & PageY also return the X,Y co-ordinates where the mouse is clicked in an element i.e canvas
//offsetLeft return the number of px from left side. offsetTop returns px from right side.
			lastY = e.offsetY || (e.pageY - canvas.offsetTop);
			dragStart = ctx.transformedPoint(lastX,lastY);
			dragged = false;
		},false);
		canvas.addEventListener('mousemove',function(e){
			lastX = e.offsetX || (e.pageX - canvas.offsetLeft);
			lastY = e.offsetY || (e.pageY - canvas.offsetTop);
			dragged = true;
			if (dragStart){
				var pt = ctx.transformedPoint(lastX,lastY);
				ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
				redraw();
			}
		},false);
		canvas.addEventListener('mouseup',function(e){
			dragStart = null;
			if (!dragged) zoom(e.shiftKey ? -1 : 1 );
		},false);

		let scaleFactor = 1.1;
		const zoom = function(clicks){
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x,pt.y);
			var factor = Math.pow(scaleFactor,clicks);
			if(factor == 2) return;
			ctx.scale(factor,factor);
			ctx.translate(-pt.x,-pt.y);
			redraw();
		}

		var handleScroll = function(e){
			var delta = e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail : 0;
			if (delta) zoom(delta);
			return e.preventDefault() && false;
		};
		canvas.addEventListener('DOMMouseScroll',handleScroll,false);
		canvas.addEventListener('mousewheel',handleScroll,false);
	};

	
	// Adds ctx.getTransform() - returns an SVGMatrix
	// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
	function trackTransforms(ctx){
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx.getTransform = function(){ return xform; };
		
		var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		var restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		var rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		var translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		var transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
	}

    function addNewImage(src) {
                    
                    gkhead.src = src;

                    gkhead.onload = () => {
                    let w = canvas.width;
                    let nw = img.naturalWidth;
                    let nh = img.naturalHeight;
                    let aspect = nw / nh;
                    let h = w / aspect; // Figures out how much it'll resize the image in ratio.
                    
                    console.log('height', h);
                    canvas.height = h;
                    ctx.drawImage(gkhead, 0, 0, w, h);
                    
                    //ctx.drawImage(imgObj, dx, dy);
                    //ctx.drawImage(imgObj, dx, dy, dw, dh);
                    //ctx.drawImage(imgObj, sx, sy, sw, sh, dx, dy, dw, dh); // Used to call a specific part of the image.
                };
            }
  