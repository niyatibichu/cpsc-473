/*globals $*/
/*globals io*/
var socket = io(); //to load socket io client
var main = function (toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");
    var toDos = toDoObjects.map(function (toDo) {
        // we'll just return the description
        // of this toDoObject
        return toDo.description;
    });


    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul id=\"newest\">");   //id added to fetch the element in socket event
                for (i = toDos.length - 1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul id=\"oldest\">");   //id added to fetch the element in socket event
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return { "name": tag, "toDos": toDosWithTag };
                });

                console.log(tagObjects);

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul id=\"tags\">");     //id added to fetch the element in socket event


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                $input = $("<input>").addClass("description");
                var $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: ");
                $button = $("<span>").text("+");

                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = { "description": description, "tags": tags };

                    $.post("todos", newToDo, function (result) {
                        console.log(result);

                        //toDoObjects.push(newToDo);
                        toDoObjects = result;

                        // update toDos
                        toDos = toDoObjects.map(function (toDo) {
                            return toDo.description;
                        });

                        $input.val("");
                        $tagInput.val("");
                    });
                    socket.emit('newToDo', newToDo);
                });

                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
    
    //socket on event and code to update the tabs
    socket.on('newToDo', function (toDo) {
        var newToDo = $("<li>").text(toDo.description).hide();
        //update the newest tab
        if ($("#newest").length > 0) {
            $("#newest").prepend(newToDo);
            newToDo.slideDown(300);
        }
        //update the oldest tab
        else if ($("#oldest").length > 0) {
            $("#oldest").append(newToDo);
            newToDo.slideDown(300);
        }
        //update the tags tab
        else if ($("#tags").length > 0) {
            //to update the existing tags
            var appended = false;
            $(".content h3").toArray().forEach(function (element) {
                if (toDo.tags[0] === $(element).text()) {
                    var temp = $("<li>").text(toDo.description);
                    appended = true;
                    var elem = element.nextSibling;
                    elem.outerHTML += temp[0].outerHTML;
                }
            });
            //to update the new tags
            if (!appended) {
                $("main .content").append($("<h3>").text(toDo.tags));
                $("main .content").append(newToDo);
                newToDo.slideDown(300);
            }

        }
        alert("new ToDo item added:Tags-"+toDo.tags+" Description-"+toDo.description);

        $.getJSON("todos.json", function (newToDos) {
            toDoObjects = newToDos;
            toDos = newToDos.map(function (toDo) {
                return toDo.description;
            });
        });



    });



};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});
