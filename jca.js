/**
 * 控制异步并发
 * @{Number} emitSum 异步完成的计数
 * @{Array} emitArr  异步完成的标记数组
 * @{Function} callback 异步完成的回调
 * @{Array} thenFunArr then链中存放异步操作的栈
 * @{Function} failFun then链中抛错的回调
 * @{Boolean} ignoreErr true-then链将忽略错误继续向下执行 ，false则相反
 * @{Object} that 返回的对象
 */
var jca = function (initArg) {
    var emitSum = 0,
        emitArr = null,
        callback = null,
        thenFunArr = [],
        failFun = null,
        ignoreErr = false;
        that = {};
	
	//sum个mark函数或方法完成后，执行myCallback
    var after = function (mark, sum, myCallback) {
        var i;
        if (typeof mark !== 'string') {
            throw 'first arg is not string';
	}
        if (typeof parseInt(sum, 10) !== 'number') {
            throw 'second arg is not number or not be converted to number';
	}
        if (!myCallback instanceof Function) {
            throw 'third arg is not function';
        }
        emitSum = sum;
        for (i = 0; i < sum; i += 1) {
            emitArr[i] = mark;
        }
        callback = myCallback;
    }

    //arr中所有的函数或方法完成后，执行myCallback
    var all = function (arr, myCallback) {
        if (!arr instanceof Array) {
            throw 'first arg is not array';
        }
        if (!myCallback instanceof Function) {
            throw 'second arg is not function';
        }
        emitArr = arr;
        emitSum = arr.length;
        if (emitSum === 0) {
            callback();
        } else {
            callback = myCallback;
        }
    }

    //将要执行的异步操作推入堆中
    var then = function (fun) {
        thenFunArr[thenFunArr.length] = fun;
        return that;
    }

    //异步操作中抛出错误时
    var fail = function (fun) {
        failFun = fun;
        return that;
    }

    //放在then链中的末尾，也是异步操作出堆的开始
    var done = function (myIgnoreErr) {
        ignoreErr = myIgnoreErr;
        popStack(initArg);
    }

    //每个异步操作完成后执行
    var emit = function (arg) {
        if (thenFunArr.length === 0) {
            var arrId = inArray(arg, emitArr);
            if (arrId !== -1) {
                delete emitArr[arrId];
                emitSum -= 1;
            }
            if (emitSum === 0 || emitArr.join('') === '') {
                callback();
            }
        } else {
            popStack(arg);
        }
    }

    //出栈的方法
    var popStack = function (arg) {
        try {
            thenFunArr.shift()(arg);
        } catch(e) {
            if (!ignoreErr) {
                thenFunArr = [];
                if (failFun instanceof Function) {
                    failFun();
                } else {
                    console.error(e);
                }
            } else {
                thenFunArr.shift()();
            }
        }
    }

    //内部方法，判断在数组内
    var inArray = function (arg, arr) {
        var i,
            returnVal = -1;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === arg) {
                returnVal = i;
            }
        }
        return returnVal;
    }

    //返回的对象
    that = {
        after: after,
        all: all,
        emit: emit,
        then: then,
        fail: fail,
        done: done
    }
    return that;
}
