<?php
header('Content-type: text/html; charset=UTF-8');
/**
 * 公众号粉丝圈模块模块微站定义
 *
 * @author joechow
 * @qq 28341847
 */
//error_reporting(E_ALL);
defined('IN_IA') or exit('Access Denied');
define('MODULE_PATH','../addons/'.pathinfo(__DIR__,PATHINFO_BASENAME ).'/');

//session_start();
define('REVIEW_MODE',1);  //0,无需审核，1，先发后审，2先审后发.
define('USER_MODE',2); //用户模式，1注册会员可用，2网页授权用户（需要授权接口），3公众号内使用。

load()->func('file');
load()->model('mc');
load()->func('communication');
require IA_ROOT . '/framework/library/emoji/emoji.php';

function tranTime($time)
{
    $rtime = date("m-d H:i",$time);
    $htime = date("H:i",$time);
    $time = time() - $time;
    if ($time < 60)
    {
        $str = '刚刚';
    }
    elseif ($time < 60 * 60)
    {
        $min = floor($time/60);
        $str = $min.'分钟前';
    }
    elseif ($time < 60 * 60 * 24)
    {
        $h = floor($time/(60*60));
        $str = $h.'小时前 '.$htime;
    }
    elseif ($time < 60 * 60 * 24 * 3)
    {
        $d = floor($time/(60*60*24));
        if($d==1)
            $str = '昨天 '.$rtime;
        else
            $str = '前天 '.$rtime;
    }
    else
    {
        $str = $rtime;
    }
    return $str;
} 

 
class Yeo_public_circleModuleSite extends WeModuleSite {

    public function __construct()
    {

        global $_W, $_GPC;
         $this->_checkAuth();
         
         if(empty($_W['fans']['uid'])){
            message('微信授权失败,请关注【'.$_W['account']['name'].'】公众号才可继续' ,'http://mp.weixin.qq.com/s?__biz=MjM5MjA2NjM2Mg==&mid=2651440517&idx=3&sn=e26fb5d5069dbec4ee96cc49032489a3&chksm=bd569bd08a2112c652fb2f6ba7aafb05ad401c63b6738da4770c3968b8fb664afa568e4f3dd3&scene=0#wechat_redirect','error');
         }
         //print_r($_W['fans']['uid']);
        // print_r($_W['member']);
       
        $info = pdo_fetch("SELECT * FROM " . tablename('yeo_public_circle_admin') . "where uniacid = '{$_W['uniacid']}'  and uid='{$_W['fans']['uid']}' ");
        if(! empty($info)){   //我是管理员
            $_W['circle_admin']=1;
        }
    }

    private function _checkAuth() {
        global $_W ,$_GPC;

        switch (USER_MODE) {
            case 1:     //.注册会员模式，可不依赖于微信，则需要强制注册
                checkauth();
                break;
            case 2:     //.userinfo网页授权，可强制不关注。
                $userinfo=mc_oauth_userinfo();  //获取微信用户网页授权（userinfo方式）
                //print_r($userinfo);
                $_W['fans']['nickname']=$userinfo['nickname'];
                $_W['fans']['openid']=$userinfo['openid'];
                $_W['fans']['headimgurl']=$userinfo['headimgurl'];
                if(empty($_W['fans']['uid'])){
                    $_W['fans']['uid'] = mc_openid2uid($userinfo['openid']);
                }
                
                break; 
             case 3:     //.userinfo网页授权，可强制不关注。
                //$fans=mc_oauth_fans();
                if(empty($_W['fans']['uid'])){
                    message('请在公众号【'.$_W['account']['name'].'】内访问' ,'','error');
                }
                break;
            default:
                 checkauth();
                break;
        }
    }



    public function doMobileMoments()
    {
        global $_GPC, $_W;

        $_GPC['admin']=1;
        $this->doMobileIndex();
    }

    private function _getalladmin(){
        global $_GPC, $_W;
        $list = pdo_fetchall("SELECT * FROM " . tablename('yeo_public_circle_admin') . "where uniacid = '{$_W['uniacid']}'  ");
        $admin_list=[];
        foreach ($list as $key => $admin) {
            $admin_list[$admin['uid']]=$admin;
        }
        return $admin_list;
    }

