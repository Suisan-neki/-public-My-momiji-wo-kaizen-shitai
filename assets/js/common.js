if(navigator.userAgent.indexOf("Mac")!=-1){
			if (navigator.userAgent.indexOf("Firefox/2") > -1) {
    			document.write('<link rel="stylesheet" href="https://momiji.hiroshima-u.ac.jp/momiji-top/cmn_css/font_mac_old.css" type="text/css" />');
			} else {
    			document.write('<link rel="stylesheet" href="https://momiji.hiroshima-u.ac.jp/momiji-top/cmn_css/font_mac.css" type="text/css" />');
			}
} else {
    document.write('<link rel="stylesheet" href="https://momiji.hiroshima-u.ac.jp/momiji-top/cmn_css/font_win.css" type="text/css" />');
}


$(document).ready(function() {

	if(!checkSP()){
		$('#nav').droppy();
	}

	$('.toTop a').attr('href', 'javascript:void(0);');
	$('.toTop a').click(function() {
		slidePage(0);
	});

	//100803追記
	var mh = 0;
	$('#siteMapBox>ul>li').each(function() {
		var h = $(this).height();
		if (h > mh) mh = h;
	});

	$('#siteMapBox>ul>li:eq(0)').height(mh);
	$('#siteMapBox>ul>li:eq(1)').height(mh);
	$('#siteMapBox>ul>li:eq(2)').height(mh);

/*
	if (navigator.userAgent.indexOf("Mac") > -1) { // UA に [Mac] が含まれている場合
		if (navigator.userAgent.indexOf("Safari") > -1) {
			$("body").css("font-size","80%");
		} else {
			if (navigator.userAgent.indexOf("Firefox/3") > -1) {
				//$("body").css("font-size","75%");
				//$("div#header div#headerRight").css("width","285px");
				//$("div#header div#loginBox").css("width","360px");
			} else {
				$("body").css("font-size","103%");
			}
		}
	}
*/

$('#btn_menu a').click(function(){
	if($('body').hasClass('is-opened')){
		// $('#navigation').css("display","none");
		$('#navigation').fadeOut(300);
		$('body').removeClass('is-opened');
		$('bocy,html').css({"overflow":"auto","height":"auto"});
  } else {
		// $('#navigation').css("display","block");
		$('#navigation').fadeIn(300);
		$('body').addClass('is-opened');
		$('body,html').css({"overflow":"hidden","height":"100%"});
	}
	return false;
});

//
$('#btn_search a').click(function(){
	// $('#btn_menu a').trigger('click');
	// $('#searchField').focus();
	return false;
});

var opendObj;

$('#nav > li').each(function(index, element){
	$(this).find('ul').css('display','none');

	$(this).click(function (e) {

		var child = $(this).find('ul');
		if (child.is(':visible')) {
			console.log("hide");
			child.fadeOut(300);
			// opendObj.find('ul').css('display','none');
			$(this).removeClass('is-open');
		} else{
			child.fadeIn(300);
			$(this).addClass('is-open');
			opendObj = $(this);
		}


	});
});


});


//add 2019/02
$(window).on('load', function() {
	var sw = checkSP();
	if (sw) {

		//諸々配置換え
		$('#emergencyBox').insertBefore('#eventNewsBox');
		$('#loginBox').insertBefore('#header');
		$('#searchBox').insertAfter('#nav');
		$('#momijiTopicsBox').insertBefore('#campasActivitiesBox');
		$('#searchBox form').insertAfter('#navigation ul.subMenu');

		//altをテキストに変換
		$('.altText').each(function(){
			alt = $(this).find('img').addClass('show-pc').attr('alt');
			$(this).prepend('<span class="show-sp">' + alt + '</span>');
		});

		//テーブルスクロール
		$( '.pageBody table' ).wrap('<div class="table-wrap"></div>');
		$( '#detailBlogBox table' ).wrap('<div class="table-wrap"></div>');

		// 検索ボタンイベント
		$('#btn_search .btn_search').click(function(){
			$('#btn_search form').fadeIn(100);
		});

		$('#btn_search .close').click(function(){
			$('#btn_search form').fadeOut(100);
		});

		//スクロールすべきテーブルを切り分ける
		$('div.table-wrap').each(function(){
			tblWidth = $(this).find('table').outerWidth(true);
			wrapWidth = $(this).outerWidth(true);
			if (tblWidth <= wrapWidth) {
				$(this).find('table').unwrap()
			}
		});

		//アーカイブ開閉
		$('#detailArchiveBox ul').hide();
		$('#detailArchiveBox h3').click(function(){
			$(this).parent().find('ul').toggle();
		});

		//バックナンバー開閉
		$('#detailTrackbackBox ul').hide();
		$('#detailTrackbackBox h3').click(function(){
			$(this).parent().find('ul').toggle();
		});


	} else {
		$('#emergencyBox').insertBefore('#emergencyBoxBottom');
		$('#loginBox').insertBefore('#headerRight');
		// $('#otherMenuBox').insertAfter('#otherMenuBox');
	}
});

var isSP;

function checkSP(){
	var r;
	if (window.matchMedia('(max-width:768px)').matches){
		r = true;
	} else {
		r = false;
	}
	return r;
}

function slidePage(point)
{
	step = 80;
	start = getWinYOffset();
	difference = point - start;
	tmp = difference;
	k = 0.90;
	i = 0;
	move();
}

function move()
{
	if (i < step) {
		tmp = tmp * k;
		window.scroll(0, start + (difference - tmp));
		setTimeout("move()", 0);
		i++;
	} else {
		window.scroll(0, difference + start);
	}
}

function getWinYOffset()
{
	if (window.scrollY) return window.scrollY; // Mozilla

	if (window.pageYOffset) return window.pageYOffset; // Opera, NN4

	if (document.documentElement && document.documentElement.scrollTop) { // 以下 IE
		return document.documentElement.scrollTop;
	} else if(document.body && document.body.scrollTop) {
		return document.body.scrollTop;
	}

	return 0;
}
