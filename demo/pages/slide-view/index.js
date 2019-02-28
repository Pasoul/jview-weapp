import Page from "../../common/page";

Page({
  data: {
    lists: [
      {
        img: "https://images2.bestjlb.com/v2jlbossd7e5d35b8ac77aa3b8dfea3d0e7db8b415513177975275635.jpeg",
        nickname: "小李",
        time: "7:00 PM",
        id: 1
      },
      {
        img: "https://images2.bestjlb.com/v2jlboss962cd7aa9242bf4669cab3bbe92e944615513177325533752.jpeg",
        nickname: "文件传输助手",
        time: "7:00 PM",
        id: 2
      }
    ]
  },
  slideOpen(e) {
    const componentId = e.currentTarget.id;
    for (let i = 0, len = this.data.lists.length; i < len; i++) {
      const itemId = `componentId${this.data.lists[i].id}`;
      if (itemId !== componentId) {
        this.close({ currentTarget: { dataset: { id: itemId }}});
      }
    }
  },
  close(e) {
    const componentId = e.currentTarget.dataset.id;
    this.selectComponent(`#${componentId}`).close();
  },
  read(e) {
    const index = e.currentTarget.dataset.index;
    const componentId = `componentId${this.data.lists[index].id}`;
    wx.showToast({
      title: `点击已读`
    });
    this.close({ currentTarget: { dataset: { id: componentId }}});
  },
  del(e) {
    const index = e.currentTarget.dataset.index;
    wx.showToast({
      title: `点击删除`
    });
    const lists = this.data.lists;
    lists.splice(index, 1);
    this.setData({
      lists
    });
  }
});
