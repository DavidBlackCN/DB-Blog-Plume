---
title: 【Linux】云服务器自动化部署VuePress博客（Jenkins）
createTime: 2025/08/16 09:35:37
permalink: /article/w5w03ppj/
excerpt: 如果Vuepress是部署在自己的云服务器上，就可以采用==Jenkins==来自动化部署，每次只要push了新的内容就会自动拉取并进行构建。
tags:
  - linux
  - vuepress
  - jenkins
---

## 写在话前

- 由于Vuepress是每次生成静态文件，没有数据库和后台，因此每次更新了文章源码就需要`npm run build`构建一次。  
- 对于部署到 **Github Pages** 或 **第三方云平台** ，仅需按需求配置脚本和工作流，但如果是部署在自己的云服务器上，就可以采用==Jenkins==来自动化部署，每次只要push了新的内容就会自动拉取并进行构建。

## 预期

::: steps
1. 将Vuepress源码push到自己的Github仓库上

2. Jenkins服务器自动将更新后的代码从Github上fetch下来

3. Jenkins服务器将源码构建并打包至对应文件夹

4. 在对应文件夹上部署静态网站服务
:::

## 安装Jenkins

此处使用==Ubuntu==进行演示，安装LTS版本，对应系统安装可在官网查看。

[Downloading Jenkins](https://www.jenkins.io/download/)

::: details Ubuntu Install
``` bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins
```
软件包安装将：
- 将 Jenkins 设置为启动时启动的守护进程。运行 `systemctl cat jenkins` 了解更多详细信息
- 创建一个 **jenkin** 用户来运行此服务
- 将控制台日志输出直接到 systemd-journald。如果要对 Jenkins 进行故障排除，请运行 `journalctl -u jenkins.service`
- 添加 `/lib/systemd/system/jenkins.service` 启动的配置参数，例如 JENKINS_HOME
- 将 Jenkins 设置为监听端口 8080，使用浏览器访问此端口以开始配置
::: note 
如果8080端口被占用，请运行 `systemctl edit jenkins` 并添加以下内容：
```
[Service]
Environment="JENKINS_PORT=8081"
```
:::

---

- 使用浏览器访问：http://你的服务器IP地址:8080/  
- 打开网页按照提示继续操作，一般此处会提示你前往 `/var/lib/jenkins/secrets/initialAdminPassword` 寻找解锁Jenkins的密码

``` bash
cat /var/lib/jenkins/secrets/initialAdminPassword
```

- 随后是创建账户等操作，插件安装可以选择推荐项，会自动帮你安装包括汉化在内的大部分常用插件  
- 保存并完成，Jenkins就搭建完成了


## 安装前置项

### 安装Java

- Jenkins 需要 Java 才能运行，但并非所有 Linux 发行版都默认包含 Java。  
- 你可以使用多种 Java 实现，此处演示 ==OpenJDK== 的安装：
``` bash
sudo apt update
sudo apt install fontconfig openjdk-21-jre
java -version
openjdk version "21.0.3" 2024-04-16
OpenJDK Runtime Environment (build 21.0.3+11-Debian-2)
OpenJDK 64-Bit Server VM (build 21.0.3+11-Debian-2, mixed mode, sharing)
```
---

### 安装Node.js
- [Download Node.js®](https://nodejs.org/en/download)
选择对应的安装项并复制命令执行：

![](/assets/202508/16-1.png)

由于我的项目使用[pnpm](https://pnpm.io/zh/)作为包管理器，所以命令如下：
``` bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.18.0".
nvm current # Should print "v22.18.0".

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v
```

## 使用Jenkins

### 启动

使用以下命令使 Jenkins 服务在开机时启动：
``` bash
sudo systemctl enable jenkins
```

启动 Jenkins 服务：
``` bash
sudo systemctl start jenkins
```

检查 Jenkins 服务的状态：
``` bash
sudo systemctl status jenkins
```

正常输出：
``` bash
Loaded: loaded (/lib/systemd/system/jenkins.service; enabled; vendor preset: enabled)
Active: active (running) since Tue 2018-11-13 16:19:01 +03; 4min 57s ago
```

重启 Jenkins 服务：  
```
使用浏览器访问
http://你的服务器IP地址:8080/restart
```

### 插件

- 安装插件 ==NodeJS Plugin==

![](/assets/202508/16-2.png)

- 配置NodeJS

![](/assets/202508/16-3.png)


## 部署任务

### 配置凭据

- 在服务器中生成公私钥，用于Github和Jenkins的安全连接
``` bash
ssh-keygen -t rsa -C "你的邮箱地址"
```
连续回车三次，会在Linux(云服务器)的~/.ssh文件里生成公钥 **id_rsa.pub** 和私钥 **id_rsa** ，公钥用于Github的==SSH key==

::: steps
1. 获取公钥的值，添加到Github的SSH key中：
``` ssh
cat ~/.ssh/id_rsa.pub
```

![](/assets/202508/16-10.png)

2. 获取私钥的值，新建凭据并添加到Credentials中
``` ssh
cat ~/.ssh/id_rsa
```

![](/assets/202508/16-9.png)


![在Private Key中添加私钥的值](/assets/202508/16-11.png)
:::


### 配置Webhook

- 在项目仓库的==Settings==里配置Webhook
- 我们的预期是push后自动化构建，所以只需要push event，添加好以后测试连接

![](/assets/202508/16-12.png)

![](/assets/202508/16-13.png)


### 新建任务

- 在Jenkins首页点击 ==新建任务== 输入任务名称并选择 **自由项目**

![](/assets/202508/16-4.png)

#### 项目配置

![](/assets/202508/16-5.png)

![](/assets/202508/16-6.png)

![](/assets/202508/16-7.png)

![](/assets/202508/16-8.png)

#### 命令
``` bash
export PATH="/usr/local/bin:$PATH"

# 此处使用pnpm包管理器，npm请自行修改
pnpm install
pnpm docs:build

# 指向部署静态服务的对应文件夹
TARGET_DIR="/opt/1panel/www/sites/davidblackcn.cc/index"

# 直接操作，无需 sudo
rm -rf "$TARGET_DIR"/*
cp -R docs/.vuepress/dist/* "$TARGET_DIR"/
```

::: warning 关于jenkins权限问题
由于jenkins用户并没有权限直接执行sudo命令，此处我们需要更改配置文件，允许jenkins用户无需密码执行部署命令到对应文件夹
:::

``` bash
sudo visudo
```
添加以下内容：
```
# 允许 jenkins 用户无需密码执行部署命令
jenkins ALL=(ALL) NOPASSWD: /bin/rm -rf /opt/1panel/www/sites/davidblack.cc/index/*, /bin/cp -R /var/lib/jenkins/workspace/VuePress-Blog-Deploy/docs/.vuepress/dist/* /opt/1panel/www/sites/davidblack.cc/index/
```
将其中 `/opt/1panel/www/sites/davidblack.cc/index/` 以及 `/var/lib/jenkins/workspace/VuePress-Blog-Deploy/docs/.vuepress/dist/` 更改为 **实际网站部署的路径** 和 **Jenkins项目工作目录**

- 任务配置完成后记得保存


## 执行任务测试

![在每一次的测试中都可以看控制台输出，方便快速定位错误](/assets/202508/16-14.png)

## 配置静态网站

我使用1Panel(OpenResty)创建静态网站，Nginx创建可自行折腾，一般情况下将Nginx指向Jenkins构建的 `TARGET_DIR` 即可

![1Panel示例，过于简单不多介绍](/assets/202508/16-15.png)


## 使用&推送
- 仅供参考

``` bash
git clone https://github.com/用户名/项目名.git
```

``` bash
git commit -m "提交描述"
```

``` bash
git push -u origin main
```
---

::: info 本文参考
- [Jenkins实现Vuepress自动化部署(上)-安装配置Jenkins](https://juejin.cn/post/6969542924182749198)
- [Jenkins实现Vuepress自动化部署(下)-Jenkins任务配置自动化部署](https://juejin.cn/post/6969949152700563469)
:::


