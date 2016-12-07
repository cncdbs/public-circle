var toast;

var photoBrowserPhotos = [];
var photoBrowserStandalone ;

function toast_show(info){
    toast = myApp.toast(info, '', {});
    toast.show();
}
function toast_hide(info){toast.show();}


function isWeiXin(){
  var ua = window.navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
   return true;
  }else{
    return false;
  }
} 


//操作条点击
    var controlbarhandler=function(){
        $$controlbarobj=$$(this).next();
        if($$controlbarobj.css('display') =="none"){
            $$controlbarobj.show('slow');
        }else{
             $$controlbarobj.hide(1000);
        }
        event.stopPropagation();
    }
    var zanhandler=function(){
            $$this=$$(this);
            album_id=$$this.parent().attr('data-album-id');
            $$.getJSON('index.php?i='+weid+'&c=entry&do=like&m=yeo_public_circle', {album_id: album_id}, function (data) {
                //替换点赞区域
                if(data.is_like==1){
                    $$this.html('取消');
                }else{
                    $$this.html('赞');
                }
                $$this.parent().parent().parent().find('.like').html('<img src="../addons/yeo_public_circle/resource/images/l.png">'+data.likeusers);
            });
        }
    var pinglunhandler=function(){
             $$('#coment_bar').css('display','');
             $$('.comment_text').attr('placeholder',"评论" );
             $$('.comment_text').attr('data-album_id',$$(this).parent().attr('data-album-id') );
             $$('.comment_text').attr('data-re_uid',$$(this).parent().attr('data-uid') );
             $$('.comment_text').focus();
        }
    var huifuhandler=function(){
            $$('#coment_bar').css('display','');
             holdertext='回复'+$$(this).find(' span').html();
             $$('.comment_text').attr('placeholder',holdertext );
             $$('.comment_text').attr('data-album_id',$$(this).parent().attr('data-album-id') );
             $$('.comment_text').attr('data-re_uid',$$(this).find(' span').attr('data-uid') );
             $$('.comment_text').val('');
             $$('.comment_text').focus();
        }
    var reviewhandler=function(){
            $$this=$$(this);
            album_id=$$this.parent().parent().attr('data-album-id');
            var actionSheetButtons = [
                // First buttons group
                [
                    // First button
                    {
                        text: '通过',
                        color:'green',
                        bold: true,
                        onClick: function () {
                            $$.get('index.php?i='+weid+'&c=entry&do=review&m=yeo_public_circle', {album_id:album_id,status:1}, function (data) {
                                $$this.html('已通过');
                            });
                        }
                    },
                    // Another red button
                    {
                        text: '拒绝',
                        color:'red',
                        bold: true,
                        onClick: function () {
                           $$.get('index.php?i='+weid+'&c=entry&do=review&m=yeo_public_circle', {album_id:album_id,status:2}, function (data) {
                                //更改状态
                                $$this.html('未通过');
                            });
                        }
                    }
                ],
            ];
            myApp.actions(actionSheetButtons);
        }
    var hidesenderhandler=function () {
            $$('#coment_bar').css('display','none');
        }
    var sendmsghandler=function()
    {
            album_id=$$('.comment_text').attr('data-album_id');
            re_uid=$$('.comment_text').attr('data-re_uid');
            comment=$$('.comment_text').val();
            //alert(comment);
            $$.ajax({
                url: 'index.php?i='+weid+'&c=entry&do=reply&m=yeo_public_circle',
                method: 'POST',
                dataType: 'json',
                data: {
                    album_id: album_id,
                    re_uid: re_uid,
                    comment: comment
                },
                success: function (data) {
                   $$.get('index.php?i='+weid+'&c=entry&do=comments&m=yeo_public_circle', {album_id:album_id}, function (data) {
                    $$('#comment-'+album_id).html(data);
                    controlunbindevent();
                    controlbindevent();
                   });
                }
            });
    }

    var pickphotoshandler=function()
    {
        //提取图片数据
        obj=this;   //当前点击的图片
        cur_index=0;
        $$('.list-img').each(function(index, el) {
            if(el==obj){
                cur_index=index;
            }
            img={
                url: $$(this).attr('src'),
                caption: $$(this).parent().prev().html()
            }
            photoBrowserPhotos[index]=img;
        });
        //alert(photoBrowserPhotos.length);
        photoBrowser = myApp.photoBrowser({
            photos: photoBrowserPhotos,
            theme: 'dark',
            //type: 'popup'
        });
        photoBrowser.open(cur_index);
    }

    var reviewcommenthandler=function(){
        $$this=$$(this);
            comment_id=$$this.parent().attr('data-cid');
            var actionSheetButtons = [
                // First buttons group
                [
                    // First button
                    {
                        text: '通过',
                        color:'green',
                        bold: true,
                        onClick: function () {
                            $$.get('index.php?i='+weid+'&c=entry&do=reviewcomment&m=yeo_public_circle', {comment_id: comment_id,status:1}, function (data) {
                                $$this.html('已通过');
                            });
                        }
                    },
                    // Another red button
                    {
                        text: '拒绝',
                        color:'red',
                        bold: true,
                        onClick: function () {
                           $$.get('index.php?i='+weid+'&c=entry&do=reviewcomment&m=yeo_public_circle', {comment_id: comment_id,status:2}, function (data) {
                                //更改状态
                                $$this.html('未通过');
                            });
                        }
                    }
                ],
            ];
            myApp.actions(actionSheetButtons);

        event.stopPropagation();
    }

    //取消操作绑定
    function controlunbindevent()
    {
        //绑定点赞事件
        $$('.js-like').off('click',zanhandler);
        $$('.js-comment').off('click',pinglunhandler);
        $$('.cmt-list>p').off('click',huifuhandler);
        $$('.js-review').off('click',reviewhandler);
        //隐藏评论条
        $$('.comment_text').off('click');
        $$('.list-img').off('click', pickphotoshandler);
        $$('.controlbtn').off('click', controlbarhandler);
        $$('.js-review-comment').off('click',reviewcommenthandler);
    }
    //操作绑定事件
    function controlbindevent()
    {
        //绑定点赞事件
        $$('.js-like').on('click' ,zanhandler);
        $$('.js-comment').on('click' ,pinglunhandler);
        $$('.cmt-list>p').on('click' ,huifuhandler);
        $$('.js-review').on('click' ,reviewhandler);
        //隐藏评论条
        $$('#coment_bar .js-send').on('touchstart' ,sendmsghandler);
        $$('.comment_text').on('blur', hidesenderhandler);
        //图片浏览
        $$('.list-img').on('click', pickphotoshandler);
        //点赞评论条按钮
        $$('.controlbtn').on('click', controlbarhandler);
        $$('.js-review-comment').on('click',reviewcommenthandler);
    }
