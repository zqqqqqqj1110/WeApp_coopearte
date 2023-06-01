var app = getApp();

var Grid = require('./grid.js');
var Tile = require('./tile.js');
var GameManager = require('./game_manager.js');

var config = {
    data: {
        hidden: false,
        // 游戏数据可以通过参数控制
        grids: [],
        over: false,
        win: false,
        score: 0,
        highscore: 0,
        overMsg: '游戏结束'
    },

    go2rank:function() {
        wx.navigateTo({
            url: '/pages/rank/rank'
        })
      },

      onLoad: function(options) {
        wx.clearStorageSync();
        this.GameManager = new GameManager(4);
        this.setData({
            grids: this.GameManager.setup(),
            highscore: wx.getStorageSync('highscore') || 0
        });
    
        // 获取前一个页面传递过来的参数
        const name = options.username;                  // 1
        const phone = options.phone;
    
        // 获取前一个页面设置的全局数据
        const username = getApp().globalData.username;
        const globalPhone = getApp().globalData.phone;
    },

    UpHigestScore: function() {
        const db = wx.cloud.database();
        const hs = wx.getStorageSync('highscore');                  // 修改hs，变为当前得分
        const username = getApp().globalData.username;
        const phone = getApp().globalData.phone;
      
        // 先查询用户当前的分数
        db.collection('UserData').where({
        //   name: username,
          phone: phone
        }).get().then(res => {
          const currentScore = res.data[0].score;
          if (hs > currentScore) {
            // 更新数据
            db.collection('UserData').where({
              phone: phone
            }).update({
              data: {
                name: username,
                score: hs
              }
            }).then(res => {
              console.log('更新成功');
            }).catch(err => {
              console.log('更新失败', err);
            });
          } else {
            console.log('当前分数已经大于原来的分数，无需更新');
          }
        }).catch(err => {
          console.log('查询失败', err);
        });
      },
      

    onReady: function() {
        var that = this;

        // 页面渲染完毕隐藏loading
        that.setData({
            hidden: true
        });
    },
    onShow: function() {
        // 页面展示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },

    // 更新视图数据
    updateView: function(data) {
        // 游戏结束
        if(data.over){
            data.overMsg = '游戏结束';
        }

        // 获胜
        if(data.win){
            data.overMsg = '恭喜';
        }

        this.setData(data);
    },

    // 重新开始
    restart: function() {
        this.updateView({
            grids: this.GameManager.restart(),
            over: false,
            won: false,
            score: 0,
        });
    },

    touchStartClienX: 0,
    touchStartClientY: 0,
    touchEndClientX: 0,
    touchEndClientY: 0,
    isMultiple: false, // 多手指操作

    touchStart: function(events) {

        // 多指操作
        this.isMultiple = events.touches.length > 1;
        if (this.isMultiple) {
            return;
        }

        var touch = events.touches[0];

        this.touchStartClientX = touch.clientX;
        this.touchStartClientY = touch.clientY;

    },

    touchMove: function(events) {
        var touch = events.touches[0];
        this.touchEndClientX = touch.clientX;
        this.touchEndClientY = touch.clientY;
    },

    touchEnd: function(events) {
        if (this.isMultiple) {
            return;
        }

        var dx = this.touchEndClientX - this.touchStartClientX;
        var absDx = Math.abs(dx);
        var dy = this.touchEndClientY - this.touchStartClientY;
        var absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
            var direction = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);

            var data = this.GameManager.move(direction) || {
                grids: this.data.grids,
                over: this.data.over,
                won: this.data.won,
                score: this.data.score
            };

            var highscore = wx.getStorageSync('highscore') || 0;
            if(data.score > highscore){
                wx.setStorageSync('highscore', data.score);
            }

            this.updateView({
                grids: data.grids,
                over: data.over,
                won: data.won,
                score: data.score,
                highscore: Math.max(highscore, data.score)
            });

        }

    }
};

Page(config);
