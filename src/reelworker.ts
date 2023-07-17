import ImageBlobReduce from "image-blob-reduce";

const reducer = new ImageBlobReduce();

onmessage = function (e) {
	reducer.toBlob(r.blob(), { max: 150 }).then((blob) => {
		console.log("blob: ", blob);
		// image.src = URL.createObjectURL(blob);
	}
};