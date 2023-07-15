// let viewer = new ImageViewer(canvas);
// viewer.set_image('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/A_Stream_of_Stars_over_Paranal.jpg/1920px-A_Stream_of_Stars_over_Paranal.jpg')


export class ImageViewer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	image: HTMLImageElement;
	// aspect_ratio: number; 
	private scale: number;
	private offsetX: number;
	private offsetY: number;

	// mouse_x: number;
	// mouse_y: number;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.set_image('./untitled.jpg');

		// Add event listeners
		const handle_pan_handle = this.handle_pan.bind(this); // needs to be bound to this, otherwise different references are passed in the add/remove
		this.canvas.addEventListener("wheel", this.handle_zoom.bind(this));
		this.canvas.addEventListener("mousedown", () => {
			this.canvas.addEventListener("mousemove", handle_pan_handle);
		});
		this.canvas.addEventListener("mouseup", () => {
			this.canvas.removeEventListener("mousemove", handle_pan_handle);
		});
		window.addEventListener("resize", this.handle_resize.bind(this));

		// add this instance to the window for debugging
		// @ts-ignore
		window.viewer = this;
	}

	set_image(image_url) {
		this.image = new Image();
		this.image.src = image_url;

		this.image.onload = () => {
			// this.aspect_ratio = this.image.width / this.image.height; // not needed
			this.reset();
		};
	}

	reset() {
		this.scale =  this.canvas.clientHeight / this.image.height;
		this.offsetX = Math.abs(this.canvas.clientWidth - this.image.width * this.scale) / 2;
		this.offsetY = 0;
		this.handle_resize();
	}

	private draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(
			this.image,
			this.offsetX,
			this.offsetY,
			this.image.width * this.scale,
			this.image.height * this.scale
		);
	}

	private handle_zoom(event) {
		// console.log("handle_zoom: event", event)
		const zoom_factor = 1.05;
		const mouse_x = event.clientX - this.canvas.offsetLeft;
		const mouse_y = event.clientY - this.canvas.offsetTop;
		const old_scale = this.scale;
		const delta = event.deltaY < 0 ? 1 : -1;
		this.scale *= zoom_factor ** delta;
		const new_scale = this.scale;
		const delta_scale = new_scale - old_scale;
		const delta_x = mouse_x * delta_scale;
		const delta_y = mouse_y * delta_scale;
		this.offsetX -= delta_x;
		this.offsetY -= delta_y;

		this.draw();
	}


	private handle_pan(event) {
		this.offsetX += event.movementX;
		this.offsetY += event.movementY;
		this.draw();
	}

	private handle_resize() {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
		this.draw();
	}
}
