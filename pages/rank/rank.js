Page({
    data: {
      // 当前页数
      currentPage: 1,
      // 每页显示的数据数量
      pageSize: 10,
      // 总页数
      pageCount: 0,
      // 数据总数
      total: 0,
      // 当前页的数据
      pageData: []
    },
  
    onLoad: function() {
      // 加载第一页的数据
      this.loadData(this.data.currentPage);
    },
  
    // 加载数据
    loadData: function(page) {
        const db = wx.cloud.database()
        const collection = db.collection('UserData').orderBy('score', 'desc');
      
        // 计算数据总数和总页数
        collection.count().then(res => {
          this.setData({
            total: res.total,
            pageCount: Math.ceil(res.total / this.data.pageSize)
          });
        });
      
        // 查询数据
        new Promise(resolve => {
          collection.skip((page - 1) * this.data.pageSize).limit(this.data.pageSize).get().then(res => {
            this.setData({
              pageData: res.data
            });
            resolve();
          });
        }).then(() => {
          wx.showToast({
            title: '刷新成功',
            icon: 'success'
          });
        });
      },
      
  
    // 上一页
    prevPage: function() {
      let currentPage = this.data.currentPage;
      if (currentPage > 1) {
        currentPage--;
        this.setData({
          currentPage: currentPage
        });
        this.loadData(currentPage);
      }
    },
  
    // 下一页
    nextPage: function() {
      let currentPage = this.data.currentPage;
      if (currentPage < this.data.pageCount) {
        currentPage++;
        this.setData({
          currentPage: currentPage
        });
        this.loadData(currentPage);
      }
    },

    refresh: function() {
        this.loadData(this.data.currentPage);
      },

      go2myself: function() {
        wx.navigateTo({
            url: '/pages/myself/myself'
        });
    }

  })
  