//====================================
// Initialize your app
var myApp = new Framework7({
    modalTitle:  '',                              //弹层默认标题
    modalButtonOk:  '确定',                           //弹层确定按钮的默认文案
    modalButtonCancel:  '取消',                        //弹层取消按钮的默认文案
    modalPreloaderTitle:  '加载中...',
    pushState: true,                                //用户可通过浏览器默认的前进后退按钮来操作
    domCache: false,                                 //如果设置为true，则所有上一步的页面都不会从DOM中被删除。有的时候这个设置会很有用，比如你有一个表单有5步操作，你想从第5步访问第一步的页面的时候
     cache: false,
    onAjaxStart: function (xhr) {                   //当Ajax请求开始时调用，该函数会传递一个xhr对象作为参数
        myApp.showIndicator();                      // Hide and show indicator during ajax requests
    },
    onAjaxComplete: function (xhr) {                //当Ajax请求结束时调用。该函数会传递一个xhr对象作为参数
        myApp.hideIndicator();                      // Hide and show indicator during ajax requests
    },
    init:false     //手动初始化
});



// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    myApp.hideIndicator();
});



var mySwiper = myApp.swiper('.swiper-container', {
    autoplay:2000,
    autoplayDisableOnInteraction: false,
});



//返回后重置无限滚动事件
myApp.onPageBack('index', function (page) {
    myApp.detachInfiniteScroll($$('.infinite-scroll'));
    myApp.attachInfiniteScroll($$('.infinite-scroll'));
    $$('.scroll-loading').html('loading');
});
myApp.onPageInit('index', function (page) {
    $$('body').on('click',function(event){
        $$('.controlbar').css('display','none');
        //return false;
    })

//绑定操作事件
controlbindevent();


//绑定发表事件

// ========上拉无限加载
    // Loading trigger
    var loading = false;
    // Last loaded index, we need to pass it to script
    var lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
    // Attach 'infinite' event handler
    $$('.infinite-scroll').on('infinite', function () {
        // Exit, if loading in progress
        $$('.scroll-loading').html('loading...');
        if (loading) return;
        // Set loading trigger
        loading = true;
        // Request some file with data
        $$.get('index.php?i='+weid+'&c=entry&do=index&m=yeo_public_circle', {tpl:'momentlist',leftIndex: lastLoadedIndex }, function (data) {
            loading = false;
            if (data === '') {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                myApp.detachInfiniteScroll($$('.infinite-scroll'));
                $$('.scroll-loading').html('加载完毕');
            }
            else {
                // Append loaded elements to list block
                $$('.infinite-scroll .list-block ul').append(data);
                controlunbindevent();
                controlbindevent();
                // Update last loaded index
                lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
            }
        });
    });



    // ========下拉刷新页面
    var ptrContent = $$('.pull-to-refresh-content');
    
    //alert(last_album_id);
    // 添加'refresh'监听器
    ptrContent.on('refresh', function (e) {
        var last_album_id = $$('.pull-to-refresh-content .list-block li:first-child').attr('data-album-id');
        // 模拟2s的加载过程
        setTimeout(function () {
            
           $$.get('index.php?i='+weid+'&c=entry&do=index&m=yeo_public_circle', {tpl:'momentlist',last_album_id: last_album_id}, function (data) {
            if (data === '') {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
            }
            else {
                // 前插新列表元素
                ptrContent.find('ul').prepend(data);
                controlunbindevent();
                controlbindevent();
            }
        });
            // 加载完毕需要重置
            myApp.pullToRefreshDone();
        }, 1000);
    });


});


