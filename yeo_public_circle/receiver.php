<?php
/**
 * 公众号粉丝圈模块订阅器
 *
 * @author joechow
 * @url http://bbs.yeeoo.com/
 */
defined('IN_IA') or exit('Access Denied');

class Yeo_public_circleModuleReceiver extends WeModuleReceiver {
	public function receive() {
		$type = $this->message['type'];
		//这里定义此模块进行消息订阅时的, 消息到达以后的具体处理过程, 请查看微擎文档来编写你的代码
	}
}