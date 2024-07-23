document.addEventListener('DOMContentLoaded', function() {
    // Select all forms
    const forms = document.querySelectorAll('form');

    // Get the table after the form and extract entity type from data
    forms.forEach(form => {
        const table = form.nextElementSibling;
        const entityType = form.dataset.entity;
        const toggleButton = document.getElementById('toggleFormButton');

        // Hide form
        form.style.display = 'none';

        // Form toggle for visibility
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

            const formData = new FormData(form);
            const entries = [...formData.entries()];
            const values = entries.map(entry => entry[1]);
            const id = formData.get(`${entityType}Id`);

            let rowExists = false;
            
            // Check if the row with ID exists
            for (let i = 1, row; row = table.rows[i]; i++) {
                // If it does, update
                if (row.cells[0].innerText == id) {
                    entries.forEach((entry, index) => {
                        row.cells[index].innerText = entry[1];
                    });
                    rowExists = true;
                    break;
                }
            }

            // If the row does not exist, then create it
            if (!rowExists) {
                const newRow = table.insertRow();

                values.forEach(value => {
                    const cell = newRow.insertCell();
                    cell.innerText = value;
                });

                const actionsCell = newRow.insertCell();

                // Make edit button
                const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.onclick = function() { editEntity(editButton); };
                actionsCell.appendChild(editButton);

                // Make delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = function() { deleteEntity(deleteButton); };
                actionsCell.appendChild(deleteButton);
            }

            // Reset form and hide
            form.reset();
            form.style.display = 'none';
        });

        // Edit entity
        window.editEntity = function(button) {
            // Initialize row with button, all cells, 
            const row = button.parentNode.parentNode;
            const cells = row.cells;
            const inputs = form.querySelectorAll('input, textarea');

            inputs.forEach((input, index) => {
                if (cells[index]) {
                    input.value = cells[index].innerText;
                }
            });

            form.style.display = 'block';
        };

        // Delete entity
        window.deleteEntity = function(button) {
            // Initialize row with button and confirmation
            const row = button.parentNode.parentNode;
            const confirmed = confirm('Are you sure you want to delete this entry?');

            if (confirmed) {
                row.parentNode.removeChild(row);
            }
        };

        // Search function
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const rows = table.getElementsByTagName('tr');

            for (let i = 1; i < rows.length; i++) {
                let row = rows[i];
                let cells = row.getElementsByTagName('td');
                let match = false;

                // Loop until we find a match to the filter
                for (let j = 0; j < cells.length; j++) {
                    if (cells[j].innerText.toLowerCase().includes(filter)) {
                        match = true;
                        break;
                    }
                }

                // Style based on filter
                if (match) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    });
});