    public function doMobileIndex(){

        global $_GPC, $_W;
        
      
        $uniacid=$_W['uniacid'];
        $acid=$_W['fans']['acid'];
        $fanid=$_W['fans']['fanid'];

        $only=$_GPC['t'];  //1，表示官方发布，2其他。
        //查找官方的发布账号；
        
        $leftIndex = $_GET['leftIndex'] ? intval($_GET['leftIndex']) : 0;
        $itemsAmount = 5; // 19 items per request
        $maxItemIndex = 200; // 150th item will be the last

        if ($leftIndex >= $maxItemIndex) {
            // nothing to load
            exit();
        }

        $rightIndex = $leftIndex + $itemsAmount;
        if ($rightIndex > $maxItemIndex) $rightIndex = $maxItemIndex;

        //$pindex = max(1, intval($_GPC['page']));
        //$psize = 20;
        $last_album_id = max(0, intval($_GPC['last_album_id']));

        $condition = ' and album_id>'.$last_album_id.' ';
    
        if( ! isset($_W['circle_admin']) ){  //非官方人员受规则限制
            switch (REVIEW_MODE) {
                case '0':
                    //$condition .=' and album.status in (0,1,2)';
                    break;
                case '1':
                    $condition .=' and (album.status in (0,1) OR album.uid='.$_W['fans']['uid'].')';
                    break;
                case '2':
                    $condition .=' and (album.status in (1) OR album.uid='.$_W['fans']['uid'].'';
                    break;
            }
            
        }
        //$admin_uids_str= implode(',', $admin_uids);
        $admin_list=$this->_getalladmin();
        $admin_uids=array_keys($admin_list);
        if($_GPC['admin']==1){  //仅显示官方发布
            if(!empty($admin_list)){
                $admin_uids=array_keys($admin_list);
                $admin_uids_str= implode(',', $admin_uids);
                $condition .=' and album.uid in ('.$admin_uids_str.')';
            }
        }
       
        $list = pdo_fetchall("SELECT album.*,member.`avatar`, member.`nickname` FROM " . tablename('yeo_public_circle_albums') . " as album  left join ".tablename('mc_members')." as member on  album.uniacid=member.uniacid and album.uid=member.uid WHERE album.uniacid = '{$_W['uniacid']}'   $condition ORDER BY album_id DESC LIMIT " . $leftIndex . ',' . $itemsAmount);
        foreach ($list as $key => $post) {
           //print_r($post['album_id']);
            $attachment= pdo_fetchall("SELECT * FROM " . tablename('yeo_public_circle_attachment') . " WHERE   album_id='{$post['album_id']}' and uniacid = '{$_W['uniacid']}' ORDER BY aid ASC");
            $moment=emoji_html_to_unified($list[$key]['moment']);
            $list[$key]['moment']=$moment;
            $list[$key]['attachment']=$attachment;
            $list[$key]['timeline']=tranTime(strtotime($post['create_at']));
            if(in_array($list[$key]['uid'], $admin_uids)){
                 $list[$key]['nickname']='爱听914';
                 $list[$key]['avatar']='../addons/yeo_public_circle/resource/images/getheadimg.jpg';
            }

            if(!empty($_W['fans']['uid'])){
                $like=pdo_fetch("SELECT * FROM " . tablename('yeo_public_circle_like') . " WHERE  album_id='{$post['album_id']}' and uid='{$_W['fans']['uid']}' and uniacid = '{$_W['uniacid']}' " );
                if(empty($like)){
                     $list[$key]['is_like']=0;  //自己是否已经点赞
                }else{
                     $list[$key]['is_like']=1;  //自己是否已经点赞
                }
            }else{
                $list[$key]['is_like']=0;  //未注册会员不显示点赞
            }
            

            //点赞列表
            $likeusers="";
            $likecount=pdo_fetch("SELECT count(id) as count FROM " . tablename('yeo_public_circle_like') . " WHERE   album_id='{$post['album_id']}' and uniacid = '{$_W['uniacid']}' ");
            $likecount=$likecount['count'];

            if($likecount>0){
                 $likeuserlist=pdo_fetchall("SELECT member.`nickname` FROM " . tablename('yeo_public_circle_like') . " as likes left join ".tablename('mc_members')." as member on  likes.uniacid=member.uniacid and likes.uid=member.uid  WHERE   album_id='{$post['album_id']}' and member.uniacid = '{$_W['uniacid']}' ORDER BY id DESC");
                foreach ($likeuserlist  as $i =>$likeuser) {
                      $likeusers .= $likeuser['nickname'].'，';
                      if($i>=10){
                        $likeusers .= "...(共".$likecount."个赞)";
                         break;
                      }
                }
            }
           
            $list[$key]['likeusers']=rtrim($likeusers,'，');        //"苍井空，陈冠希，杨幂，王思聪，陈赫，刘德华，马云...";
            $list[$key]['likecount']=$likecount;

            //读取评论信息
            $condition="";
            if( ! isset($_W['circle_admin']) ){  
                switch (REVIEW_MODE) {
                    case '0':
                        //$condition .=' and comments.status in (0,1,2)';
                        break;
                    case '1':
                        $condition .=' and (comments.status in (0,1) OR comments.uid='.$_W['fans']['uid'].')';
                        break;
                    case '2':
                        $condition .=' and (comments.status in (1) OR comments.uid='.$_W['fans']['uid'].')';
                        break;
                }
            }
            $comment_list=pdo_fetchall("SELECT member.`uid`,member.`nickname`,(select m.`nickname` from ".tablename('mc_members')."  as m where m.`uid`=comments.`to_uid`) to_nickname,comments.* FROM " . tablename('yeo_public_circle_comment') . " as comments left join ".tablename('mc_members')." as member on  comments.uniacid=member.uniacid and comments.uid=member.uid  WHERE   album_id='{$post['album_id']}' and member.uniacid = '{$_W['uniacid']}' {$condition} ORDER BY comment_id ASC");
            foreach ($comment_list as $i => $comment) {
                $comment_list[$i]['comment']=emoji_html_to_unified($comment_list[$i]['comment']);
            }
            $list[$key]['comment_list']=$comment_list;
        }

        if(empty($_GPC['tpl'])){
            if($_GPC['admin']==1){
                $tplname="moments";
            }else{
                $tplname="index";
            }
        }else{
            $tplname= $_GPC['tpl'] ;
        }
        
        include $this->template($tplname);
    }

