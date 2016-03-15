/* jshint browser:true*/
/* globals $*/
function loadActorData(jsonData) {
    var content = "";
    content += "<div class=\"mdl-list__item\">";
    content += "<span class=\"mdl-list__item-primary-content\">";
    content += "<i class=\"material-icons mdl-list__item-avatar\">person</i>";

    content += "<span>" + jsonData.name + "</span>";
    content += "</span>";
    content += "<a class=\"mdl-list__item-secondary-action star\"><i class=\"material-icons star\" id=" + jsonData.id + ">";

    if (jsonData.starred) {
        content += "star";
    } else {
        content += "star_border";
    }
    content += "</i></a>";
    content += "</div>";
    return content;
}


function display() {
    $.ajax({
        url: "http://localhost:3000/actors",
        type: "GET",
        dataType: "json",
        success: function(data) {
            $.each(data, function(x, value) {
                $(".demo-list-action").addClass("mdl-list");
                $(".demo-list-action").append(loadActorData(value));

            });
        },
        error: function(xhr, textStatus, errorThrown) {
            window.alert("Error" + xhr + textStatus + errorThrown);
        }
    });
}



$(".addActorButton").click(function() {
    var name = $(".newActorName").val();
    if (name !== "" && name !== undefined && name !== null) {
        $.ajax({
            url: "http://localhost:3000/actors",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                starred: false
            }),
            dataType: "json",
            success: function(data) {
                $(".demo-list-action").append(loadActorData(data));
            },
            error: function(xhr, textStatus, errorThrown) {
                window.alert("Error" + xhr + textStatus + errorThrown);
            }
        });
        $(".newActorName").val("");
        $(".mdl-textfield").removeClass("is-dirty");
    } else {
        window.alert("Please enter the actor's name.");
    }
});

$(".demo-list-action").on("click", "a i", function() {
    var id = $(this)[0].id,
        starred = $(this)[0].firstChild,
        name = $(this)[0].parentNode.previousSibling.childNodes[1].firstChild.nodeValue,
        flag = false;
    if (starred.nodeValue === "star") {
        flag = false;
        starred.nodeValue = "star_border";
    } else {
        flag = true;
        starred.nodeValue = "star";
    }
    $.ajax({
        url: "http://localhost:3000/actors/" + id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            name: name,
            starred: flag
        }),
        dataType: "json"
    });

});


$(document).ready(function() {
    "use strict";
    display();
});