(function(){
	var loadJquery = function(_callback) {
		var _url = "http://l.bst.126.net/rsc/js/jquery-1.6.2.min.js";
		var _script = document.createElement('script');
		_script.type = 'text/javascript';
		(navigator.appVersion.indexOf("MSIE") != -1) ? _script.onreadystatechange = _callback
				: _script.onload = _callback;
		if (_url != '') {
			_script.src = _url;
		}
		document.getElementsByTagName('head')[0].appendChild(_script);
	};
	
	var isNosImage = function(_imgsrc){
		_imgsrc = _imgsrc || '';
		if(_imgsrc.indexOf('nos.netease.com')>=0 || _imgsrc.indexOf('nosdn.127.net')>=0){
			return true;
		} else{
			return false;
		}
	};
	
	//LOF-3084:统计从同步到网易号的内容来的个人主页访问量
	// 事件统计
	var eventStatistic = function(_s0, _s1, _s2, _s3, _callback, _timeout){
		_s0 = _s0 || '_trackEvent';
		_s1 = _s1 || '';
		_s2 = _s2 || '';
		_s3 = _s3 || '';
		_timeout = _timeout || 400;
		if(!!_callback && 'function'== typeof _callback){
			var _fn = (function(_callback){
				var cb = function(){
					if(!cb.isExeced){
						cb.isExeced = true;
						_callback();
					}
				};
				return cb;
			})(_callback);

			setTimeout(_fn,_timeout);

			window['_gaq'].push(['_set','hitCallback',_fn]);
		}

		window['_gaq'].push([_s0,_s1,_s2,_s3]);
		window['_gaq'].push(['_set', 'hitCallback',null]);
	};
	
	var commonFunc = function() {
		if (!!window.Theme&&!!window.Theme.ImageProtected) {
			$(document).delegate('img', 'contextmenu', function(event){
				if (isNosImage($(this).attr('src')) || /^http:\/\/img(lf\d*|size|\d*)\.ph\.126\.net\/.+$/.test($(this).attr('src'))) {
					 $("#context_content").remove();
		             $("<div id='context_content' oncontextmenu='return false;' style='z-index:99999;color:#fff;position:absolute;background:#000;padding:8px;opacity:.8;filter:alpha(opacity=80);border-radius:3px;'>" + window.Theme.ContextValue + "</div>").appendTo("body")
		                .css("left", event.pageX)
		                .css("top", event.pageY)
		                .show().delay(3000).fadeOut('fast');
					event.returnValue=false;
					return false;
				}
			});
			$(document).click(function(event){
				$("#context_content").remove();
			});
			$('img').click(function(event){
				$("#context_content").remove();
			});
		}

		if (!!window.pagewidget) {
			$('input').bind('keydown', function(event){
				event.stopPropagation();
		        return true;
			});
			$(document).bind('keydown', function(event){
				if (!!window['__photo_showing_lock__']) {
					return true;
				}
				if (event.keyCode == 75 || event.keyCode == 39) {
					var nextLink = $('#__next_permalink__').attr('href');
					if (!!nextLink) {
						location.href = nextLink;
					}
					return false;
				}
				if (event.keyCode == 74 || event.keyCode == 37) {
					var prevLink = $('#__prev_permalink__').attr('href');
					if (!!prevLink) {
						location.href = prevLink;
					}
					return false;
				}
			});
		}
		
		//LOFTER-16520:LOFTER个人主页注册引导功能 (弹层逻辑)
		initLofterRegLoginLayer();
		
		//LOF-605:PC端门板功能 (前端修改)
		initUserSplashLayer();
		
		//LOF-3084:统计从同步到网易号的内容来的个人主页访问量
        if(location.href.indexOf('statiscode=fromneteasenoblog') >= 0){
        	eventStatistic('_trackEvent', 'LOFTER个人主页网易号入口', 'fromneteasenoblog', '');
        } else if(location.href.indexOf('statiscode=fromneteasenopost') >= 0){
        	eventStatistic('_trackEvent', 'LOFTER个人日志页网易号入口', 'fromneteasenopost', '');
        }
		
	};

	try {
		if(!window.jQuery) {
		   loadJquery(commonFunc);
		} else {
			$(document).ready(commonFunc);
		}
	} catch(e) {

	}
	
	
	//公用函数  开始
	//cookie相关
	var __cookies,                      // cookie数据缓存
    __resp = /\s*\;\s*/,            // cookie分隔符
    __date = new Date(),            // cookie涉及的时间处理对象
    __currentms = __date.getTime(), // 当前时间值
    __milliseconds = 24*60*60*1000; // 一天的毫秒数值
	
	var __getCookieStr = function(_key,_value){
	    if (arguments[3])
	        __date.setTime(__currentms+arguments[3]*__milliseconds);
	    var _path = arguments[4]?('path='+arguments[4]+';'):'',
	        _domain = arguments[2]?('domain='+arguments[2]+';'):'',
	        _expires = arguments[3]?('expires='+__date.toGMTString()+';'):'';
	    return _key+'='+_value+';'+_domain+_path+_expires;
	};
	
	var getCookie = function(_key){
	    return __cookies[_key]||'';
	};
	
	var delCookie = function(_key){
	    document.cookie = __getCookieStr(_key,'',arguments[1],-100,arguments[2]);
	    delete __cookies[_key];
	};
	
	var setCookie = function(_key,_value){
	    document.cookie = __getCookieStr.apply(null,arguments);
	    __cookies[_key] = _value;
	};
	
	var refreshCookie = function(){
	    __cookies = {};
	    for(var i=0,_arr=document.cookie.split(__resp),l=_arr.length,_index;i<l;i++){
	        _index = _arr[i].indexOf('=');
	        __cookies[_arr[i].substring(0,_index)] = _arr[i].substr(_index+1);
	    }
	};
	
	refreshCookie();
	
	var trim = function(_str) {
		if(_str!=null) {
			return _str.replace(/(^\s*)|(\s*$)/g, "");
		} else {
			return null;
		}
	};
	
	var getParmvalByKey = function(_url,_key,_separator){
		_url = _url || '';
		_separator = _separator || '?';
	    _url = trim(_url);
	    if(_separator!='#'){
	    	var _index = _url.indexOf('#') || 0;
	    	if(_index>=0){
	    		_url = _url.substring(0,_index);
	        }
	    }
	    _url = _url.substr(_url.indexOf(_separator)+1);
	    
	    if (!_url) return '';
	    _url = _url.split('&');
	    for(var i=0,l=_url.length,d;i<l;i++){
	        d = _url[i].indexOf('=');
	        if(_url[i].substring(0,d) === _key){
	            return _url[i].substr(d+1)||'';
	        }
	    }
	    return '';
	};
	
	//事件相关
	var stopBubble = function(_event) {
		_event = _event ? _event : window.event;
		if(!_event) return;
		if(!!(window.attachEvent &&!window.opera)) {
			_event.cancelBubble = true;
		} else {
			_event.stopPropagation();
		}
		return _event;
	};
	
	var stopDefault = function(_event){
		_event = _event ? _event : window.event;
		if (!_event) return;
	    !!_event.preventDefault
	    ? _event.preventDefault()
	    : _event.returnValue = false;
	};
	
	var stopEvent = function(_event){
		stopBubble(_event);
		stopDefault(_event);
	};
	
	var addEvent = function(_element,_type,_handler,_capture){
		_element = getElement(_element);
		if (!_element||!_type||!_handler) return;
		if (!!document.addEventListener) {
			_element.addEventListener(_type,_handler,!!_capture);
		}else{
			_element.attachEvent('on'+_type,_handler);
		}
	};
	
	var delEvent = function(_element,_type,_handler,_capture){
		 _element = getElement(_element);
		if (!_element||!_type||!_handler) return;
		if (!!document.addEventListener) {
			_element.removeEventListener(_type,_handler,!!_capture);
		}else{
			_element.detachEvent('on'+_type,_handler);
		}
	};
	
	var getElement = function(_element){
		if(typeof _element == 'string' || typeof _element == 'number'){
			_element = document.getElementById(_element);
		}
		return _element;
	};
	
	//执行正则式
	var isExpectedString = function(pattern,str){
		if(pattern.test(str)) {		
			return true;
		} else{
			return false;
		}
	};
	
	//判断某节点是否包含指定class
	var hasClassName = function(_element,_classname){
		_classname = trim(_classname);
		if(!_element || !_element.className || !_classname) return false;
		
		var _classnamepattern = "\\s+" + _classname + "\\s+";
		var _reg = new RegExp(_classnamepattern);
		return isExpectedString(_reg," "+ _element.className +" ")
	};
	
	var addClassName = function(_obj,_classname) {
		if(!hasClassName(_obj,_classname)){
			_obj.className = _obj.className + " " + _classname;
		}
	};
	
	var delClassName = function(_obj,_classname) {
		if(!!hasClassName(_obj,_classname)){
			var _classnamepattern = "(^" + _classname + "\\s+)" + "|" + "(\\s+" + _classname + "\\s+)"  + "|" + "(\\s+" + _classname + "$)";
			var _reg = new RegExp(_classnamepattern,'g');
			_obj.className = _obj.className.replace(_reg, " ");
		}
	};
	
	//通过className 取得dom元素
	var getElementsByClassName = function(_fatherobj,_classname){
		var _element = [];
		_fatherobj = getElement(_fatherobj);

		if(typeof _fatherobj != "object" || _fatherobj == null){
			_fatherobj = document;
		}
	
		var _el = _fatherobj.getElementsByTagName('*');
		
		for (var i=0; i<_el.length; i++ ) {
			if(hasClassName(_el[i],_classname)){
				_element[_element.length] = _el[i];
			}
		}
		return _element;
	};
	
	var statistic = function(_tjStr){
		try{
			var _img = new Image();
			_img.src = 'http://www.lofter.com/statistic.png?act=' + _tjStr + '&t=' + new Date().getTime();
		}catch(e){}
	};
	
	
	//公用函数  结束
	
	//LOFTER-16520:LOFTER个人主页注册引导功能 (弹层逻辑)
	function initLofterRegLoginLayer(){
		var __cookieKey1 = 'reglogin_doopen';
		var __cookieKey2 = 'reglogin_hasopened';
		var __cookieKey_loginFlag = 'reglogin_isLoginFlag';
		var __isLogin = true;
		var __isLogin4Control = true;
		var __mydomain = location.host || location.hostname;
		
		var justShowLayer = function(){
			var _options = {
					'class' : 'w-pagelayer-reglogin w-pagelayer-reglogin2',
					'html' : '',
					'isNeedAnimation' : true,
					'opacity' : 80,
					'bgcolor' : '#000',
					'zIndex' : 2000,
					'showClosedIcon' : true,
					'noDocClickDestroy'  :true,
					'notSetContMinHeight' : true,
					'cbClosedClick':function(){
						var _control_frame = document.getElementById('control_frame');
						if(!!_control_frame){
							_control_frame.style.visibility = '';
							_control_frame.style.opacity = 1;
						}
						
						//LOFTER-22102:个人主页去掉底部注册引导层，恢复右上角弹层，修改统计串
//						window.setTimeout(function(){
//							var _mRegGuideLayer = document.getElementById('m-regGuideLayer');
//							if(!!_mRegGuideLayer){
//								_mRegGuideLayer.style.visibility = '';
//								_mRegGuideLayer.style.opacity = 1;
//							}
//						},300);
						
						statistic('qbzcydtc_20150421_01');//统计关闭按钮点击量
					}._$bind(this),
					'cbAfterSetHtmlContent' : function(_lycont) {
						if(!!_lycont && !!_lycont.parentNode && !!_lycont.parentNode.parentNode && !!_lycont.parentNode.parentNode.parentNode){
							var _pagelayer = _lycont.parentNode.parentNode.parentNode;
							var _lyHeight = _pagelayer.clientHeight || 1;
							if(_lyHeight>380){
								_lycont.style.paddingTop = Math.floor((_lyHeight-380)/2) + 'px';
							} else{
								_lycont.style.paddingTop = 0;
							}
						}
					}._$bind(this)
			};
			
			//LOFTER-19159:个人主页弹层引导注册
			//LOFTER-19649:网首到文章页流量增加注册引导弹层 (统计)
			var _ifrmSrc = 'http://www.lofter.com/loginiframe?type=2&from=personalPage&target='+location.href;
			var _referrer = (document.referrer || '').toLowerCase();
			if(!!_referrer && _referrer.indexOf('http://www.163.com')==0){
				_ifrmSrc = _ifrmSrc + '#referrer=163home';
				statistic('qb163wytc_20150331_01');//来自网易首页统计弹层总弹出次数
			}
			_options.html = '<div class="m-reglogin">\
				                 <a id="closereglogin2" class="close" href="#" style="display:none;visibility:hidden;"><span>关闭</span></a>\
				                 <div class="iframewrap">\
				                     <iframe width="1080" height="600" frameborder="0" border="0" scrolling="no" marginheight="0" marginwidth="0" allowtransparency="true" src="' + _ifrmSrc + '"></iframe>\
				                 </div>\
				             </div>';
			
//			_options.html = '<div class="m-reglogin">\
//				                 <div style="display:none" class="logo">\
//				                     <h1 class="f1">LOFTER</h1>\
//				                     <h2 class="f2">快速<span class="f3">、</span>漂亮<span class="f3">、</span>有趣的记录方式</h2>\
//				                 </div>\
//				                 <div class="iframewrap">\
//				                     <iframe width="1080" height="670" frameborder="0" border="0" scrolling="no" marginheight="0" marginwidth="0" allowtransparency="true" src="http://www.lofter.com/loginiframe?from=personalPage&target='+location.href+'"></iframe>\
//				                 </div>\
//				             </div>';
			
			
			var _control_frame = document.getElementById('control_frame');
			if(!!_control_frame){
				_control_frame.style.opacity = 0;
				_control_frame.style.visibility = 'hidden';
			}
			
			//LOFTER-22102:个人主页去掉底部注册引导层，恢复右上角弹层，修改统计串
//			//LOFTER-20257:个人主页文章页引导注册弹层修改
//			var _mRegGuideLayer = document.getElementById('m-regGuideLayer');
//			if(!!_mRegGuideLayer){
//				_mRegGuideLayer.style.opacity = 0;
//				_mRegGuideLayer.style.visibility = 'hidden';
//			}

			var pageLayer = netease.lofter.widget.pageLayer._$getInstance(document.body, _options);
			var _close = document.getElementById('closereglogin2');
			if(!!_close && !!pageLayer){
				window.setTimeout(function(){
					_close.style.visibility = 'visible';
				},1000);
				
				_close.onclick = function(){
					pageLayer.destroy();
					if(!!_control_frame){
						_control_frame.style.visibility = '';
						_control_frame.style.opacity = 1;
					}
					
					if(!!_mRegGuideLayer){
						_mRegGuideLayer.style.visibility = '';
						_mRegGuideLayer.style.opacity = 1;
					}
					
					return false;
				};
				
			}
			
			statistic('qbgrzytc_20150210_06');//统计弹层总弹出次数
		};
		
		var showRegLoginLayer = function(){
			var _loginFlag = getCookie(__cookieKey_loginFlag);
			if(__isLogin && _loginFlag=='1') return;
			
			justShowLayer();
		};
		
		window.showRegLoginLayer = showRegLoginLayer;//接口全局化
		
		//LOFTER-16834:在非登陆状态下，用户在个人主页模板页面，第一次进入不弹出注册层，第二次弹出注册层，只弹出一次
		var _dealOpenLogic = function dealOpenLogic(){
			if(dealOpenLogic.isExeced) return;
			dealOpenLogic.isExeced = true;
			if(!__isLogin){
				var _doOpened = getCookie(__cookieKey1);
				var _hasOpened = getCookie(__cookieKey2);
				if(!!_hasOpened){
					delCookie(__cookieKey1,'lofter.com','/');
					if(!!__mydomain){
						delCookie(__cookieKey1,__mydomain,'/');
					}
				} else{
					if(!!_doOpened){
						delCookie(__cookieKey1,'lofter.com','/');
						setCookie(__cookieKey2,'1','lofter.com',365,'/');
						if(!!__mydomain){
							delCookie(__cookieKey1,__mydomain,'/');
							setCookie(__cookieKey2,'1',__mydomain,365,'/');
						}
						$(document).ready(showRegLoginLayer);
					} else{
						setCookie(__cookieKey1,'1','lofter.com',365,'/');
						if(!!__mydomain){
							setCookie(__cookieKey1,'1',__mydomain,365,'/');
						}
					}
				}
			}
		};
		
		//LOFTER-19649:网首到文章页流量增加注册引导弹层
		var _openRegLayerFrom163 = function openRegLayerFrom163(){
			if(openRegLayerFrom163.isExeced) return;
			openRegLayerFrom163.isExeced = true;
			
			var _hasOpened = getCookie(__cookieKey2);
			if(!!_hasOpened){
				delCookie(__cookieKey1,'lofter.com','/');
				if(!!__mydomain){
					delCookie(__cookieKey1,__mydomain,'/');
				}
			} else{
				delCookie(__cookieKey1,'lofter.com','/');
				setCookie(__cookieKey2,'1','lofter.com',365,'/');
				if(!!__mydomain){
					delCookie(__cookieKey1,__mydomain,'/');
					setCookie(__cookieKey2,'1',__mydomain,365,'/');
				}
				$(document).ready(showRegLoginLayer);
			}
		};
		
		var setLoginFlag = function(_islogin){
			__isLogin = _islogin || false;
			var _loginFlag = '';
			if(__isLogin) _loginFlag = '1';
			setCookie(__cookieKey_loginFlag,_loginFlag,'lofter.com',1,'/');
			if(!!__mydomain){
				setCookie(__cookieKey_loginFlag,_loginFlag,__mydomain,1,'/');
			}
			
			//LOFTER-19649:网首到文章页流量增加注册引导弹层
			var _referrer = (document.referrer || '').toLowerCase();
			if(!__isLogin && !!_referrer && _referrer.indexOf('http://www.163.com')==0){
				_openRegLayerFrom163();
				return;
			}
			
			
			
			_dealOpenLogic();
		};
		window.setLoginFlag = setLoginFlag;
		
		//LOFTER-21264:个人页面底部的注册浮层的登录标志，改成从顶部工具栏iframe获取
		var setLoginFlag4Control = function(_isLogin4Control){
			__isLogin4Control = _isLogin4Control || false;
		};
		window.setLoginFlag4Control = setLoginFlag4Control;
		
		//未登录用户点击图片，不允许查看大图，也弹出弹层
		var noShowBigPhoto = function(){
			var _ntmp = getElementsByClassName(document.body,'imgclasstag');
			if(!!_ntmp && _ntmp.length>0){
				var _len = _ntmp.length;
				for(var i=0;i<_len;i++){
					if(!!_ntmp[i]){
						addEvent(_ntmp[i],'mousedown',function(e){
							var _loginFlag = getCookie(__cookieKey_loginFlag);
							//if(__isLogin && _loginFlag=='1'){
							if(!!__mydomain && __mydomain.indexOf('.lofter.com')){
								if(__isLogin && _loginFlag=='1'){
									return;
								}
							} else{
								if(__isLogin){
									return;
								}
							}
							
							stopEvent(e);
							showRegLoginLayer();
							statistic('qbgrzytc_20150210_07');
						},true);
					}
				}
				
			}
			
		};
		noShowBigPhoto();
		
		//LOFTER-19159:个人主页弹层引导注册
		(function(){
			var _mciframe = document.getElementById('morecontent_frame');
			if(!!_mciframe) return;
			var _iframe = document.createElement('iframe');
			_iframe.style.display = 'none';
			document.body.appendChild(_iframe);
			var _control_frame = document.getElementById('control_frame');
			
			var _blogId = getParmvalByKey(_control_frame.src,'blogId','?');
			
			_iframe.src = 'http://www.lofter.com/recommend?blogId=' + _blogId;
		})();
		
		
//		$('#__prev_permalink__').bind('click', function(event){
//			if(__isLogin) return;
//			var _doOpened = getCookie(__cookieKey1);
//			var _hasOpened = getCookie(__cookieKey2);
//			if(!_hasOpened){
//				setCookie(__cookieKey1,'1','lofter.com',365,'/');
//			} else{
//				delCookie(__cookieKey1);
//			}
//		});
//		
//		$('#__next_permalink__').bind('click', function(event){
//			if(__isLogin) return;
//			var _doOpened = getCookie(__cookieKey1);
//			var _hasOpened = getCookie(__cookieKey2);
//			if(!_hasOpened){
//				setCookie(__cookieKey1,'1','lofter.com',365,'/');
//			} else{
//				delCookie(__cookieKey1);
//			}
//		});
//		
//		var _doOpened = getCookie(__cookieKey1);
//		var _hasOpened = getCookie(__cookieKey2);
//		if(!!_hasOpened){
//			delCookie(__cookieKey1);
//			//refreshCookie();
//		} else{
//			if(!!_doOpened){
//				delCookie(__cookieKey1);
//				setCookie(__cookieKey2,'1','lofter.com',365,'/');
//				//refreshCookie();
//				$(document).ready(showRegLoginLayer);
//			}
//		}
		
		
		//LOFTER-20257:个人主页文章页引导注册弹层修改
        (function(){
        	var __getScrollTop = function(){
        	    return window.pageYOffset
                        || document.documentElement.scrollTop  
                        || document.body.scrollTop  
                        || 0;
            };

            var initRegGuideLayer = function(){
            	var _loginFlag = getCookie(__cookieKey_loginFlag);
            	//LOFTER-20310:safari下，已登录后，访问独立域名，底部仍然显示注册栏。不正确
//            	if(__isLogin && _loginFlag=='1'){
//					return;
//				}
            	if(__isLogin || __isLogin4Control){
					return;
				}
        		
        	    var _adnode = document.createElement('div');
        	    _adnode.id = 'm-regGuideLayer';
        		_adnode.className = 'm-regGuideLayer f-trans';
        		_adnode.innerHTML = '<div class="bg"></div><div class="shadow"></div><div class="regwrap"><span class="tip">加入LOFTER</span><a class="goreg" href="http://www.lofter.com/regurs?urschecked=true&act=qbdbmc_20150522_01&target=' + encodeURIComponent(location.href) +'">注册</a></div>';
        		
        		var _goreg = (getElementsByClassName(_adnode,'goreg')||[])[0];
        		addEvent(_goreg, 'click', function(_event){
        			stopEvent(_event);
        			window.setTimeout(function(){
        			    location.href = _goreg.href;
        			},300);
        		});
        		
        		document.body.appendChild(_adnode);
        		
        		var __timer = null;
        		addEvent(window, 'scroll', function(){
        		    //if(!!__timer) __timer = window.clearTimeout(__timer);
        		    //__timer = window.setTimeout(function(){
        			    var _scrollTop = __getScrollTop();
        				var _clientHeight = document.documentElement.clientHeight || 1;
        				var _scrollHeight = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight) || 0;
        				
        				if(_scrollHeight<1000) return;
        				
        				var _height = Math.floor(_clientHeight*0.15);
        				var _padding = 0;
        				if(_height>80){
        					_padding = Math.floor((_height-80)/2);
        				} else{
        					_height = 80;
        					_padding = 0;
        				}
        				_adnode.style.paddingTop = _padding + 'px';
    					_adnode.style.paddingBottom = _padding + 'px';
        				
        				if(_scrollTop>100 && (_scrollTop+_clientHeight)<=(_scrollHeight-3)){
        					_adnode.style.marginBottom = 0;
        				    if(!hasClassName(_adnode,'js-show-regGuideLayer')){
        			            addClassName(_adnode,'js-show-regGuideLayer');
        			            statistic('qbdbmc_20150522_02');
        					}
        			    } else{
        			        delClassName(_adnode,'js-show-regGuideLayer');
        			        _adnode.style.marginBottom = '-' + _height + 'px';
        			    }
        			//},300);
        		});
        	}
        	
            //LOFTER-22102:个人主页去掉底部注册引导层，恢复右上角弹层，修改统计串
        	//window.setTimeout(initRegGuideLayer,1500);
        })();
		
		
	}
	
	//LOFTER-21302:dashboard、个人主页、文章页增加iframe
//	window.setTimeout(function(){
//	    var _iframe = document.createElement('iframe');
//		_iframe.style.display = 'none';
//		document.body.appendChild(_iframe);
//		_iframe.src = 'http://rd.da.netease.com/redirect?t=88n7jx&p=7hsCgg&proId=1024&target=www.kaola.com';
//	},3000);
	
	//LOF-605:PC端门板功能 (前端修改)
	//LOF-711:PC门板优化，支持三张图片
	var __usersplashNodeList;
	var __bodyOverflowY;
	
	function initUserSplashLayer(){
		var _ntmp = getElementsByClassName(document.body,'m-usersplash') || [];
		__usersplashNodeList = _ntmp;
		
		for(var i=0;i<_ntmp.length;i++){
			var _usersplashNode = _ntmp[i];
			if(!!_usersplashNode){
				addClassName(_usersplashNode,'m-usersplash-show');
				window.setTimeout((function(_node){
					return function(){addClassName(_node,'f-trans')};
				})(_usersplashNode),300);
				
				var _img = (_usersplashNode.getElementsByTagName('img')||[])[0];
				if(!!_img && _img.parentNode.parentNode ==_usersplashNode && !_img.src){
					var _lazysrc = _img.getAttribute('lazysrc');
					_img.src = _lazysrc;
				}
			}
		}
	}
	
	function showUserSplashLayer(_splashIdx,_img,_imgwidth,_imgHeight){
		if(!_img || !_img.parentNode || !_img.parentNode.parentNode || !hasClassName(_img.parentNode.parentNode,'m-usersplash')){
			return;
		}
		
		var _usersplashNode = _img.parentNode.parentNode;
		addClassName(_img,'js-imgshow');
		window.setTimeout(function(_img){
			addClassName(_img,'js-imgshow-animate');
		}._$bind(this,_img),300);
		
		//以下为正常逻辑
		if(!!_img.src){
			var _body0 = document.documentElement || document.body;
			if(__bodyOverflowY===undefined){
				__bodyOverflowY = _body0.style.overflowY;
			}
			
			var _oldClientWidth = _body0.clientWidth || 1;
			var _oldClientHeight = _body0.clientHeight || 1;
			
			if(_imgwidth>_oldClientWidth){
				_imgHeight = _imgHeight*_oldClientWidth/_imgwidth;
				_imgwidth = _oldClientWidth;
				_img.style.width = '100%';
			}
			
		    if(__bodyOverflowY!='hidden'){
		    	_body0.style.overflowY = 'hidden';
				//修正滚动条隐藏后的body区实际宽度变化
				var _clientWidth = _body0.clientWidth || 0;
				if(_clientWidth>_oldClientWidth){
					_body0.style.paddingRight = (_clientWidth - _oldClientWidth) + 'px';
					_body0.style.width = 'auto';//html的宽度为auto才生效
				}
		    }
			
			_body0.style.overflowY = 'hidden';
			//_usersplashNode.style.display = 'table';
			
			if(_imgHeight>_oldClientHeight){
				_usersplashNode.style.display = 'block';
				_img.parentNode.style.display = 'block';
			}
			
			addEvent(_usersplashNode, 'click', function(_splashIdx,_body0,_usersplashNode,_event){
				stopEvent(_event);
				
				_splashIdx = _splashIdx || 0;
				var _nxtNode = __usersplashNodeList[_splashIdx+1];
				
				delClassName(_usersplashNode,'m-usersplash-show-animate');
				window.setTimeout(function(){
					delClassName(_usersplashNode,'m-usersplash-show');
					_usersplashNode.style.display = 'none';
				}._$bind(this),300);
				
				if(!_nxtNode){
					_body0.style.paddingRight = 0;
					_body0.style.overflowY = __bodyOverflowY;
					window.setTimeout(function(){
						_usersplashNode.parentNode.style.display = 'none';
					}._$bind(this),300);
				}
				
			}._$bind(this,_splashIdx,_body0,_usersplashNode));
		}
		
	}
	
	window.initUserSplashLayer = initUserSplashLayer;
	window.showUserSplashLayer = showUserSplashLayer;
	
	//LOF-1456 获取referrer
	this.__controlIframe = document.getElementById("control_frame");
	var _referrer = document.referrer;
	window.addEventListener("message",function(_event){
		if(_event.data == "start"){
			this.__controlIframe.contentWindow.postMessage(_referrer, "*");
		}
	}._$bind(this));

})();


