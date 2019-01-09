$(function () {
    var id = getQueryString('id')
    console.log(id);
    
    $.ajax({
         url: '/product/queryProductDetail',
         data: {
                 id: id
        },
       success: function (data) {
           console.log(data)
           // 2.1 动态渲染之前因为尺码不是一个数组 是一个字符串40-50字符串 希望是一个[40,41,42,43..50]这样的数组
           // 2.2 取出字符中的最小值
           var min = +data.size.split('-')[0];
           var max = +data.size.split('-')[1];
           console.log(min, max);
           // 2.4 定义一个数组把循环的每一个值都添加到数组中
           var size = [];
           // 2.3 写一个循环从min开始到max结束
           for (var i = min; i <= max; i++) {
               size.push(i);
           }
           // console.log(size);
           // 2.5 把数组赋值给数据对象 data的size属性
           data.size = size;
           console.log(data);
           // 3. 调用模板生成html
           var html = template('detailTpl', data);
           // 在这详情页面就已经渲染完毕了
           $('#main .mui-scroll').html(html);
           // 4. 动态渲染完成后要手动初始化插件

           // 5. 初始化轮播图
           var gallery = mui('.mui-slider');
           gallery.slider({
               interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
           });
           // 6. 初始化区域滚动
           mui('.mui-scroll-wrapper').scroll({
               deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
           });
           // 7. 初始化数字框
           mui('.mui-numbox').numbox();
           // 8. 初始化尺码点击 让尺码能够点击切换 类名 为什么不需要委托 因为详情数据已经渲染完毕了可以直接使用
           $('.btn-size').on('tap', function () {
               $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
           });
       }
    })
//    实现购物车功能
    // 1.点击购物车按钮实现加入购物
    // 2获取当前用户选择的尺码与数量
    // 3如果没有尺码或者数量要提醒用户选择
    // 4给用户选择的 尺码数量等数据作为参数调用加入购物车API
    // 5.接受返回来的值是失败还是成功,如果成功表示加入购物车跳转到购物车
    // 6.如果失败表示未登录 跳转到登录页面让用户登录
    // 1点击计入购物车
    $('.btn-add-cart').on('tap', function () {
        //   2获取url参数值的函数
        // 获取的尺码
        var size = $('.btn-size.mui-btn-warning').data('size')
        console.log(size);
        if (!size) {
             mui.toast('请选择尺码!', {
                 duration: 1000,
                 type: 'div'
             });
             return false;
        }
        //  获取数量调用MUI框架的 调用方法
        var num = mui('.mui-numbox').numbox().getValue()
        if (!num) {
            mui.toast('请选择数量!', {
                duration: 1000,
                type: 'div'
            });
            return false;
        }
        // 根据获取到的数量以及尺码发送请求
        $.ajax({
            url: '/cart/addCart',
            type: 'post',
            data: {
                productId: id,
                size: size,
                num:num
            },
            success: function (data) {
                console.log(data); 
                // 如果登录跳转购物车
                if (data.success) {
                    //表示成功跳转购物车
                } else {
                    //   如果没有登录就跳转到登录页面并且给给当前页面的url传过去
                    location = 'login.html?returnUrl=' + location.href;
                }
            }
        })
    })
    















     function getQueryString(name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
         var r = window.location.search.substr(1).match(reg);
         // console.log(r); 
         if (r != null) return decodeURI(r[2]);
         return null;
     }
})