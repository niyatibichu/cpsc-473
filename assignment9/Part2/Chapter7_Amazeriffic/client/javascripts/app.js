/*globals ko*/
/*globals $*/
function ToDo(data) {
    this.description = ko.observable(data.description);
    this.tags = ko.observableArray(data.tags);
}

var Tab = function (name, selected) {
    this.name = name;
    this.isSelected = ko.computed(function () {
        return this === selected();
    }, this);
};

function ToDoAppViewModel() {
    var self = this;

    self.selectedTab = ko.observable();

    self.tabs = ko.observableArray([
        new Tab('Newest', self.selectedTab),
        new Tab('Oldest', self.selectedTab),
        new Tab('Tags', self.selectedTab),
        new Tab('Add', self.selectedTab)
    ]);
    
    //inialize to the first tab
    self.selectedTab(self.tabs()[0]);

    self.todos = ko.observableArray([]);
    self.newTodo_description = ko.observable("");
    self.newTodo_tags = ko.observable("");
    self.tagsTabObjs = ko.observable([]);

    function formatData() {
        var tags = [];

        self.todos().forEach(function (toDo) {
            toDo.tags().forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });

        var tagObjects = tags.map(function (tag) {
            var toDosWithTag = [];

            self.todos().forEach(function (toDo) {
                if (toDo.tags.indexOf(tag) !== -1) {
                    toDosWithTag.push(toDo.description);
                }
            });

            return { "name": tag, "toDos": toDosWithTag };
        });
        self.tagsTabObjs(tagObjects);
    }




    $.getJSON("/todos.json", function (allData) {
        var mappedTodos = $.map(allData, function (item) { return new ToDo(item); });
        self.todos(mappedTodos);
        formatData();
    });

    self.addToDo = function () {
        var description = self.newTodo_description,
            tags = self.newTodo_tags,
            split_tags = tags().split(','),
            newToDo = { "description": description, "tags": split_tags };

        if (description() !== "" && tags() !== "") {
            $.post("/todos", newToDo, function (result) {
                var mappedTodos = $.map(result, function (item) { return new ToDo(item); });
                self.todos(mappedTodos);
                formatData();
            });
        }

        self.newTodo_description("");
        self.newTodo_tags("");
    };
}

ko.applyBindings(new ToDoAppViewModel());