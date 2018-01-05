function Card(id, name, bootcamp_kanban_column_id) {
    var self = this;
    this.bootcamp_kanban_column_id = bootcamp_kanban_column_id;
    this.id = id;
    this.name = name || 'New Card';
    this.$element = createCard();

    function createCard() {
        var $card = $('<li>').addClass('card');
        var $cardDescription = $('<p>').addClass('card-description').text(self.name);
        var $cardEdit = $('<i>').addClass('fa fa-edit');
        var $cardDelete = $('<button>').addClass('btn-delete').text('X');
        $cardDelete.click(function() {
            self.removeCard();
        });
        $cardEdit.click(function(event) {
            var newName = prompt('Enter new text for the card');
            event.preventDefault();
            $.ajax({
                url: baseUrl + '/card/' + self.id,
                method: 'PUT',
                data: {
                    id: self.id,
                    name: newName,
                    bootcamp_kanban_column_id: self.bootcamp_kanban_column_id
                },
                success: function(response) {
                    self.name = newName;
                    $cardDescription.text(self.name);
                }
            });
        });
        $card.append($cardDelete)
        .append($cardEdit)
        .append($cardDescription);
        return $card;
    }
}
Card.prototype = {
    removeCard: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/card/' + self.id,
            method: 'DELETE',
            success: function(response){
                self.$element.remove();
            }
        });
    }
};