document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    const searchInput = document.getElementById('searchInput');

    forms.forEach(form => {
        const table = form.nextElementSibling;
        const entityType = form.dataset.entity;
        const toggleButton = document.getElementById('toggleFormButton');
        form.style.display = 'none';

        toggleButton.addEventListener('click', function() {
            if (form.style.display === 'none') {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const entries = [...formData.entries()];
            const values = entries.map(entry => entry[1]);
            const id = formData.get(`${entityType}Id`);

            let rowExists = false;

            for (let i = 1, row; row = table.rows[i]; i++) {
                if (row.cells[0].innerText == id) {
                    entries.forEach((entry, index) => {
                        row.cells[index].innerText = entry[1];
                    });
                    rowExists = true;
                    break;
                }
            }

            if (!rowExists) {
                const newRow = table.insertRow();
                values.forEach(value => {
                    const cell = newRow.insertCell();
                    cell.innerText = value;
                });

                const actionsCell = newRow.insertCell();
                const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.onclick = function() { editEntity(editButton); };
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = function() { deleteEntity(deleteButton); };
                actionsCell.appendChild(deleteButton);
            }

            form.reset();
            form.style.display = 'none';
        });

        window.editEntity = function(button) {
            const row = button.parentNode.parentNode;
            const cells = row.cells;
            const inputs = form.querySelectorAll('input, textarea, select');

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

        window.deleteEntity = function(button) {
            const row = button.parentNode.parentNode;
            const confirmed = confirm('Are you sure you want to delete this entry?');

            if (confirmed) {
                row.parentNode.removeChild(row);
            }
        };

        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const rows = table.getElementsByTagName('tr');

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
