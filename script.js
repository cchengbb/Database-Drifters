document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const table = document.querySelector('table');
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
        }

        form.reset();
        form.style.display = 'none';
    });

    window.editEntity = function(button) {
        const row = button.parentNode.parentNode;
        const cells = row.cells;
        const inputs = form.querySelectorAll('input');

        inputs.forEach((input, index) => {
            if (cells[index]) {
                input.value = cells[index].innerText;
            }
        });

        form.style.display = 'block';
    };
});