   public function doMobileLike(){
        global $_GPC, $_W;
        if(empty($_W['fans']['uid'])){
            echo json_encode(['error'=>1,'msg'=>'未获取微信授权，请关注公众号']);
            die();
        }
        //include $this->template('newmoment');
        $outdata=[];
        $like=pdo_fetch("SELECT * FROM " . tablename('yeo_public_circle_like') . " WHERE  album_id='{$_GPC['album_id']}' and uid='{$_W['fans']['uid']}' and uniacid = '{$_W['uniacid']}' " );
        if(empty($like)){
            //点赞
            $data = array(
                'uniacid' => $_W['uniacid'],
                'album_id' => $_GPC['album_id'],
                'uid' => $_W['fans']['uid'],
                'create_at' => date("Y-m-d H:i:s")
            );
            pdo_insert('yeo_public_circle_like',$data );
            $outdata['is_like']=1;
        }else{
            //取消点赞
            pdo_delete('yeo_public_circle_like', array('id' => $like['id']));
            $outdata['is_like']=0;
        }

         //点赞列表
        $likecount=pdo_fetch("SELECT count(id) as count FROM " . tablename('yeo_public_circle_like') . " WHERE   album_id='{$_GPC['album_id']}' and uniacid = '{$_W['uniacid']}' ");
        $likecount=$likecount['count'];
        $likeuserlist=pdo_fetchall("SELECT member.`nickname` FROM " . tablename('yeo_public_circle_like') . " as likes left join ".tablename('mc_members')." as member on  likes.uniacid=member.uniacid and likes.uid=member.uid  WHERE   album_id='{$_GPC['album_id']}' and member.uniacid = '{$_W['uniacid']}' ORDER BY id DESC");
        $likeusers="";
        foreach ($likeuserlist as $key => $likeuser) {
              $likeusers .= $likeuser['nickname'].'，';
        }
        $likeusers=rtrim($likeusers,'，');
        $outdata['likeusers']=$likeusers;        //"苍井空，陈冠希，杨幂，王思聪，陈赫，刘德华，马云...";
        $outdata['likecount']=$likecount;

        echo json_encode($outdata);
    }

