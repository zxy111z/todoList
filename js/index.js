    /**
     * Created by Administrator on 2018/1/23/023.
     */
    var myscroll=new iScroll($(".content")[0]);
    var swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        //navigation: {
        //    nextEl: '.swiper-button-next',
        //    prevEl: '.swiper-button-prev',
        //},
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        }
    });
    $(".btn-wrapper div").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    var flag="plan";
    $(".done").click(function(){
        flag="done";
        render();
    });
    $(".plan").click(function(){
        flag="plan";
        render();
    });

    $(".add").click(function () {
        $(".main").css("filter", "blur(2px)").next().show().children(".alertBox").addClass("show");
    });
    $(".submit").click(function () {
        var data = getData();
        var val = $("#text").val();
        var time = new Date().getTime();
        data.push({text: val, isDone: false, isStar: false, time:time});
        if ($("#text").val() === "") {
            $(".tips").html("请填写内容").addClass("tipsShow");
            return;
        }
        $("#text").val("");
        saveData(data);
        $(this).parent().removeClass("show").parent().hide().prev().css("filter", "none");
        render();
    });
    $(".close").click(function () {
        $(this).parent().removeClass("show").parent().hide().prev().css("filter", "none")
    });
    $(".tips").on("animationend", function () {
        $(this).removeClass("tipsShow");
    });
    function getData() {
        return localStorage.todo ? JSON.parse(localStorage.todo) : [];
    }
    function saveData(data) {
        localStorage.todo = JSON.stringify(data);
    }
    function render() {
        var data = getData();
        var str = "";
        $.each(data, function (index, val) {
            if(flag==="plan"&& val.isDone === false) {
                    str += `
                <li id=${index}>
                <p>${val.text}</p>
                <time>${getDate(val.time)}</time>
                <i class=${val.isStar?"active":""}>o</i>
                <div class="donebtn">完成</div>
                </li>`
            }else if(flag==="done"&& val.isDone === true){
                    str += `
                <li id=${index}>
                <p>${val.text}</p>
                <time>${getDate(val.time)}</time>
                <i class=${val.isStar?"active":""}>o</i>
                <div class="delbtn">删除</div>
                </li>`
            }
        });
        $(".content ul").html(str);
        addEvent();
        myscroll.scrollTo(0,0);
        myscroll.refresh();
    }
    render();
    function getDate(time) {
        var date = new Date();
        date.setTime(time);
        var year = date.getFullYear();
        var month = setZero(date.getMonth() + 1);
        var day = setZero(date.getDate());
        return year + "-" + month + "-" + day;
    }
    function setZero(n) {
        return n < 10 ? "0" + n : n;
    }

    function addEvent() {
        var max = $(".content ul li div").width();
        $(".content ul li").each(function (index, ele) {
            var sx, mx, pos = "start", movex;
            var hammer = new Hammer(ele);
            hammer.on("panstart", function (e) {
                $(ele).css("transtion","none");
                sx = e.center.x;
                $(ele).siblings().transition({x:0});
            });

            hammer.on("panmove", function (e) {
                var cx = e.center.x;
                mx = cx - sx;
                if (mx > 0 && pos === "start") {
                    return;
                }
                if (mx < 0 && pos === "end") {
                    return;
                }
                if (Math.abs(mx) > max) {
                    return;
                }
                if (pos === "start") {
                    movex = mx;
                    //ele.style.transform="translateX(" + mx + "px)"

                } else if (pos === "end") {
                    movex = mx - max;
                }
                ele.style.transform = "translateX(" + movex + "px)"

            });

            hammer.on("panend", function () {
                $(ele).css("transtion","all 1s");
                if (Math.abs(movex) < max / 2) {
                    $(ele).css("x",0);
                    pos = "start";
                } else {
                    $(ele).css("x",-max);
                    pos = "end";
                }
            });
        })
    }

    $(".content ul")
        .on("click",".donebtn",function(){
            var id=$(this).parent().attr("id");
            var data=getData();
            data[id].isDone=true;
            saveData(data);
            render();
    })
    .on("click",".delbtn",function(){
        var id=$(this).parent().attr("id");
        var data=getData();
        data.splice(id,1);
        saveData(data);
        render();
    })
    .on("click","i",function(){
        var id=$(this).parent().attr("id");
        var data=getData();
        data[id].isStar=!data[id].isStar;
        saveData(data);
        render();
    })
    .on("click","p",function(){
        var text=$(this).text();
        var id=$(this).parent().attr("id");
        $(document).data("id",id);
        $(".main")
          .css("filter", "blur(2px)")
          .next()
          .show().children(".editBox").addClass("show").find("textarea").val(text);
     });
    $(".submit2").click(function(){
        var id=$(document).data("id");
        var text=$(this).prev().val();
        var data=getData();
        data[id].text=text;
        var date=new Date();
        data[id].time=date.getTime();
        saveData(data);
        render();
        $(this).parent().removeClass("show").hide().prev().css("filter", "none")
    });



