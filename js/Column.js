function Column(id, name) {
    var self = this;
    this.id = id;
    this.name = name || 'Untitled';
    this.$element = createColumn();

    function createColumn() {
        var $column = $('<div>').addClass('column').attr('id', self.id);
        var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
        var $columnEdit = $('<i>').addClass('fa fa-edit');
        var $columnCardList = $('<ul>').addClass('column-card-list');
        var $columnDelete = $('<button>').addClass('btn-delete').text('X');
        var $columnAddCard = $('<button>').addClass('btn add-card').text('Add a card');
        $columnDelete.click(function() {
            self.removeColumn();
        });
        $columnAddCard.click(function(event) {
            var cardName = prompt("Add text to the card");
            event.preventDefault();
            $.ajax({
                url: baseUrl + '/card',
                method: 'POST',
                data: {
                    name: cardName,
                    bootcamp_kanban_column_id: self.id
                },
                success: function(response) {
                    var card = new Card(response.id, cardName, self.id);
                    self.addCard(card);
                }
            });
        });
        $columnEdit.click(function(event) {
            var newName = prompt('Enter new name') || 'Untitled';
            event.preventDefault();
            $.ajax({
                url: baseUrl + '/column/' + self.id,
                method: 'PUT',
                data: {
                    id: self.id,
                    name: newName
                },
                success: function(response) {
                    self.name = newName;
                    $columnTitle.text(self.name);
                }
            });
        });
        $column.append($columnTitle)
            .append($columnEdit)
            .append($columnDelete)
            .append($columnAddCard)
            .append($columnCardList);
        return $column;
    }
}
Column.prototype = {
    addCard: function(card) {
        this.$element.children('ul').append(card.$element);
    },
    removeColumn: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/column/' + self.id,
            method: 'DELETE',
            success: function(response){
                self.$element.remove();
            }
        });
    }
};