$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false
    })
//    分类的左侧数据请求
    // 实现分类的渲染
    // 用zepto 发送AJAX 请求
    $.ajax({
        // type:'get',  zepto中  get 一般可以省略
        url: '/category/queryTopCategory',
        // datatype:'json' 转化成JSON  一般也可以省略
        success: function (data) {
            // console.log(data);
        // 调用模板 
        var html = template('categoryLeftTpl',data)
            $('.category-left ul').html(html)
        }
    })  
    //2 实现分类左侧点击渲染右侧分类
        // 1 给所有的li的a 添加点击事件   使用委托事件添加点击事件
        // 2  拿到当前点击li的a 的id
        // 3拿到ID  给ID当参数传递 发送二级请求 
        //   4 拿到数据把数据渲染到左边页面
    // 移动端使用tap  解决延迟的click 事件
    $('.category-left ul').on('tap', 'li>a', function () {
        var id = $(this).data('id');
       
        querySecondCategory(id)
        $(this).parent().addClass('active').siblings().removeClass('active');
        
    })
    querySecondCategory(1);
    function querySecondCategory(id) {
        $.ajax({
            url: "/category/querySecondCategory",
            data: {
                id: id
            },
            success: function (data) {
                // console.log(data);
                var html = template('categoryRightTpl', data);
                // console.log(html);

                $('.category-right .mui-row').html(html)

            }
        })
    }
})