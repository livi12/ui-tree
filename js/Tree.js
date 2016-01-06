
	var _ztree_defaults_nodes = [{name:'暂无数据',isParent:false}];

	var _ztree_defaults_settings = {
		context: window.ctx,
		async : {
			autoParam : ['id'],
			dataType : 'json',
			otherParam : [],
			type : 'POST',
			service: null,
			url : null,
			enable : true
		},
		callback : {
		},
		data : {
			key : {
				name : 'name'
			},
			simpleData : {
				enable : true,
				rootPId : '0',
				rootValue : '0',
				rootText: null,
				icon: '',
				open: true
			}
		},
		view : {
			showIcon : true,
			showLine : true,
			showTitle : true,
			firstLevel: true,
			dblClickExpand : true,
			updateNodeIcon: true,
			selectedMulti : false
		},
		edit : {
			drag : {
				isCopy : false,
				isMove : false
			},
			enable : false,
			showRemoveBtn : false,
			showRenameBtn : false
		},
		check : {
			enable: false,
			chkStyle: null,
			chkboxType: null
		}
	};

	var TreeFactory = {
		createTree: function(container, settings, nodes){
			var _settings = $.extend(true, {}, _ztree_defaults_settings, settings);
			var $el = $(container);
			TreeFactory._config(_settings, $el);
			nodes = TreeFactory._initNodeData(_settings, nodes);
			var tree = $.fn.zTree.init($el, _settings, nodes);
			tree = TreeFactory._extendTreeNode(tree);
			TreeFactory._afterCreateConfig(tree);
			return tree;
		},
		/**
		 * after tree create, setting tree default callback function.
		 */
		_afterCreateConfig: function(tree){
			//expand two level
			if (tree.setting.view.firstLevel) {
				tree.setting.callback.onAsyncSuccess = function(e,tid,node,ns){
					if (!node && $.isArray(ns)){
						var n = tree.getNodes()[0];
						if(n && !n.children){
							tree.reAsyncChildNodes(n);
						}
						tree.expandNode(n);
					}
				}
				//if tree has rootNode and is a synchronized tree, auto load next level.
				if (tree.setting.data.simpleData.rootText && tree.setting.async.enable) {
					var rNood = tree.getNodesByParam('pId', tree.setting.data.simpleData.rootValue)[0];
					tree.reAsyncChildNodes(rNode, 'refresh');
				}
			}
			//if node has no children and after loading has no children too, set no to leaf node.
			tree.setting.callback.onExpand = function(event, tid, node){
				if(node&&(!node.children||!node.children.length)){
					node.isParent = false;
					tree.updateNode(node);
				}
			}
		},
		/**
		 * extend tree function, add show, hide and override updateNode function.
		 */
		_extendTreeNode: function(tree){
			$.extend(tree, {
				show: function(){
					$('#' + this.setting.treeId).show();
					return this;
				},
				hide: function(){
					$('#' + this.setting.treeId).hide();
					return this;
				},
				updateNode: function(node, checkTypeFlag){
					if (!node) return;
					var nObj = $("#" + node.tId);
					if (nObj.get(0) && $.fn.zTree._z.tools.uCanDo(this.setting)) {
						$.fn.zTree._z.view.setNodeName(this.setting, node);
						$.fn.zTree._z.view.setNodeTarget(node);
						$.fn.zTree._z.view.setNodeUrl(this.setting, node);
						if (this.setting.view.updateNodeIcon) {
							$.fn.zTree._z.view.setNodeLineIcos(this.setting, node);
						}
						$.fn.zTree._z.view.setNodeFontCss(this.setting, node);
					}
				}
			});
			tree.callback = tree.setting.callback;
			return tree;
		},
		/**
		 * if nodes is empty and is synchronized tree.
		 */
		_initNodeData: function(settings, nodes){
			var _nodes = nodes;
			if (settings.data.simpleData.rootText) {
				var rootNode = {isParent:true};
				rootNode[settings.data.key.name] = settings.data.simpleData.rootText;
				rootNode.icon = settings.data.simpleData.icon;
				rootNode.open = settings.data.simpleData.open;
				var rootValue = settings.data.simpleData.rootValue;
				for (var i in settings.async.autoParam) {
					var param = settings.async.autoParam[i];

					if (param.indexOf('=') > -1) {
						param = param.split('=')[0];
					}
					rootNode[param] = rootValue;
				}
				if ($.isArray(_nodes) && _nodes.length) {
					rootNode.children = _nodes;
				}
				_nodes = [rootNode];
			} else if (!settings.async.url && (!$.isArray(_nodes) || !_nodes.length)) {
				_nodes = _ztree_defaults_nodes;
			}
			return _nodes;
		},
		/**
		 * init config info.
		 */
		_config: function(settings, container){
			if (!container.hasClass('ztree')) {
				container.addClass('ztree');
			}
			//config async modules
			if (settings.async.service && !settings.async.url) {
				settings.async.url = window.ctx +　'/tag/tree/' + settings.async.service + '/queryTreeNodes.htm';
			}
			if (!settings.async.url) {
				settings.async.enable = false;
			}
			//config check modules
			if (settings.check.chkStyle) {
				if (settings.check.chkStyle != 'checkbox') {
					settings.check.chkStyle = 'radio';
				}
				settings.check.enable = true;
			}
		}
	};

