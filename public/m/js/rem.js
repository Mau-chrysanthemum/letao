setHtmlFontSize();
function setHtmlFontSize() {// 假设设计搞大小
var designWidth = 750;
// 假设设计搞根元素大小200
var designFonSize = 200;
// 获取当前屏幕的 宽度
windowWidth = document.documentElement.offsetWidth;
// 计算根元素大小
var notFonsize = windowWidth / (750 / 200);
// 设置到当前html元素的font-size上
    document.documentElement.style.fontSize = notFonsize + 'px';
}
// 添加一个屏幕宽度变化事件,变化后执行更元素计算设置
window.addEventListener('resize', setHtmlFontSize);