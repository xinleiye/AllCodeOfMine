function loadXMLDoc(url) {
    var obj = {
        method : "GET",
        url : url,
        data : "",
        async : true,
    };

    ajax(obj, function(data){
        console.log(data);
        document.getElementById("test").innerHTML=data;
    });
}
