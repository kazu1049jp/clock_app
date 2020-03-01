var click = 0;
var st, ed;
var timer, time;
var page = 0, page_on_memo = 0;
var minute = 0, second = 0;
var tmp_minute = 0, tmp_second = 0;
var yorei_time = 0, fin_time = 0;
var yorei_flag = 0, fin_flag = 0;
var rap_time_st, rap_time = 0;
var memo_content = [];

/*ベル鳴らそうと思ったけど、良さそうな音声素材がないので放置！*/
function textSave(){
    var e = document.getElementById('memo');
    memo_content[page_on_memo] = e.value;
    var save_text = "";
    var e = document.getElementsByClassName('keika');
    //console.log(e.length);
    //console.log(e[0].value);
    save_text += "発表時間：" + e[0].value + "\n";
    save_text += "\n＜発表時間の内訳＞\n";
    e = document.getElementById('rap');
    save_text += e.value;
    if (click == 1){
	rap_time += ed.getTime() - rap_time_st.getTime();
    }
    save_text += "ページ" + (page + 1) + "(計測中 or 終了): " + Math.floor(rap_time / 1000 / 60) + "分" + Math.floor(rap_time / 1000) % 60 + "秒";

    save_text += "\n\n＜発表メモ＞";
    for (i = 0; i < memo_content.length; i++){
	save_text += "\n" + "[" + (i + 1) + "ページ目]";
	save_text += "\n" + memo_content[i];
    }

    var name = "\n発表練習メモ";
    var blob = new Blob([save_text], {type:"text/plain;charset=UTF-8"});

    var link = document.getElementById('DL_link');
    link.href = window.URL.createObjectURL(blob);

    if ('download' in link){
	link.download = name + ".txt";
	link.click();
    }
    else {
	link.textContent = "発表メモは、右クリックから名前を付けて保存してください。";
    }
}

function bell(time){
    var audio;
    if (time >= fin_time){
	audio = new Audio("./media/fin_bell.mp3");
    } else if (time < fin_time && time >= yorei_time) {
	audio = new Audio("./media/yorei_bell.mp3");
    }
    if (typeof audio !== "undefined"){
	audio.play();
    }
}

function yorei_check(){
    yorei_time = document.time.yorei.value;
    fin_time = document.time.fin.value;
    bell(yorei_time);
}

function fin_check(){
    yorei_time = document.time.yorei.value;
    fin_time = document.time.fin.value;
    bell(fin_time);
}
    

function check_time(){
    if (minute >= fin_time) {
        if (fin_flag == 0) {
            document.time.now.style.backgroundColor = "red";
            fin_flag = 1;
	    bell(minute);
            //alert("終了時間を過ぎました。");
        }
    } else if (minute >= yorei_time) {
        if (yorei_flag == 0){
            document.time.now.style.backgroundColor = "yellow";
            yorei_flag = 1;
	    bell(minute);
            //alert("予鈴です！");
        }
    }
}

function start(){
    if (click == 0){
        document.time.start_button.disabled = true;
        document.time.rap_button.disabled = false;
        document.time.stop_button.disabled = false;
        document.time.reset_button.disabled = true;
	document.time.save.disabled = true;
        click = 1;
	yorei_time = document.time.yorei.value;
	fin_time = document.time.fin.value;
        st = rap_time_st = new Date();
	
        if (click == 1){
            timer = setInterval('update()',1);
	}
    }
}

function update(){
    if (click == 1){
        ed = new Date();
        time = ed.getTime() - st.getTime();
        minute = tmp_minute + Math.floor(time / 1000 /  60);
        second = tmp_second + Math.floor((time / 1000) % 60);
	minute = minute + Math.floor(second / 60);
	second = second % 60;
        document.time.now.value = minute + "分" + second + "秒";
        check_time();
    }
    if (click == 0){
        clearInterval(timer);
    }
}

function rap(){
    if (click == 1){
	var e = document.getElementById('memo');
	memo_content[page_on_memo] = e.value;
	e.value = "";

	rap_time += ed.getTime() - rap_time_st.getTime();
        e = document.getElementById('rap');
	e.value += "ページ" + (page + 1) + ": " + Math.floor(rap_time / 1000 / 60) + "分" + Math.floor(rap_time / 1000) % 60 + "秒\n";

	page++;
	page_on_memo = page;
	
	e = document.getElementById("memo_page");
	e.textContent = (page_on_memo + 1) + "ページ目";
    }
    rap_time = 0;
    rap_time_st = new Date();
}

function stop(){
    if (click == 1){
        click = 0;
        document.time.start_button.disabled = false;
        document.time.stop_button.disabled = true;
        document.time.rap_button.disabled = true;
	document.time.reset_button.disabled = false;
	document.time.save.disabled = false;
        tmp_minute = minute;
        tmp_second = second;
	ed = new Date();
	rap_time += ed.getTime() - rap_time_st.getTime();
    }
}

function all_reset(){
    if (click == 0){
        document.time.now.style.backgroundColor = "white";
        click = 0;
	ini_flag = 0;
	yorei_time = document.time.yorei.value;
	fin_time = document.time.fin.value;
	page = 0;
        yorei_flag = 0;
        fin_flag = 0;
        tmp_minute = 0;
        tmp_second = 0;
        minute = 0;
        second = 0;
	rap_time = 0;
        var e = document.getElementById('rap');
        e.value = "";
	e = document.getElementById('memo');
	e.value = "";
	e = document.getElementById('memo_page');
	e.textContent = 1 + "ページ目";
	memo_content.length = page = page_on_memo = 0;
        document.time.now.value = "0分0秒";
        document.time.start_button.disabled = false;
        document.time.rap_button.disabled = true;
        document.time.stop_button.disabled = true;
        document.time.rap_button.disabled = true;
    }   
}

function back_page(){
    if (page_on_memo - 1 >= 0){
	var e = document.getElementById('memo');
	memo_content[page_on_memo] = e.value;
	page_on_memo--;
	e.value = memo_content[page_on_memo];
	e = document.getElementById("memo_page");
	e.textContent = (page_on_memo + 1) + "ページ目";
    }
}

function next_page(){
    if (page_on_memo + 1 < memo_content.length){
	var e = document.getElementById('memo');
	memo_content[page_on_memo] = e.value;
	page_on_memo++;
	e.value = memo_content[page_on_memo];
	e = document.getElementById("memo_page");
	e.textContent = (page_on_memo + 1) + "ページ目";
    }
}
