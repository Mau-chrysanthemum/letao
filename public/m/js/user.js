$(function () {
    $.ajax({
        url: '/user/queryUserMessage',
        success: function(data) {
            console.log(data);
            if (data.error == 400) {
                location = 'login.html?returnUrl=' + location.href 
            } else {
                $('.username span').html(data.username)
                $('.mobaler span').html(data.mobile)
            }
        }
    })
    // 退出登录
        $('.btn-exit').on('tap', function () {
            // 2. 调用退出登录APi退出即可
            $.ajax({
                url: '/user/logout',
                success: function (data) {
                    console.log(data);
                    // 3. 判断如果退出成功就去登录
                    if (data.success) {
                        // 4. 退出成功就跳转到登录页面
                        location = 'login.html?returnUrl=' + location.href;
                    }
                }
            })
        });
})