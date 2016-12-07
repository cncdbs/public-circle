<?php
/**
 * 公众号粉丝圈模块处理程序
 *
 * @author joechow
 * @url http://bbs.yeeoo.com/
 */
defined('IN_IA') or exit('Access Denied');

class Yeo_public_circleModuleProcessor extends WeModuleProcessor {
	public function respond() {
		$content = $this->message['content'];
		//这里定义此模块进行消息处理时的具体过程, 请查看微擎文档来编写你的代码
	}
}