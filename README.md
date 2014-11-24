#js control Asynchronous
##example1:
```js
var jcaTest = jca();
function f1() {
	//throw new Error('f1 throw error');
	setTimeout(function () {
		console.log('f1');
		jcaTest.emit('This is f1arg!');
	}, 2000);
}
function f2() {
	//throw new Error('f2 throw error');
	setTimeout(function () {
		console.log('f2');
		jcaTest.emit('This is f2arg');
	}, 1000);
}
jcaTest.all(['f1', 'f2'], function () {
	console.log('end');
});
f1();
f2();
```
##example2:
```js
(function () {
	jcaTest.then(function () {f2();}).then(function (kk) {f1();console.log(kk)}).fail(function () {
		console.log('error');
	}).done(true);
})();
```