    //回复
    public function doMobileReply(){
        global $_GPC, $_W;
        $uniacid = intval($_W['uniacid']);
        $comment=emoji_unified_to_html($_POST['comment']);
        $data = array(
            'uniacid' => $uniacid,
            'album_id' => $_GPC['album_id'],
            'uid' => $_W['fans']['uid'],    //回复人
            'comment' => $comment,
            'create_at'=>date('Y-m-d H:i:s'),
            'to_uid' => $_GPC['re_uid'],  //被回复者,应该根据 回复的ID查找对应的uid.
            'status' => 0
        );
        pdo_insert('yeo_public_circle_comment', $data);
       $comment_id = pdo_insertid();
       echo json_encode(array('done'=>1));
    }

    //获取某主题的全部回复，用于评论或回复后刷新
    public function doMobileComments(){
        global $_GPC, $_W;
        
        $uniacid = intval($_W['uniacid']);
        $album_id=intval($_GPC['album_id']);
        //读取评论信息
        $condition="";
        if( ! isset($_W['circle_admin']) ){  
            switch (REVIEW_MODE) {
                case '0':
                    //$condition .=' and comments.status in (0,1,2)';
                    break;
                case '1':
                    $condition .=' and (comments.status in (0,1) OR comments.uid='.$_W['fans']['uid'].')';
                    break;
                case '2':
                    $condition .=' and (comments.status in (1) OR comments.uid='.$_W['fans']['uid'].')';
                    break;
            }
        }


        $comment_list=pdo_fetchall("SELECT member.`uid`,member.`nickname`,(select m.`nickname` from ".tablename('mc_members')."  as m where m.`uid`=comments.`to_uid`) to_nickname,comments.* FROM " . tablename('yeo_public_circle_comment') . " as comments left join ".tablename('mc_members')." as member on  comments.uniacid=member.uniacid and comments.uid=member.uid  WHERE   album_id='{$album_id}' and member.uniacid = '{$_W['uniacid']}'  {$condition} ORDER BY comment_id ASC");
        foreach ($comment_list as $i => $comment) {
            $comment_list[$i]['comment']=emoji_html_to_unified($comment_list[$i]['comment']);
        }
        $item['comment_list']=$comment_list;
         include $this->template('commentlist');
    }


    //审核主题
    public function doMobileReview(){
        global $_GPC, $_W;
        if( empty($_W['circle_admin'])){  
            echo json_encode(array('error'=>1,'msg'=>'没有权限'));
        }
        $uniacid = intval($_W['uniacid']);
        $album_id=intval($_GPC['album_id']);
        $status=intval($_GPC['status']);
        $data = array(
            'status' => $status,
            'review_uid'=>$_W['fans']['uid'],
            //'review_time'=>date("Y-m-d H:i:s")
        );
        $re=pdo_update('yeo_public_circle_albums', $data,array('album_id' => $album_id,'uniacid'=>$uniacid));

        //插入审查日志
        $data = array(
            'type' => 1,
            'item_id'=>$album_id,
            'review_uid'=>$_W['fans']['uid'],
            'create_at'=>date("Y-m-d H:i:s"),
            'review_result'=>$status
        );
        pdo_insert('yeo_public_circle_review_logs', $data);
        echo json_encode(array('done'=>$album_id));
    }

