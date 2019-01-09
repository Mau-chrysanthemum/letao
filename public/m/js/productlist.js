$(function () {
    var key = getQueryString('key');
    /* 1. 根据url参数的值 去查询商品列表数据并显示
        1. 调用ajax 请求查询商品列表的数据的API
        2. 调用查询API传人一些参数 包含当前搜索关键字key（但是后台要求传人proName）  proName:key 传人page 和 pageSize
        3. 拿到数据后调用模板去渲染页面即可 */
    // 第一次调用查询商品的函数 是在根据url参数去查询

    QueryProductList()

    $('.btn-search').on('tap', function () {
        key = $('.btn-ment').val().trim();
        // 做非空判断  如果为空提示
        if (!key) {
              mui.alert('请输入你要搜索的关键字', '温馨提示', function () {

              });
              return;
        }
        // 如果搜索的内容不为空  就调用函数
        QueryProductList()
    })

    //   根据点击的按钮的来排序
    $('.product-list .mui-card-header a').on('tap', function () {
        // 获取自定义的属性的值
        var sortType = $(this).data('sort-type');
        console.log(sortType);
        // 获取自定义属性的排序
        var sort = $(this).data('sort');
        // console.log(sort);
        // 点击修改排序
        sort = sort == 1 ? 2 : 1;
        // console.log(sort);
        //  5. 把修改了的排序顺序重新保存到 当前点击a标签身上
        $(this).data('sort', sort);
        var obj = {
                proName: key,
                page: 1,
                pageSize: 4
             }
         obj[sortType] = sort;
         console.log(obj);
        $.ajax({
            url: '/product/queryProduct',
            data: obj,
            success: function (res) {
                console.log(res);
                // 2. 调用模板
                var html = template('productTpl', res);
                // 3. 把列渲染到商品列表 的 mui-row里面
                $('.product-list .mui-card-content .mui-row').html(html);
            }
        });
        // 给点击的当前a 标签添加一个类 切给变当前I 标签的类
        $(this).addClass('active').siblings().removeClass('active');
         if (sort == 1) {
             // 如果排序方式1 升序  把之前的降序删掉 替换升序
             $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
         } else {
             // 如果排序方式2 降序 把之前的升序删掉 替换为降序
             $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
         }
    })
//   下拉刷新
    var page = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                contentrefresh: "正在加载中...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    setTimeout(function () {
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
                        // mui('#refreshContainer').pullRefresh().endPulldown();
                         mui('#refreshContainer').pullRefresh().refresh(true);
                         page = 1;
                    },2000)
                } 
            },
             up: {   
                 contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                 callback: function () {
                     setTimeout(function () {
                         page++;
                         $.ajax({
                             url: '/product/queryProduct',
                             data: {
                                 proName: key,
                                 page: page, // 必传一定要传
                                 pageSize: 4 //必传 不传会报错 报错就重启
                             },
                             success: function (res) {
                                 console.log(res);
                                 // 3. 判断返回数据的数组的长度是否大于0 大于0表示有数据就追加渲染
                                 if (res.data.length > 0) {
                                     // 4. 调用模板
                                     var html = template('productTpl', res);
                                     // 5. 把列渲染追加到商品列表 的 mui-row里面 append函数
                                     $('.product-list .mui-card-content .mui-row').append(html);
                                     // 6. 数据加载完毕 要结束上拉加载 但是还有数据
                                     mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                 } else {
                                     // 7. 没有数据了 结束上拉加载 并且提示没有更多数据了
                                     mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                 }
                             }
                         });
                     }, 2000)
                 }
             }
        }
    });
//    点击立即购买跳转到相应的 页面
    $('.mui-card-content .btn-click').on('tap', 'button', function () {
        var id = $(this).data('id');
        location = 'detail.html?id=' + id;
        
    })


   function QueryProductList() {
       $.ajax({
           url: '/product/queryProduct',
           data: {
               proName: key,
               page: 1, // 必传一定要传
               pageSize: 4 //必传 不传会报错 报错就重启
           },
           success: function (res) {
            //    console.log(res);
               // 2. 调用模板
               var html = template('productTpl', res);
               // 3. 把列渲染到商品列表 的 mui-row里面
               $('.product-list .mui-card-content .mui-row').html(html);
           }
       });
   }
   // 获取url参数值的函数
   function getQueryString(name) {
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
       var r = window.location.search.substr(1).match(reg);
       // console.log(r); 
       if (r != null) return decodeURI(r[2]);
       return null;
   }
})