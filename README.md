## 基于云开发的智慧校园综合服务微信小程序

### 完整源码
- https://github.com/zhroc/campus-service-wechat/releases

### UI来源
- https://github.com/wechat-miniprogram/weui-miniprogram

### 项目截图

<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/home.png" width="350">
<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/article.png" width="700">
<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/repair.png" width="700">
<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/repairinfo.png" width="700">
<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/subscribe.png" width="700">
<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/subscribeinfo.png" width="700">
<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/userinfo.png" width="700">
<img src="https://raw.githubusercontent.com/zhroc/campus-service-wechat/main/docs/other.png" width="700">

### 部署步骤
1. 下载本仓库代码到本地。
2. 使用微信小程序官方开发工具导入本项目并开通云开发以及内容管理服务。
3. 修改导入项目的全局配置文件`project.private.config.json`和`project.config.json`或自己新建小程序项目后复制`miniprogram`和`cloudfunctions`两个文件夹中的内容到项目中，即使用新建小程序项目自动生成的配置文件。
4. 将本仓库中的`cloudbasecms`文件夹下的文件导入云开发内容管理平台中。
5. 将`app.js`中底部的`env`替换成自己devenv的环境变量。
6. 进行编译应该就可以使用了。

> 注意：本项目代码结构混乱、不规范，且需求实现方式并不优雅，存在更好的解决方案，大家可自行修改。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zhroc/campus-service-wecha&type=Date)](https://star-history.com/#zhroc/campus-service-wecha&Date)

## 贡献者

<!-- readme: collaborators,contributors -start -->
<table>
  <tr>
      <td align="center">
          <a href="https://github.com/zhroc">
              <img src="https://avatars.githubusercontent.com/u/46491966?v=4" width="100;" alt="zhroc"/>
              <br />
              <sub><b>zhroc</b></sub>
          </a>
      </td>
  </tr>
</table>
<!-- readme: collaborators,contributors -end -->
