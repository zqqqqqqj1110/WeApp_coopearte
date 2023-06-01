const db = wx.cloud.database();

Page({
  data: {
    username: '',
    phone: ''
  },

  onLoad: function () {
    wx.clearStorageSync()
  },

  submit11: async function (x) {
    const formData = x.detail.value;
    const username = formData.username;
    const phone = formData.phone;
    getApp().globalData.username = username;
    getApp().globalData.phone = phone;

    // Check if user already exists
    const res = await db.collection('UserData').where({
      phone: phone,
    }).get();

    if (res.data.length === 0) {
      // Add new user to database
      const result = await db.collection('UserData').add({
        data: {
          name: username,
          phone: phone,
          score: 0
        }
      });
      console.log("New user added:", result);

    } else {
      console.log("User already exists:", res.data[0]);
    }

    // Navigate to game page
    wx.navigateTo({
      url: '/pages/2048/2048?username=' + username + '&phone=' + phone
    });
  }
});

