(function(){
    var g_protocolTCPUDP = 0;
    var g_protocolTCP = 1;
    var g_protocolUDP = 2;
    var g_protocolICMP = 3;
    var g_ipFilterStatusOn = 1;
    var g_ipFilterStatusOff = 0;
    var g_ipFilterTypeBlack = 0;
    var g_ipFilterTypeWhite = 1;
    var g_ipFilterType = [
        {
            type: g_ipFilterTypeBlack,
            name: str_security_lanipfilter_filterblack
        },
        {
            type: g_ipFilterTypeWhite,
            name: str_security_lanipfilter_filterwhite
        }
    ];
    var g_protocol = [
        {
            mode: g_protocolTCPUDP,
            name: "TCP/UDP"
        },
        {
            mode: g_protocolTCP,
            name: "TCP"
        },
        {
            mode: g_protocolUDP,
            name: "UDP"
        },
        {
            mode: g_protocolICMP,
            name: "ICMP"
        }
    ];
    var g_status = [
        {
            status: g_ipFilterStatusOn,
            name: common_on
        },
        {
            status: g_ipFilterStatusOff,
            name: common_off
        }
    ];

    var g_curIpFilterBlackData;
    var g_curIpFilterWhiteData;
    var g_curIpFilterType;
    var g_lanNetmask;
    var g_lanIpAddress;

    getIpFilterData();
    $(document).ready(function(){
        var i, len, list, html, radio;

        list = ipFilterList.getInstance("ipfilterlist");
        radio = '<input type="radio" name="ipfiltertype" value="%d"/><span>%s</span>';
        html = "";
        for(i = 0, len = g_ipFilterType.length; i < len; i++){
            html += radio;
            html = html.replace("%d", g_ipFilterType[i].type);
            html = html.replace("%s", g_ipFilterType[i].name);
        }
        $("#ipfiltertype").html(html);
        if (g_curIpFilterType === g_ipFilterTypeBlack) {
            list.init(g_curIpFilterBlackData);
        } else if (g_curIpFilterType === g_ipFilterTypeWhite) {
            list.init(g_curIpFilterWhiteData);
        } else {
            list.init([]);
        }
        $("input:radio[name='ipfiltertype']" + "[value='" + g_curIpFilterType + "']").attr("checked", "checked");
        $("input:radio[name='ipfiltertype']").on("change", function(){
            var val = parseInt($(this).val());
            g_curIpFilterType = val;
            if (val === g_ipFilterTypeBlack) {
                list.init(g_curIpFilterBlackData);
            } else if (val === g_ipFilterTypeWhite) {
                list.init(g_curIpFilterWhiteData);
            } else {
                list.init([]);
            }
        });

        $("#apply").attr("value", common_apply).on("click", saveIpFilterData);
        stopLogoutTimer();
    });
    function saveIpFilterData(){
        var postdata, filterdata, data = {};
        data.type = g_curIpFilterType;
        if (g_curIpFilterType === g_ipFilterTypeBlack) {
            filterdata = g_curIpFilterBlackData;
            data.blackList = g_curIpFilterBlackData;
        } else if (g_curIpFilterType === g_ipFilterTypeWhite) {
            filterdata = g_curIpFilterWhiteData;
            data.whiteList = g_curIpFilterWhiteData;
        } else {
            return;
        }
        $.each(filterdata, function(){
            var i, len;
            for(i = 0, len = g_protocol.length; i < len; i++){
                if (this.protocol === g_protocol[i].name){
                    this.protocol = g_protocol[i].mode
                }
            }
            for(i = 0, len = g_status.length; i < len; i++){
                if (this.status === g_status[i].name){
                    this.status = g_status[i].status;
                }
            }
        });
        postdata = JSON.stringify(data);
        saveAjaxJsonData("/action/SetLanIpFilterCfg", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_success, 3000);
            }
        }, {

        });
    }
    function getIpFilterData(){
        getAjaxJsonData("/action/GetLanIpFilterCfg", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_curIpFilterType = obj.type;
                g_curIpFilterBlackData = obj.blackList;
                g_curIpFilterWhiteData = obj.whiteList;
                $.each(g_curIpFilterBlackData, function(){
                    var i, len;
                    for(i = 0, len = g_protocol.length; i < len; i++){
                        if (this.protocol === g_protocol[i].mode){
                            this.protocol = g_protocol[i].name;
                        }
                    }
                    for(i = 0, len = g_status.length; i < len; i++){
                        if (this.status === g_status[i].status){
                            this.status = g_status[i].name;
                        }
                    }
                });
                $.each(g_curIpFilterWhiteData, function(){
                    var i, len;
                    for(i = 0, len = g_protocol.length; i < len; i++){
                        if (this.protocol === g_protocol[i].mode){
                            this.protocol = g_protocol[i].name;
                        }
                    }
                    for(i = 0, len = g_status.length; i < len; i++){
                        if (this.status === g_status[i].status){
                            this.status = g_status[i].name;
                        }
                    }
                });
            }
        }, {
            async: false
        });
        getAjaxJsonData("/action/GetLanCfgInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_lanNetmask = obj.netmask;
                g_lanIpAddress = obj.ipaddr;
            }
        }, {
            async: false,
            timeout: 1000
        });
    }
    var ipFilterList = (function(){
        var instances;
        var ipdata;
        var status;    //0:init; 1:edit; 2:ok; 3:add;
        var dest;

        var listhead = [
            '<form id="ipfilterlistform">',
            '<h3>%title</h3>',
            '<table id="listtable" cellpadding="0" cellspacing="1" width="600">',
            '<tbody>',
            '<tr id="head">',
            '<th width="105">%lanip</th>',
            '<th width="70">%lanport</th>',
            '<th width="105">%wanip</th>',
            '<th width="70">%wanport</th>',
            '<th width="100">%protocol</th>',
            '<th width="50">%status</th>',
            '<th>%option</th>',
            '</tr>',
            '%list',
            '</tbody>',
            '</table>',
            '<input id="add" type="button" value="Add" class="ipfilterlistadd-btn"/>',
            '</form>'
        ];
        var protocolListStyle = [
            '<select id="protocol">',
            '%list',
            '</select>'
        ];
        var statusListStyle = [
            '<select id="statuslist">',
            '%list',
            '</select>'
        ];
        var normalStyle = [
            '<tr id="row" class="%class">',
            '<td id="lanip">%lanip</td>',
            '<td id="lanport">%lanport</td>',
            '<td id="wanip">%wanip</td>',
            '<td id="wanport">%wanport</td>',
            '<td id="protocol">%protocol</td>',
            '<td id="status">%status</td>',
            '<td>',
            '<span id="btn1" class="option-btn">Edit</span>',
            '<span id="btn2" class="option-btn">Delete</span>',
            '</td>',
            '</tr>'
        ];
        var newOrEditStyle = [
            '<tr id="row" class="oddtr">',
            '<td id="lanip"><input type="text"/></td>',
            '<td id="lanport"><input type="text"/></td>',
            '<td id="wanip"><input type="text"/></td>',
            '<td id="wanport"><input type="text"/></td>',
            '<td id="protocol">',
            '%protocollist',
            '</td>',
            '<td id="status">',
            '%status',
            '</td>',
            '<td>',
            '<span id="btn1" class="option-btn">OK</span>',
            '<span id="btn2" class="option-btn">Cancel</span>',
            '</td>',
            '</tr>'
        ];

        function Create(id){
            var i, len, html, option = '<option value="%d">%s</option>';

            html = '';
            for(i = 0, len = g_status.length; i < len; i++){
                html += option;
                html = html.replace("%d", g_status[i].status);
                html = html.replace("%s", g_status[i].name);
            }
            statusListStyle = statusListStyle.join("").replace("%list", html);

            html = '';
            for(i = 0, len = g_protocol.length; i < len; i++){
                html += option;
                html = html.replace("%d", g_protocol[i].mode);
                html = html.replace("%s", g_protocol[i].name);
            }
            protocolListStyle = protocolListStyle.join("").replace("%list", html);

            dest = id || "";
            this.init = init;
        }

        function init(data){
            status = 0;
            ipdata = data;

            show(ipdata);
        }
        function show(data){
            var i, len, row, allrow, head, $ipfilterlist;

            $ipfilterlist = $("#" + dest);
            $ipfilterlist.empty();
            head = listhead.join("");
            head = head.replace("%title", str_security_lanipfilter_filterlist);
            head = head.replace("%lanip", str_security_lanipfilter_lanipaddr);
            head = head.replace("%lanport", str_security_lanipfilter_lanport);
            head = head.replace("%wanip", str_security_lanipfilter_wanipaddr);
            head = head.replace("%wanport", str_security_lanipfilter_wanport);
            head = head.replace("%protocol", str_security_lanipfilter_protocol);
            head = head.replace("%status", common_status);
            head = head.replace("%option", str_security_lanipfilter_options);

            row = "";
            allrow = "";
            for(i = 0, len = data.length; i < len; i++){
                row = normalStyle.join("");
                row = row.replace("%lanip", data[i].lanIp);
                row = row.replace("%lanport", data[i].lanPort);
                row = row.replace("%wanip", data[i].wanIp);
                row = row.replace("%wanport", data[i].wanPort);
                row = row.replace("%protocol", data[i].protocol);
                row = row.replace("%status", data[i].status);

                row = row.replace("lanip", "lanip" + (i + 1));
                row = row.replace("lanport", "lanport" + (i + 1));
                row = row.replace("wanip", "wanip" + (i + 1));
                row = row.replace("wanport", "wanport" + (i + 1));
                row = row.replace("protocol", "protocol" + (i + 1));
                row = row.replace("status", "status" + (i + 1));
                row = row.replace("btn1", "Edit" + (i + 1));
                row = row.replace("btn2", "Delete" + (i + 1));
                row = row.replace("row", "row" + (i + 1));

                if ( (i + 1) % 2 === 1) {
                    row = row.replace("%class", "oddtr");
                } else {
                    row = row.replace("%class", "eventr");
                }
                allrow += row;
            }
            head = head.replace("%list", allrow);
            $ipfilterlist.html(head);
            $("#ipfilterlistform").on("click", function(ev){
                stopLogoutTimer();
                operator(ev);
                startLogoutTimer();
            });
        }
        function fire(index){
            var item;

            if (status !== 1 && status !== 3) {
                return;
            }
            item = getIpfilterItem(index);
            if (item){
                status = 0;
                ipdata.push(item);
                show(ipdata);
            }
        }

        function edit(index){
            var value, $lanip, $lanport, $wanip, $wanport, $protocol, $status, $edit, $delete;

            if (status !==0) {
                return;
            }
            status = 1;

            $lanip = $("#lanip" + index);
            value = $lanip.text();
            $lanip.html('<input type="text"/>').children("input").val(value).focus();

            $lanport = $("#lanport" + index);
            value = $lanport.text();
            $lanport.html('<input type="text"/>').children("input").val(value);

            $wanip = $("#wanip" + index);
            value = $wanip.text();
            $wanip.html('<input type="text"/>').children("input").val(value);

            $wanport = $("#wanport" + index);
            value = $wanport.text();
            $wanport.html('<input type="text"/>').children("input").val(value);

            $protocol = $("#protocol" + index);
            value = $protocol.text();
            $.each(g_protocol, function(){
                if (value === this.name){
                    value = this.mode;
                }
            });
            $protocol.html(protocolListStyle).children("select").val(value);

            $status = $("#status" + index);
            value = $status.text();
            $.each(g_status, function(){
                if (value === this.name){
                    value = this.status;
                }
            });
            $status.html(statusListStyle).children("select").val(value);

            $edit = $("#Edit" + index);
            $edit.text(common_ok).attr("id", "modify" + index);

            $delete = $("#Delete" + index);
            $delete.text(common_cancel).attr("id", common_cancel + index);
        }
        function modify(index){
            var item;

            item = getIpfilterItem(index);
            if (item){
                status = 0;
                ipdata.splice(index - 1, 1, item);
                show(ipdata);
            }
        }

        function add(){
            var newlist, index, $row;

            if (status !== 0) {
                return;
            }
            status = 3;
            index = ipdata.length + 1;
            newlist = newOrEditStyle.join("").replace("%protocollist", protocolListStyle).replace("%status", statusListStyle);
            newlist = newlist.replace("lanip", "lanip" + index);
            newlist = newlist.replace("lanport", "lanport" + index);
            newlist = newlist.replace("wanip", "wanip" + index);
            newlist = newlist.replace("wanport", "wanport" + index);
            newlist = newlist.replace("protocol", "protocol" + index);
            newlist = newlist.replace("protocollist", "protocollist" + index);
            newlist = newlist.replace("status", "status" + index);
            newlist = newlist.replace("statuslist", "statuslist" + index);
            newlist = newlist.replace("btn1", "OK" + index);
            newlist = newlist.replace("btn2", "Cancel" + index);
            $("#listtable").append(newlist);

            $row = $("#row");
            if (index%2 === 1) {
                $row.attr("class", "oddtr");
            } else {
                $row.attr("class", "eventr");
            }
            $row.attr("id", "row" + index);
        }

        function deleted(index) {
            if (status !== 0) {
                return;
            }
            ipdata.splice(index - 1, 1);
            show(ipdata);
        }

        function cancel() {
            if (status !== 1 && status !==3) {
                return;
            }
            status = 0;
            show(ipdata);
        }

        function operator(ev){
            var id, index, reg, _ev = ev || event;
            var target = _ev.target || _ev.srcElemnt;

            reg = /([a-zA-Z]+)/g;
            id = target.id.match(reg);
            if (id) {
                id = id[0].toLowerCase();
            }

            reg = /([0-9]+)/g;
            index = target.id.match(reg);
            if (index){
                index = index[0];
            }
            switch(id){
                case "add":
                    add();
                    break;
                case "edit":
                    edit(index);
                    break;
                case "delete":
                    deleted(index);
                    break;
                case "cancel":
                    cancel();
                    break;
                case "ok":
                    fire(index);
                    break;
                case "modify":
                    modify(index);
                    break;
                default:
                    break;
            }
        }
        function checkLanIp(ip, gateway, mask){
            var ret, ipnum, gatewaynum, masknum;

            ret = checkIp(ip);
            if (!ret){
                return false;
            }
            ipnum = ip2Number(ip);
            gatewaynum = ip2Number(gateway);
            masknum = ip2Number(mask);

            return ( (ipnum & masknum) === (gatewaynum & masknum));
        }
        function checkIp(ip){
            var ipArr, i, len;
            ipArr = ip.split(".");
            len = ipArr.length;
            if (len !== 4){
                return false;
            }
            for(i = 0; i < len; i++) {
                if (isNaN(ipArr[i]) === true) {
                    return false;
                }
                if (ipArr[i].length === 0) {
                    return false;
                }
                if (ipArr[i].indexOf(" ") !== -1) {
                    return false;
                }
            }
            if ((ipArr[0] <= 0 || ipArr[0] == 127 || ipArr[0] >= 223) ||
                (ipArr[1] < 0 || ipArr[1] > 255) ||
                (ipArr[2] < 0 || ipArr[2] > 255) ||
                (ipArr[3] < 0 || ipArr[3] > 255))
            {
                return false;
            }
            return true;
        }
        function ip2Number(ip){
            var num;
            var ipaddr = ip.split(".");
            num = ipaddr[0]<<24 | ipaddr[1]<<16 | ipaddr[2]<<8 | ipaddr[3];
            return num>>>0;
        }
        function checkPort(port){
            var i, len, val, reg;
            reg = /[^0-9]+/g;
            val = port.split("-");
            len = val.length;
            for (i = 0; i < len; i++){
                if (val[i].match(reg)){
                    return false;
                }
                if (val[i][0] === "0"){
                    return false;
                }
                if (parseInt(val[i]) > 65535 || parseInt(val[i]) <= 0){
                    return false;
                }
            }
            if (len === 2) {
                if (parseInt(val[0]) > parseInt(val[1])){
                    return false;
                }
            }
            return true;
        }
        function getIpfilterItem(index){
            var ret, val, $input, proname, status, statusname, item, tips;

            tips = '<tr class="errortips"><td colspan="7">%tips</td></tr>';

            item = {};
            $input = $("#lanip" + index).children("input");
            val = $input.val();
            ret = checkLanIp(val, g_lanIpAddress, g_lanNetmask);
            if (ret === true){
                item.lanIp = val;
            } else {
                $input.focus();
                tips = tips.replace("%tips", str_security_lanipfilter_tips1);
                $("#listtable").append(tips);
                return;
            }

            $input = $("#lanport" + index).children("input");
            val = $input.val();
            ret = checkPort(val);
            if (ret === true){
                item.lanPort = val;
            } else {
                $input.focus();
                tips = tips.replace("%tips", str_security_lanipfilter_tips2);
                $("#listtable").append(tips);
                return;
            }

            val = $("#wanip" + index).children("input").val();
            ret = checkIp(val);
            if (ret === true){
                item.wanIp = val;
            } else {
                $input.focus();
                tips = tips.replace("%tips", str_security_lanipfilter_tips1);
                $("#listtable").append(tips);
                return;
            }

            $input = $("#wanport" + index).children("input");
            val = $input.val();
            ret = checkPort(val);
            if (ret === true){
                item.wanPort = val;
            } else {
                $input.focus();
                tips = tips.replace("%tips", str_security_lanipfilter_tips2);
                $("#listtable").append(tips);
                return;
            }

            proname = common_unknown;
            val = parseInt($("#protocol" + index).children("select").val());
            $.each(g_protocol, function(){
                if (this.mode === val) {
                    proname = this.name;
                }
            });
            item.protocol = proname;

            statusname = common_unknown;
            status = parseInt($("#status" + index).children("select").val());
            $.each(g_status, function(){
                if (this.status === status){
                    statusname = this.name;
                }
            });
            item.status = statusname;
            return item;
        }

        return {
            getInstance: function(id){
                if (!instances){
                    instances = new Create(id);
                }
                return instances;
            }
        };
    })();
})();