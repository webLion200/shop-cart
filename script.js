window.onload = function() {
    if(!document.getElementsByClassName) {
        var ret = [];
        var els = document.getElementsByTagName('*');
        document.getElementsByClassName = function (cls) {
            for (var i=0, len = els.length; i < len; i ++) {
                if(els[i].className == cls 
                    || els[i].className.indexOf(' ' + cls) >= 0 
                    || els[i].className.indexOf(' ' + cls + ' ') >= 0 
                    || els[i].className.indexOf(cls + ' ') >=0) {
                    ret.push(els[i].className);
                }
            }
            return ret;
        }
    }
    var cartTable = document.getElementById('cartTable');
    var trs = cartTable.children[1].rows;
    var checkInputs = document.getElementsByClassName('check');
    var selectedTotal = document.getElementById('selectedTotal');
    var priceTotal = document.getElementById('priceTotal');
    var selected = document.getElementById('selected');
    var foot = document.getElementById('foot');
    var selectedViewList = document.getElementById('selectedViewList');
    var check = document.getElementsByClassName('check');
    var checkAll = document.getElementsByClassName('check-all'); 
    var deleteAll = document.getElementById('deleteAll');
    // 总计
    function getTotal () {
        var selected = 0;
        var totalPrice = 0;
        var HTMLdiv = '';
        for(var i = 0; i < trs.length; i ++) {
            if(trs[i].getElementsByTagName('input')[0].checked) {
                selected += parseInt(trs[i].getElementsByTagName('input')[1].value);
                totalPrice += parseFloat(trs[i].cells[4].innerHTML);
                HTMLdiv += "<div><img src="+trs[i].getElementsByTagName('img')[0].src+"><span class='del' index="+i+">取消选择</span></div>"
            }
        }   
        selectedTotal.innerHTML = selected;
        priceTotal.innerHTML = totalPrice.toFixed(2);
        selectedViewList.innerHTML = HTMLdiv;
        if(selectedTotal.innerHTML == 0) {
            foot.className = 'foot';
        } 
    }
    
    // checkbox点击
    for(var j = 0;j < check.length; j ++) {
        check[j].onclick = function () {
            if(this.className == 'check-all check') {
                for(var k = 0; k < check.length; k ++) {
                    check[k].checked = this.checked;
                }
                getTotal();
            }
            if(this.className == 'check-one check') {
                getTotal();
            }
        }   
    }

    // img添加框
    selected.onclick = function () {
        if(foot.className == "foot show" || selectedTotal.innerHTML == 0) {
            foot.className = "foot";
            return;
        }
        foot.className = "foot show";
    }

    selectedViewList.onclick = function(e) {
        var e = e || window.event;
        var els = e.srcElement;
        var index = els.getAttribute("index");
        if(els.className == "del") {
            trs[index].getElementsByTagName("input")[0].checked = false;
            getTotal();
        }
    }

    // 小计
    function subTotal(tr) {
        var subtotal = tr.getElementsByClassName('subtotal')[0];
        var price = parseFloat(tr.cells[2].innerHTML);
        var count = parseInt(tr.getElementsByTagName('input')[1].value);
        subtotal.innerHTML = (price * count).toFixed(2);
    }

    for(var i = 0; i < trs.length; i ++) {
        trs[i].onclick = function (e) {
            var e = e || window.event;
            var els = e.srcElement;
            var cls = els.className;
            var inputs = this.getElementsByTagName('input')[1];
            var reduce = this.getElementsByClassName('reduce')[0];
            switch (cls) {
                case 'reduce':
                    if(inputs.value > 1) {
                        inputs.value--;
                    } 
                    if(inputs.value <= 1) {
                        reduce.innerHTML = '';
                        return;
                    }   
                    subTotal(this);
                    break;
                case 'add':
                    reduce.innerHTML = '-';
                    inputs.value ++;
                    subTotal(this);
                    break;
                case 'delete':
                    var con = confirm("Are u sure?")
                    if (con) {
                        this.parentNode.removeChild(this);
                    } 
                    break;
                default: break;
            }
            getTotal();
        }
    }

    deleteAll.onclick = function () {
        if(selectedTotal.innerHTML != 0) {
            var trsLen = trs.length;
            var con = confirm("Are u sure?");
            if (con) {
                for(var i = 0; i < trsLen; i ++) {
                    if(trs[i].getElementsByTagName('input')[0].checked) {
                        trs[i].parentNode.removeChild(trs[i]);
                        i --;
                        trsLen --;  
                    }
                }
            }
            getTotal();
        }
    }
}