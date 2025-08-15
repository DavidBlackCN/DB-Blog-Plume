// data.ts - 导航数据存储文件
export interface Site {
  name: string;
  url: string;
  desc: string;
  logo?: string;
  category: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'minecraft', name: 'Minecraft', icon: '◻️' },
  { id: 'community', name: 'MC社区', icon: '🏡' },
  { id: 'docs', name: '百科文档', icon: '📃' },
  { id: 'host', name: '托管网站', icon: '🛜' },
  { id: 'tool', name: '在线工具', icon: '🔧' },
  { id: 'software', name: '开发软件', icon: '💾'},
  { id: 'launcher', name: '启动器', icon: '⚡️'},
  { id: 'loader', name: '加载器', icon: '🛻'},
  { id: 'project', name: '项目', icon: '📦️'}
];

export const sites: Site[] = [
  {
    name: 'Minecraft',
    url: 'https://www.minecraft.net/',
    desc: 'Minecraft我的世界官方网站',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Minecraft.png',
    category: 'minecraft',
    tags: ['官方']
  },
  {
    name: '网易我的世界',
    url: 'https://mc.163.com/',
    desc: '网易我的世界官方，中国地区Minecraft代理',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MC163.png',
    category: 'minecraft',
    tags: ['官方']
  },
  {
    name: 'Mojang Jira',
    url: 'https://bugs.mojang.com/',
    desc: 'Mojang官方Bug反馈/提交建议',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Mojang.ico',
    category: 'minecraft',
    tags: ['官方','Bug反馈']
  },
  {
    name: 'MC导航网',
    url: 'https://developer.mozilla.org',
    desc: '一个精致、全面的Minecraft网址导航站，收录各类型的MC网站',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCNav.gif',
    category: 'community',
    tags: ['社区', '导航']
  },
  {
    name: 'MCBBS·纪念版',
    url: 'https://www.mcbbs.co/forum.php',
    desc: '永远怀念 —— MCBBS',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Chest.png',
    category: 'community',
    tags: ['社区', '论坛', '牢大']
  },
  {
    name: 'MineBBS',
    url: 'https://www.minebbs.com/',
    desc: 'MineBBS 我的世界中文论坛',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MineBBS.png',
    category: 'community',
    tags: ['社区', '论坛']
  },
  {
    name: 'KLPBBS',
    url: 'https://klpbbs.com/',
    desc: 'KLPBBS 我的世界苦力怕论坛',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/KLPBBS.ico',
    category: 'community',
    tags: ['社区', '论坛']
  },
  {
    name: '红石中继站',
    url: 'https://www.mczwlt.net/',
    desc: 'MCBBS 牢坛打赢复活赛力的产物',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCzwlt.ico',
    category: 'community',
    tags: ['社区', '论坛']
  },
  {
    name: 'Minecraft Forum',
    url: 'https://www.minecraftforum.net/',
    desc: 'Minecraft原官方论坛，全球使用人数最多的Minecraft社区',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MinecraftForum.png',
    category: 'community',
    tags: ['社区', '论坛']
  },
  {
    name: 'Minecraft-HK',
    url: 'https://www.minecraft-hk.com/',
    desc: '交流有關 Minecraft 的最新資訊、專業教學、遊戲伺服器、相關資源及心得分享',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Minecraft-HK.ico',
    category: 'community',
    tags: ['社区', '论坛']
  },
  {
    name: 'MGC 中文图形学社区',
    url: 'https://minegraph.cn/',
    desc: '共同探索MC图形学的无限可能',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MGC.png',
    category: 'community',
    tags: ['社区', '论坛']
  },
  {
    name: '阿尔萨斯工业园社区',
    url: 'https://www.alsace.team/',
    desc: '一个拥有资深运营管理经验的 Minecraft 公益建筑服务器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Alsace.team.png',
    category: 'community',
    tags: ['社区', '服务器']
  },


  {
    name: 'Minecraft Wiki',
    url: 'https://zh.minecraft.wiki/',
    desc: '欢迎来到这个完全公开、可自由编辑的Wiki，这里致力于收集一切和Minecraft有关的信息',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MinecraftWiki.ico',
    category: 'docs',
    tags: ['百科', '原版', 'Wiki']
  },
  {
    name: 'MCMOD百科',
    url: 'https://www.mcmod.cn/',
    desc: '嘿，别碰那个.. 啊... BOOM!',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCMOD.ico',
    category: 'docs',
    tags: ['百科', '模组']
  },
  {
    name: 'Minecraft插件百科',
    url: 'https://mineplugin.org/',
    desc: '服务器插件百科Wiki',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MinePlugin.png',
    category: 'docs',
    tags: ['百科', '插件']
  },
  {
    name: 'MCBE 官方创作者文档',
    url: 'https://learn.microsoft.com/minecraft/creator/?view=minecraft-bedrock-stable',
    desc: '创建皮肤，设计独特的体验，发现最新功能，并发展您作为Minecraft创作者的技能',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Microsoft.png',
    category: 'docs',
    tags: ['官方', '开发', '文档']
  },
  {
    name: 'Bedrock Wiki',
    url: 'https://wiki.bedrock.dev/',
    desc: '一个技术基岩的知识分享网站，包含文档、教程和一般的操作信息',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/WikiBedrock.png',
    category: 'docs',
    tags: ['社区', '开发', '文档']
  },
  {
    name: 'NitWikit 笨蛋文档',
    url: 'https://nitwikit.8aka.org/',
    desc: '一个详细且全面的 Minecraft 开服教程，并且基于社区最新内容编写，保持更新',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Nitwikit.png',
    category: 'docs',
    tags: ['社区', '服务器', '开发', '文档']
  },
  {
    name: 'Minecraft Parkour Wiki',
    url: 'https://www.mcpk.wiki/wiki/Main_Page/zh',
    desc: '一个记录 Minecraft 跑酷知识以及玩家运动机制的 wiki',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCPKwiki.png',
    category: 'docs',
    tags: ['社区', '跑酷', '文档']
  },


  {
    name: 'Minecraft Curseforge',
    url: 'https://www.curseforge.com/minecraft',
    desc: 'Discover the best Minecraft Mods and Modpacks around.',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Curseforge.png',
    category: 'host',
    tags: ['托管', '资源']
  },
  {
    name: 'Modrinth',
    url: 'https://modrinth.com/',
    desc: 'Discover, play, and share Minecraft content through our open-source platform built for the community',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Modrinth.ico',
    category: 'host',
    tags: ['托管', '资源']
  },
  {
    name: 'Minecraft Maps',
    url: 'https://www.minecraftmaps.com/',
    desc: '一个非官方Minecraft粉丝网站',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MinecraftMaps.png',
    category: 'host',
    tags: ['托管', '资源', '地图']
  },
  {
    name: 'Planet Minecraft',
    url: 'https://www.minecraftmaps.com/',
    desc: '一个拥有丰富游戏素材、纹理包、存档、皮肤、Mods、地图资源的分享站点',
    logo: 'https://img.icons8.com/?size=100&id=rHeIASNeN99k&format=png&color=000000',
    category: 'host',
    tags: ['托管', '资源', '地图']
  },
  {
    name: '像素茶艺地图站',
    url: 'https://pixelmap.minegraph.cn/',
    desc: 'Minecraft地形师茶馆与Fn Studio建立的地图下载站点',
    logo: 'https://img.icons8.com/?size=100&id=49316&format=png&color=000000',
    category: 'host',
    tags: ['托管', '资源', '地图']
  },
  {
    name: 'MC汉化补丁下载站',
    url: 'https://www.ningna-cn.asia/',
    desc: '本站由b站柠娜个人搭建维护',
    logo: 'https://img.icons8.com/?size=100&id=120530&format=png&color=000000',
    category: 'host',
    tags: ['托管', '资源', '汉化']
  },
  {
    name: 'VM 汉化组',
    url: 'https://www.ningna-cn.asia/',
    desc: '一个用爱发电专注于汉化MC整合包与地图的非盈利组织',
    logo: 'https://vmct-cn.top/imgs/logo/logo_256.png',
    category: 'host',
    tags: ['托管', '资源', '汉化']
  },


  {
    name: 'NameMC',
    url: 'https://namemc.com/',
    desc: '检查Minecraft用户名的可用性，查询Minecraft账户的用户名历史',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/NameMC.ico',
    category: 'tool',
    tags: ['工具', '在线', '账号']
  },
  {
    name: 'MCUUID',
    url: 'https://mcuuid.net/',
    desc: '查找、转换和解析 Minecraft 用户名和 UUID 的最简单方式！',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCuuid.ico',
    category: 'tool',
    tags: ['工具', '在线', '账号']
  },
  {
    name: 'LittleSkin',
    url: 'https://littleskin.cn/',
    desc: '知名老牌皮肤站，拥有海量皮肤和披风',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/LittleSkin.png',
    category: 'tool',
    tags: ['工具', '在线', '皮肤']
  },
  {
    name: 'HelloSkin',
    url: 'https://helloskin.cn/',
    desc: '免费、快捷的MC皮肤站',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/HelloSkin.png',
    category: 'tool',
    tags: ['工具', '在线', '皮肤']
  },
  {
    name: 'Minecraft Skin Editor',
    url: 'https://minecraft-skin-editor.com/cn/',
    desc: '简洁易用的在线皮肤编辑器！',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Minecraft-Skin-Editor.png',
    category: 'tool',
    tags: ['工具', '在线', '皮肤']
  },
  {
    name: 'Pixilart',
    url: 'https://www.pixilart.com/',
    desc: '免费的在线绘画社区和像素画工具',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Pixilart.png',
    category: 'tool',
    tags: ['工具', '在线', '皮肤', '绘画']
  },
  {
    name: 'Minecraft艺术',
    url: 'https://mcpixelart.com/',
    desc: '辅助制作像2D素画、3D雕像、以及红石音乐',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCpixelart.png',
    category: 'tool',
    tags: ['工具', '在线', '皮肤', '绘画', '音乐']
  },
  {
    name: 'MinecraftTools',
    url: 'https://minecraft.tools/',
    desc: '一个Minecraft工具集合，功能丰富',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MinecraftTools.png',
    category: 'tool',
    tags: ['工具', '在线']
  },
  {
    name: 'ChunkBase',
    url: 'https://www.chunkbase.com/apps/',
    desc: '一个实用的区块查询、种子地图网站',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Chunkbase.png',
    category: 'tool',
    tags: ['工具', '在线', '种子']
  },  
  {
    name: 'MCCAG',
    url: 'https://mccag.cn/',
    desc: 'Minecraft Cute Avatar Generator，国内开发者精心打造的头像生成器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCcag.png',
    category: 'tool',
    tags: ['工具', '在线', '头像']
  },
  {
    name: 'Minecraft PFP',
    url: 'https://www.minecraftpfp.com/',
    desc: '一个开源的MC像素头像生成器，可以切换背景，保存到电脑或者下载',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Minecraftpfp.png',
    category: 'tool',
    tags: ['工具', '在线', '头像']
  },
  {
    name: '3D Minecraft 风格 Logo 生成',
    url: 'https://3dtext.easecation.net/',
    desc: '一个可以便捷生成 3D Minecraft 风格 Logo 的网站',
    logo: 'https://vitejs.cn/vite3-cn/logo-with-shadow.png',
    category: 'tool',
    tags: ['工具', '在线', '图标']
  },
  {
    name: 'McSounds',
    url: 'http://o.xbottle.top/mcsounds/',
    desc: '丰富的MC音效在线收听！还有试手气功能来试一下？',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Jukebox.png',
    category: 'tool',
    tags: ['工具', '在线', '音效']
  },
  {
    name: 'GameGeeks',
    url: 'https://www.gamergeeks.net/apps/minecraft',
    desc: '一个有很多实用工具的minecraft站',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Gamergeeks.png',
    category: 'tool',
    tags: ['工具', '在线']
  },
  {
    name: 'McIcons',
    url: 'https://mcicons.ccleaf.com/',
    desc: '一个丰富的MC图库网站',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCicons.png',
    category: 'tool',
    tags: ['工具', '在线', '图标']
  },
  {
    name: 'Reden',
    url: 'https://redenmc.com/zh_cn',
    desc: '为红石开发者提供一站式工作环境，成为红石最好的调试和教学工具',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Reden.png',
    category: 'tool',
    tags: ['工具', '在线', '投影', '模组']
  },
  

  {
    name: 'Sakura Frp',
    url: 'https://www.natfrp.com/',
    desc: '好用的内网穿透软件：免费穿，轻松透',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/NatFrp.png',
    category: 'software',
    tags: ['软件', '内网穿透']
  },
  {
    name: 'OpenFrp',
    url: 'https://www.openfrp.net/',
    desc: '免费开放、高效便捷的内网穿透工具',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Openfrp.png',
    category: 'software',
    tags: ['软件', '内网穿透']
  },
  {
    name: 'WorldPainter',
    url: 'https://www.worldpainter.net/',
    desc: 'MC地形制作软件，用 Java 实现',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/WorldPainter.png',
    category: 'software',
    tags: ['软件', '地形制作']
  },
  {
    name: 'World Machine',
    url: 'https://www.world-machine.com/',
    desc: '进阶版Minecraft地形编辑器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/WorldMachine.png',
    category: 'software',
    tags: ['软件', '地形制作']
  },
  {
    name: 'Amulate',
    url: 'https://www.amuletmc.com/',
    desc: '新时代的 Minecraft 世界编辑和转换器， 支持自 Java 1.12 和基岩 1.7 以来的每一个版本',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Amulate.png',
    category: 'software',
    tags: ['软件', '世界编辑']
  },
  {
    name: 'MCreator',
    url: 'https://mcreator.net/',
    desc: '用于使用直观易学的界面或集成代码编辑器制作 Minecraft Java 版模组',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCreator.ico',
    category: 'software',
    tags: ['软件', '模组']
  },
  {
    name: 'Mod Manager',
    url: 'https://github.com/kaniol-lck/modmanager',
    desc: '基于Qt的Minecraft Mod管理器，可以管理、更新与下载Mod',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/ModManager.png',
    category: 'software',
    tags: ['软件', '模组']
  },
  {
    name: 'Mine-imator',
    url: 'https://www.mineimator.com/',
    desc: 'MC动画制作软件，使用Minecraft中的方块，物品和可爱的角色创建动画视频',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Mine-imator.png',
    category: 'software',
    tags: ['软件', '动画']
  }, 
  {
    name: 'MCSTools',
    url: 'https://docs.mcschematic.top/zh/',
    desc: '功能强大的蓝图辅助工具，提供多格式蓝图解析与智能存储管理功能',
    logo: 'https://docs.mcschematic.top/assets/image/fav.png',
    category: 'software',
    tags: ['软件', '蓝图', '投影', '建筑']
  },
  {
    name: 'BlockBench',
    url: 'https://www.blockbench.net/',
    desc: '适用于 Minecraft 的建模软件',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/BlockBench.png',
    category: 'software',
    tags: ['软件', '建模']
  },
  {
    name: 'MCSkinn Legacy',
    url: 'https://apps.microsoft.com/detail/9n8sjt329hh1?hl=zh-cn&gl=CN',
    desc: '适用于 Windows 的现代化 Minecraft 3D 皮肤管理器/编辑器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCSkinn.png',
    category: 'software',
    tags: ['软件', '皮肤']
  },
  {
    name: 'Minecraft Server Launcher',
    url: 'https://www.mslmc.cn/',
    desc: '我的世界开服器，一键式开服，简单快捷！',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MSL.ico',
    category: 'software',
    tags: ['软件', '服务器']
  },
  {
    name: 'MCServerLauncher 2',
    url: 'https://mcsl.com.cn/',
    desc: '一个简洁全能易上手的Minecraft服务器启动器，集搭服、开服、资源下载、自研插件系统于一身',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCSL2.webp',
    category: 'software',
    tags: ['软件', '服务器']
  },
  {
    name: 'Serein',
    url: 'https://serein.cc/',
    desc: '新时代极简服务器面板',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Serein.ico',
    category: 'software',
    tags: ['软件', '服务器']
  },
  {
    name: 'MCSManager',
    url: 'http://mcsmanager.com/',
    desc: '稳定可靠 ，轻量级和开箱即用的 Minecraft 服务端管理面板',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/MCSManager.ico',
    category: 'software',
    tags: ['软件', '服务器']
  },


  {
    name: 'HMCL',
    url: 'https://github.com/huanghongxun/HMCL',
    desc: 'Hello Minecraft! Launcher 一个强大的MC启动器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/HMCL.ico',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'PCL2',
    url: 'https://afdian.net/p/e5c821a4b1ab11eb879b52540025c377',
    desc: 'Plain Craft Launcher 2，龙猫dalao开发的MC启动器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/PCL2.png',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'BakaXL',
    url: 'https://www.bakaxl.com/',
    desc: '新一代丧病启动器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/BakaXL.ico',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'LauncherX',
    url: 'https://corona.studio/lx',
    desc: '功能强大、界面优美的下一代 MineCraft 启动器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/LauncherX.png',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'Multimc',
    url: 'https://multimc.org/',
    desc: '轻松管理 Minecraft 实例',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Multimc.png',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'LabyMod Launcher',
    url: 'https://labymod.net/zh_Hans',
    desc: '新的 LabyMod 启动器比原来的 Minecraft 启动器启动更快、更可靠！而且它更干净、更易于使用',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Labymod.png',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'LunarCilent',
    url: 'https://www.lunarclient.com/',
    desc: '知名PVP客户端，通过为您提供所有你最喜欢的模组，配置和装扮，提高你的游戏体验！',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Lunar.ico',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'XMCL',
    url: 'https://xmcl.app/',
    desc: 'X Minecraft Launcher，一个方便你管理大量的模组、纹理包的的现代化启动器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/XMCL.png',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'Prism Launcher',
    url: 'https://prismlauncher.org/',
    desc: '开源 Minecraft 启动器，能够管理多个实例、帐户和mod',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/PrismLauncher.png',
    category: 'launcher',
    tags: ['启动器']
  },
  {
    name: 'FCL启动器',
    url: 'https://fcl-team.github.io/index.html',
    desc: 'Android Java版Minecraft启动器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/FCL-team.png',
    category: 'launcher',
    tags: ['启动器', 'PE-Java']
  },
  {
    name: 'Pojav Launcher',
    url: 'https://github.com/PojavLauncherTeam/PojavLauncher',
    desc: '国外持续更新的手机Java启动器 支持模组和少部分光影 全版本 下载文件需正版',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/PojavLauncher.png',
    category: 'launcher',
    tags: ['启动器', 'PE-Java']
  },


  {
    name: 'Bedrock Dedicated Server',
    url: 'https://www.minecraft.net/download/server/bedrock',
    desc: '官方基岩版专用服务端，可以实现全游戏特性',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Bedrock.png',
    category: 'loader',
    tags: ['加载器', '模组系', '基岩版']
  },
  {
    name: 'PowerNukkitX',
    url: 'https://www.powernukkitx.cn/',
    desc: '新一代高性能、富特性、完全独立的开源MCBE服务端软件',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Bedrock.png',
    category: 'loader',
    tags: ['加载器', '基岩版']
  },
  {
    name: 'LeviLamina',
    url: 'https://levilamina.liteldev.com/',
    desc: '轻量、模块化和多功能的MCBE官方服务端插件加载器，前身为LiteLoaderBDS',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/LeviMC.png',
    category: 'loader',
    tags: ['加载器', '基岩版']
  },
  {
    name: 'Forge',
    url: 'https://forums.minecraftforge.net/',
    desc: 'Minecraft Forge 社区',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Forge.ico',
    category: 'loader',
    tags: ['加载器', '模组系']
  },
  {
    name: 'NeoForge',
    url: 'https://neoforged.net/',
    desc: 'Forge的高版本主要分支',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/NeoForge.ico',
    category: 'loader',
    tags: ['加载器', '模组系']
  },
  {
    name: 'Fabric',
    url: 'https://fabricmc.net/',
    desc: '轻量的mod服务端，支持最新版本、更小、更轻量',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Fabric.png',
    category: 'loader',
    tags: ['加载器', '模组系']
  },
  {
    name: 'QuiltMC',
    url: 'https://quiltmc.org/',
    desc: '新一代开源的、以社区为载体的、基于 Fabric 的模组加载器兼模组开发工具链',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Quilt.png',
    category: 'loader',
    tags: ['加载器', '模组系']
  },
  {
    name: 'LiteLoader',
    url: 'http://www.liteloader.com/',
    desc: '一个Minecraft轻量版MOD API，与Forge类似',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Liteloader.png',
    category: 'loader',
    tags: ['加载器', '模组系']
  },
  {
    name: 'Bukkit',
    url: 'https://bukkit.org/',
    desc: 'Bukkit 是插件开发者用来创建插件的一个 API。——我的世界Wiki',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Lava_Bucket.png',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'Spigot',
    url: 'https://www.spigotmc.org/',
    desc: 'Bukkit的分支，一个优秀的服务端',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Spigot.ico',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'PaperMC',
    url: 'https://papermc.io/',
    desc: '下一代 Minecraft 服务端，与 Spigot 插件兼容，提供不妥协的性能',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Paper.ico',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'Pufferfish',
    url: 'https://pufferfish.host/downloads',
    desc: 'Paper的高性能开源分支，旨在提供企业功能并最大限度地提高性能',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/PufferFish.png',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'Purpur',
    url: 'https://purpurmc.org/',
    desc: 'Paper 服务器的直接替代品，专为可配置性和新的、有趣的、令人兴奋的游戏功能而设计',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/PurpurMC.png',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'Leaves',
    url: 'https://leavesmc.org/',
    desc: '基于 Paper 的 Minecraft 服务端，旨在修复被破坏的原版特性，专为生电设计',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/LeavesMC.png',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'Leaf',
    url: 'https://www.leafmc.one/zh/',
    desc: '一个 Paper 分支, 专注于寻找性能优化, Vanilla, 稳定之间的平衡',
    logo: 'https://www.leafmc.one/logo.svg',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'Folia',
    url: 'https://papermc.io/software/folia',
    desc: 'Paper 的一个新分支，它向服务器添加了区域化多线程',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Paper.ico',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'SpongePowered',
    url: 'https://www.spongepowered.org/',
    desc: '由多数Bukkit人马打造，社区参与，拥有几乎最好的优化和独立生态的新一代Java版服务端',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/SpongePowered.png',
    category: 'loader',
    tags: ['加载器', '插件系']
  },
  {
    name: 'MohistMC',
    url: 'https://mohistmc.com/',
    desc: '墨端服务器核心，体验由社区和AI驱动的Minecraft软件创新',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Mohist.ico',
    category: 'loader',
    tags: ['加载器', '混合端']
  },
  {
    name: 'CatServer',
    url: 'https://catmc.org/',
    desc: '一个高性能Bukkit和Forge混合的minecraft服务端',
    logo: 'https://img.icons8.com/?size=100&id=QBnz0pGMdk0_&format=png&color=000000',
    category: 'loader',
    tags: ['加载器', '混合端']
  },
  {
    name: 'Arclight',
    url: 'https://arclight.izzel.io/',
    desc: '一个使用 Mixin 实现的 Bukkit 服务端，可在模组环境下加载 Bukkit 插件',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Arclight.png',
    category: 'loader',
    tags: ['加载器', '混合端']
  },
  {
    name: 'Velocity',
    url: 'https://arclight.izzel.io/',
    desc: '现代的高性能代理。它在设计时考虑到了性能和稳定性，是 Waterfall 的完整替代品',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Paper.ico',
    category: 'loader',
    tags: ['加载器', '代理端']
  },


  {
    name: 'Geyser 间歇泉',
    url: 'https://geysermc.org/',
    desc: '允许 Minecraft 基岩版中的客户端加入您的 Minecraft Java 服务器',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/GeyserMC.png',
    category: 'project',
    tags: ['项目', '服务器']
  },
  {
    name: 'OptFine',
    url: 'https://optifine.net/',
    desc: 'MC显示优化模组，允许 Minecraft 运行得更快，看起来更好，完全支持高清纹理和许多配置选项',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/Optifine.png',
    category: 'project',
    tags: ['项目', '模组']
  },
  {
    name: 'Iris Shaders',
    url: 'https://www.irisshaders.dev/',
    desc: '新一代的开源光影模组，进入 MINECRAFT 图形新时代的镜头',
    logo: 'https://cdn.jsdelivr.net/gh/DavidBlackCN/my-icons@main/public/icon/Minecraft/IrisShaders.png',
    category: 'project',
    tags: ['项目', '模组']
  },
  
];