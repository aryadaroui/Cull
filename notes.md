# `<img>` is a bit faster than `<canvas>`

Loading an img with

```js
img_node.src = path_str
```

is faster than loading the same image with

```js
image.src = path_str
ctx.drawImage(image, ...)
```

This was expected, but now there is empirical evidence. To get times, used the general pattern,

```js
const start_time = new Date().getTime();
image.onload = () => {
  const load_time = new Date().getTime() - start_time;
  console.log(`Image loaded in ${load_time}ms`);
};
```

The `<img>` method feels a bit snappier too.

## `<img>` times in ms

```
4
4
5
6
4
5
5
5
4
5
5
```

## `<canvas>` times in ms

with single Image

```
13
13
13
7
4
5
8
6
5
6
5
```