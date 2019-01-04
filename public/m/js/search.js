$(function () {
    /* 1. 添加搜索记录
      1. 获取当前输入的搜索内容
      2. 不能直接添加这个内容到数组中 把内容存储到一个数组里面去 把数组添加到本地存储中
      3. 判断 去除重复的 如果之前数组中存在这个值 要先删除 再往前添加
      4. 把数组存储到本地存储的中的时候 要把数组转出一个json字符串再存进去
      5. 调用设置本地存储的函数 把json字符串存储到本地存储中 */

    // 1. 给搜索按钮添加点击事件
   
    // 给获取到的数组字符串  转换成数组切要做非空判断
   
    $('.btn-search').on('tap', function () {
        // 获取输入框的内容  
        var search = $('.btn-ment').val().trim();
        // 非空判断
        if (search == '') {
            mui.toast('请输入有效内容');
            return
        }
        
        var arr = localStorage.getItem('historyData1');
        // 给获取到的数组字符串  转换成数组切要做非空判断
        arr = JSON.parse(arr) || []
        // 给数组去重  切给新输入的 内容添加到数组的最前面
        // 判断当前值在数组中存在 因为存在返回当前值的索引 不会是 - 1
        if (arr.indexOf(search) != -1) {
            // 如果数组中有就删除
            arr.splice(arr.indexOf(search),1)   
        }
        // 给搜索的内容添加到数组的最前面
        arr.unshift(search)
        // 给数组转换成JSON格式
        arr = JSON.stringify(arr)
        // 给JSON  字符串 存储到本地中
        localStorage.setItem('historyData1', arr)
        // 输入完成清空
        $('.btn-ment').val('')
        // 输入完成后调用一次
        queryHistory()
    })
    // 页面加载完成调用一次
    queryHistory()
    // 获取 数据   渲染到页面上
    function queryHistory() {
        var arr = localStorage.getItem('historyData1');
        // 给获取到的数组字符串  转换成数组切要做非空判断
        arr = JSON.parse(arr) || []
        //   调用模板
        var html = template('searchTpl', { rows: arr })
        // 给生成的模板渲染到页面上
        $('.search-histroy ul').html(html)
    }
    // 删除全部
    $('.record').on('tap',function () {
        localStorage.clear()
        queryHistory()
    })
    // 删除单个数据
    $('.search-cancel').on('tap', 'li>span', function () {
        var arr = localStorage.getItem('historyData1');
        // 给获取到的数组字符串  转换成数组切要做非空判断
        arr = JSON.parse(arr) || []
        // 获取到当前点击的索引  
        var index = $(this).data('key')
        // console.log(index);
        // 根据索引  删除数组中的内容
        arr.splice(index, 1)
    //    给数组转成  JSON  字符串
        arr = JSON.stringify(arr);
        // 给删除后的JSon  存储到本地
        localStorage.setItem('historyData1', arr)
        // 在调用一次  获取到的数据  渲染到页面上
        queryHistory()
    })
})