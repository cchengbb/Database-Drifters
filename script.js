document.addEventListener('DOMContentLoaded', function() {
    // Select all forms
    const forms = document.querySelectorAll('form');
    // Select search input
    const searchInput = document.getElementById('searchInput');

    // Iterate each form
    forms.forEach(form => {
        const table = form.nextElementSibling;  // get table element
        const entityType = form.dataset.entity; // get entity type
        const toggleButton = document.getElementById('toggleFormButton');
        
        // form visibility
        form.style.display = 'none';

        // toggle form
        toggleButton.addEventListener('click', function() {
            if (form.style.display === 'none') {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        });

        // Form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(form);            // create FormData
            const entries = [...formData.entries()];        // Convert to array
            const values = entries.map(entry => entry[1]);  // map to array
            const id = formData.get(`${entityType}Id`);     // get ID from form

            let rowExists = false;

            // Check if row with ID exists in each row
            for (let i = 1, row; row = table.rows[i]; i++) {
                if (row.cells[0].innerText == id) {
                    // exists => update cells
                    entries.forEach((entry, index) => {
                        row.cells[index].innerText = entry[1];
                    });
                    rowExists = true;
                    break;
                }
            }

            // Create new row if it does not exist
            if (!rowExists) {
                const newRow = table.insertRow();
                values.forEach(value => {
                    const cell = newRow.insertCell();
                    cell.innerText = value;
                });

                const actionsCell = newRow.insertCell();

                // Create and add edit button
                const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.onclick = function() { editEntity(editButton); };
                actionsCell.appendChild(editButton);

                // Create and add delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = function() { deleteEntity(deleteButton); };
                actionsCell.appendChild(deleteButton);
            }

            // Reset
            form.reset();
            form.style.display = 'none';
        });

        // Edit entity
        window.editEntity = function(button) {
            const row = button.parentNode.parentNode;   // get row with button
            const cells = row.cells;                    // get all cells
            const inputs = form.querySelectorAll('input, textarea, select');

            // Populate values from row cells through each input
            inputs.forEach((input, index) => {
                if (cells[index]) {
                    if (input.tagName === 'SELECT') {
                        input.value = cells[index].innerText;
                    } else {
                        input.value = cells[index].innerText;
                    }
                }
            });

            form.style.display = 'block';
        };

        // Delete entity
        window.deleteEntity = function(button) {
            const row = button.parentNode.parentNode;
            const confirmed = confirm('Are you sure you want to delete this entry?');

            // remove row if confirmed
            if (confirmed) {
                row.parentNode.removeChild(row);
            }
        };

        // Search function
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const rows = table.getElementsByTagName('tr');

            // Hide any rows that don't match filter
            for (let i = 1; i < rows.length; i++) {
                let row = rows[i];
                let cells = row.getElementsByTagName('td');
                let match = false;

                for (let j = 0; j < cells.length; j++) {
                    if (cells[j].innerText.toLowerCase().includes(filter)) {
                        match = true;
                        break;
                    }
                }

                if (match) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    });
});
