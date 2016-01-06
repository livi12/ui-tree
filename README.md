#乐课ui的插件的使用

## 原理：
乐课上使用的ui-tree实际是对[ui-tree.js](http://www.ztree.me/v3/api.php)进行了一定的包装。
ui-tree.js是基于jquery开发的，leke网中的[ui-tree-3.5.js](http://tutor.leke.cn/scripts/common/ui/ui-tree/ui-tree-3.5.js)只包含`core`+`excheck`+`exdit`,不包含exhide文件，则下面zTree的setting配置和zTree方法中前面带有`H`的方法和设置均不能用。

##调用方法
###本例子
该例子中未对Tree.js用sea.js封装，所以可以通过直接调用Tree.js中的TreeFactory的createTree方法，创建树结构，需要引用`zTreeStyle.css` ，`jquery` ， `ztree.core-3.5.js`可以根据需要引用其他的ztree.xx.js

```javascript
var zTree =TreeFactory.createTree('#tree',setting,zNodes);
```
###乐课网
乐课网中的Tree.js用sea.js封装了，只对外开放了两个方法`createTree`和`getZTreeObj`方法，原生的ui-tree.js方法中还有的两个方法`destroy`和`_z`方法不能使用。


`createTree`初始化方法，返回zTree对象（json），提供操作 zTree 的各种方法，对于通过 js 操作 zTree 来说必须通过此对象
`getZTreeObj`返回zTree 对象，提供操作 zTree 的各种方法，对于通过 js 操作 zTree 来说必须通过此对象


调用时需要先引用封装好的Tree.js方法，以乐课中的页面中的一个例子为例

```javascript
	var tree = require('tree');
	tree.createTree('#structTemplateTree', {
	  	view: {
		  	addHoverDom : self.addHoverDom,
			removeHoverDom: self.removeHoverDom,
			selectedMulti: false
		},
		edit : {
			enable : true,
			editNameSelectAll : true,
			showRemoveBtn : self.showRemoveBtn,
			showRenameBtn : self.showRenameBtn,
			removeTitle: "删除部门",
			renameTitle: "修改部门"
		},
	  	data : {
			simpleData: {
				enable: true
			}
	  	},
		callback: {
			beforeEditName: self.beforeEditName,
			beforeRemove: self.beforeRemove,
			beforeRename: self.beforeRename,
			onRemove: self.onRemove,
			onRename: self.onRename,
			beforeClick : self.beforeClick,
			onClick : self.onClick
		}
	}, depList);

	tree.getZTreeObj('structTemplateTree').expandAll(true);//展开全部节点

```
##Params
以下，对上面例子中的参数进行说明，以乐课网封装的一些方法进行解释

createTree(container, settings, nodes)
container为生成树节点的容器
setting设置树的参数，具体参数的设置可以参考[ui-tree.js的文档](http://www.ztree.me/v3/api.php)，乐课网中添加了部分参数可供选择
当`settings.async.url`为false时，可以设置 settings.async.service 现有取值可取 `defaultTreeContent`  `knowledgeTreeDataService`  `materialTreeDataService` 拼接成`settings.async.url`的路径 __settings.async.url = window.ctx +　'/tag/tree/' + settings.async.service + '/queryTreeNodes.htm'__
settings.data.simpleData.rootText 设置根节点，`这个属性会把所有的直接子节点和间接子节点都当成这个的直接子节点`
settings.check.chkStyle为这个属性设置值，且值settings.check.chkStyle为true时，可不用设置settings.check.chkStyle

##html

```html
<ul class="structTemplateTree"></ul>
```

###`createTree`方法中的第三个参数zTreeNodes的格式

~~~ sh
zTreeNodes的格式为Array(JSON) / JSON
zTreeNodes = [
		{"name":"网站导航", open:true, children: [
			{ "name":"google", "url":"http://g.cn", "target":"_blank"},
			{ "name":"baidu", "url":"http://baidu.com", "target":"_blank"},
			{ "name":"sina", "url":"http://www.sina.com.cn", "target":"_blank"}
			]
		}
	];

指定父元素的节点pid
  zTreeNodes =  [
		{id:1, pId:0, name:"[core] Basic Functions", open:false},
		{id:101, pId:1, name:"Standard JSON Data", file:"core/standardData"},
		{id:102, pId:1, name:"Simple JSON Data", file:"core/simpleData"},
		{id:202, pId:2, name:"Simple JSON Data2", file:"core/simpleData"}
		{id:201, pId:2, name:"Standard JSON Data3", file:"core/standardData"},
		];

~~~