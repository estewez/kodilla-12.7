var board = {
	name: 'Tablica Kanban',
	createColumn: function(column) {
        this.$element.append(column.$element);
        initSortable();
	},
	$element: $('#board .column-container')
};

$('.create-column').click(function(){
    if ($('.column-container .column').length < 6){
        var columnName = prompt('Enter a column name');
        $.ajax({
            url: baseUrl + '/column',
            method: 'POST',
            data: {
                name: columnName
            },
            success: function(response){
                var column = new Column(response.id, columnName);
                board.createColumn(column);
            }
        });
    } else {
        alert('Max columns reached');
    }
});

function initSortable() {
    var startIndex = -1;
    $('.column-card-list').sortable({
        connectWith: '.column-card-list',
        placeholder: 'card-placeholder',
        start: function(event, ui){
            startIndex = ui.item.index();
        },
        stop: function(event, ui){
            updateServer(startIndex);
        }
    }).disableSelection();
}

function updateServer(startIndex) {
    $.ajax({
        url: baseUrl + '/board',
        method: 'GET',
        success: function(response) {
            checkForMovement(response.columns, startIndex);
        }
    });
}

function checkForMovement(cols, startIndex) {
    var cardId = -1;
    var cardName = 'error';
    var columnId = -1;
    cols.forEach(function (column) {
        var i = 0;
        column.cards.forEach(function (card) {
            i++;
        });
        if (i > $('#' + column.id + ' .card').length) {
            cardId = column.cards[startIndex].id;
            cardName = column.cards[startIndex].name;
        } else if (i < $('#' + column.id + ' .card').length) {
            columnId = column.id;
        }
    });
    $.ajax({
        url: baseUrl + '/card/' + cardId,
        method: 'PUT',
        data: {
            id: cardId,
            name: cardName,
            bootcamp_kanban_column_id: columnId
        },
        success: function(response) {}
    });
}