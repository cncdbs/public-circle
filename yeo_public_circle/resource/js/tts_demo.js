/*
 author:cyhu(viskey.hu@gmail.com) 2014.7.8
 --modified 2014.7.24 cyhu
 --modified 2014.12.26 cyhu

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/***************************************************ELEMENT**************************************************************/
var HINT_IFLYTEK = '科大讯飞成立于1999年，是中国最大的智能化语音技术提供商，其语音核心技术代表世界最高水平。2008年科大讯飞在深圳证券交易所挂牌上市';
var HINT_API = '本API基于HTML5和NODEJS技术，实现网页上的语音合成、语音识别效果，兼容个人电脑、苹果和安卓等移动终端设备.';
var HINT_ENG = 'IFLYTEK.AI enables developers to add a natural language interface to their app or device in minutes. It’s faster and more accurate than Siri, and requires no upfront investment, expertise, or training dataset.';
/***************************************************ELEMENT**************************************************************/
/***********************************************local Variables**********************************************************/
var audioPalyUrl = "http://h5.xf-yun.com/audioStream/";

/**
  * 初始化Session会话
  * url                 连接的服务器地址（可选）
  * reconnection        客户端是否支持断开重连
  * reconnectionDelay   重连支持的延迟时间   
  */
var session = new IFlyTtsSession({
									'url'                : 'ws://h5.xf-yun.com/tts.do',
									'reconnection'       : true,
									'reconnectionDelay'  : 30000
								});
/* 音频播放对象 */
window.iaudio = null;
/* 音频播放状态 0:未播放且等待音频数据状态，1:正播放且等待音频数据状态，2：未播放且不等待音频数据*/
var audio_state = 0;
/***********************************************local Variables**********************************************************/

function play(content, vcn){
    reset();
	
	ssb_param = {"appid": '584fa504', "appkey":"c4248a4092d1bb34", "synid":"12345", "params" : "ent=aisound,aue=lame,vcn="+vcn};

	session.start(ssb_param, content, function (err, obj)
	{
		var audio_url = audioPalyUrl + obj.audio_url;
		if( audio_url != null && audio_url != undefined )
		{
			window.iaudio.src = audio_url;
			window.iaudio.play();
		}
	});
};

/**
  * 停止播放音频
  *
  */
function stop() {
    audio_state = 2;
    window.iaudio.pause();
}

function start() {
	audio_state = 1;
	window.iaudio.play();
}

function play_xiaoyan(){play(HINT_API, 'aisxping')};
function play_yufeng(){play(HINT_IFLYTEK, 'viviyufeng')};
function play_mary(){play(HINT_ENG , 'vivimary')};

function play_text(text){
	//myApp.alert(text);
	toast_show('准备语音播报');
	play(text , 'aisxping');
};

/**
  * 重置音频缓存队列和播放对象
  * 若音频正在播放，则暂停当前播放对象，创建并使用新的播放对象.
  */
function reset()
{
	audio_array = [];	 
	audio_state = 0;
	if(window.iaudio != null)
	{
		window.iaudio.pause();
	}
	window.iaudio = new Audio();
	window.iaudio.src = '';
	//window.iaudio.play();
};