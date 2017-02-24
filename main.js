/**
 * Created by M137952 on 2/14/2017.
 */
var mcomdefects = [];
var bcomdefects = [];
var releaseList = [];
var main = document.getElementById("main-box");
var table = '<div class="w3-container w3-responsive"><table class="w3-table w3-bordered w3-white"><caption class="w3-white">MCOM Active Defects</caption><thead><tr><th>Defect Number</th><th>Defect Title</th><th>Age (Days)</th><th>Created By</th></tr></thead><tbody class="mcom-defects"></tbody></table></div><hr><div class="w3-container w3-responsive"><table class="w3-table w3-bordered w3-white"><caption class="w3-white">BCOM Active Defects</caption><thead><tr><th>Defect Number</th><th>Defect Title</th><th>Age (Days)</th><th>Created By</th></tr></thead><tbody class="bcom-defects"></tbody></table></div>'
$.ajax({
    type : "GET",
    url : "https://www14.v1host.com/Macyscom/rest-1.oauth.v1/Data/Defect?sel=Parent.Name,Timebox.Name,CreateDate,ID.Number,CreatedBy.Name,Name,Parent.Name&Accept=application/json&where=Custom_Channel2.Name!='BCOM';IsClosed='false';SecurityScope.Name='Selection';Parent.Name!=''",
    dataType: 'jsonp',
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer 1.y4Lq8do1hb2E1yxXYY8ycCDd1Do=');},
    success : function(result) {
        for (var i = 0; i < result.Assets.length; i++){
            var defect = result.Assets[i];
            mcomdefects.push(defect);
            if(!releaseList.includes(defect.Attributes["Parent.Name"].value.slice(0,3))){
                releaseList.push(defect.Attributes["Parent.Name"].value.slice(0,3));
            }

        }

    },
    error : function(result) {
        //handle the error
    }
});

$.ajax({
    type : "GET",
    url : "https://www14.v1host.com/Macyscom/rest-1.oauth.v1/Data/Defect?sel=Parent.Name,Timebox.Name,CreateDate,ID.Number,CreatedBy.Name,Name,Parent.Name&Accept=application/json&where=Custom_Channel2.Name='BCOM';IsClosed='false';SecurityScope.Name='Selection';Parent.Name!=''",
    dataType: 'jsonp',
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer 1.y4Lq8do1hb2E1yxXYY8ycCDd1Do=');},
    success : function(result) {
        for (var i = 0; i < result.Assets.length; i++){
            var defect = result.Assets[i];
            bcomdefects.push(defect);
            if(!releaseList.includes(defect.Attributes["Parent.Name"].value.slice(0,3))){
                releaseList.push(defect.Attributes["Parent.Name"].value.slice(0,3));
            }
        }
        showDate(releaseList, mcomdefects, bcomdefects, main, table)
    },
    error : function(result) {
        //handle the error
    }
});

function showDate(releaseList, mcomdefects, bcomdefects, main, table){
    releaseList.sort();
    for(var i = 0; i < releaseList.length; i++){
        var button = $('<button>').attr('onclick', 'expand("' + releaseList[i] + '")').attr('class', 'w3-btn-block w3-left-align w3-hover-grey').html(releaseList[i]).appendTo(main);
        var releaseTable = $('<div>').attr('id', releaseList[i]).attr('class', 'w3-hide w3-container w3-light-grey w3-padding').append(table).appendTo(main);
        for(var j=0; j < mcomdefects.length; j++) {
            if (mcomdefects[j].Attributes["Parent.Name"].value.slice(0, 3) === releaseList[i]) {
                var tr = $('<tr>').attr('id', 'mcomdefect-' + j).appendTo($("#" + releaseList[i] + " .mcom-defects"));
                var token = mcomdefects[j].href.slice(mcomdefects[j].href.lastIndexOf("Defect/") + 7);
                $('<td>').html('<a href="https://www14.v1host.com/Macyscom/defect.mvc/Summary?oidToken=Defect%3A' + token +'">' + mcomdefects[j].Attributes["ID.Number"].value + '</a>').appendTo(tr);
                $('<td>').text(mcomdefects[j].Attributes.Name.value).appendTo(tr);
                var date = mcomdefects[j].Attributes.CreateDate.value;
                var age = Math.abs(new Date() - new Date(date.replace(/-/g,'/').replace('T', ' ')));
                $('<td class="age">').text(Math.floor(age/(1000*60*60*24))).appendTo(tr);
                $('<td class="name">').text(mcomdefects[j].Attributes["CreatedBy.Name"].value).appendTo(tr);
            }
        }
        for(var j=0; j < bcomdefects.length; j++) {
            if (bcomdefects[j].Attributes["Parent.Name"].value.slice(0, 3) === releaseList[i]) {
                var tr = $('<tr>').attr('id', 'bcomdefect-' + j).appendTo($("#" + releaseList[i] + " .bcom-defects"));
                var token = bcomdefects[j].href.slice(bcomdefects[j].href.lastIndexOf("Defect/") + 7);
                $('<td>').html('<a href="https://www14.v1host.com/Macyscom/defect.mvc/Summary?oidToken=Defect%3A' + token +'">' + bcomdefects[j].Attributes["ID.Number"].value + '</a>').appendTo(tr);
                $('<td>').text(bcomdefects[j].Attributes.Name.value).appendTo(tr);
                var date = bcomdefects[j].Attributes.CreateDate.value;
                var age = Math.abs(new Date() - new Date(date.replace(/-/g,'/').replace('T', ' ')));
                $('<td class="age">').text(Math.floor(age/(1000*60*60*24))).appendTo(tr);
                $('<td class="name">').text(bcomdefects[j].Attributes["CreatedBy.Name"].value).appendTo(tr);
            }
        }
    }

    var setColor = document.getElementsByClassName("age");
    for(var i = 0; i < setColor.length; i++){
        if(setColor[i].innerHTML > 3) {
            setColor[i].style.color = "red";
        }
    }
}

function expand(id){
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-dark-grey"
    } else {
        x.className = x.className.replace(" w3-show", "");
        x.previousElementSibling.className = x.previousElementSibling.className.replace("w3-dark-grey", "");
    }
}
