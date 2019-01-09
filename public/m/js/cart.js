$(function () {
   requestCart();

  var page=1
  mui.init({
   pullRefresh: {
      container: "#pullrefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
         contentrefresh: "正在加载中...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
         callback: function () {
            setTimeout(function () {
               mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
               // mui('#refreshContainer').pullRefresh().endPulldown();
               // mui('#refreshContainer').pullRefresh().refresh(true);
               // page = 1;
            }, 2000)
         }
      },
      up: {
         contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
         callback: function () {
            setTimeout(function () {
               page++;
               $.ajax({
                  url: '/cart/queryCartPaging',
                  data: {
                     page: page, // 必传一定要传
                     pageSize: 5 //必传 不传会报错 报错就重启
                  },
                  success: function (data) {
                     // console.log(data);
                     
                      if (data instanceof Array) {
                         data = {
                            data: data
                         }
                      }
                     // console.log(res);
                     // 3. 判断返回数据的数组的长度是否大于0 大于0表示有数据就追加渲染
                     if (data.data.length > 0) {
                        // 4. 调用模板
                        var html = template('cartTpl', data)
                        // 5. 把列渲染追加到商品列表 的 cartlist里面 append函数
                        $('.cartlist').append(html);
                        // 6. 数据加载完毕 要结束上拉加载 但是还有数据
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        getSun();
                     } else {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                     }
                  }
               });
            }, 2000)
         }
      }
   }
  })
   
   // 购物车删除功能
   // 点击删除  按钮弹出一个确认框问用户是否删除
   // 如果是发送请求   如果不是给左拉框  复位
   // 因为是动态生成的 需要使用委托事件
   $('.cartlist').on('tap', ".btn-delet", function () {
      // 这里的 LI 是dom的对象 所以要用dom来取
      var li = this.parentNode.parentNode;
      // console.log(li);
      
      var id = $(this).data('id');
     var btnArray = ['确认', '取消'];
     mui.confirm('确定要移除商品吗?', '温馨提示', btnArray, function (e) {
        if (e.index == 0) {
           $.ajax({
              url: "/cart/deleteCart",
              data: { id: id },
              success: function (data) {
               //   console.log(data);
                 requestCart()
              }
            })
        } else {
          setTimeout(function () {
             mui.swipeoutClose(li);
          }, 0);
        }
     })
      
   })
   //购物车编辑功能

    $('.cartlist').on('tap', ".btn-edit", function () {
       // 这里的 LI 是dom的对象 所以要用dom来取
       var li = this.parentNode.parentNode;
      //  console.log(li);

       var value = $(this).data('value');
       console.log(value);
       var min = +value.productSize.split('-')[0]
       var max = +value.productSize.split('-')[1]
       var size = []
       for (i = min; i <= max; i++){
         //  给循环中的每一个数添加到数组中
           size.push(i)
       }
      //  给数组赋值给数据对象的size属性
       value.productSize = size
       var html = template('editCartTpl', value);
      //  console.log(html);
       
      //  去掉生成后的换行
       html = html.replace(/[\r\n]/g, "");
      //  console.log(html);
       var btnArray = ['确认', '取消'];
       mui.confirm(html, '温馨提示', btnArray, function (e) {
          if (e.index == 0) {
            //   var size = $('.btn-size.mui-btn-warning').data('size');
              var size = $('.btn-size.mui-btn-warning').data('size')
              console.log(size);
              // 13. 获取最新选择的数量                
            //   var num = mui('.mui-numbox').numbox().getValue();
             var num = mui('.mui-numbox').numbox().getValue()
              // 14. 调用APi传人商品id 和 尺码 和 数量更新购物车 的商品
             $.ajax({
                url: "/cart/updateCart",
                type:'post',
                data: {
                   id:value.id, size:size,num:num
                },
                success: function (data) {
                   console.log(data);
                   requestCart()
                }
             })
          } else {
             setTimeout(function () {
                mui.swipeoutClose(li);
             }, 0);
          }
       })
        mui('.mui-numbox').numbox();
        // 8. 初始化尺码点击 让尺码能够点击切换 类名 为什么不需要委托 因为详情数据已经渲染完毕了可以直接使用
        $('.btn-size').on('tap', function () {
           $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
        });

    })
   
   
   // 计算总金额
   $('.cartlist').on('change', ".odd",getSun)
  
   function getSun() {
      var checkeds = $('.odd:checked');
      var sun = 0;
         checkeds.each(function (index, value) {
             var price = $(value).data('price');
             var num = $(value).data('num');
             sun += price * num
          })
          // 取小数的后两位
          sun = sun.toFixed(2)
          $('.order-count span').html(sun)
      }
      // 因为刷新页面需要重新计算  要重复调用
function requestCart() {
   $.ajax({
      // type: "GET",//请求的方式
      url: '/cart/queryCartPaging', //请求的路径
      data: {
         page: 1,
         pageSize: 5
      }, //传入的参数
      //    dataType: "dataType",//转成的格式
      success: function (data) { //返回的参数
         // console.log(data);
         var html = template('cartTpl', data);
         $('.cartlist').html(html);
         getSun()
      }
   });
}
})