    //审核评论
    public function doMobileReviewcomment(){
        global $_GPC, $_W;
         if( empty($_W['circle_admin'])){  
            echo json_encode(array('error'=>1,'msg'=>'没有权限'));
        }
        $uniacid = intval($_W['uniacid']);
        $comment_id=intval($_GPC['comment_id']);
        $status=intval($_GPC['status']);
        $data = array(
            'status' => $status,
            'review_uid'=>$_W['fans']['uid'],
            //'review_time'=>date("Y-m-d H:i:s")
        );
        pdo_update('yeo_public_circle_comment', $data,array('comment_id' => $comment_id,'uniacid'=>$uniacid));

        //插入审查日志
        $data = array(
            'type' => 2,
            'item_id'=>$comment_id,
            'review_uid'=>$_W['fans']['uid'],
            'create_at'=>date("Y-m-d H:i:s"),
            'review_result'=>$status
        );
        pdo_insert('yeo_public_circle_review_logs', $data);
        echo json_encode(array('done'=>1));
    }

    //发布帖子表单
    public function doMobileNew(){
        global $_GPC, $_W;
        
        include $this->template('newmoment');
    }

    /**
     * 发表帖子
     * @return type
     */
    public function doMobilePost(){

        global $_GPC, $_W;
        if(empty($_W['fans']['uid'])){
            echo "未获取微信授权，请关注公众号";
            die();
        }
        $uniacid = intval($_W['uniacid']);
        $posttext=emoji_unified_to_html($_POST['posttext']);
        if(empty($posttext)){
            echo "请输入内容";
            die();
        }
        //echo $posttext;
       /* preg_match_all('/\[U\+(\\w{4,})\]/i', $moment, $matchArray);
            if(!empty($matchArray[1])) {
                foreach ($matchArray[1] as $emojiUSB) {
                    $moment = str_ireplace("[U+{$emojiUSB}]", utf8_bytes(hexdec($emojiUSB)), $moment);
                }
            }*/
        //$posttext= emoji_html_to_unified(emoji_unified_to_html($_GPC['posttext']));
        
        $data = array(
            'moment' => $posttext,
            'uniacid' => $uniacid,
            'uid' => $_W['fans']['uid'],
            //'author' => $_W['nickname'],
            'create_at'=>date('Y-m-d H:i:s'),
            'from_user' => $_W['fans']['from_user'],
            'status' => 0
        );
        pdo_insert('yeo_public_circle_albums', $data);
        $postid = pdo_insertid();
        foreach($_FILES['file']['tmp_name'] as $k=>$v){
            if(is_uploaded_file($_FILES['file']['tmp_name'][$k])){
                $ext = pathinfo($_FILES['file']['name'][$k], PATHINFO_EXTENSION);
                $ext = strtolower($ext);
                $path = "images/fanscircle/{$uniacid}/" . date('Y/m/');
                mkdirs(ATTACHMENT_ROOT . '/' . $path);
                //echo ATTACHMENT_ROOT . '/' . $path;
                $filename = file_random_name(ATTACHMENT_ROOT . '/' . $path, $ext);
                $saveurl= $path . $filename;
                //echo $saveurl."<br>";
                if(move_uploaded_file($_FILES['file']['tmp_name'][$k],ATTACHMENT_ROOT.'/'.$saveurl)){
                    //echo "上传成功！";
                    ////还需要生成一个缩略图
                    $data = array(
                        'atype' => 1,
                        'aurl' => $saveurl,
                        'uniacid' => $uniacid,
                        'album_id' => $postid,
                        'uid' => $author,
                        'create_at'=>date('Y-m-d H:i:s'),
                        //'delete_at'=>0,
                        //'from_user' => $_W['fans']['from_user'],
                        //'status' => 0
                    );
                    pdo_insert('yeo_public_circle_attachment', $data);
                }
            }
        }

       //上传完毕，调用粉丝圈首页。【如果是ajax上传，则直接back】
      header("Location:index.php?i=".$_W['uniacid']."&c=entry&do=index&m=yeo_public_circle");
    }
 


}