<template>
  <div>
    <div class="preview-popup">
      <div class="preview-content">
        <img src="https://images2.bestjlb.com/v2jlboss7f041115a20c5284fbeafe063ffce17315519441744464027.jpeg">
        <p>微信扫码体验</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
};
</script>

<style lang="less">
body {
  margin: 0;
  color: #333;
  line-height: 1;
  background-color: #f8f8f8;
  font-family: 'PingFang SC', Helvetica, 'STHeiti STXihei', 'Microsoft YaHei',
    Tohoma, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.preview {
  &-image {
    width: 100%;
    display: block;
    margin-top: -62px;
  }

  &-popup {
    opacity: 0;
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .95);
    transition: .3s;
    text-align: center;
    opacity: 1;
  }

  &-content {
    left: 0;
    top: 50%;
    width: 100%;
    height: 200px;
    position: absolute;
    text-align: center;
    transform: translateY(-60%);
    user-select: none;

    img {
      width: 180px;
      height: 180px;
      margin-bottom: 15px;
      display: inline-block;
    }

    p {
      margin: 0;
      color: #34495e;
      line-height: 1.5;
      font-size: 16px;
    }
  }
}
</style>
