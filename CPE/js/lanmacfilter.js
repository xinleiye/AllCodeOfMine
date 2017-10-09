(function(){
    var g_macfilterBlack = 0;
    var g_macfilterWhite = 1;
    var g_macfilter = [
        {
            type: g_macfilterBlack,
            name : str_security_macfilter_filterblack
        },
        {
            type: g_macfilterWhite,
            name : str_security_macfilter_filterwhite
        }
    ];
    var g_macfilterBlackList;
    var g_macfilterWhiteList;
    var g_macFilterStatus;

    getMacFilterInfo();
    $(document).ready(function(){
        var i, len, html, filterList, radio;

        radio = '<input type="radio" name="macfiltertype" value="%d"/><span>%s</span>';
        filterList = macfilterList.getIntance("macfilterlist", 8);

        html = "";
        for(i = 0, len = g_macfilter.length; i < len; i++){
            html += radio;
            html = html.replace("%d", g_macfilter[i].type);
            html = html.replace("%s", g_macfilter[i].name);
        }
        $("#macfiltertype").html(html);

        if (g_macFilterStatus === g_macfilterBlack){
            $('input:radio[name="macfiltertype"]' + '[value="' + g_macfilterBlack + '"]').attr("checked", "checked");
            filterList.init(g_macfilterBlackList);
        } else if (g_macFilterStatus === g_macfilterWhite){
            $('input:radio[name="macfiltertype"]' + '[value="' + g_macfilterWhite + '"]').attr("checked", "checked");
            filterList.init(g_macfilterWhiteList);
        } else {
            filterList.init([]);
        }
        $("input:radio[name='macfiltertype']").on("change", function(){
            var val = parseInt($(this).val());
            g_macFilterStatus = val;
            if (val === g_macfilterBlack){
                filterList.init(g_macfilterBlackList);
            } else if (val === g_macfilterWhite){
                filterList.init(g_macfilterWhiteList);
            } else {
                filterList.init([]);
            }
        });
        $("#apply").attr("value", common_apply).on("click", saveMacfilterData);
    });
    function saveMacfilterData(){
        var postdata, data = {};

        data.type = g_macFilterStatus;
        if (g_macFilterStatus === g_macfilterBlack){
            data.blackList = g_macfilterBlackList;
        } else if (g_macFilterStatus === g_macfilterWhite){
            data.whiteList = g_macfilterWhiteList;
        } else {
            return;
        }
        postdata = JSON.stringify(data);
        saveAjaxJsonData("/action/SetMacFilterCfg", postdata, function(data){
            if (typeof data.retcode === "number" && data.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed);
            }
        }, {
            async: true
        });
    }
    var macfilterList = (function(){
        var instance;
        var macdata;
        var status;
        var number;
        var max;
        var dest;
        var listhead = [
            '<form id="macfilterform">',
            '<h3>%title</h3>',
            '<table cellpadding="0" cellspacing="1">',
            '<tbody id="listbody">',
            '<tr>',
            '<th class="width180">%macaddr</th>',
            '<th class="width100">%option</th>',
            '</tr>',
            '%list',
            '</tbody>',
            '</table>',
            '<input id="add" type="button" value="Add" class="ipfilterlistadd-btn"/>',
            '</form>'
        ];
        var normalrow = [
            '<tr id="row" class="%class">',
            '<td id="macaddr">%macaddr</td>',
            '<td>',
            '<span id="btn1" class="option-btn">%btn1</span>',
            '<span id="btn2" class="option-btn">%btn2</span>',
            '</td>',
            '</tr>'
        ];
        var editrow = [
            '<tr id="row" class="%class">',
            '<td id="macaddr"><input type="text"></td>',
            '<td>',
            '<span id="btn1" class="option-btn">%btn1</span>',
            '<span id="btn2" class="option-btn">%btn2</span>',
            '</td>',
            '</tr>'
        ];
        function Create(id, num){
            dest = id;
            max = num;
            this.init = init;
        }
        function init(data){
            macdata = data;
            status = 0;
            number = macdata.length;
            show(macdata);
        }
        function show(data){
            var i, index, list, html, head, $dest;

            $dest = $("#" + dest);
            $dest.empty();
            head = listhead.join("");
            html = "";
            list = "";
            for(i = 0; i < number; i++) {
                index = i + 1;
                html = normalrow.join("");
                if (i % 2 === 0){
                    html = html.replace("%class", "oddtr");
                } else {
                    html = html.replace("%class", "eventr");
                }
                html = html.replace("%macaddr", data[i]);
                html = html.replace("%btn1", common_edit);
                html = html.replace("%btn2", common_del);
                html = html.replace("row", "row" + index);
                html = html.replace("macaddr", "macaddr" + index);
                html = html.replace("btn1", "edit" + index);
                html = html.replace("btn2", "delete" + index);
                list += html;
            }
            head = head.replace("%title", str_security_macfilter_list);
            head = head.replace("%macaddr", str_security_macfilter_macaddr);
            head = head.replace("%option", str_security_macfilter_option);
            head = head.replace("%list", list);
            $dest.html(head);
            $("#macfilterform").on("click", function(ev){
                stopLogoutTimer();
                operator(ev);
                startLogoutTimer();
            });
        }

        function edit(index){
            var val, row, $addr, $edit, $del;
            var input = '<input type="text" value="%value"></td>';

            if (status !== 0){
                return;
            }
            status = 1;
            $addr = $("#macaddr" + index);
            val = $addr.text();
            row = input.replace("%value", val);
            $addr.html(row);

            $edit = $("#edit" + index);
            $edit.text(common_ok).attr("id", "modify" + index);
            $del = $("#delete" + index);
            $del.text(common_cancel).attr("id", "cancel" + index);
        }
        function deleted(index){
            if (status !== 0) {
                return;
            }
            macdata.splice(index -1, 1);
            number = macdata.length;
            status = 0;
            show(macdata);
        }
        function modify(index){
            var val;
            val = $("#macaddr" + index).children("input").val();
            macdata.splice(index - 1, 1, val);
            status = 0;
            show(macdata);
        }
        function fire(index){
            var val;
            val = $("#macaddr" + index).children("input").val();
            macdata.push(val);
            number = macdata.length;
            status = 0;
            show(macdata);
        }
        function add(num){
            var newrow, index;
            if (status !== 0 || number >= max){
                return;
            }
            status = 2;
            index = num + 1;
            newrow = editrow.join("");
            newrow = newrow.replace("row", "row" + index);
            newrow = newrow.replace("macaddr", "macaddr" + index);
            newrow = newrow.replace("btn1", "ok" + index);
            newrow = newrow.replace("btn2", "cancel" + index);
            newrow = newrow.replace("%btn1", common_ok);
            newrow = newrow.replace("%btn2", common_cancel);
            if (index % 2 === 1) {
                newrow = newrow.replace("%class", "oddtr");
            } else {
                newrow = newrow.replace("%class", "eventr");
            }
            $("#listbody").append(newrow);
        }
        function cancel(){
            status = 0;
            show(macdata);
        }
        function operator(ev){
            var id, index, reg, _ev = ev || event;
            var target = _ev.target || _ev.srcElemnt;

            reg = /[a-zA-Z]+/g;
            id = target.id.match(reg);
            if (id){
                id = id[0];
            }
            reg = /[0-9]+/g;
            index = target.id.match(reg);
            if (index){
                index = index[0];
            }
            console.log(id, index);
            switch(id){
                case "edit":
                    edit(index);
                    break;
                case "delete":
                    deleted(index);
                    break;
                case "modify":
                    modify(index);
                    break;
                case "add":
                    add(number);
                    break;
                case "ok":
                    fire(index);
                    break;
                case "cancel":
                    cancel();
                    break;
                default:
                    break;
            }
        }
        return {
            getIntance: function(dest, num){
                if (!instance) {
                    instance = new Create(dest, num);
                }
                return instance;
            }
        }
    })();

    function getMacFilterInfo(){
        getAjaxJsonData("/action/GetMacFilterCfg", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_macFilterStatus = obj.type;
                g_macfilterBlackList = obj.blackList;
                g_macfilterWhiteList = obj.whiteList;
            }
        }, {
            async: false
        });
    }
})();