myApp.onPageBack('moments', function (page) {
    myApp.detachInfiniteScroll($$('.infinite-scroll'));
    myApp.attachInfiniteScroll($$('.infinite-scroll'));
});
//官方发布
myApp.onPageInit('moments', function (page) {
 $$('body').on('click',function(event){
        $$('.controlbar').css('display','none');
        //return false;
    })
//绑定操作事件
controlbindevent();
//绑定发表事件

// ========上拉无限加载
    // Loading trigger
    var loading = false;
    // Last loaded index, we need to pass it to script
    var lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
    // Attach 'infinite' event handler
    $$('.infinite-scroll').on('infinite', function () {
        // Exit, if loading in progress
        $$('.scroll-loading').html('loading...');
        if (loading) return;
        // Set loading trigger
        loading = true;
        // Request some file with data
        $$.get('index.php?i='+weid+'&c=entry&do=moments&m=yeo_public_circle&tpl=momentlist', {tpl:'momentlist',leftIndex: lastLoadedIndex }, function (data) {
            loading = false;
            if (data === '') {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                myApp.detachInfiniteScroll($$('.infinite-scroll'));
                $$('.scroll-loading').html('加载完毕');
            }
            else {
                // Append loaded elements to list block
                $$('.infinite-scroll .list-block ul').append(data);
                controlunbindevent();
                controlbindevent();
                // Update last loaded index
                lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
            }
        });
    });



    // ========下拉刷新页面
    var ptrContent = $$('.pull-to-refresh-content');
    
    //alert(last_album_id);
    // 添加'refresh'监听器
    ptrContent.on('refresh', function (e) {
        var last_album_id = $$('.pull-to-refresh-content .list-block li:first-child').attr('data-album-id');
        // 模拟2s的加载过程
        setTimeout(function () {
            
           $$.get('index.php?i='+weid+'&c=entry&do=moments&m=yeo_public_circle&tpl=momentlist', {tpl:'momentlist',last_album_id: last_album_id}, function (data) {
            if (data === '') {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
            }
            else {
                // 前插新列表元素
                ptrContent.find('ul').prepend(data);
                controlunbindevent();
                controlbindevent();
            }
        });
            // 加载完毕需要重置
            myApp.pullToRefreshDone();
        }, 1000);
    });


});
/**
 * 发表主题
 * @param  {[type]} page) {              
 * @return {[type]}       [description]
 */
myApp.onPageInit('newmoment', function (page) {
    $$('.navbar .cancel').on('click',function(){
         myApp.confirm('放弃本次编辑?', function () {
            mainView.router.back();
        });
    })

  $$('.addimg').on('change',' .upload-h5-file',function(event){
    var files = event.target.files, file;
    if (files && files.length > 0) {
/*        // 获取目前上传的文件
        file = files[0];
        // 来在控制台看看到底这个对象是什么
        console.log(file);
        // 那么我们可以做一下诸如文件大小校验的动作
        if(file.size > 1024 * 1024 * 2) {
        alert('图片大小不能超过 2MB!');
        return false;
        }*/
        // !!!!!!
        // 获取 window 的 URL 工具
        var URL = window.URL || window.webkitURL;
      
        // 用这个 URL 产生一个 <img> 将其显示出来
        for(c=0;c<files.length;c++){
              // 通过 file 生成目标 url
            file = files[c];
             var imgURL = URL.createObjectURL(file);
            $$('.photo_select .imglist').append($$('<img class="list-img" width="80" height="80"/>').attr('src', imgURL));
        }
        $$('#upload_form').prepend($$('.addimg .upload-h5-file').attr('style', "width:0px;height:0px;"));
        $$('.addimg').append($$('<input class="upload-h5-file" type="file" name="file[]" capture="camera" accept="image/*" multiple="multiple">'));
        
        // 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
         URL.revokeObjectURL(imgURL);
    } 
       
  });


     $$('.navbar .js-post').on('click',function(event){
        $$('#upload_form').submit();
     });
      

    
});



myApp.init();