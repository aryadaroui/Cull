import ImageBlobReduce from "image-blob-reduce";

const reducer = new ImageBlobReduce();

// const reducer = require('image-blob-reduce')();


onmessage = function (e) {
	fetch(e.data[0]).then((r) => {
		console.log(r);
		r.blob().then((blob) => {
			reducer.toBlob(blob, { max: 150 }).then((blob) => {
				// image.src = URL.createObjectURL(blob);
				this.postMessage([blob]);
			});
		});
	});
};