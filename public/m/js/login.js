$(function () {
    // 点击按钮获取当前输入框的用户名和密码
    $('.btn-login').on('tap', function () {
        var username = $('.username').val().trim();
        if (!username) {
            mui.toast('请输入用户名', {
                duration: 'short',
                type: 'div'
            });
            return false;
        }
        var password = $('.password').val().trim();
        if (!password) {
            mui.toast('请输入密码', {
                duration: 'short',
                type: 'div'
            });
            return false;
        }
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                console.log(data);
                //   5. 判断当前是否登录成功
                if (data.success) {
                    // 6. 成功 就跳转回我需要返回的页面的url  通过地址栏参数去获取这个我要返回 的url
                    var returnUrl = getQueryString('returnUrl');
                    console.log(returnUrl)
                    // 7. 使用location去跳转到这个url地址
                    location = returnUrl;
                } else {
                    // 7. 失败提示用户失败的信息
                    mui.toast(data.message, {
                        duration: 'short',
                        type: 'div'
                    });
                }
            }
        })
              
    });
//   点击注册按钮跳转到注册页面
     $('.btn-danger').on('tap', function () {
         location = 'register.html';
     });




     function getQueryString(name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
         var r = window.location.search.substr(1).match(reg);
         // console.log(r); 
         if (r != null) return decodeURI(r[2]);
         return null;
     }
})