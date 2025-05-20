"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
// 必须使用这种导出结构
exports.methods = {
    excute: async function () {
        console.log("执行");
        return true;
    },
};
// 必须导出的生命周期函数
function load() { }
exports.load = load;
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGFBQWE7QUFDQSxRQUFBLE9BQU8sR0FBRztJQUNuQixNQUFNLEVBQUUsS0FBSztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKLENBQUM7QUFFRixjQUFjO0FBQ2QsU0FBZ0IsSUFBSSxLQUFJLENBQUM7QUFBekIsb0JBQXlCO0FBQ3pCLFNBQWdCLE1BQU0sS0FBSSxDQUFDO0FBQTNCLHdCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIOW/hemhu+S9v+eUqOi/meenjeWvvOWHuue7k+aehFxyXG5leHBvcnQgY29uc3QgbWV0aG9kcyA9IHtcclxuICAgIGV4Y3V0ZTogYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5omn6KGMXCIpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxufTtcclxuXHJcbi8vIOW/hemhu+WvvOWHuueahOeUn+WRveWRqOacn+WHveaVsFxyXG5leHBvcnQgZnVuY3Rpb24gbG9hZCgpIHt9XHJcbmV4cG9ydCBmdW5jdGlvbiB1bmxvYWQoKSB7fVxyXG4iXX0=