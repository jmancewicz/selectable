class TableSelection {
    constructor(table_id) {
        this.last_selected_row = null;
        this.mousedown_row = null;
        this.mousedown_with_alt = false;

        var table = $(table_id).DataTable();

        // Disablew text selection because we want to select rows not text
        $(table_id + ' tbody').disableSelection();

        $(table_id + ' tbody').mouseenter(function() {
            TableSelection.current_table = table_id;
        });

        $(table_id + ' tbody').mouseleave(function() {
            TableSelection.current_table = null;
        });

        var that = this;
        // Begin a drag selection
        $(table_id + ' tbody').on('mousedown', 'tr', function(e) {
            that.mousedown_row = this;
            that.mousedown_with_alt = (e.ctrlKey || e.metaKey);
        });

        // Drag selection
        $(table_id + ' tbody').on('mousemove', 'tr', function(e) {
            if (e.which == 1 && that.mousedown_row != null) {
                var first = Math.min(that.mousedown_row.rowIndex, this.rowIndex) + 1;
                var last = Math.max(that.mousedown_row.rowIndex, this.rowIndex) + 1;
                for (var i = first; i <= last; i++) {
                    if (that.mousedown_with_alt) {
                        $(table_id + ' tr').eq(i).removeClass('selected');
                    } else {
                        $(table_id + ' tr').eq(i).addClass('selected');
                        that.last_selected_row = this;
                    }
                }
            }
        });

        // End drag selection
        $(table_id + ' tbody').on('mouseup', 'tr', function() {
            that.mousedown_row = null;
        });

        // click selection
        $(table_id + ' tbody').on( 'click', 'tr', function(e) {
            // shift select region
            if ((e.shiftKey)) {
                e.preventDefault();
                if (that.last_selected_row != null) {
                    var first = Math.min(that.last_selected_row.rowIndex, this.rowIndex) + 1;
                    var last = Math.max(that.last_selected_row.rowIndex, this.rowIndex) + 1;
                    for (i = first; i <= last; i++) {
                        $(table_id + ' tr').eq(i).addClass('selected');
                    }
                    that.last_selected_row = this;
                }
            }
            // toggle click selection
            else if ((e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    that.last_selected_row = null;
                } else {
                    $(this).addClass('selected');
                    that.last_selected_row = this;
                }
            }
            // simple unmodified click selection
            else {
                e.preventDefault();
                $(table_id + ' tr').removeClass("selected");
                $(this).addClass('selected');
                that.last_selected_row = this;
            }
        });

        // Because the key event is global, only register once.
        if (!TableSelection.initialized) {
            TableSelection.initialized = true;
            $(document).keydown(function(e) {
                if (TableSelection.current_table == null) return;
                // Use alt-a for select all rows
                if ((e.ctrlKey || e.metaKey) && e.keyCode == 65) {
                    e.preventDefault();
                    $(TableSelection.current_table + " tr").addClass("selected");
                    that.last_selected_row = null;
                }
                // Use alt-d for deselect all rows
                if ((e.ctrlKey || e.metaKey) && e.keyCode == 68) {
                    e.preventDefault();
                    $(TableSelection.current_table + " tr").removeClass("selected");
                    that.last_selected_row = null;
                }
                // Use alt-i for invert selection
                if ((e.ctrlKey || e.metaKey) && e.keyCode == 73) {
                    e.preventDefault();
                    $(TableSelection.current_table + " tr.selected").addClass("swap");
                    $(TableSelection.current_table + " tr").not('swap').addClass("selected");
                    $(TableSelection.current_table + " tr.swap").removeClass("swap selected");
                    that.last_selected_row = $(TableSelection.current_table + " tr.selected").last();
                }
                switch(e.which) {
                case 38: // up
                    if (that.last_selected_row) {
                        if (!e.shiftKey)
                            $(TableSelection.current_table + " tr").removeClass("selected");
                        var row = $(that.last_selected_row).prev('tr');
                        if (row.length)
                            that.last_selected_row = row;
                        $(that.last_selected_row).addClass("selected");
                    }
                    break;
                case 40: // down
                    if (that.last_selected_row != null) {
                        if (!e.shiftKey)
                            $(TableSelection.current_table + " tr").removeClass("selected");
                        var row = $(that.last_selected_row).next('tr');
                        if (row.length)
                            that.last_selected_row = row;
                        $(that.last_selected_row).addClass("selected");
                    }
                    break;
                case 191: // ?
                    $('.selected td').each(function(){
                        console.log(this);
                    });
                default: return; // exit this handler for other keys
                }
                e.preventDefault(); // prevent the default action (scroll / move caret)
            });
        }
    }
}
TableSelection.current_table = null;
TableSelection.initialized = false;

