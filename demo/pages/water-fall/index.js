import Page from "../../common/page";
const lists = [
  {
    "id": 1,
    "url": "https://images2.bestjlb.com/v2jlbossb81242458a9b86c0cb60aaea16a8667215514127979246691.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "风吹雨成花，时间追不上白马。你年少掌心的梦话，依",
    "width": 320,
    "height": 480
  },
  {
    "id": 2,
    "url": "https://images2.bestjlb.com/v2jlboss06a432796b81cb65319200b583b1d5ee15514128074081916.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "捧起一捧故乡土，那是无尽的思念。 描写乡情的美文 ",
    "width": 300,
    "height": 200
  },
  {
    "id": 3,
    "url": "https://images2.bestjlb.com/v2jlboss180730d8f4af502437a820b7083fd33715514128148907432.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "励志心灵的短篇美文 大多数人距离他们的目标只缺少了",
    "width": 340,
    "height": 640
  },
  {
    "id": 4,
    "url": "https://images2.bestjlb.com/v2jlboss4bf2d44d5a720bbadd17508091b8e3a415514128219546766.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "中国是世界四大文明古国之一，也是现仅存的文明古国，",
    "width": 290,
    "height": 440
  },
  {
    "id": 5,
    "url": "https://images2.bestjlb.com/v2jlboss74fe66de258bb3b9936a893f43cf9d3415514128277047478.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "苦与甜的变奏 成华彪 又到瓜熟蒂落的时节。想抢鲜吃",
    "width": 360,
    "height": 620
  },
  {
    "id": 6,
    "url": "https://images2.bestjlb.com/v2jlboss1dddf386ab0d78b8546905b5f394670f15514128342009283.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "空间风波： 很多人都喜欢在空间发大量的说说或自拍的",
    "width": 440,
    "height": 740
  },
  {
    "id": 7,
    "url": "https://images2.bestjlb.com/v2jlboss1c219a1efadf7477334c2480f6b055d715514128396784067.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "你是否也会注视这么一个画面：方方正正的现代化建筑，",
    "width": 130,
    "height": 320
  },
  {
    "id": 8,
    "url": "https://images2.bestjlb.com/v2jlboss9e2fd5367a85284c6d4c13379abd851015514128455919411.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "时光的深处，红尘的渡口。我依然伫立静水一方，以字暖",
    "width": 340,
    "height": 640
  },
  {
    "id": 9,
    "url": "https://images2.bestjlb.com/v2jlboss681eee1d07730e21a8d9f6a746126ffe15514128506835897.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "昆德拉在《不能承受的生命之轻》中写到：最沉重的负担",
    "width": 330,
    "height": 540
  },
  {
    "id": 10,
    "url": "https://images2.bestjlb.com/v2jlboss095e21a9bdba87b27e744f807890ae5115514128556162531.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "宋代诗人王质有诗《夜泊荻港》：落日人家已半扉，隔离",
    "width": 430,
    "height": 660
  }
];
const lists1 = [
  {
    "id": 11,
    "url": "https://images2.bestjlb.com/v2jlbossdd58deea5e8a3f98abedc7714f72d2cc15514128724124325.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "我曾说，年轻的灵魂，不在春城停留就该在山城邂逅！ ",
    "width": 120,
    "height": 220
  },
  {
    "id": 12,
    "url": "https://images2.bestjlb.com/v2jlboss2d06093980de14aeb80847bd63e6b7d815514128989408974.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "看到这个题目，很多人可能想着我又在瞎胡扯什么，那么",
    "width": 170,
    "height": 270
  },
  {
    "id": 13,
    "url": "https://images2.bestjlb.com/v2jlboss1c219a1efadf7477334c2480f6b055d715514129070216440.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "大自然是美的，世界是美的，我们也是美的。只要眼里有",
    "width": 220,
    "height": 320
  },
  {
    "id": 14,
    "url": "https://images2.bestjlb.com/v2jlbossea963120323c910d0d2e8a2a1d82dd4715514129140317551.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "宠辱不惊，看庭前花开花落，去留无意，望天上云卷去舒",
    "width": 320,
    "height": 420
  },
  {
    "id": 15,
    "url": "https://images2.bestjlb.com/v2jlboss681eee1d07730e21a8d9f6a746126ffe15514129210446757.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "几年前，我去过黄平县谷陇镇的滚水村，我曾被那个村子",
    "width": 220,
    "height": 420
  },
  {
    "id": 16,
    "url": "https://images2.bestjlb.com/v2jlboss095e21a9bdba87b27e744f807890ae5115514129857764755.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "沿清水江南行，过了平地营之后再往东行，过蟠龙坳，视",
    "width": 320,
    "height": 620
  },
  {
    "id": 17,
    "url": "https://images2.bestjlb.com/v2jlboss7a2f3a171f51ef2cef3b9df912d551da15514129991874025.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "国庆到了，总得找个地方走走。有钱人远行，无币人归家",
    "width": 420,
    "height": 720
  },
  {
    "id": 18,
    "url": "https://images2.bestjlb.com/v2jlboss6042bd60fa32aa86266eaa3d24fff4c315514130032233488.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "我出生在一个贫困家庭里，母亲是全职妈妈，父亲是农民",
    "width": 320,
    "height": 820
  },
  {
    "id": 19,
    "url": "https://images2.bestjlb.com/v2jlbosse6adbed62e99c6c1c051802d459793be15514130071638477.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "到云台山的机会很多，总想写一些感触。看山，看水，听",
    "width": 220,
    "height": 270
  },
  {
    "id": 20,
    "url": "https://images2.bestjlb.com/v2jlbossbbc1d15e3e46b1c96229d7bd0fc48aba15514130120377837.jpeg?_w=320&_h=480",
    "type": 1,
    "desc": "姑娘，请擦干你的眼泪，我知道你此刻万念俱灰，绝望和",
    "width": 220,
    "height": 420
  }
];
Page({
  data: {
    lists: lists,
    hasMore: true,
    width: 345
  },
  onImgTap() {
    console.log(111);
  },
  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({
        lists: this.data.lists.concat(lists1),
        hasMore: false
      });
    }
  }
});
